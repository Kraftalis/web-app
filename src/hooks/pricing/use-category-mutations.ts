import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "@/services/pricing";
import type {
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CreateSubcategoryPayload,
  UpdateSubcategoryPayload,
} from "@/services/pricing";
import { pricingKeys } from "./keys";

// ─── Category mutations ─────────────────────────────────────

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pricingKeys.categories });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
    }) => updateCategory(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pricingKeys.categories });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pricingKeys.categories });
    },
  });
}

// ─── Subcategory mutations ──────────────────────────────────

export function useCreateSubcategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSubcategoryPayload) =>
      createSubcategory(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pricingKeys.categories });
    },
  });
}

export function useUpdateSubcategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSubcategoryPayload;
    }) => updateSubcategory(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pricingKeys.categories });
    },
  });
}

export function useDeleteSubcategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSubcategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pricingKeys.categories });
    },
  });
}
