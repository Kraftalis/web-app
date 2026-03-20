import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/pricing";
import { pricingKeys } from "./keys";

export function useCategories() {
  return useQuery({
    queryKey: pricingKeys.categories,
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // categories are master data, cache 5 min
  });
}
