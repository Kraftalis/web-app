"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api-client";
import type { ApiResponse } from "@/lib/api/types";

export interface BusinessProfile {
  id: string;
  userId: string;
  businessName: string;
  tagline: string | null;
  logoUrl: string | null;
  email: string | null;
  phoneNumber: string | null;
  socialLinks: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertBusinessProfilePayload {
  businessName: string;
  tagline?: string | null;
  logoUrl?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  socialLinks?: Record<string, string> | null;
}

const profileKeys = {
  all: ["business-profile"] as const,
};

export function useBusinessProfile() {
  return useQuery<BusinessProfile | null>({
    queryKey: profileKeys.all,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<BusinessProfile | null>>(
        "/user/business-profile",
      );
      return data.data ?? null;
    },
  });
}

export function useUpsertBusinessProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpsertBusinessProfilePayload) => {
      const { data } = await api.put<ApiResponse<BusinessProfile>>(
        "/user/business-profile",
        payload,
      );
      return data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}
