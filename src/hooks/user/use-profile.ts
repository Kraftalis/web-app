import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/user";
import { userKeys } from "./keys";

export function useProfile() {
  return useQuery({
    queryKey: userKeys.profile,
    queryFn: getProfile,
  });
}
