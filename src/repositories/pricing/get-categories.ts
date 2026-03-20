import { prisma } from "@/lib/prisma";

/**
 * Find all active categories with their subcategories.
 */
export async function findAllCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      subcategories: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

/**
 * Find a single category by ID (with subcategories).
 */
export async function findCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      subcategories: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

/**
 * Find a single category by name.
 */
export async function findCategoryByName(name: string) {
  return prisma.category.findUnique({
    where: { name },
  });
}
