import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBookingLink } from "@/services/booking";
import { bookingKeys } from "./keys";

export function useCreateBookingLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBookingLink,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bookingKeys.links });
    },
  });
}
