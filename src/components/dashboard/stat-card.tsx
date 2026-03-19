"use client";

import { type ReactNode } from "react";
import { IconTrendUp, IconTrendDown } from "@/components/icons";

/**
 * StatCard — Google Workspace-style metric card with clean design.
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
      className={`rounded-lg border border-(--border) bg-white p-5 transition-shadow hover:shadow-sm ${className}`}
    >
      {/* Icon */}
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent-light text-accent">
        {icon}
      </div>

      {/* Title */}
      <p className="text-xs font-medium text-(--text-secondary)">{title}</p>

      {/* Value + Trend */}
      <div className="mt-1 flex items-end gap-2">
        <span className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold ${
              trend.direction === "up"
                ? "bg-accent-light text-accent-dark"
                : "bg-red-50 text-red-600"
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
