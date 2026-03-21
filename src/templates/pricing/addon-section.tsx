"use client";

import {
  Card,
  CardBody,
  Badge,
  Button,
  Skeleton,
  SkeletonTableRow,
} from "@/components/ui";
import { IconPlus, IconEdit, IconPricing } from "@/components/icons";
import type { AddOn } from "./types";
import { formatCurrency } from "./helpers";

interface Props {
  addOns: AddOn[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (addon: AddOn) => void;
  onDelete: (id: string) => void;
  deletingAddonId: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: Record<string, any>;
}

export default function AddOnSection({
  addOns,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
  deletingAddonId,
  dict,
}: Props) {
  const pricing = dict.pricing;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {pricing.addOnsTitle}
        </h2>
        <Button variant="primary" size="sm" onClick={onAdd}>
          <IconPlus size={16} />
          <span className="ml-1">{pricing.addAddOn}</span>
        </Button>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <Card>
          <CardBody className="-mx-1 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="px-3 py-2">
                    <Skeleton className="h-4 w-16" />
                  </th>
                  <th className="px-3 py-2">
                    <Skeleton className="h-4 w-24" />
                  </th>
                  <th className="px-3 py-2">
                    <Skeleton className="h-4 w-16" />
                  </th>
                  <th className="px-3 py-2">
                    <Skeleton className="h-4 w-14" />
                  </th>
                  <th className="px-3 py-2">
                    <Skeleton className="h-4 w-20" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonTableRow key={i} cols={5} />
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}

      {/* Empty state */}
      {!isLoading && addOns.length === 0 && (
        <Card>
          <CardBody className="py-12 text-center">
            <IconPricing size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">
              {pricing.noAddOns}
            </p>
            <p className="mt-1 text-xs text-gray-400">{pricing.noAddOnsDesc}</p>
          </CardBody>
        </Card>
      )}

      {/* Table */}
      {!isLoading && addOns.length > 0 && (
        <Card>
          <CardBody className="-mx-1 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="px-3 py-2 font-medium">{pricing.colName}</th>
                  <th className="px-3 py-2 font-medium">
                    {pricing.colDescription}
                  </th>
                  <th className="px-3 py-2 font-medium">{pricing.colPrice}</th>
                  <th className="px-3 py-2 font-medium">{pricing.colStatus}</th>
                  <th className="px-3 py-2 font-medium">
                    {pricing.colActions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {addOns.map((addon) => (
                  <tr
                    key={addon.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-3 py-2 font-medium text-gray-900">
                      {addon.name}
                    </td>
                    <td className="px-3 py-2 text-gray-500">
                      {addon.description || "-"}
                    </td>
                    <td className="px-3 py-2 text-gray-900">
                      {formatCurrency(addon.price, addon.currency)}
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant={addon.isActive ? "success" : "default"}>
                        {addon.isActive ? pricing.active : pricing.archived}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(addon)}
                        >
                          <IconEdit size={14} />
                        </Button>
                        <Button
                          variant={
                            deletingAddonId === addon.id ? "danger" : "outline"
                          }
                          size="sm"
                          onClick={() => onDelete(addon.id)}
                        >
                          {deletingAddonId === addon.id
                            ? pricing.confirmDelete
                            : dict.common.delete}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}
    </section>
  );
}
