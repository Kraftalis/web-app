import { NextRequest } from "next/server";
import {
  successResponse,
  validationError,
  notFoundError,
  forbiddenError,
  internalError,
  requireAuth,
  validate,
} from "@/lib/api";
import {
  findAddOnById,
  updateAddOn,
  deleteAddOn,
} from "@/repositories/pricing";
import { updateAddOnSchema } from "@/lib/validations/pricing";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/pricing/addons/[id]
 * Get a single add-on by ID.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const addOn = await findAddOnById(id);

    if (!addOn) return notFoundError("Add-on not found.");
    if (addOn.vendorId !== userId) return forbiddenError();

    return successResponse({
      ...addOn,
      price: String(addOn.price),
    });
  } catch (err) {
    console.error("[API] GET /api/pricing/addons/[id] error:", err);
    return internalError();
  }
}

/**
 * PUT /api/pricing/addons/[id]
 * Update an add-on.
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const addOn = await findAddOnById(id);

    if (!addOn) return notFoundError("Add-on not found.");
    if (addOn.vendorId !== userId) return forbiddenError();

    const body = await request.json();
    const result = validate(updateAddOnSchema, body);
    if (result.error)
      return validationError("Validation failed.", result.error);

    const updated = await updateAddOn(id, result.data);
    return successResponse({
      ...updated,
      price: String(updated.price),
    });
  } catch (err) {
    console.error("[API] PUT /api/pricing/addons/[id] error:", err);
    return internalError();
  }
}

/**
 * DELETE /api/pricing/addons/[id]
 * Delete an add-on.
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const addOn = await findAddOnById(id);

    if (!addOn) return notFoundError("Add-on not found.");
    if (addOn.vendorId !== userId) return forbiddenError();

    await deleteAddOn(id);
    return successResponse({ deleted: true });
  } catch (err) {
    console.error("[API] DELETE /api/pricing/addons/[id] error:", err);
    return internalError();
  }
}
