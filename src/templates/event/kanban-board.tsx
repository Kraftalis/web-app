"use client";

import Link from "next/link";
import { Badge } from "@/components/ui";
import { IconEye, IconClock, IconMapPin } from "@/components/icons";
import type { EventItem } from "./types";
import {
  paymentStatusVariant,
  EVENT_STATUSES,
  EVENT_STATUS_COLORS,
} from "./types";

// ─── Kanban Board ───────────────────────────────────────────

interface KanbanBoardProps {
  events: EventItem[];
  eventStatusLabel: Record<string, string>;
  paymentStatusLabel: Record<string, string>;
  noEventsLabel: string;
  viewLabel: string;
  formatDate: (dateStr: string) => string;
}

export function KanbanBoard({
  events,
  eventStatusLabel,
  paymentStatusLabel,
  noEventsLabel,
  viewLabel,
  formatDate,
}: KanbanBoardProps) {
  // Group events by status
  const columns = EVENT_STATUSES.map((status) => ({
    status,
    label: eventStatusLabel[status] ?? status,
    color: EVENT_STATUS_COLORS[status] ?? "bg-gray-400",
    events: events.filter((e) => e.eventStatus === status),
  }));

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((col) => (
        <KanbanColumn
          key={col.status}
          label={col.label}
          color={col.color}
          count={col.events.length}
          events={col.events}
          paymentStatusLabel={paymentStatusLabel}
          noEventsLabel={noEventsLabel}
          viewLabel={viewLabel}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
}

// ─── Kanban Column ──────────────────────────────────────────

interface KanbanColumnProps {
  label: string;
  color: string;
  count: number;
  events: EventItem[];
  paymentStatusLabel: Record<string, string>;
  noEventsLabel: string;
  viewLabel: string;
  formatDate: (dateStr: string) => string;
}

function KanbanColumn({
  label,
  color,
  count,
  events,
  paymentStatusLabel,
  noEventsLabel,
  viewLabel,
  formatDate,
}: KanbanColumnProps) {
  return (
    <div className="flex w-72 shrink-0 flex-col rounded-xl bg-slate-50 border border-slate-200">
      {/* Column header */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-slate-200">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
        <span className="ml-auto rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
          {count}
        </span>
      </div>

      {/* Column body */}
      <div
        className="flex-1 space-y-2 overflow-y-auto p-2"
        style={{ maxHeight: "calc(100vh - 320px)" }}
      >
        {events.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs text-slate-400">{noEventsLabel}</p>
          </div>
        ) : (
          events.map((event) => (
            <KanbanCard
              key={event.id}
              event={event}
              paymentStatusLabel={paymentStatusLabel}
              viewLabel={viewLabel}
              formatDate={formatDate}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Kanban Card ────────────────────────────────────────────

interface KanbanCardProps {
  event: EventItem;
  paymentStatusLabel: Record<string, string>;
  viewLabel: string;
  formatDate: (dateStr: string) => string;
}

function KanbanCard({
  event,
  paymentStatusLabel,
  viewLabel,
  formatDate,
}: KanbanCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
      {/* Client name + type */}
      <div className="mb-2">
        <p className="truncate text-sm font-semibold text-slate-900">
          {event.clientName}
        </p>
        <p className="text-xs text-slate-500">{event.eventType}</p>
      </div>

      {/* Date & location */}
      <div className="mb-2 space-y-1">
        <p className="flex items-center gap-1.5 text-xs text-slate-500">
          <IconClock size={12} />
          {formatDate(event.eventDate)}
          {event.eventTime && ` · ${event.eventTime}`}
        </p>
        {event.eventLocation && (
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <IconMapPin size={12} />
            <span className="truncate">{event.eventLocation}</span>
          </p>
        )}
      </div>

      {/* Package */}
      {event.packageName && (
        <p className="mb-2 truncate text-xs text-slate-400">
          📦 {event.packageName}
        </p>
      )}

      {/* Footer: payment badge + view link */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <Badge variant={paymentStatusVariant(event.paymentStatus)} dot>
          {paymentStatusLabel[event.paymentStatus] ?? event.paymentStatus}
        </Badge>
        <Link
          href={`/event/${event.id}`}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-500"
        >
          <IconEye size={12} />
          {viewLabel}
        </Link>
      </div>
    </div>
  );
}
