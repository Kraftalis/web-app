import { prisma } from "@/lib/prisma";

/**
 * Delete an event by ID (cascades to add-ons, payments, booking link).
 */
export async function deleteEvent(id: string) {
  return prisma.event.delete({ where: { id } });
}
