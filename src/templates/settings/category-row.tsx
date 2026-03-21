"use client";

import { Card, CardBody, Badge, Button } from "@/components/ui";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconChevronDown,
  IconChevronRight,
} from "@/components/icons";
import type { Category, Subcategory } from "@/services/pricing";

interface Props {
  cat: Category;
  isExpanded: boolean;
  onToggle: () => void;
  onEditCategory: (cat: Category) => void;
  onDeleteCategory: (id: string) => void;
  deletingCatId: string | null;
  onAddSubcategory: (categoryId: string) => void;
  onEditSubcategory: (sub: Subcategory) => void;
  onDeleteSubcategory: (id: string) => void;
  deletingSubId: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: Record<string, any>;
}

export default function CategoryRow({
  cat,
  isExpanded,
  onToggle,
  onEditCategory,
  onDeleteCategory,
  deletingCatId,
  onAddSubcategory,
  onEditSubcategory,
  onDeleteSubcategory,
  deletingSubId,
  dict,
}: Props) {
  const s = dict.settings;

  return (
    <Card>
      <CardBody className="p-0">
        {/* Category header */}
        <div className="flex items-center gap-3 px-5 py-4">
          <button
            type="button"
            onClick={onToggle}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
          >
            {isExpanded ? (
              <IconChevronDown size={16} className="text-gray-500" />
            ) : (
              <IconChevronRight size={16} className="text-gray-500" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">
                {cat.name}
              </h3>
              <Badge variant="default">{cat.subcategories.length} sub</Badge>
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
              onClick={() => onEditCategory(cat)}
            >
              <IconEdit size={14} />
            </Button>
            <Button
              variant={deletingCatId === cat.id ? "danger" : "outline"}
              size="sm"
              onClick={() => onDeleteCategory(cat.id)}
            >
              {deletingCatId === cat.id ? (
                s.confirmDeleteCategory
              ) : (
                <IconTrash size={14} />
              )}
            </Button>
          </div>
        </div>

        {/* Subcategories */}
        {isExpanded && (
          <div className="border-t border-gray-100 bg-gray-50/50">
            {cat.subcategories.length === 0 ? (
              <div className="px-5 py-6 text-center">
                <p className="text-xs text-gray-400">{s.noSubcategories}</p>
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
                        onClick={() => onEditSubcategory(sub)}
                      >
                        <IconEdit size={12} />
                      </Button>
                      <Button
                        variant={
                          deletingSubId === sub.id ? "danger" : "outline"
                        }
                        size="sm"
                        onClick={() => onDeleteSubcategory(sub.id)}
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

            {/* Add subcategory */}
            <div className="px-5 py-3 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddSubcategory(cat.id)}
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
}
