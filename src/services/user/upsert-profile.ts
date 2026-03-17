import api from "@/services/api-client";
import type { ApiResponse } from "@/lib/api/types";
import type { UserProfile, UpdateProfilePayload } from "./types";

/**
 * Update the current user's profile.
 */
export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<UserProfile> {
  const { data } = await api.put<ApiResponse<UserProfile>>(
    "/user/profile",
    payload,
  );
  return data.data!;
}
