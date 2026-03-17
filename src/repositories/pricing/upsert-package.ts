import { prisma } from "@/lib/prisma";
import type {
  CreatePackageInput,
  UpdatePackageInput,
} from "@/lib/validations/pricing";

/**
 * Create a new package for a vendor.
 * Variations (items) are created with their own price + description.
 */
export async function createPackage(
  vendorId: string,
  data: CreatePackageInput,
) {
  return prisma.package.create({
    data: {
      vendorId,
      name: data.name,
      description: data.description ?? undefined,
      price: data.price ?? 0,
      currency: data.currency ?? "IDR",
      sortOrder: data.sortOrder ?? 0,
      items: data.variations
        ? {
            create: data.variations.map((v, index) => ({
              label: v.label,
              description: v.description ?? undefined,
              price: v.price,
              sortOrder: v.sortOrder ?? index,
            })),
          }
        : undefined,
    },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });
}

/**
 * Update an existing package.
 * If variations[] is provided, replaces all existing variations atomically.
 */
export async function updatePackage(id: string, data: UpdatePackageInput) {
  const { variations, ...rest } = data;

  if (variations !== undefined) {
    // Replace all variations
    await prisma.packageItem.deleteMany({ where: { packageId: id } });
    if (variations.length > 0) {
      await prisma.packageItem.createMany({
        data: variations.map((v, index) => ({
          packageId: id,
          label: v.label,
          description: v.description ?? undefined,
          price: v.price,
          sortOrder: v.sortOrder ?? index,
        })),
      });
    }
  }

  return prisma.package.update({
    where: { id },
    data: {
      ...rest,
      description: rest.description ?? undefined,
    },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });
}
