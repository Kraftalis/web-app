"use client";

import React from "react";
import { Select } from "@/components/ui";

interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  sortBy: string;
  setSortBy: (v: "name" | "price" | "status") => void;
  sortDir: string;
  setSortDir: (v: "asc" | "desc") => void;
  pageSize: number;
  setPageSize: (v: number) => void;
  categoryId: string;
  setCategoryId: (v: string) => void;
  subcategoryId: string;
  setSubcategoryId: (v: string) => void;
  categoryOptions: SelectOption[];
  subcategoryOptions: SelectOption[];
}

/**
 * Inline filter selects for the pricing page.
 * Renders as a flat row of selects — no wrapper flex container.
 * The parent is responsible for the row layout.
 */
export default function PricingControls({
  sortBy,
  setSortBy,
  sortDir,
  setSortDir,
  pageSize,
  setPageSize,
  categoryId,
  setCategoryId,
  subcategoryId,
  setSubcategoryId,
  categoryOptions,
  subcategoryOptions,
}: Props) {
  return (
    <>
      <Select
        value={categoryId}
        onChange={(e) => {
          setCategoryId(e.target.value);
          setSubcategoryId(""); // reset subcategory when category changes
        }}
        options={[{ value: "", label: "All categories" }, ...categoryOptions]}
        className="w-auto"
      />

      <Select
        value={subcategoryId}
        onChange={(e) => setSubcategoryId(e.target.value)}
        options={[{ value: "", label: "All types" }, ...subcategoryOptions]}
        className="w-auto"
        disabled={!categoryId}
      />

      <Select
        value={`${sortBy}_${sortDir}`}
        onChange={(e) => {
          const [s, d] = e.target.value.split("_");
          setSortBy(s as "name" | "price" | "status");
          setSortDir(d as "asc" | "desc");
        }}
        options={[
          { value: "name_asc", label: "Name ↑" },
          { value: "name_desc", label: "Name ↓" },
          { value: "price_asc", label: "Price ↑" },
          { value: "price_desc", label: "Price ↓" },
          { value: "status_desc", label: "Status" },
        ]}
        className="w-auto"
      />

      <Select
        value={String(pageSize)}
        onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
        options={[
          { value: "5", label: "5 / page" },
          { value: "8", label: "8 / page" },
          { value: "12", label: "12 / page" },
        ]}
        className="w-auto"
      />
    </>
  );
}
