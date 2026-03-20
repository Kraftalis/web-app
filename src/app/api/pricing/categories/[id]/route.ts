import { NextRequest } from "next/server";
import {
  successResponse,
  validationError,
  notFoundError,
  internalError,
  requireAuth,
  validate,
} from "@/lib/api";
import {
  findCategoryById,
  updateCategory,
  deleteCategory,
} from "@/repositories/pricing";
import { updateCategorySchema } from "@/lib/validations/pricing";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/pricing/categories/[id]
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const category = await findCategoryById(id);
    if (!category) return notFoundError("Category not found.");
    return successResponse(category);
  } catch (err) {
    console.error("[API] GET /api/pricing/categories/[id] error:", err);
    return internalError();
  }
}

/**
 * PUT /api/pricing/categories/[id]
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const existing = await findCategoryById(id);
    if (!existing) return notFoundError("Category not found.");

    const body = await request.json();
    const result = validate(updateCategorySchema, body);
    if (result.error)
      return validationError("Validation failed.", result.error);

    const updated = await updateCategory(id, result.data);
    return successResponse(updated);
  } catch (err) {
    console.error("[API] PUT /api/pricing/categories/[id] error:", err);
    return internalError();
  }
}

/**
 * DELETE /api/pricing/categories/[id]
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const existing = await findCategoryById(id);
    if (!existing) return notFoundError("Category not found.");

    await deleteCategory(id);
    return successResponse({ deleted: true });
  } catch (err) {
    console.error("[API] DELETE /api/pricing/categories/[id] error:", err);
    return internalError();
  }
}
