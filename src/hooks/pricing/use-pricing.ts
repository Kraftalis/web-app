import { useQuery } from "@tanstack/react-query";
import { getPricing } from "@/services/pricing";
import { pricingKeys } from "./keys";

export function usePricing() {
  return useQuery({
    queryKey: pricingKeys.all,
    queryFn: getPricing,
  });
}
