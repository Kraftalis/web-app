import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/services/user";
import type { UpdateProfilePayload } from "@/services/user";
import { userKeys } from "./keys";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile });
    },
  });
}
