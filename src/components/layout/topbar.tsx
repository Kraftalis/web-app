"use client";

import { IconMenu } from "@/components/icons";
import {
  SearchButton,
  NotificationDropdown,
  ProfileDropdown,
  LanguageSwitcher,
} from "@/components/topbar";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useDictionary } from "@/i18n";

/**
 * Topbar — top navigation bar with search, notifications, and user menu.
 * Used inside the authenticated app shell.
 */

interface TopbarProps {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  /** Page title displayed in the breadcrumb area */
  title?: string;
}

export default function Topbar({ user, title }: TopbarProps) {
  const { toggle } = useSidebarStore();
  const { dict } = useDictionary();
  const displayTitle = title ?? dict.nav.home;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      {/* Left side — mobile menu + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          aria-label={dict.topbar.openSidebar}
        >
          <IconMenu size={20} />
        </button>

        {/* Breadcrumb */}
        <nav className="hidden items-center gap-1.5 text-sm sm:flex">
          <span className="text-slate-400">{dict.nav.home}</span>
          {displayTitle !== dict.nav.home && (
            <>
              <span className="text-slate-300">/</span>
              <span className="font-medium text-slate-700">{displayTitle}</span>
            </>
          )}
        </nav>
      </div>

      {/* Right side — language, search, notifications, profile */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <SearchButton />
        <NotificationDropdown />

        {/* Divider */}
        <div className="mx-1 h-8 w-px bg-slate-200" />

        {/* User profile dropdown */}
        {user && <ProfileDropdown user={user} />}
      </div>
    </header>
  );
}
