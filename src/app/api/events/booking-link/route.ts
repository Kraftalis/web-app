import { NextRequest } from "next/server";
import {
  successResponse,
  createdResponse,
  internalError,
  requireBusinessProfile,
} from "@/lib/api";
import {
  createBookingLink,
  findBookingLinkByToken,
} from "@/repositories/event";
import {
  findActivePackagesByVendor,
  findActiveAddOnsByVendor,
} from "@/repositories/pricing";

/**
 * POST /api/events/booking-link
 * Generate a new booking link for the authenticated vendor.
 */
export async function POST() {
  const { businessProfileId, error } = await requireBusinessProfile();
  if (error) return error;

  try {
    const link = await createBookingLink(businessProfileId);
    return createdResponse({
      token: link.token,
      expiresAt: link.expiresAt.toISOString(),
    });
  } catch (err) {
    console.error("[API] POST /api/events/booking-link error:", err);
    return internalError();
  }
}

/**
 * GET /api/events/booking-link?token=xxx
 * Public endpoint — get booking link info + vendor packages/addons.
 * No auth required (clients use this).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return successResponse(null);
    }

    const link = await findBookingLinkByToken(token);

    if (!link) {
      return successResponse(null);
    }

    // Check expiry
    if (link.expiresAt < new Date()) {
      return successResponse({ expired: true });
    }

    // Fetch vendor's active packages & add-ons for the booking form
    const [packages, addOns] = await Promise.all([
      findActivePackagesByVendor(link.businessProfileId),
      findActiveAddOnsByVendor(link.businessProfileId),
    ]);

    return successResponse({
      token: link.token,
      vendorId: link.businessProfileId,
      vendor: {
        id: link.businessProfile.id,
        name: link.businessProfile.businessName,
        image: link.businessProfile.logoUrl,
      },
      eventId: link.eventId,
      expiresAt: link.expiresAt.toISOString(),
      packages: packages.map((p) => ({
        ...p,
        price: String(p.price),
      })),
      addOns: addOns.map((a) => ({
        ...a,
        price: String(a.price),
      })),
    });
  } catch (err) {
    console.error("[API] GET /api/events/booking-link error:", err);
    return internalError();
  }
}
