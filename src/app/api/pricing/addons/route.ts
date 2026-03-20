import { NextRequest } from "next/server";
import { successResponse, internalError, requireAuth } from "@/lib/api";
import { findAddOnsByVendor } from "@/repositories/pricing";
import { paginationSchema } from "@/lib/validations/pricing";

/**
 * GET /api/pricing/addons
 * List add-ons for the authenticated vendor.
 * Supports pagination & search via query params.
 */
export async function GET(request: NextRequest) {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = paginationSchema.safeParse(params);
    const filters = parsed.success ? parsed.data : {};

    const result = await findAddOnsByVendor(userId, filters);

    return successResponse(result.addOns.map(serializeAddOn), {
      page: result.page,
      limit: result.limit,
      total: result.total,
    });
  } catch (err) {
    console.error("[API] GET /api/pricing/addons error:", err);
    return internalError();
  }
}

function serializeAddOn(addOn: Record<string, unknown>) {
  return {
    ...addOn,
    price: String(addOn.price),
  };
}
