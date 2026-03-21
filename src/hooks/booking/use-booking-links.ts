import { useQuery } from "@tanstack/react-query";
import { getBookingLinks } from "@/services/booking";
import { bookingKeys } from "./keys";

export function useBookingLinks() {
  return useQuery({
    queryKey: bookingKeys.links,
    queryFn: getBookingLinks,
  });
}
