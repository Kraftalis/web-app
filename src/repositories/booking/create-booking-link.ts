import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import type { CreateBookingLinkInput } from "@/lib/validations/booking";

/**
 * Create a booking link with snapshot data.
 */
export async function createBookingLink(
  vendorId: string,
  input: CreateBookingLinkInput,
) {
  const token = randomBytes(16).toString("hex");
  const expiresAt = new Date(
    Date.now() + (input.expiresInDays ?? 30) * 24 * 60 * 60 * 1000,
  );

  // Calculate total
  const pkgPrice = input.packageSnapshot?.price ?? 0;
  const addOnsTotal =
    input.addOnsSnapshot?.reduce(
      (sum, a) => sum + a.price * (a.quantity ?? 1),
      0,
    ) ?? 0;
  const totalAmount = pkgPrice + addOnsTotal;

  return prisma.bookingLink.create({
    data: {
      vendorId,
      token,
      expiresAt,
      clientName: input.clientName ?? undefined,
      clientPhone: input.clientPhone ?? undefined,
      eventDate: input.eventDate ? new Date(input.eventDate) : undefined,
      eventTime: input.eventTime ?? undefined,
      eventLocation: input.eventLocation ?? undefined,
      packageSnapshot: input.packageSnapshot ?? undefined,
      addOnsSnapshot: input.addOnsSnapshot ?? undefined,
      totalAmount: totalAmount > 0 ? totalAmount : undefined,
    },
  });
}

/**
 * Find a booking link by token (public).
 */
export async function findBookingLinkByToken(token: string) {
  return prisma.bookingLink.findUnique({
    where: { token },
    include: {
      vendor: { select: { id: true, name: true, image: true } },
      event: { select: { id: true, eventStatus: true, paymentStatus: true } },
    },
  });
}

/**
 * Find all booking links for a vendor.
 */
export async function findBookingLinksByVendor(vendorId: string) {
  return prisma.bookingLink.findMany({
    where: { vendorId },
    orderBy: { createdAt: "desc" },
    include: {
      event: {
        select: {
          id: true,
          clientName: true,
          eventStatus: true,
          paymentStatus: true,
        },
      },
    },
  });
}
