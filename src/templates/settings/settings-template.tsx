"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout";
import {
  Card,
  CardBody,
  Badge,
  Button,
  Input,
  Textarea,
  Modal,
} from "@/components/ui";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSettings,
  IconChevronDown,
  IconChevronRight,
} from "@/components/icons";
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

  // Expanded categories
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const toggleExpanded = (id: string) =>
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));

  // Category modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);

  // Subcategory modal
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [subParentCatId, setSubParentCatId] = useState<string>("");
  const [editingSub, setEditingSub] = useState<Subcategory | null>(null);
  const [deletingSubId, setDeletingSubId] = useState<string | null>(null);

  // ─── Category handlers ────────────────────────────────────

  const openAddCategory = () => {
    setEditingCat(null);
    setCatModalOpen(true);
  };

  const openEditCategory = (cat: Category) => {
    setEditingCat(cat);
    setCatModalOpen(true);
  };

  const handleSaveCategory = (formData: FormData) => {
    const name = (formData.get("name") as string).trim();
    const description = (formData.get("description") as string).trim() || null;
    if (!name) return;

    if (editingCat) {
      updateCatMut.mutate(
        { id: editingCat.id, payload: { name, description } },
        {
          onSuccess: () => {
            setCatModalOpen(false);
            setEditingCat(null);
          },
        },
      );
    } else {
      createCatMut.mutate(
        { name, description },
        { onSuccess: () => setCatModalOpen(false) },
      );
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (deletingCatId === id) {
      deleteCatMut.mutate(id);
      setDeletingCatId(null);
    } else {
      setDeletingCatId(id);
      setTimeout(() => setDeletingCatId(null), 3000);
    }
  };

  // ─── Subcategory handlers ─────────────────────────────────

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

  const handleSaveSubcategory = (formData: FormData) => {
    const name = (formData.get("name") as string).trim();
    const description = (formData.get("description") as string).trim() || null;
    if (!name) return;

    if (editingSub) {
      updateSubMut.mutate(
        { id: editingSub.id, payload: { name, description } },
        {
          onSuccess: () => {
            setSubModalOpen(false);
            setEditingSub(null);
          },
        },
      );
    } else {
      createSubMut.mutate(
        { categoryId: subParentCatId, name, description },
        { onSuccess: () => setSubModalOpen(false) },
      );
    }
  };

  const handleDeleteSubcategory = (id: string) => {
    if (deletingSubId === id) {
      deleteSubMut.mutate(id);
      setDeletingSubId(null);
    } else {
      setDeletingSubId(id);
      setTimeout(() => setDeletingSubId(null), 3000);
    }
  };

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

        {/* ── Categories Section ──────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {s.categoriesTitle}
              </h2>
              <p className="text-sm text-gray-500">{s.categoriesSubtitle}</p>
            </div>
            <Button size="md" onClick={openAddCategory}>
              <IconPlus size={16} />
              {s.addCategory}
            </Button>
          </div>

          {categoriesQuery.isLoading ? (
            <Card>
              <CardBody className="py-12 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-accent" />
                <p className="mt-3 text-sm text-gray-500">
                  {dict.common.loading}
                </p>
              </CardBody>
            </Card>
          ) : categories.length === 0 ? (
            <Card>
              <CardBody className="py-12 text-center">
                <IconSettings
                  size={40}
                  className="mx-auto mb-3 text-gray-300"
                />
                <p className="text-sm font-medium text-gray-500">
                  {s.noCategories}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {s.noCategoriesDesc}
                </p>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-3">
              {categories.map((cat) => {
                const isExpanded = expandedIds[cat.id] ?? false;
                return (
                  <Card key={cat.id}>
                    <CardBody className="p-0">
                      {/* Category row */}
                      <div className="flex items-center gap-3 px-5 py-4">
                        <button
                          type="button"
                          onClick={() => toggleExpanded(cat.id)}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
                        >
                          {isExpanded ? (
                            <IconChevronDown
                              size={16}
                              className="text-gray-500"
                            />
                          ) : (
                            <IconChevronRight
                              size={16}
                              className="text-gray-500"
                            />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-gray-900">
                              {cat.name}
                            </h3>
                            <Badge variant="default">
                              {cat.subcategories.length} sub
                            </Badge>
                          </div>
                          {cat.description && (
                            <p className="mt-0.5 text-xs text-gray-500 truncate">
                              {cat.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditCategory(cat)}
                          >
                            <IconEdit size={14} />
                          </Button>
                          <Button
                            variant={
                              deletingCatId === cat.id ? "danger" : "outline"
                            }
                            size="sm"
                            onClick={() => handleDeleteCategory(cat.id)}
                          >
                            {deletingCatId === cat.id ? (
                              s.confirmDeleteCategory
                            ) : (
                              <IconTrash size={14} />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Subcategories (expanded) */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-gray-50/50">
                          {cat.subcategories.length === 0 ? (
                            <div className="px-5 py-6 text-center">
                              <p className="text-xs text-gray-400">
                                {s.noSubcategories}
                              </p>
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-100">
                              {cat.subcategories.map((sub) => (
                                <div
                                  key={sub.id}
                                  className="flex items-center gap-3 px-5 py-3 pl-16"
                                >
                                  <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium text-gray-700">
                                      {sub.name}
                                    </span>
                                    {sub.description && (
                                      <p className="text-xs text-gray-400 truncate">
                                        {sub.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openEditSubcategory(sub)}
                                    >
                                      <IconEdit size={12} />
                                    </Button>
                                    <Button
                                      variant={
                                        deletingSubId === sub.id
                                          ? "danger"
                                          : "outline"
                                      }
                                      size="sm"
                                      onClick={() =>
                                        handleDeleteSubcategory(sub.id)
                                      }
                                    >
                                      {deletingSubId === sub.id ? (
                                        s.confirmDeleteSubcategory
                                      ) : (
                                        <IconTrash size={12} />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add subcategory button */}
                          <div className="px-5 py-3 border-t border-gray-100">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openAddSubcategory(cat.id)}
                              className="w-full justify-center"
                            >
                              <IconPlus size={14} />
                              <span className="ml-1">{s.addSubcategory}</span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ── Category Modal ──────────────────────────────── */}
      <Modal
        open={catModalOpen}
        onClose={() => {
          setCatModalOpen(false);
          setEditingCat(null);
        }}
        title={editingCat ? s.editCategory : s.addCategory}
        footer={
          <>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setCatModalOpen(false);
                setEditingCat(null);
              }}
            >
              {dict.common.cancel}
            </Button>
            <Button
              variant="primary"
              type="submit"
              form="cat-form"
              disabled={createCatMut.isPending || updateCatMut.isPending}
            >
              {dict.common.save}
            </Button>
          </>
        }
      >
        <form id="cat-form" action={handleSaveCategory} className="space-y-4">
          <Input
            name="name"
            label={s.categoryName}
            placeholder={s.categoryNamePlaceholder}
            defaultValue={editingCat?.name ?? ""}
            required
          />
          <Textarea
            name="description"
            label={s.categoryDescription}
            placeholder={s.categoryDescPlaceholder}
            defaultValue={editingCat?.description ?? ""}
            rows={3}
          />
        </form>
      </Modal>

      {/* ── Subcategory Modal ───────────────────────────── */}
      <Modal
        open={subModalOpen}
        onClose={() => {
          setSubModalOpen(false);
          setEditingSub(null);
        }}
        title={editingSub ? s.addSubcategory : s.addSubcategory}
        footer={
          <>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setSubModalOpen(false);
                setEditingSub(null);
              }}
            >
              {dict.common.cancel}
            </Button>
            <Button
              variant="primary"
              type="submit"
              form="sub-form"
              disabled={createSubMut.isPending || updateSubMut.isPending}
            >
              {dict.common.save}
            </Button>
          </>
        }
      >
        <form
          id="sub-form"
          action={handleSaveSubcategory}
          className="space-y-4"
        >
          <Input
            name="name"
            label={s.subcategoryName}
            placeholder={s.subcategoryNamePlaceholder}
            defaultValue={editingSub?.name ?? ""}
            required
          />
          <Textarea
            name="description"
            label={s.subcategoryDescription}
            placeholder={s.subcategoryDescPlaceholder}
            defaultValue={editingSub?.description ?? ""}
            rows={3}
          />
        </form>
      </Modal>
    </AppLayout>
  );
}
