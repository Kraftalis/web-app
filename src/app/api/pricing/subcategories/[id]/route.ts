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
  findSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
} from "@/repositories/pricing";
import { updateSubcategorySchema } from "@/lib/validations/pricing";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PUT /api/pricing/subcategories/[id]
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const existing = await findSubcategoryById(id);
    if (!existing) return notFoundError("Subcategory not found.");

    const body = await request.json();
    const result = validate(updateSubcategorySchema, body);
    if (result.error)
      return validationError("Validation failed.", result.error);

    const updated = await updateSubcategory(id, result.data);
    return successResponse(updated);
  } catch (err) {
    console.error("[API] PUT /api/pricing/subcategories/[id] error:", err);
    return internalError();
  }
}

/**
 * DELETE /api/pricing/subcategories/[id]
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const existing = await findSubcategoryById(id);
    if (!existing) return notFoundError("Subcategory not found.");

    await deleteSubcategory(id);
    return successResponse({ deleted: true });
  } catch (err) {
    console.error("[API] DELETE /api/pricing/subcategories/[id] error:", err);
    return internalError();
  }
}
