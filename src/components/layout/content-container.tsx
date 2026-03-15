"use client";

import { type ReactNode } from "react";

/**
 * ContentContainer — wraps the main page content area.
 * Provides consistent padding and max-width.
 */

interface ContentContainerProps {
  children: ReactNode;
  className?: string;
}

export default function ContentContainer({
  children,
  className = "",
}: ContentContainerProps) {
  return (
    <main
      className={`flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 ${className}`}
    >
      {children}
    </main>
  );
}

export type { ContentContainerProps };
