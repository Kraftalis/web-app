import { z } from "zod";

// ─── Profile update ─────────────────────────────────────────

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required.").max(255).optional(),
  image: z.string().url("Invalid image URL.").optional().nullable(),
});

// ─── Inferred types ─────────────────────────────────────────

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
