import { NextRequest } from "next/server";
import {
  successResponse,
  validationError,
  notFoundError,
  internalError,
  validate,
} from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

interface RouteParams {
  params: Promise<{ token: string }>;
}

/**
 * Payment submission schema — used by the client to upload a payment receipt.
 */
const paymentSchema = z.object({
  amount: z.number().positive("Amount must be positive."),
  paymentType: z.enum(["DOWN_PAYMENT", "INSTALLMENT", "FULL_PAYMENT"]),
  receiptUrl: z.string().url().optional().nullable(),
  receiptName: z.string().max(255).optional().nullable(),
  note: z.string().max(2000).optional().nullable(),
});

/**
 * POST /api/booking/[token]/payments
 * Client submits a payment (with optional receipt) for their event.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = await params;

    // 1. Validate booking link
    const link = await prisma.bookingLink.findUnique({
      where: { token },
      select: { eventId: true },
    });

    if (!link || !link.eventId) {
      return notFoundError("No event found for this booking link.");
    }

    // 2. Validate body
    const body = await request.json();
    const result = validate(paymentSchema, body);
    if (result.error)
      return validationError("Validation failed.", result.error);

    const data = result.data;

    // 3. Create payment record
    const payment = await prisma.payment.create({
      data: {
        eventId: link.eventId,
        amount: data.amount,
        paymentType: data.paymentType,
        receiptUrl: data.receiptUrl ?? undefined,
        receiptName: data.receiptName ?? undefined,
        note: data.note ?? undefined,
      },
    });

    // 4. Update event payment status based on total paid
    const allPayments = await prisma.payment.findMany({
      where: { eventId: link.eventId },
    });
    const event = await prisma.event.findUnique({
      where: { id: link.eventId },
      select: { amount: true },
    });

    const totalPaid = allPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalAmount = Number(event?.amount ?? 0);

    let newPaymentStatus: "UNPAID" | "DP_PAID" | "PAID" = "UNPAID";
    if (totalPaid > 0 && totalPaid < totalAmount) {
      newPaymentStatus = "DP_PAID";
    } else if (totalPaid >= totalAmount && totalAmount > 0) {
      newPaymentStatus = "PAID";
    }

    await prisma.event.update({
      where: { id: link.eventId },
      data: { paymentStatus: newPaymentStatus },
    });

    return successResponse({
      id: payment.id,
      amount: String(payment.amount),
      paymentType: payment.paymentType,
      receiptUrl: payment.receiptUrl,
      receiptName: payment.receiptName,
      note: payment.note,
      isVerified: payment.isVerified,
      paidAt: payment.paidAt.toISOString(),
      createdAt: payment.createdAt.toISOString(),
    });
  } catch (err) {
    console.error("[API] POST /api/booking/[token]/payments error:", err);
    return internalError();
  }
}
