import { prisma } from "@/lib/prisma";

/**
 * Find all events belonging to a vendor (list view).
 */
export async function findEventsByVendor(vendorId: string) {
  return prisma.event.findMany({
    where: { vendorId },
    orderBy: { eventDate: "desc" },
    include: {
      package: { select: { id: true, name: true } },
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
      package: {
        include: { items: { orderBy: { sortOrder: "asc" } } },
      },
      eventAddOns: {
        include: {
          addOn: {
            select: { id: true, name: true, description: true, price: true },
          },
        },
      },
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
          package: {
            include: { items: { orderBy: { sortOrder: "asc" } } },
          },
          eventAddOns: {
            include: {
              addOn: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  price: true,
                },
              },
            },
          },
          payments: { orderBy: { paidAt: "desc" } },
        },
      },
    },
  });
  return link;
}
