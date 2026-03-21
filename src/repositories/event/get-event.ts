import { prisma } from "@/lib/prisma";

/**
 * Find all events belonging to a vendor (list view).
 * Package/add-on data now lives in JSONB snapshot columns.
 */
export async function findEventsByVendor(vendorId: string) {
  return prisma.event.findMany({
    where: { vendorId },
    orderBy: { eventDate: "desc" },
    include: {
      bookingLink: { select: { token: true } },
    },
  });
}

/**
 * Find a single event by ID with full details.
 */
export async function findEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      bookingLink: { select: { token: true } },
      payments: { orderBy: { paidAt: "desc" } },
    },
  });
}

/**
 * Find event by booking link token (for public booking portal).
 */
export async function findEventByBookingToken(token: string) {
  const link = await prisma.bookingLink.findUnique({
    where: { token },
    include: {
      event: {
        include: {
          payments: { orderBy: { paidAt: "desc" } },
        },
      },
    },
  });
  return link;
}
