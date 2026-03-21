"use client";

import type { PackageSnapshot, AddOnSnapshot } from "@/services/booking";

interface Props {
  packageSnapshot: PackageSnapshot | null;
  addOnsSnapshot: AddOnSnapshot[] | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labels: Record<string, any>;
}

function fmt(n: number): string {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export default function PriceSummary({
  packageSnapshot,
  addOnsSnapshot,
  labels,
}: Props) {
  const hasItems =
    packageSnapshot || (addOnsSnapshot && addOnsSnapshot.length > 0);

  if (!hasItems) {
    return (
      <p className="text-xs italic text-gray-400">
        {labels.noItemsSelected ?? "No package or add-ons selected yet."}
      </p>
    );
  }

  const pkgTotal = packageSnapshot?.price ?? 0;
  const addOnsTotal =
    addOnsSnapshot?.reduce((s, a) => s + a.price * a.quantity, 0) ?? 0;
  const grandTotal = pkgTotal + addOnsTotal;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-2">
      <h3 className="text-sm font-semibold text-gray-700">
        {labels.summaryTitle ?? "Price Summary"}
      </h3>

      {packageSnapshot && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {packageSnapshot.name}
            {packageSnapshot.variationLabel && (
              <span className="ml-1 text-xs text-gray-400">
                ({packageSnapshot.variationLabel})
              </span>
            )}
          </span>
          <span className="font-medium text-gray-800">
            {fmt(packageSnapshot.price)}
          </span>
        </div>
      )}

      {addOnsSnapshot?.map((ao, i) => (
        <div key={i} className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {ao.name}
            {ao.quantity > 1 && (
              <span className="ml-1 text-xs text-gray-400">×{ao.quantity}</span>
            )}
          </span>
          <span className="font-medium text-gray-800">
            {fmt(ao.price * ao.quantity)}
          </span>
        </div>
      ))}

      <div className="border-t border-dashed border-gray-200 pt-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">
          {labels.total ?? "Total"}
        </span>
        <span className="text-base font-bold text-blue-600">
          {fmt(grandTotal)}
        </span>
      </div>
    </div>
  );
}
