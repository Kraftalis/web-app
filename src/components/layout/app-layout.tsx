"use client";

import { type ReactNode } from "react";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import ContentContainer from "./content-container";

/**
 * AppLayout — the authenticated app shell.
 * Combines Sidebar + Topbar + Content area in a side-by-side layout.
 * This is the main layout for all dashboard pages.
 */

interface AppLayoutProps {
  children: ReactNode;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  /** Page title shown in the topbar breadcrumb */
  title?: string;
}

export default function AppLayout({ children, user, title }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar — fixed left */}
      <Sidebar />

      {/* Main content area — fills remaining space */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar — fixed top */}
        <Topbar user={user} title={title} />

        {/* Page content — scrollable */}
        <ContentContainer>{children}</ContentContainer>
      </div>
    </div>
  );
}

export type { AppLayoutProps };
