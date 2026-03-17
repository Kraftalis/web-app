import api from "@/services/api-client";
import type { ApiResponse } from "@/lib/api/types";
import type { UserProfile } from "./types";

/**
 * Fetch the current user's profile.
 */
export async function getProfile(): Promise<UserProfile> {
  const { data } = await api.get<ApiResponse<UserProfile>>("/user/profile");
  return data.data!;
}
