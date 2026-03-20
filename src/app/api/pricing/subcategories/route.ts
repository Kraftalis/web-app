import { NextRequest } from "next/server";
import {
  createdResponse,
  validationError,
  internalError,
  requireAuth,
  validate,
} from "@/lib/api";
import { createSubcategory } from "@/repositories/pricing";
import { createSubcategorySchema } from "@/lib/validations/pricing";

/**
 * POST /api/pricing/subcategories
 * Create a new subcategory within a category.
 */
export async function POST(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const result = validate(createSubcategorySchema, body);
    if (result.error)
      return validationError("Validation failed.", result.error);

    const subcategory = await createSubcategory(result.data);
    return createdResponse(subcategory);
  } catch (err) {
    console.error("[API] POST /api/pricing/subcategories error:", err);
    return internalError();
  }
}
