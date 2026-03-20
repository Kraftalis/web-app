import { useQuery } from "@tanstack/react-query";
import { getAddOns } from "@/services/pricing";
import type { AddOnQueryParams } from "@/services/pricing";
import { pricingKeys } from "./keys";

export function useAddOns(params?: AddOnQueryParams) {
  return useQuery({
    queryKey: pricingKeys.addOns(params),
    queryFn: () => getAddOns(params),
  });
}
