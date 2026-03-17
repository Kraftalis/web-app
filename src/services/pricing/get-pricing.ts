import api from "@/services/api-client";
import type { ApiResponse } from "@/lib/api/types";
import type { PricingData } from "./types";

/**
 * Fetch all packages and add-ons for the current vendor.
 */
export async function getPricing(): Promise<PricingData> {
  const { data } = await api.get<ApiResponse<PricingData>>("/pricing");
  return data.data!;
}
