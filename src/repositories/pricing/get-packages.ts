import { prisma } from "@/lib/prisma";

/**
 * Find all packages belonging to a vendor.
 */
export async function findPackagesByVendor(vendorId: string) {
  return prisma.package.findMany({
    where: { vendorId },
    orderBy: { sortOrder: "asc" },
    include: {
      items: { orderBy: { sortOrder: "asc" } },
    },
  });
}

/**
 * Find only active packages belonging to a vendor.
 */
export async function findActivePackagesByVendor(vendorId: string) {
  return prisma.package.findMany({
    where: { vendorId, isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      items: { orderBy: { sortOrder: "asc" } },
    },
  });
}

/**
 * Find a single package by ID (with items).
 */
export async function findPackageById(id: string) {
  return prisma.package.findUnique({
    where: { id },
    include: {
      items: { orderBy: { sortOrder: "asc" } },
    },
  });
}
