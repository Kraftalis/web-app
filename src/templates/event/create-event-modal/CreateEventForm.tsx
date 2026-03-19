"use client";

import { Input, Select, Textarea } from "@/components/ui";
import type { FormEvent } from "react";

interface EventType {
  value: string;
  label: string;
}

export interface Labels {
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
}

interface Props {
  eventTypes: EventType[];
  labels: Labels;
  onSubmit: (fd: FormData) => void;
}

export default function CreateEventForm({
  eventTypes,
  labels,
  onSubmit,
}: Props) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit(fd);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <Select
        id="eventType"
        name="eventType"
        label={labels.eventType}
        placeholder={labels.selectEventType}
        options={eventTypes}
      />

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
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder={labels.notesPlaceholder}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" className="hidden" />
      </div>
    </form>
  );
}
