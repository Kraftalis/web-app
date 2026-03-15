"use client";

import { type ReactNode } from "react";
import { IconTrendUp, IconTrendDown, IconInfo } from "@/components/icons";

/**
 * StatCard — dashboard metric card showing a value with trend indicator.
 * Matches the design: icon, title, value, trend badge.
 */

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
  className?: string;
}

export default function StatCard({
  icon,
  title,
  value,
  trend,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      {/* Info button */}
      <button
        className="absolute right-4 top-4 text-slate-300 hover:text-slate-400"
        aria-label="Info"
      >
        <IconInfo size={16} />
      </button>

      {/* Icon */}
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      {/* Title */}
      <p className="text-xs font-medium text-slate-400">{title}</p>

      {/* Value + Trend */}
      <div className="mt-1 flex items-end gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold ${
              trend.direction === "up"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {trend.direction === "up" ? (
              <IconTrendUp size={12} />
            ) : (
              <IconTrendDown size={12} />
            )}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}

export type { StatCardProps };
