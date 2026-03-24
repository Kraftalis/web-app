import { prisma } from "@/lib/prisma";

/**
 * Create a payment record for an event.
 * If paidBy is "VENDOR", auto-verify (vendor-recorded payments are trusted).
 */
export async function createPayment(data: {
  eventId: string;
  paymentType: "DOWN_PAYMENT" | "FULL_PAYMENT" | "INSTALLMENT";
  amount: number;
  currency?: string;
  note?: string | null;
  receiptUrl?: string | null;
  receiptName?: string | null;
  paidBy?: "VENDOR" | "CLIENT";
}) {
  const isVendor = data.paidBy === "VENDOR";
  return prisma.payment.create({
    data: {
      eventId: data.eventId,
      paymentType: data.paymentType,
      amount: data.amount,
      currency: data.currency ?? "IDR",
      note: data.note ?? undefined,
      receiptUrl: data.receiptUrl ?? undefined,
      receiptName: data.receiptName ?? undefined,
      paidBy: data.paidBy ?? "CLIENT",
      isVerified: isVendor, // auto-verify vendor-recorded payments
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
 * Reject / unverify a payment (vendor disagrees).
 */
export async function rejectPayment(id: string) {
  return prisma.payment.update({
    where: { id },
    data: { isVerified: false },
  });
}

/**
 * Find a single payment by ID.
 */
export async function findPaymentById(id: string) {
  return prisma.payment.findUnique({ where: { id } });
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

/**
 * Recalculate and update event payment status based on verified payments total.
 */
export async function recalcPaymentStatus(eventId: string) {
  const allPayments = await prisma.payment.findMany({
    where: { eventId },
  });
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { amount: true },
  });

  const totalPaid = allPayments
    .filter((p) => p.isVerified)
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const totalAmount = Number(event?.amount ?? 0);

  let newStatus: "UNPAID" | "DP_PAID" | "PAID" = "UNPAID";
  if (totalPaid > 0 && totalPaid < totalAmount) {
    newStatus = "DP_PAID";
  } else if (totalPaid >= totalAmount && totalAmount > 0) {
    newStatus = "PAID";
  }

  // Build the update payload: always update paymentStatus,
  // and auto-promote eventStatus to BOOKED when first payment arrives.
  const updateData: Record<string, unknown> = { paymentStatus: newStatus };

  if (newStatus !== "UNPAID") {
    const currentEvent = await prisma.event.findUnique({
      where: { id: eventId },
      select: { eventStatus: true },
    });
    if (
      currentEvent?.eventStatus === "INQUIRY" ||
      currentEvent?.eventStatus === "WAITING_CONFIRMATION"
    ) {
      updateData.eventStatus = "BOOKED";
    }
  }

  await prisma.event.update({
    where: { id: eventId },
    data: updateData,
  });

  return newStatus;
}
