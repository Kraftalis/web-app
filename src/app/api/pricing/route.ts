import { NextRequest } from "next/server";
import {
  successResponse,
  createdResponse,
  validationError,
  internalError,
  requireAuth,
  validate,
} from "@/lib/api";
import {
  findPackagesByVendor,
  findAddOnsByVendor,
  createPackage,
  createAddOn,
} from "@/repositories/pricing";
import {
  createPackageSchema,
  createAddOnSchema,
} from "@/lib/validations/pricing";

/**
 * GET /api/pricing
 * List all packages and add-ons for the authenticated vendor.
 */
export async function GET() {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const [packages, addOns] = await Promise.all([
      findPackagesByVendor(userId),
      findAddOnsByVendor(userId),
    ]);

    return successResponse({
      packages: packages.map(serializePackage),
      addOns: addOns.map(serializeAddOn),
    });
  } catch (err) {
    console.error("[API] GET /api/pricing error:", err);
    return internalError();
  }
}

/**
 * POST /api/pricing
 * Create a new package or add-on.
 * Body must include { type: "package" | "addon", ...data }
 */
export async function POST(request: NextRequest) {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (type === "package") {
      const result = validate(createPackageSchema, data);
      if (result.error)
        return validationError("Validation failed.", result.error);

      const pkg = await createPackage(userId, result.data);
      return createdResponse(serializePackage(pkg));
    }

    if (type === "addon") {
      const result = validate(createAddOnSchema, data);
      if (result.error)
        return validationError("Validation failed.", result.error);

      const addOn = await createAddOn(userId, result.data);
      return createdResponse(serializeAddOn(addOn));
    }

    return validationError("Invalid type. Expected 'package' or 'addon'.");
  } catch (err) {
    console.error("[API] POST /api/pricing error:", err);
    return internalError();
  }
}

// ─── Serializers ────────────────────────────────────────────

function serializePackage(pkg: {
  price: unknown;
  items?: Array<{ price: unknown; [key: string]: unknown }>;
  [key: string]: unknown;
}) {
  return {
    ...pkg,
    price: String(pkg.price),
    items: (pkg.items ?? []).map((item) => ({
      ...item,
      price: String(item.price),
    })),
  };
}

function serializeAddOn(addOn: Record<string, unknown>) {
  return {
    ...addOn,
    price: String(addOn.price),
  };
}
