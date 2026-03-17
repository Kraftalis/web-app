import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAddOn } from "@/services/pricing";
import { pricingKeys } from "./keys";

export function useDeleteAddOn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAddOn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pricingKeys.all });
    },
  });
}
