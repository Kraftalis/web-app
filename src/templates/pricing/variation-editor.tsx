"use client";

import { Button } from "@/components/ui";
import { IconPlus } from "@/components/icons";
import VariationRow from "./variation-row";

interface Variation {
  label: string;
  description: string;
  price: string;
  inclusions: string;
}

interface Props {
  variations: Variation[];
  onAdd: () => void;
  onChange: (
    i: number,
    field: "label" | "description" | "price" | "inclusions",
    value: string,
  ) => void;
  onRemove: (i: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pricing: Record<string, any>;
}

export default function VariationEditor({
  variations,
  onAdd,
  onChange,
  onRemove,
  pricing,
}: Props) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-gray-700">
          {pricing.variationsTitle}
        </p>
        <p className="mt-0.5 text-xs text-gray-400">{pricing.variationsHint}</p>
      </div>
      {variations.length > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 px-3">
            <p className="text-xs font-medium text-gray-500">
              {pricing.variationLabel}
            </p>
            <p className="text-xs font-medium text-gray-500">
              {pricing.variationPrice}
            </p>
          </div>
          {variations.map((v, i) => (
            <VariationRow
              key={i}
              variation={v}
              index={i}
              onChange={onChange}
              onRemove={onRemove}
              labelPlaceholder={pricing.variationLabelPlaceholder}
              descPlaceholder={pricing.variationDescPlaceholder}
              inclusionsPlaceholder={
                pricing.variationInclusionsPlaceholder ??
                "Enter each inclusion on a new line"
              }
            />
          ))}
        </div>
      )}
      <Button type="button" variant="outline" size="sm" onClick={onAdd}>
        <IconPlus size={14} />
        <span className="ml-1">{pricing.addVariation}</span>
      </Button>
    </div>
  );
}
