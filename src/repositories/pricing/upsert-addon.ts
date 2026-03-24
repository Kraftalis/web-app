import { prisma } from "@/lib/prisma";
import type {
  CreateAddOnInput,
  UpdateAddOnInput,
} from "@/lib/validations/pricing";

/**
 * Create a new add-on for a vendor.
 */
export async function createAddOn(
  businessProfileId: string,
  data: CreateAddOnInput,
) {
  return prisma.addOn.create({
    data: {
      businessProfileId,
      name: data.name,
      description: data.description ?? undefined,
      price: data.price,
      currency: data.currency ?? "IDR",
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

/**
 * Update an existing add-on.
 */
export async function updateAddOn(id: string, data: UpdateAddOnInput) {
  return prisma.addOn.update({
    where: { id },
    data: {
      ...data,
      description: data.description ?? undefined,
    },
  });
}
