"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout";
import { StatCard } from "@/components/dashboard";
import {
  IconCalendar,
  IconEvent,
  IconUsers,
  IconDollar,
  IconLink,
  IconPricing,
  IconPlus,
  IconChevronRight,
} from "@/components/icons";
import { Select } from "@/components/ui";
import { useDictionary } from "@/i18n";

interface HomeTemplateProps {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
}

export default function HomeTemplate({ user }: HomeTemplateProps) {
  const { dict } = useDictionary();

  return (
    <AppLayout user={user} title={dict.nav.home}>
      {/* ─── Welcome Header ──────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {dict.dashboard.welcomeBack}
          {user?.name ? `, ${user.name}` : ""}! 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {dict.dashboard.hereIsOverview}
        </p>
      </div>

      {/* ─── Quick Actions ───────────────────────────────── */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link
          href="/event"
          className="group flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-sm"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
            <IconLink size={20} />
          </div>
          <span className="text-xs font-medium text-gray-700">
            {dict.event.generateLink}
          </span>
        </Link>

        <Link
          href="/event"
          className="group flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-sm"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 text-green-600 transition-colors group-hover:bg-green-100">
            <IconPlus size={20} />
          </div>
          <span className="text-xs font-medium text-gray-700">
            {dict.event.createEvent}
          </span>
        </Link>

        <Link
          href="/pricing"
          className="group flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-sm"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
            <IconPricing size={20} />
          </div>
          <span className="text-xs font-medium text-gray-700">
            {dict.nav.pricingPackage}
          </span>
        </Link>

        <Link
          href="/schedule"
          className="group flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-sm"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600 transition-colors group-hover:bg-red-100">
            <IconCalendar size={20} />
          </div>
          <span className="text-xs font-medium text-gray-700">
            {dict.nav.schedule}
          </span>
        </Link>
      </div>

      {/* ─── Stat Cards ──────────────────────────────────── */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<IconDollar size={20} />}
          title={dict.dashboard.totalRevenue}
          value="$0"
          trend={{ value: "0%", direction: "up" }}
        />
        <StatCard
          icon={<IconEvent size={20} />}
          title={dict.dashboard.totalEvents}
          value="0"
          trend={{ value: "0%", direction: "up" }}
        />
        <StatCard
          icon={<IconUsers size={20} />}
          title={dict.dashboard.totalClients}
          value="0"
          trend={{ value: "0%", direction: "up" }}
        />
        <StatCard
          icon={<IconCalendar size={20} />}
          title={dict.dashboard.upcomingEvents}
          value="0"
          trend={{ value: "0%", direction: "up" }}
        />
      </div>

      {/* ─── Two-Column: Upcoming Events + Recent Bookings ── */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Upcoming Events — 3/5 */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-base font-medium text-gray-900">
                {dict.dashboard.upcomingEvents}
              </h2>
              <Link
                href="/schedule"
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                {dict.event.view}
                <IconChevronRight size={14} />
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <IconCalendar size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-500">
                {dict.dashboard.noBookings}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {dict.dashboard.bookingsAppearHere}
              </p>
            </div>
          </div>
        </div>

        {/* Module Shortcuts — 2/5 */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-base font-medium text-gray-900">
                {dict.dashboard.quickActions}
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              <ModuleShortcut
                icon={<IconEvent size={18} />}
                label={dict.nav.event}
                desc={dict.event.subtitle}
                href="/event"
                color="text-blue-600 bg-blue-50"
              />
              <ModuleShortcut
                icon={<IconCalendar size={18} />}
                label={dict.nav.schedule}
                desc={dict.schedule.subtitle}
                href="/schedule"
                color="text-red-600 bg-red-50"
              />
              <ModuleShortcut
                icon={<IconPricing size={18} />}
                label={dict.nav.pricingPackage}
                desc={dict.pricing.subtitle}
                href="/pricing"
                color="text-amber-600 bg-amber-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Analytics Placeholder ───────────────────────── */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-base font-medium text-gray-900">
            {dict.dashboard.eventAnalytics}
          </h2>
          <Select
            value="month"
            onChange={() => {}}
            options={[
              { value: "month", label: dict.dashboard.month },
              { value: "week", label: dict.dashboard.week },
              { value: "year", label: dict.dashboard.year },
            ]}
            className="w-auto"
          />
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <IconEvent size={24} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-500">
            {dict.dashboard.noEventData}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {dict.dashboard.createFirstEvent}
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

/* ─── Module Shortcut Row ──────────────────────────────── */
function ModuleShortcut({
  icon,
  label,
  desc,
  href,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-gray-50"
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="truncate text-xs text-gray-400">{desc}</p>
      </div>
      <IconChevronRight size={16} className="text-gray-300" />
    </Link>
  );
}
