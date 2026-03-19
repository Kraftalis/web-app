"use client";

import React from "react";
import { Card, CardBody, Badge, Button } from "@/components/ui";
import { IconCheck, IconEdit } from "@/components/icons";
import type { Package, PackageVariation } from "./types";

interface Props {
  items: Package[];
  pageItems: Package[];
  openEditPkg: (p: Package) => void;
  deletingPkgId: string | null;
  handleDeletePackage: (id: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pricing: any;
  isMobile?: boolean;
}

export default function PackageList({
  pageItems,
  openEditPkg,
  deletingPkgId,
  handleDeletePackage,
  dict,
  pricing,
  isMobile,
}: Props) {
  if (isMobile) {
    return (
      <div className="md:hidden grid gap-4 sm:grid-cols-2">
        {pageItems.map((pkg) => (
          <Card key={pkg.id}>
            <CardBody className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {pkg.name}
                  </h3>
                  {pkg.description && (
                    <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                      {pkg.description}
                    </p>
                  )}
                </div>
                <Badge
                  variant={pkg.isActive ? "success" : "default"}
                  className="shrink-0"
                >
                  {pkg.isActive ? pricing.active : pricing.archived}
                </Badge>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{pkg.price}</p>
              </div>
              {pkg.inclusions && pkg.inclusions.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {pricing.inclusionsTitle || "Includes"}
                  </p>
                  <ul className="mt-1 space-y-1">
                    {pkg.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <IconCheck
                          size={14}
                          className="text-green-500 shrink-0 mt-0.5"
                        />
                        <span className="text-sm text-gray-700">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pkg.items.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {pricing.variationsTitle}
                  </p>
                  <ul className="space-y-1">
                    {pkg.items.map((variation: PackageVariation) => (
                      <li
                        key={variation.id}
                        className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2.5 py-1.5"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <IconCheck
                            size={12}
                            className="shrink-0 text-green-500"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-700 truncate">
                              {variation.label}
                            </p>
                            {variation.description && (
                              <p className="text-xs text-gray-400 truncate">
                                {variation.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-gray-900 shrink-0">
                          {variation.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditPkg(pkg)}
                >
                  <IconEdit size={14} />
                  <span className="ml-1">{dict.common.edit}</span>
                </Button>
                <Button
                  variant={deletingPkgId === pkg.id ? "danger" : "outline"}
                  size="sm"
                  onClick={() => handleDeletePackage(pkg.id)}
                >
                  {deletingPkgId === pkg.id
                    ? pricing.confirmDelete
                    : dict.common.delete}
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardBody className="-mx-1 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="px-3 py-2 font-medium">{pricing.colName}</th>
              <th className="px-3 py-2 font-medium">
                {pricing.colDescription}
              </th>
              <th className="px-3 py-2 font-medium">Price</th>
              <th className="px-3 py-2 font-medium">Variations</th>
              <th className="px-3 py-2 font-medium">{pricing.colStatus}</th>
              <th className="px-3 py-2 font-medium">{pricing.colActions}</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((pkg) => (
              <tr
                key={pkg.id}
                className="border-b border-gray-100 last:border-0"
              >
                <td className="px-3 py-3 font-medium text-gray-900 w-48">
                  {pkg.name}
                </td>
                <td className="px-3 py-3 text-gray-500">
                  {pkg.description || "-"}
                </td>
                <td className="px-3 py-3 text-gray-900">{pkg.price}</td>
                <td className="px-3 py-3 text-gray-700">
                  {pkg.items.length === 0 ? (
                    <span className="text-xs text-gray-500">
                      {pricing.noVariations}
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {pkg.items.map((v) => (
                        <span
                          key={v.id}
                          className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700"
                        >
                          <IconCheck size={10} className="text-green-500" />
                          <span className="truncate max-w-40">{v.label}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-3 py-3 text-sm text-gray-700">
                  {pkg.inclusions && pkg.inclusions.length > 0 ? (
                    <ul className="space-y-1 max-w-md">
                      {pkg.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <IconCheck
                            size={12}
                            className="text-green-500 shrink-0 mt-0.5"
                          />
                          <span className="text-sm text-gray-700">{inc}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-xs text-gray-500">-</span>
                  )}
                </td>
                <td className="px-3 py-3">
                  <Badge variant={pkg.isActive ? "success" : "default"}>
                    {pkg.isActive ? pricing.active : pricing.archived}
                  </Badge>
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditPkg(pkg)}
                    >
                      <IconEdit size={14} />
                      <span className="ml-1">{dict.common.edit}</span>
                    </Button>
                    <Button
                      variant={deletingPkgId === pkg.id ? "danger" : "outline"}
                      size="sm"
                      onClick={() => handleDeletePackage(pkg.id)}
                    >
                      {deletingPkgId === pkg.id
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
  );
}
