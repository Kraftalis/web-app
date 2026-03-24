import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { PaginationInput } from "@/lib/validations/pricing";

/**
 * Build the shared `where` clause for add-on queries.
 */
function buildAddOnWhere(
  businessProfileId: string,
  params?: Partial<PaginationInput>,
): Prisma.AddOnWhereInput {
  const where: Prisma.AddOnWhereInput = { businessProfileId };

  if (params?.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }
  if (params?.isActive === "true") {
    where.isActive = true;
  } else if (params?.isActive === "false") {
    where.isActive = false;
  }

  return where;
}

/**
 * Find add-ons with pagination and search.
 */
export async function findAddOnsByVendor(
  businessProfileId: string,
  params?: Partial<PaginationInput>,
) {
  const where = buildAddOnWhere(businessProfileId, params);
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 50;
  const dir = params?.sortDir ?? "asc";

  const [addOns, total] = await Promise.all([
    prisma.addOn.findMany({
      where,
      orderBy: { sortOrder: dir },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.addOn.count({ where }),
  ]);

  return { addOns, total, page, limit };
}

/**
 * Find only active add-ons belonging to a vendor.
 */
export async function findActiveAddOnsByVendor(businessProfileId: string) {
  return prisma.addOn.findMany({
    where: { businessProfileId, isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

/**
 * Find a single add-on by ID.
 */
export async function findAddOnById(id: string) {
  return prisma.addOn.findUnique({ where: { id } });
}
