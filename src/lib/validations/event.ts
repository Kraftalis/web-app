import { z } from "zod";

// ─── Event creation (from vendor side) ──────────────────────

export const createEventSchema = z.object({
  clientName: z.string().min(1, "Client name is required.").max(255),
  clientPhone: z.string().min(1, "Phone number is required.").max(50),
  clientEmail: z
    .string()
    .email("Invalid email.")
    .max(320)
    .optional()
    .nullable(),
  eventType: z.string().min(1, "Event type is required.").max(100),
  eventDate: z.string().min(1, "Event date is required."), // ISO date string
  eventTime: z.string().max(20).optional().nullable(),
  eventLocation: z.string().max(2000).optional().nullable(),
  packageId: z.string().uuid().optional().nullable(),
  addOnIds: z
    .array(
      z.object({
        addOnId: z.string().uuid(),
        quantity: z.number().int().min(1).default(1),
      }),
    )
    .optional(),
  amount: z.number().min(0).optional().nullable(),
  dpAmount: z.number().min(0).optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
});

export const updateEventSchema = createEventSchema.partial().extend({
  eventStatus: z
    .enum(["INQUIRY", "WAITING_PAYMENT", "CONFIRMED", "ONGOING", "COMPLETED"])
    .optional(),
  paymentStatus: z.enum(["UNPAID", "DP_PAID", "PAID"]).optional(),
});

// ─── Booking (from client side via booking link) ────────────

export const bookingSubmitSchema = z.object({
  token: z.string().min(1, "Token is required."),
  clientName: z.string().min(1, "Client name is required.").max(255),
  clientPhone: z.string().min(1, "Phone number is required.").max(50),
  clientEmail: z
    .string()
    .email("Invalid email.")
    .max(320)
    .optional()
    .nullable(),
  eventType: z.string().min(1, "Event type is required.").max(100),
  eventDate: z.string().min(1, "Event date is required."),
  eventTime: z.string().max(20).optional().nullable(),
  eventLocation: z.string().max(2000).optional().nullable(),
  packageId: z.string().uuid("Package selection is required."),
  addOnIds: z
    .array(
      z.object({
        addOnId: z.string().uuid(),
        quantity: z.number().int().min(1).default(1),
      }),
    )
    .optional(),
  dpAmount: z.number().min(1, "Down payment is required."),
  notes: z.string().max(5000).optional().nullable(),
});

// ─── Inferred types ─────────────────────────────────────────

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type BookingSubmitInput = z.infer<typeof bookingSubmitSchema>;
