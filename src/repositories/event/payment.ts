import { prisma } from "@/lib/prisma";

/**
 * Create a payment record for an event.
 */
export async function createPayment(data: {
  eventId: string;
  paymentType: "DOWN_PAYMENT" | "FULL_PAYMENT" | "INSTALLMENT";
  amount: number;
  currency?: string;
  note?: string | null;
  receiptUrl?: string | null;
  receiptName?: string | null;
}) {
  return prisma.payment.create({
    data: {
      eventId: data.eventId,
      paymentType: data.paymentType,
      amount: data.amount,
      currency: data.currency ?? "IDR",
      note: data.note ?? undefined,
      receiptUrl: data.receiptUrl ?? undefined,
      receiptName: data.receiptName ?? undefined,
    },
  });
}

/**
 * Verify a payment receipt (vendor confirms).
 */
export async function verifyPayment(id: string) {
  return prisma.payment.update({
    where: { id },
    data: { isVerified: true },
  });
}

/**
 * Find all payments for an event.
 */
export async function findPaymentsByEvent(eventId: string) {
  return prisma.payment.findMany({
    where: { eventId },
    orderBy: { paidAt: "desc" },
  });
}
