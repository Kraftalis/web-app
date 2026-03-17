import { NextRequest } from "next/server";
import {
  successResponse,
  validationError,
  notFoundError,
  internalError,
  validate,
} from "@/lib/api";
import { bookingSubmitSchema } from "@/lib/validations/event";
import { findBookingLinkByToken } from "@/repositories/event";
import { createEvent } from "@/repositories/event";
import { createPayment } from "@/repositories/event";
import { findPackageById } from "@/repositories/pricing";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/booking — handles public booking form submission.
 * Creates an event + links it to the booking link + creates DP payment record.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = validate(bookingSubmitSchema, body);
    if (result.error)
      return validationError("Validation failed.", result.error);

    const data = result.data;

    // 1. Validate booking link
    const link = await findBookingLinkByToken(data.token);
    if (!link) return notFoundError("Invalid or expired booking link.");
    if (link.expiresAt < new Date())
      return notFoundError("Booking link has expired.");
    if (link.eventId)
      return validationError("This booking link has already been used.");

    // 2. Snapshot the selected package
    const pkg = await findPackageById(data.packageId);
    if (!pkg) return notFoundError("Selected package not found.");

    // 3. Calculate total amount
    const packagePrice = Number(pkg.price);
    let addOnsTotal = 0;
    if (data.addOnIds?.length) {
      const addOnRecords = await prisma.addOn.findMany({
        where: { id: { in: data.addOnIds.map((a) => a.addOnId) } },
      });
      for (const sel of data.addOnIds) {
        const addon = addOnRecords.find((a) => a.id === sel.addOnId);
        if (addon) addOnsTotal += Number(addon.price) * sel.quantity;
      }
    }
    const totalAmount = packagePrice + addOnsTotal;

    // 4. Create event
    const event = await createEvent(link.vendorId, {
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      clientEmail: data.clientEmail,
      eventType: data.eventType,
      eventDate: data.eventDate,
      eventTime: data.eventTime,
      eventLocation: data.eventLocation,
      packageId: data.packageId,
      addOnIds: data.addOnIds,
      amount: totalAmount,
      dpAmount: data.dpAmount,
      notes: data.notes,
    });

    // 5. Link event to booking link
    await prisma.bookingLink.update({
      where: { id: link.id },
      data: { eventId: event.id },
    });

    // 6. Create DP payment record
    await createPayment({
      eventId: event.id,
      paymentType: "DOWN_PAYMENT",
      amount: data.dpAmount,
    });

    // 7. Update event status to WAITING_PAYMENT
    await prisma.event.update({
      where: { id: event.id },
      data: { eventStatus: "WAITING_PAYMENT", paymentStatus: "DP_PAID" },
    });

    return successResponse({
      eventId: event.id,
      token: data.token,
    });
  } catch (err) {
    console.error("[API] POST /api/booking error:", err);
    return internalError();
  }
}
