import { useMutation } from "@tanstack/react-query";
import { generateBookingLink } from "@/services/event";

export function useGenerateBookingLink() {
  return useMutation({
    mutationFn: generateBookingLink,
  });
}
