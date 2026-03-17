import { prisma } from "@/lib/prisma";
import type {
  CreateEventInput,
  UpdateEventInput,
} from "@/lib/validations/event";

/**
 * Create a new event for a vendor.
 */
export async function createEvent(vendorId: string, data: CreateEventInput) {
  const { addOnIds, ...eventData } = data;

  const event = await prisma.event.create({
    data: {
      vendorId,
      clientName: eventData.clientName,
      clientPhone: eventData.clientPhone,
      clientEmail: eventData.clientEmail ?? undefined,
      eventType: eventData.eventType,
      eventDate: new Date(eventData.eventDate),
      eventTime: eventData.eventTime ?? undefined,
      eventLocation: eventData.eventLocation ?? undefined,
      packageId: eventData.packageId ?? undefined,
      amount: eventData.amount ?? undefined,
      dpAmount: eventData.dpAmount ?? undefined,
      notes: eventData.notes ?? undefined,
      eventAddOns: addOnIds?.length
        ? {
            create: addOnIds.map((a) => ({
              addOnId: a.addOnId,
              quantity: a.quantity,
            })),
          }
        : undefined,
    },
    include: {
      package: { include: { items: true } },
      eventAddOns: { include: { addOn: true } },
      payments: true,
    },
  });

  return event;
}

/**
 * Update an existing event.
 */
export async function updateEvent(id: string, data: UpdateEventInput) {
  const { addOnIds, ...eventData } = data;

  // If addOnIds is provided, replace all event add-ons
  if (addOnIds !== undefined) {
    await prisma.eventAddOn.deleteMany({ where: { eventId: id } });
    if (addOnIds.length > 0) {
      await prisma.eventAddOn.createMany({
        data: addOnIds.map((a) => ({
          eventId: id,
          addOnId: a.addOnId,
          quantity: a.quantity,
        })),
      });
    }
  }

  // Convert date string to Date if provided
  const updateData: Record<string, unknown> = { ...eventData };
  if (eventData.eventDate) {
    updateData.eventDate = new Date(eventData.eventDate);
  }

  return prisma.event.update({
    where: { id },
    data: updateData,
    include: {
      package: { include: { items: true } },
      eventAddOns: { include: { addOn: true } },
      payments: true,
    },
  });
}
