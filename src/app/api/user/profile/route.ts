import { NextRequest } from "next/server";
import {
  successResponse,
  validationError,
  notFoundError,
  internalError,
  requireAuth,
  validate,
} from "@/lib/api";
import { findUserById, updateUserProfile } from "@/repositories/user";
import { updateProfileSchema } from "@/lib/validations/user";

/**
 * GET /api/user/profile
 * Returns the authenticated user's profile.
 */
export async function GET() {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const user = await findUserById(userId);

    if (!user) return notFoundError("User not found.");

    return successResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("[API] GET /api/user/profile error:", err);
    return internalError();
  }
}

/**
 * PUT /api/user/profile
 * Update the authenticated user's profile.
 */
export async function PUT(request: NextRequest) {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const result = validate(updateProfileSchema, body);
    if (result.error)
      return validationError("Validation failed.", result.error);

    const updated = await updateUserProfile(userId, result.data);
    return successResponse(updated);
  } catch (err) {
    console.error("[API] PUT /api/user/profile error:", err);
    return internalError();
  }
}
