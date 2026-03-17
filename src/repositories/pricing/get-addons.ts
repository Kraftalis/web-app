import { prisma } from "@/lib/prisma";

/**
 * Find all add-ons belonging to a vendor.
 */
export async function findAddOnsByVendor(vendorId: string) {
  return prisma.addOn.findMany({
    where: { vendorId },
    orderBy: { sortOrder: "asc" },
  });
}

/**
 * Find only active add-ons belonging to a vendor.
 */
export async function findActiveAddOnsByVendor(vendorId: string) {
  return prisma.addOn.findMany({
    where: { vendorId, isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

/**
 * Find a single add-on by ID.
 */
export async function findAddOnById(id: string) {
  return prisma.addOn.findUnique({ where: { id } });
}
