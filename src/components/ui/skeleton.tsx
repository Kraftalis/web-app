"use client";

import { type ReactNode } from "react";

// ─── Base Skeleton ──────────────────────────────────────────

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

// ─── Skeleton Text (single line) ────────────────────────────

interface SkeletonTextProps {
  width?: string;
  className?: string;
}

export function SkeletonText({
  width = "w-full",
  className = "",
}: SkeletonTextProps) {
  return <Skeleton className={`h-4 ${width} ${className}`} />;
}

// ─── Skeleton Circle (avatar, icon) ─────────────────────────

interface SkeletonCircleProps {
  size?: number;
  className?: string;
}

export function SkeletonCircle({
  size = 40,
  className = "",
}: SkeletonCircleProps) {
  return (
    <Skeleton
      className={`rounded-full shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

// ─── Skeleton Card ──────────────────────────────────────────

interface SkeletonCardProps {
  lines?: number;
  className?: string;
}

export function SkeletonCard({ lines = 3, className = "" }: SkeletonCardProps) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-5 space-y-3 ${className}`}
    >
      <Skeleton className="h-5 w-2/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3 ${i === lines - 1 ? "w-1/2" : "w-full"}`}
        />
      ))}
    </div>
  );
}

// ─── Skeleton Table Row ─────────────────────────────────────

interface SkeletonTableRowProps {
  cols?: number;
  className?: string;
}

export function SkeletonTableRow({
  cols = 5,
  className = "",
}: SkeletonTableRowProps) {
  return (
    <tr className={className}>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-3 py-3">
          <Skeleton className={`h-4 ${i === 0 ? "w-32" : "w-20"}`} />
        </td>
      ))}
    </tr>
  );
}

// ─── Skeleton Wrapper (children or skeleton) ────────────────

interface SkeletonWrapperProps {
  isLoading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
}

export function SkeletonWrapper({
  isLoading,
  skeleton,
  children,
}: SkeletonWrapperProps) {
  return <>{isLoading ? skeleton : children}</>;
}
