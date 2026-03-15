"use client";

import { Button, Input, Modal } from "@/components/ui";
import { IconCopy, IconWhatsApp } from "@/components/icons";

// ─── Create Event Modal ─────────────────────────────────────

interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isCreating: boolean;
  createError: string | null;
  eventTypes: { value: string; label: string }[];
  labels: {
    title: string;
    clientName: string;
    clientNamePlaceholder: string;
    clientPhone: string;
    clientPhonePlaceholder: string;
    clientEmail: string;
    clientEmailPlaceholder: string;
    eventType: string;
    selectEventType: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    eventLocationPlaceholder: string;
    notes: string;
    notesPlaceholder: string;
    create: string;
  };
  cancelLabel: string;
}

export function CreateEventModal({
  open,
  onClose,
  onSubmit,
  isCreating,
  createError,
  eventTypes,
  labels,
  cancelLabel,
}: CreateEventModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={labels.title}>
      <form action={onSubmit} className="space-y-4">
        {createError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {createError}
          </div>
        )}

        <Input
          id="clientName"
          name="clientName"
          label={labels.clientName}
          placeholder={labels.clientNamePlaceholder}
          required
        />
        <Input
          id="clientPhone"
          name="clientPhone"
          label={labels.clientPhone}
          placeholder={labels.clientPhonePlaceholder}
          required
        />
        <Input
          id="clientEmail"
          name="clientEmail"
          type="email"
          label={labels.clientEmail}
          placeholder={labels.clientEmailPlaceholder}
        />

        <div>
          <label
            htmlFor="eventType"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            {labels.eventType}
          </label>
          <select
            id="eventType"
            name="eventType"
            required
            defaultValue=""
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="" disabled>
              {labels.selectEventType}
            </option>
            {eventTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="eventDate"
            name="eventDate"
            type="date"
            label={labels.eventDate}
            required
          />
          <Input
            id="eventTime"
            name="eventTime"
            type="time"
            label={labels.eventTime}
          />
        </div>

        <Input
          id="eventLocation"
          name="eventLocation"
          label={labels.eventLocation}
          placeholder={labels.eventLocationPlaceholder}
        />

        <div>
          <label
            htmlFor="notes"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            {labels.notes}
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder={labels.notesPlaceholder}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" size="md" type="button" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button size="md" type="submit" isLoading={isCreating}>
            {labels.create}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Booking Link Modal ─────────────────────────────────────

interface BookingLinkModalProps {
  open: boolean;
  onClose: () => void;
  token: string | null;
  onCopyLink: () => void;
  onShareWhatsApp: () => void;
  linkCopied: boolean;
  labels: {
    modalTitle: string;
    modalDesc: string;
    copyLink: string;
    copied: string;
    shareWhatsApp: string;
    linkExpiry: string;
  };
}

export function BookingLinkModal({
  open,
  onClose,
  token,
  onCopyLink,
  onShareWhatsApp,
  linkCopied,
  labels,
}: BookingLinkModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={labels.modalTitle}>
      <div className="space-y-4">
        <p className="text-sm text-slate-500">{labels.modalDesc}</p>

        {token && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="break-all text-xs text-slate-600">
              {typeof window !== "undefined"
                ? `${window.location.origin}/booking/${token}`
                : `/booking/${token}`}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={onCopyLink}
            className="flex-1"
          >
            <IconCopy size={16} />
            {linkCopied ? labels.copied : labels.copyLink}
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={onShareWhatsApp}
            className="flex-1"
          >
            <IconWhatsApp size={16} />
            {labels.shareWhatsApp}
          </Button>
        </div>

        <p className="text-center text-xs text-slate-400">
          {labels.linkExpiry}
        </p>
      </div>
    </Modal>
  );
}
