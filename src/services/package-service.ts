import { prisma } from "@/lib/prisma";

/**
 * Package & pricing service — data access layer for vendor packages and add-ons.
 */

// ─── Packages ───────────────────────────────────────────────

export async function findPackagesByVendor(vendorId: string) {
  return prisma.package.findMany({
    where: { vendorId },
    orderBy: { sortOrder: "asc" },
    include: {
      items: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function findActivePackagesByVendor(vendorId: string) {
  return prisma.package.findMany({
    where: { vendorId, isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      items: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function findPackageById(id: string) {
  return prisma.package.findUnique({
    where: { id },
    include: {
      items: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function createPackage(data: {
  vendorId: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  duration?: string;
  capacity?: string;
  items?: string[];
}) {
  return prisma.package.create({
    data: {
      vendorId: data.vendorId,
      name: data.name,
      description: data.description,
      price: data.price,
      currency: data.currency ?? "IDR",
      duration: data.duration,
      capacity: data.capacity,
      items: data.items
        ? {
            create: data.items.map((label, index) => ({
              label,
              sortOrder: index,
            })),
          }
        : undefined,
    },
    include: { items: true },
  });
}

export async function updatePackage(
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    currency?: string;
    duration?: string;
    capacity?: string;
    isActive?: boolean;
    sortOrder?: number;
    items?: string[]; // Replace all items
  },
) {
  const { items, ...rest } = data;

  // If items provided, delete all existing and recreate
  if (items !== undefined) {
    await prisma.packageItem.deleteMany({ where: { packageId: id } });
    await prisma.packageItem.createMany({
      data: items.map((label, index) => ({
        packageId: id,
        label,
        sortOrder: index,
      })),
    });
  }

  return prisma.package.update({
    where: { id },
    data: rest,
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function deletePackage(id: string) {
  return prisma.package.delete({ where: { id } });
}

// ─── Add-Ons ────────────────────────────────────────────────

export async function findAddOnsByVendor(vendorId: string) {
  return prisma.addOn.findMany({
    where: { vendorId },
    orderBy: { sortOrder: "asc" },
  });
}

export async function findActiveAddOnsByVendor(vendorId: string) {
  return prisma.addOn.findMany({
    where: { vendorId, isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function findAddOnById(id: string) {
  return prisma.addOn.findUnique({ where: { id } });
}

export async function createAddOn(data: {
  vendorId: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
}) {
  return prisma.addOn.create({
    data: {
      vendorId: data.vendorId,
      name: data.name,
      description: data.description,
      price: data.price,
      currency: data.currency ?? "IDR",
    },
  });
}

export async function updateAddOn(
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    currency?: string;
    isActive?: boolean;
    sortOrder?: number;
  },
) {
  return prisma.addOn.update({ where: { id }, data });
}

export async function deleteAddOn(id: string) {
  return prisma.addOn.delete({ where: { id } });
}
