"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui";
import {
  IconPlus,
  IconLink,
  IconSearch,
  IconList,
  IconKanban,
} from "@/components/icons";
import { useDictionary } from "@/i18n";
import { createEventAction, generateBookingLinkAction } from "./actions";
import type { EventItem } from "./types";
import { EventTable } from "./event-table";
import { KanbanBoard } from "./kanban-board";
import { CreateEventModal, BookingLinkModal } from "./event-modals";

export type { EventItem };

interface EventListTemplateProps {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  events: EventItem[];
}

type ViewMode = "list" | "kanban";

export default function EventListTemplate({
  user,
  events,
}: EventListTemplateProps) {
  const { dict } = useDictionary();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, startCreateTransition] = useTransition();
  const [createError, setCreateError] = useState<string | null>(null);

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [isGenerating, startGenTransition] = useTransition();
  const [linkCopied, setLinkCopied] = useState(false);

  const eventStatusLabel: Record<string, string> = {
    INQUIRY: dict.event.statusInquiry,
    WAITING_PAYMENT: dict.event.statusWaitingPayment,
    CONFIRMED: dict.event.statusConfirmed,
    ONGOING: dict.event.statusOngoing,
    COMPLETED: dict.event.statusCompleted,
  };

  const paymentStatusLabel: Record<string, string> = {
    UNPAID: dict.event.paymentUnpaid,
    DP_PAID: dict.event.paymentDpPaid,
    PAID: dict.event.paymentPaid,
  };

  const filtered = events.filter((e) => {
    if (statusFilter && e.eventStatus !== statusFilter) return false;
    if (paymentFilter && e.paymentStatus !== paymentFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        e.clientName.toLowerCase().includes(q) ||
        e.eventType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  function handleCreateEvent(formData: FormData) {
    setCreateError(null);
    startCreateTransition(async () => {
      const result = await createEventAction(formData);
      if (result.error) {
        setCreateError(result.error);
      } else {
        setShowCreateModal(false);
        router.refresh();
      }
    });
  }

  function handleGenerateLink() {
    startGenTransition(async () => {
      const result = await generateBookingLinkAction();
      if (result.token) {
        setGeneratedToken(result.token);
        setShowLinkModal(true);
      }
    });
  }

  function handleCopyLink() {
    if (!generatedToken) return;
    const url = `${window.location.origin}/booking/${generatedToken}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  function handleShareWhatsApp() {
    if (!generatedToken) return;
    const url = `${window.location.origin}/booking/${generatedToken}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, "_blank");
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const eventTypes = [
    { value: "Wedding", label: dict.booking.typeWedding },
    { value: "Engagement", label: dict.booking.typeEngagement },
    { value: "Birthday", label: dict.booking.typeBirthday },
    { value: "Graduation", label: dict.booking.typeGraduation },
    { value: "Corporate", label: dict.booking.typeCorporate },
    { value: "Other", label: dict.booking.typeOther },
  ];

  return (
    <AppLayout user={user} title={dict.nav.event}>
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {dict.event.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{dict.event.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={handleGenerateLink}
            isLoading={isGenerating}
          >
            <IconLink size={16} />
            {dict.event.generateLink}
          </Button>
          <Button size="md" onClick={() => setShowCreateModal(true)}>
            <IconPlus size={16} />
            {dict.event.createEvent}
          </Button>
        </div>
      </div>

      {/* Filters + View Toggle */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder={dict.event.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">{dict.event.allStatuses}</option>
          <option value="INQUIRY">{dict.event.statusInquiry}</option>
          <option value="WAITING_PAYMENT">
            {dict.event.statusWaitingPayment}
          </option>
          <option value="CONFIRMED">{dict.event.statusConfirmed}</option>
          <option value="ONGOING">{dict.event.statusOngoing}</option>
          <option value="COMPLETED">{dict.event.statusCompleted}</option>
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">{dict.event.allPayments}</option>
          <option value="UNPAID">{dict.event.paymentUnpaid}</option>
          <option value="DP_PAID">{dict.event.paymentDpPaid}</option>
          <option value="PAID">{dict.event.paymentPaid}</option>
        </select>

        {/* View toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
          <button
            onClick={() => setViewMode("list")}
            className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
              viewMode === "list"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            title={dict.event.listView}
          >
            <IconList size={16} />
          </button>
          <button
            onClick={() => setViewMode("kanban")}
            className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
              viewMode === "kanban"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            title={dict.event.kanbanView}
          >
            <IconKanban size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "list" ? (
        <EventTable
          events={filtered}
          allEventsCount={events.length}
          eventStatusLabel={eventStatusLabel}
          paymentStatusLabel={paymentStatusLabel}
          viewLabel={dict.event.view}
          formatDate={formatDate}
          columns={dict.event}
          emptyLabels={dict.event}
        />
      ) : (
        <KanbanBoard
          events={filtered}
          eventStatusLabel={eventStatusLabel}
          paymentStatusLabel={paymentStatusLabel}
          noEventsLabel={dict.event.kanbanNoEvents}
          viewLabel={dict.event.view}
          formatDate={formatDate}
        />
      )}

      {/* Modals */}
      <CreateEventModal
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setCreateError(null);
        }}
        onSubmit={handleCreateEvent}
        isCreating={isCreating}
        createError={createError}
        eventTypes={eventTypes}
        labels={dict.createEventModal}
        cancelLabel={dict.common.cancel}
      />

      <BookingLinkModal
        open={showLinkModal}
        onClose={() => {
          setShowLinkModal(false);
          setGeneratedToken(null);
          setLinkCopied(false);
        }}
        token={generatedToken}
        onCopyLink={handleCopyLink}
        onShareWhatsApp={handleShareWhatsApp}
        linkCopied={linkCopied}
        labels={dict.bookingLink}
      />
    </AppLayout>
  );
}
