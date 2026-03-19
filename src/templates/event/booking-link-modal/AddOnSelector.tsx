"use client";

import { Input } from "@/components/ui";
import { IconPlus, IconTrash } from "@/components/icons";
import type { VendorAddOn } from "@/templates/booking/types";

interface CustomAddOn {
  name: string;
  description: string;
  price: string;
}

interface Props {
  addOns: VendorAddOn[];
  selectedAddOnIds: string[];
  toggleAddOn: (id: string) => void;
  label: string;
  onAddCustom?: () => void;
  customAddOns?: CustomAddOn[];
  onUpdateCustom?: (i: number, field: keyof CustomAddOn, value: string) => void;
  onRemoveCustom?: (i: number) => void;
  labels: {
    customAddOnLabel: string;
    customAddOnPlaceholder: string;
    customAddOnPrice: string;
    addCustomAddOn: string;
  };
}

export default function AddOnSelector({
  addOns,
  selectedAddOnIds,
  toggleAddOn,
  label,
  onAddCustom,
  customAddOns = [],
  onUpdateCustom,
  onRemoveCustom,
  labels,
}: Props) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-700">{label}</p>
      <div className="space-y-2">
        {addOns.map((ao: VendorAddOn) => {
          const isAdded = selectedAddOnIds.includes(ao.id);
          return (
            <label
              key={ao.id}
              className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors ${isAdded ? "border-blue-300 bg-blue-50/50" : "border-slate-200 hover:bg-slate-50"}`}
            >
              <input
                type="checkbox"
                checked={isAdded}
                onChange={() => toggleAddOn(ao.id)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900">{ao.name}</p>
                {ao.description && (
                  <p className="text-xs text-slate-500">{ao.description}</p>
                )}
              </div>
              <p className="shrink-0 text-sm font-semibold text-slate-700">
                +{ao.price}
              </p>
            </label>
          );
        })}

        {customAddOns.map((cao: CustomAddOn, i: number) => (
          <div
            key={`custom-ao-${i}`}
            className="rounded-md border border-blue-200 bg-blue-50/30 p-3"
          >
            <div className="flex items-start gap-2">
              <div className="grid flex-1 grid-cols-2 gap-2">
                <Input
                  placeholder={labels.customAddOnPlaceholder}
                  value={cao.name}
                  onChange={(e) => onUpdateCustom?.(i, "name", e.target.value)}
                  className="bg-white"
                />
                <Input
                  placeholder={labels.customAddOnPrice}
                  value={cao.price}
                  onChange={(e) => onUpdateCustom?.(i, "price", e.target.value)}
                  className="bg-white"
                />
              </div>
              <button
                type="button"
                onClick={() => onRemoveCustom?.(i)}
                className="rounded-md p-2 text-red-500 hover:bg-red-50"
              >
                <IconTrash size={14} />
              </button>
            </div>
            <Input
              placeholder="Deskripsi (opsional)"
              value={cao.description}
              onChange={(e) =>
                onUpdateCustom?.(i, "description", e.target.value)
              }
              className="mt-2 bg-white"
            />
          </div>
        ))}

        {onAddCustom && (
          <button
            type="button"
            onClick={onAddCustom}
            className="mt-1 flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            <IconPlus size={12} />
            {labels.addCustomAddOn}
          </button>
        )}
      </div>
    </div>
  );
}
