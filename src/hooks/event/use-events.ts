import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/services/event";
import { eventKeys } from "./keys";

export function useEvents() {
  return useQuery({
    queryKey: eventKeys.all,
    queryFn: getEvents,
  });
}
