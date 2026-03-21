"use client";

import { Button, Input } from "@/components/ui";
import { IconPlus, IconTrash } from "@/components/icons";
import type { SourceAddOn, CustomAddOnDraft } from "./types";

interface Props {
  addOns: SourceAddOn[];
  selectedAddOnIds: string[];
  toggleAddOn: (id: string) => void;
  customAddOns: CustomAddOnDraft[];
  addCustomAddOn: () => void;
  removeCustomAddOn: (i: number) => void;
  updateCustomAddOn: (i: number, field: "name" | "price", v: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labels: Record<string, any>;
}

export default function AddOnSelector({
  addOns,
  selectedAddOnIds,
  toggleAddOn,
  customAddOns,
  addCustomAddOn,
  removeCustomAddOn,
  updateCustomAddOn,
  labels,
}: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">
        {labels.addOnsTitle ?? "Add-ons"}{" "}
        <span className="font-normal text-gray-400">
          ({labels.optional ?? "optional"})
        </span>
      </h3>

      {/* Existing add-ons as toggleable pills */}
      {addOns.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {addOns.map((ao) => {
            const isSelected = selectedAddOnIds.includes(ao.id);
            return (
              <button
                key={ao.id}
                type="button"
                onClick={() => toggleAddOn(ao.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isSelected
                    ? "border-blue-300 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {ao.name}
                <span className="ml-1 text-gray-400">
                  Rp {Number(ao.price).toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Custom add-ons */}
      {customAddOns.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500">
            {labels.customAddOns ?? "Custom Add-ons"}
          </p>
          {customAddOns.map((ca, i) => (
            <div key={i} className="flex items-end gap-2">
              <Input
                label={i === 0 ? (labels.addOnName ?? "Name") : undefined}
                placeholder="e.g. Photo booth"
                value={ca.name}
                onChange={(e) => updateCustomAddOn(i, "name", e.target.value)}
                className="flex-1"
              />
              <Input
                label={i === 0 ? (labels.addOnPrice ?? "Price") : undefined}
                type="number"
                min="0"
                placeholder="0"
                value={ca.price}
                onChange={(e) => updateCustomAddOn(i, "price", e.target.value)}
                className="w-32"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeCustomAddOn(i)}
                className="shrink-0"
              >
                <IconTrash size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={addCustomAddOn}
        type="button"
      >
        <IconPlus size={14} />
        {labels.addCustomAddOn ?? "Add custom add-on"}
      </Button>
    </div>
  );
}
