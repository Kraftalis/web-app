import { NextRequest } from "next/server";
import {
  successResponse,
  validationError,
  notFoundError,
  forbiddenError,
  internalError,
  requireAuth,
  validate,
} from "@/lib/api";
import { findEventById, updateEvent, deleteEvent } from "@/repositories/event";
import { updateEventSchema } from "@/lib/validations/event";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/events/[id]
 * Get a single event with full details.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const event = await findEventById(id);

    if (!event) return notFoundError("Event not found.");
    if (event.vendorId !== userId) return forbiddenError();

    return successResponse(serializeEventDetail(event));
  } catch (err) {
    console.error("[API] GET /api/events/[id] error:", err);
    return internalError();
  }
}

/**
 * PUT /api/events/[id]
 * Update an event.
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const event = await findEventById(id);

    if (!event) return notFoundError("Event not found.");
    if (event.vendorId !== userId) return forbiddenError();

    const body = await request.json();
    const result = validate(updateEventSchema, body);
    if (result.error)
      return validationError("Validation failed.", result.error);

    const updated = await updateEvent(id, result.data);

    return successResponse({
      ...updated,
      eventDate: updated.eventDate.toISOString(),
      amount: updated.amount ? String(updated.amount) : null,
      dpAmount: updated.dpAmount ? String(updated.dpAmount) : null,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (err) {
    console.error("[API] PUT /api/events/[id] error:", err);
    return internalError();
  }
}

/**
 * DELETE /api/events/[id]
 * Delete an event.
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const event = await findEventById(id);

    if (!event) return notFoundError("Event not found.");
    if (event.vendorId !== userId) return forbiddenError();

    await deleteEvent(id);
    return successResponse({ deleted: true });
  } catch (err) {
    console.error("[API] DELETE /api/events/[id] error:", err);
    return internalError();
  }
}

// ─── Serializer ─────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeEventDetail(event: any) {
  return {
    id: event.id,
    vendorId: event.vendorId,
    clientName: event.clientName,
    clientPhone: event.clientPhone,
    clientEmail: event.clientEmail,
    eventType: event.eventType,
    eventDate: event.eventDate.toISOString(),
    eventTime: event.eventTime,
    eventLocation: event.eventLocation,
    packageId: event.packageId,
    packageSnapshot: event.packageSnapshot,
    amount: event.amount ? String(event.amount) : null,
    dpAmount: event.dpAmount ? String(event.dpAmount) : null,
    eventStatus: event.eventStatus,
    paymentStatus: event.paymentStatus,
    notes: event.notes,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
    package: event.package
      ? {
          id: event.package.id,
          name: event.package.name,
          description: event.package.description,
          price: String(event.package.price),
          currency: event.package.currency,
          duration: event.package.duration,
          capacity: event.package.capacity,
          isActive: event.package.isActive,
          items: event.package.items.map(
            (i: { id: string; label: string }) => ({
              id: i.id,
              name: i.label,
              description: null,
            }),
          ),
        }
      : null,
    eventAddOns: event.eventAddOns.map(
      (ea: {
        id: string;
        quantity: number;
        addOn: {
          id: string;
          name: string;
          description: string | null;
          price: unknown;
        };
      }) => ({
        id: ea.id,
        quantity: ea.quantity,
        unitPrice: String(ea.addOn.price),
        addOn: {
          id: ea.addOn.id,
          name: ea.addOn.name,
          description: ea.addOn.description,
        },
      }),
    ),
    bookingToken: event.bookingLink?.token ?? null,
    payments: event.payments.map(
      (p: {
        id: string;
        amount: unknown;
        paymentType: string;
        receiptUrl: string | null;
        note: string | null;
        isVerified: boolean;
        createdAt: Date;
      }) => ({
        id: p.id,
        amount: String(p.amount),
        paymentType: p.paymentType,
        receiptUrl: p.receiptUrl,
        note: p.note,
        isVerified: p.isVerified,
        createdAt: p.createdAt.toISOString(),
      }),
    ),
  };
}
