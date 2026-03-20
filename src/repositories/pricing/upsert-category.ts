import { prisma } from "@/lib/prisma";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateSubcategoryInput,
  UpdateSubcategoryInput,
} from "@/lib/validations/pricing";

// ─── Category ───────────────────────────────────────────────

export async function createCategory(data: CreateCategoryInput) {
  return prisma.category.create({
    data: {
      name: data.name,
      description: data.description ?? undefined,
      sortOrder: data.sortOrder ?? 0,
    },
    include: {
      subcategories: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function updateCategory(id: string, data: UpdateCategoryInput) {
  return prisma.category.update({
    where: { id },
    data: {
      ...data,
      description: data.description ?? undefined,
    },
    include: {
      subcategories: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}

// ─── Subcategory ────────────────────────────────────────────

export async function findSubcategoryById(id: string) {
  return prisma.subcategory.findUnique({ where: { id } });
}

export async function createSubcategory(data: CreateSubcategoryInput) {
  return prisma.subcategory.create({
    data: {
      categoryId: data.categoryId,
      name: data.name,
      description: data.description ?? undefined,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateSubcategory(
  id: string,
  data: UpdateSubcategoryInput,
) {
  return prisma.subcategory.update({
    where: { id },
    data: {
      ...data,
      description: data.description ?? undefined,
    },
  });
}

export async function deleteSubcategory(id: string) {
  return prisma.subcategory.delete({ where: { id } });
}
