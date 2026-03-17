import { useMutation } from "@tanstack/react-query";
import { submitBooking } from "@/services/event";
import type { BookingSubmitPayload } from "@/services/event";

export function useSubmitBooking() {
  return useMutation({
    mutationFn: (payload: BookingSubmitPayload) => submitBooking(payload),
  });
}
