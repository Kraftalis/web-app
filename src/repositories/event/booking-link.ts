import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * Generate a unique booking link for a vendor.
 * Optionally link it to an existing event.
 */
export async function createBookingLink(
  vendorId: string,
  options?: { eventId?: string; expiresInDays?: number },
) {
  const token = randomBytes(16).toString("hex"); // 32 chars
  const expiresAt = new Date(
    Date.now() + (options?.expiresInDays ?? 30) * 24 * 60 * 60 * 1000,
  );

  return prisma.bookingLink.create({
    data: {
      vendorId,
      token,
      eventId: options?.eventId ?? undefined,
      expiresAt,
    },
  });
}

/**
 * Find a booking link by token (public access).
 */
export async function findBookingLinkByToken(token: string) {
  return prisma.bookingLink.findUnique({
    where: { token },
    include: {
      vendor: { select: { id: true, name: true, image: true } },
    },
  });
}
