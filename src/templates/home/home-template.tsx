"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardHeader, CardBody, Badge, Button } from "@/components/ui";
import { StatCard } from "@/components/dashboard";
import {
  IconCalendar,
  IconEvent,
  IconUsers,
  IconDollar,
  IconRefresh,
  IconExpand,
} from "@/components/icons";
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
      {/* ─── Page header ─────────────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {dict.dashboard.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {dict.dashboard.welcomeBack}
            {user?.name ? `, ${user.name}` : ""}!{" "}
            {dict.dashboard.hereIsOverview}
          </p>
        </div>
        <Button variant="outline" size="md">
          {dict.dashboard.generateReports}
        </Button>
      </div>

      {/* ─── Stat Cards ──────────────────────────────────────── */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      {/* ─── Charts Row ──────────────────────────────────────── */}
      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Event Analytics — 2/3 width */}
        <Card className="xl:col-span-2">
          <CardHeader
            title={dict.dashboard.eventAnalytics}
            action={
              <div className="flex items-center gap-2">
                <select className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option>{dict.dashboard.month}</option>
                  <option>{dict.dashboard.week}</option>
                  <option>{dict.dashboard.year}</option>
                </select>
                <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                  <IconRefresh size={16} />
                </button>
              </div>
            }
          />
          <CardBody className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <IconEvent size={24} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">
                {dict.dashboard.noEventData}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {dict.dashboard.createFirstEvent}
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Client Distribution — 1/3 width */}
        <Card>
          <CardHeader
            title={dict.dashboard.clientDistribution}
            action={
              <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <IconExpand size={16} />
              </button>
            }
          />
          <CardBody className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <IconUsers size={24} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">
                {dict.dashboard.noClients}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {dict.dashboard.clientsAfterBookings}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ─── Recent Bookings Table ───────────────────────────── */}
      <Card>
        <CardHeader
          title={dict.dashboard.recentBookings}
          action={
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
                <svg
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder={dict.common.search}
                  className="w-24 border-0 bg-transparent text-xs text-slate-600 placeholder:text-slate-400 focus:outline-none sm:w-32"
                />
              </div>
              <Button variant="outline" size="sm">
                {dict.common.filter}
              </Button>
              <Button variant="outline" size="sm">
                {dict.common.sortBy}
              </Button>
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                  {dict.dashboard.no}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                  {dict.dashboard.client}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                  {dict.dashboard.package}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                  {dict.dashboard.eventDate}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                  {dict.dashboard.status}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                  {dict.dashboard.amount}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                  {dict.dashboard.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Empty state */}
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                      <IconCalendar size={24} className="text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">
                      {dict.dashboard.noBookings}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {dict.dashboard.bookingsAppearHere}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* ─── Sample data preview (for design reference) ──────── */}
      <Card className="mt-6">
        <CardHeader title={dict.dashboard.quickActions} />
        <CardBody>
          <div className="flex flex-wrap gap-3">
            <Badge variant="primary" dot>
              {dict.dashboard.active}
            </Badge>
            <Badge variant="success" dot>
              {dict.dashboard.confirmed}
            </Badge>
            <Badge variant="warning" dot>
              {dict.dashboard.pending}
            </Badge>
            <Badge variant="danger" dot>
              {dict.dashboard.cancelled}
            </Badge>
            <Badge variant="info" dot>
              {dict.dashboard.rescheduled}
            </Badge>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            {dict.dashboard.badgeVariants}
          </p>
        </CardBody>
      </Card>
    </AppLayout>
  );
}
