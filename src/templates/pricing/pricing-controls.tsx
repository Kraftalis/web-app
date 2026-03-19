"use client";

import React from "react";
import { Select } from "@/components/ui";

interface Props {
  sortBy: string;
  setSortBy: (v: "name" | "price" | "status") => void;
  sortDir: string;
  setSortDir: (v: "asc" | "desc") => void;
  pageSize: number;
  setPageSize: (v: number) => void;
  category: string;
  setCategory: (v: string) => void;
  subcategory: string;
  setSubcategory: (v: string) => void;
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
  category,
  setCategory,
  subcategory,
  setSubcategory,
}: Props) {
  return (
    <>
      <Select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        options={[
          { value: "", label: "All categories" },
          { value: "Photography", label: "Photography" },
        ]}
        className="w-auto"
      />

      <Select
        value={subcategory}
        onChange={(e) => setSubcategory(e.target.value)}
        options={[
          { value: "", label: "All types" },
          { value: "Wedding", label: "Wedding" },
          { value: "Pre-wedding", label: "Pre-wedding" },
          { value: "Graduation", label: "Graduation" },
          { value: "Family", label: "Family" },
          { value: "Community", label: "Community" },
          { value: "Maternity", label: "Maternity" },
        ]}
        className="w-auto"
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
