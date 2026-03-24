"use client";

import React from "react";
import { IconTrash } from "@/components/icons";
import { Input, Textarea } from "@/components/ui";

interface Props {
  variation: {
    label: string;
    description: string;
    price: string;
    inclusions: string;
  };
  index: number;
  onChange: (
    index: number,
    field: "label" | "description" | "price" | "inclusions",
    value: string,
  ) => void;
  onRemove: (index: number) => void;
  labelPlaceholder: string;
  descPlaceholder: string;
  inclusionsPlaceholder: string;
}

export default function VariationRow({
  variation,
  index,
  onChange,
  onRemove,
  labelPlaceholder,
  descPlaceholder,
  inclusionsPlaceholder,
}: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-2">
      <div className="flex items-start gap-2">
        <div className="flex-1 space-y-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <Input
              type="text"
              value={variation.label}
              onChange={(e) => onChange(index, "label", e.target.value)}
              placeholder={labelPlaceholder}
            />
            <Input
              type="number"
              value={variation.price}
              onChange={(e) => onChange(index, "price", e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
          <Input
            type="text"
            value={variation.description}
            onChange={(e) => onChange(index, "description", e.target.value)}
            placeholder={descPlaceholder}
          />
          <Textarea
            value={variation.inclusions}
            onChange={(e) => onChange(index, "inclusions", e.target.value)}
            placeholder={inclusionsPlaceholder}
            rows={3}
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="mt-1 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          aria-label="Remove variation"
        >
          <IconTrash size={16} />
        </button>
      </div>
    </div>
  );
}
