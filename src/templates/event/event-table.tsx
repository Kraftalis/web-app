"use client";

import Link from "next/link";
import { Card, CardBody, Badge } from "@/components/ui";
import { IconEvent, IconEye } from "@/components/icons";
import type { EventItem } from "./types";
import { eventStatusVariant, paymentStatusVariant } from "./types";

// ─── Event Table (list view) ────────────────────────────────

interface EventTableProps {
  events: EventItem[];
  allEventsCount: number;
  eventStatusLabel: Record<string, string>;
  paymentStatusLabel: Record<string, string>;
  viewLabel: string;
  formatDate: (dateStr: string) => string;
  columns: {
    colEventDate: string;
    colClientName: string;
    colEventType: string;
    colPackage: string;
    colPaymentStatus: string;
    colEventStatus: string;
    colActions: string;
  };
  emptyLabels: {
    noEvents: string;
    noEventsDesc: string;
    noMatchingEvents: string;
    noMatchingEventsDesc: string;
  };
}

export function EventTable({
  events,
  allEventsCount,
  eventStatusLabel,
  paymentStatusLabel,
  viewLabel,
  formatDate,
  columns,
  emptyLabels,
}: EventTableProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardBody>
          <div className="flex flex-col items-center py-12">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100">
              <IconEvent size={28} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">
              {allEventsCount === 0
                ? emptyLabels.noEvents
                : emptyLabels.noMatchingEvents}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {allEventsCount === 0
                ? emptyLabels.noEventsDesc
                : emptyLabels.noMatchingEventsDesc}
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                {columns.colEventDate}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                {columns.colClientName}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                {columns.colEventType}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                {columns.colPackage}
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500">
                {columns.colPaymentStatus}
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500">
                {columns.colEventStatus}
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500">
                {columns.colActions}
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr
                key={e.id}
                className="border-b border-slate-50 transition-colors hover:bg-slate-50/50"
              >
                <td className="px-6 py-3 text-slate-700">
                  {formatDate(e.eventDate)}
                </td>
                <td className="px-6 py-3 font-medium text-slate-900">
                  {e.clientName}
                </td>
                <td className="px-6 py-3 text-slate-600">{e.eventType}</td>
                <td className="px-6 py-3 text-slate-600">
                  {e.packageName || "—"}
                </td>
                <td className="px-6 py-3 text-center">
                  <Badge variant={paymentStatusVariant(e.paymentStatus)} dot>
                    {paymentStatusLabel[e.paymentStatus] ?? e.paymentStatus}
                  </Badge>
                </td>
                <td className="px-6 py-3 text-center">
                  <Badge variant={eventStatusVariant(e.eventStatus)} dot>
                    {eventStatusLabel[e.eventStatus] ?? e.eventStatus}
                  </Badge>
                </td>
                <td className="px-6 py-3 text-right">
                  <Link
                    href={`/event/${e.id}`}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                  >
                    <IconEye size={14} />
                    {viewLabel}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
