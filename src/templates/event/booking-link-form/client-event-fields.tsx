"use client";

import { Input } from "@/components/ui";

interface Props {
  clientName: string;
  setClientName: (v: string) => void;
  clientPhone: string;
  setClientPhone: (v: string) => void;
  eventDate: string;
  setEventDate: (v: string) => void;
  eventTime: string;
  setEventTime: (v: string) => void;
  eventLocation: string;
  setEventLocation: (v: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labels: Record<string, any>;
}

export default function ClientEventFields({
  clientName,
  setClientName,
  clientPhone,
  setClientPhone,
  eventDate,
  setEventDate,
  eventTime,
  setEventTime,
  eventLocation,
  setEventLocation,
  labels,
}: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">
        {labels.clientInfoTitle ?? "Client & Event Info"}
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label={labels.clientName ?? "Client Name"}
          placeholder={labels.clientNamePlaceholder ?? "e.g. Budi Santoso"}
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
        <Input
          label={labels.clientPhone ?? "Phone"}
          placeholder="+62..."
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label={labels.eventDate ?? "Event Date"}
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
        <Input
          label={labels.eventTime ?? "Event Time"}
          type="time"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
        />
      </div>

      <Input
        label={labels.eventLocation ?? "Location"}
        placeholder={labels.eventLocationPlaceholder ?? "Venue address"}
        value={eventLocation}
        onChange={(e) => setEventLocation(e.target.value)}
      />
    </div>
  );
}
