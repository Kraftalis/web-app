import { z } from "zod";

// ─── Package Variation ──────────────────────────────────────

export const packageVariationSchema = z.object({
  id: z.string().uuid().optional(), // omit for new variations
  label: z.string().min(1, "Variation name is required.").max(255),
  description: z.string().max(2000).optional().nullable(),
  price: z.number().min(0, "Price must be a positive number."),
  sortOrder: z.number().int().min(0).default(0),
});

export type PackageVariationInput = z.infer<typeof packageVariationSchema>;

// ─── Package ────────────────────────────────────────────────

export const createPackageSchema = z.object({
  name: z.string().min(1, "Package name is required.").max(255),
  description: z.string().max(2000).optional().nullable(),
  // Base price — 0 when package relies entirely on variations
  price: z.number().min(0, "Price must be a positive number.").default(0),
  currency: z.string().max(10).default("IDR"),
  variations: z.array(packageVariationSchema).optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export const updatePackageSchema = createPackageSchema.partial().extend({
  isActive: z.boolean().optional(),
});

// ─── Add-On ─────────────────────────────────────────────────

export const createAddOnSchema = z.object({
  name: z.string().min(1, "Add-on name is required.").max(255),
  description: z.string().max(2000).optional().nullable(),
  price: z.number().min(0, "Price must be a positive number."),
  currency: z.string().max(10).default("IDR"),
  sortOrder: z.number().int().min(0).default(0),
});

export const updateAddOnSchema = createAddOnSchema.partial().extend({
  isActive: z.boolean().optional(),
});

// ─── Inferred types ─────────────────────────────────────────

export type CreatePackageInput = z.infer<typeof createPackageSchema>;
export type UpdatePackageInput = z.infer<typeof updatePackageSchema>;
export type CreateAddOnInput = z.infer<typeof createAddOnSchema>;
export type UpdateAddOnInput = z.infer<typeof updateAddOnSchema>;
