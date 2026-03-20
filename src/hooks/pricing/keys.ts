import type { PricingQueryParams, AddOnQueryParams } from "@/services/pricing";

/**
 * Shared query keys for pricing-related queries.
 */
export const pricingKeys = {
  all: ["pricing"] as const,
  list: (params?: PricingQueryParams) => ["pricing", "list", params] as const,
  detail: (id: string) => ["pricing", "detail", id] as const,
  addOns: (params?: AddOnQueryParams) => ["pricing", "addons", params] as const,
  categories: ["pricing", "categories"] as const,
};
