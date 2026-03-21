"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { useDictionary } from "@/i18n";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCreateSubcategory,
  useUpdateSubcategory,
  useDeleteSubcategory,
} from "@/hooks/pricing";
import { useConfirmDelete } from "@/hooks/use-confirm-delete";
import CategoryList from "./category-list";
import CategoryModal from "./category-modal";
import SubcategoryModal from "./subcategory-modal";
import type { Category, Subcategory } from "@/services/pricing";

// ─── Types ──────────────────────────────────────────────────

interface SettingsTemplateProps {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
}

// ─── Component ──────────────────────────────────────────────

export default function SettingsTemplate({ user }: SettingsTemplateProps) {
  const { dict } = useDictionary();
  const s = dict.settings;

  // Queries
  const categoriesQuery = useCategories();
  const categories: Category[] = categoriesQuery.data ?? [];

  // Mutations
  const createCatMut = useCreateCategory();
  const updateCatMut = useUpdateCategory();
  const deleteCatMut = useDeleteCategory();
  const createSubMut = useCreateSubcategory();
  const updateSubMut = useUpdateSubcategory();
  const deleteSubMut = useDeleteSubcategory();

  // ─── Category modal ───────────────────────────────────────
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const openAddCategory = () => {
    setEditingCat(null);
    setCatModalOpen(true);
  };

  const openEditCategory = (cat: Category) => {
    setEditingCat(cat);
    setCatModalOpen(true);
  };

  const closeCatModal = () => {
    setCatModalOpen(false);
    setEditingCat(null);
  };

  const handleSaveCategory = (formData: FormData) => {
    const name = (formData.get("name") as string).trim();
    const description = (formData.get("description") as string).trim() || null;
    if (!name) return;

    if (editingCat) {
      updateCatMut.mutate(
        { id: editingCat.id, payload: { name, description } },
        { onSuccess: closeCatModal },
      );
    } else {
      createCatMut.mutate(
        { name, description },
        { onSuccess: () => setCatModalOpen(false) },
      );
    }
  };

  const catDelete = useConfirmDelete((id) => deleteCatMut.mutate(id));

  // ─── Subcategory modal ────────────────────────────────────
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [subParentCatId, setSubParentCatId] = useState<string>("");
  const [editingSub, setEditingSub] = useState<Subcategory | null>(null);

  const openAddSubcategory = (categoryId: string) => {
    setSubParentCatId(categoryId);
    setEditingSub(null);
    setSubModalOpen(true);
  };

  const openEditSubcategory = (sub: Subcategory) => {
    setSubParentCatId(sub.categoryId);
    setEditingSub(sub);
    setSubModalOpen(true);
  };

  const closeSubModal = () => {
    setSubModalOpen(false);
    setEditingSub(null);
  };

  const handleSaveSubcategory = (formData: FormData) => {
    const name = (formData.get("name") as string).trim();
    const description = (formData.get("description") as string).trim() || null;
    if (!name) return;

    if (editingSub) {
      updateSubMut.mutate(
        { id: editingSub.id, payload: { name, description } },
        { onSuccess: closeSubModal },
      );
    } else {
      createSubMut.mutate(
        { categoryId: subParentCatId, name, description },
        { onSuccess: () => setSubModalOpen(false) },
      );
    }
  };

  const subDelete = useConfirmDelete((id) => deleteSubMut.mutate(id));

  // ─── Render ───────────────────────────────────────────────

  return (
    <AppLayout user={user}>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {s.title}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{s.subtitle}</p>
        </div>

        {/* Categories */}
        <CategoryList
          categories={categories}
          isLoading={categoriesQuery.isLoading}
          onAddCategory={openAddCategory}
          onEditCategory={openEditCategory}
          onDeleteCategory={catDelete.handleDelete}
          deletingCatId={catDelete.pendingId}
          onAddSubcategory={openAddSubcategory}
          onEditSubcategory={openEditSubcategory}
          onDeleteSubcategory={subDelete.handleDelete}
          deletingSubId={subDelete.pendingId}
          dict={dict}
        />
      </div>

      {/* Category Modal */}
      <CategoryModal
        key={editingCat?.id ?? "new-cat"}
        open={catModalOpen}
        editingCat={editingCat}
        onClose={closeCatModal}
        onSave={handleSaveCategory}
        isSaving={createCatMut.isPending || updateCatMut.isPending}
        dict={dict}
      />

      {/* Subcategory Modal */}
      <SubcategoryModal
        key={editingSub?.id ?? "new-sub"}
        open={subModalOpen}
        editingSub={editingSub}
        onClose={closeSubModal}
        onSave={handleSaveSubcategory}
        isSaving={createSubMut.isPending || updateSubMut.isPending}
        dict={dict}
      />
    </AppLayout>
  );
}
