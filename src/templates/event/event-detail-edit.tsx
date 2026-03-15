"use client";

import { Card, CardHeader, CardBody, Button, Input } from "@/components/ui";
import type { EventDetail } from "./types";

// ─── Edit Mode ──────────────────────────────────────────────

interface EventDetailEditProps {
  event: EventDetail;
  onSave: (formData: FormData) => void;
  onCancel: () => void;
  isSaving: boolean;
  eventTypes: { value: string; label: string }[];
  eventStatusOptions: { value: string; label: string }[];
  paymentStatusOptions: { value: string; label: string }[];
  labels: {
    clientInfo: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    eventInfo: string;
    eventType: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    paymentInfo: string;
    totalAmount: string;
    dpAmount: string;
    notes: string;
    saveChanges: string;
    updateStatus: string;
    paymentStatus: string;
  };
  cancelLabel: string;
}

export function EventDetailEdit({
  event,
  onSave,
  onCancel,
  isSaving,
  eventTypes,
  eventStatusOptions,
  paymentStatusOptions,
  labels,
  cancelLabel,
}: EventDetailEditProps) {
  return (
    <form action={onSave} className="space-y-6">
      {/* Client Info */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-gray-900">
            {labels.clientInfo}
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            id="clientName"
            name="clientName"
            label={labels.clientName}
            defaultValue={event.clientName}
            required
          />
          <Input
            id="clientPhone"
            name="clientPhone"
            label={labels.clientPhone}
            defaultValue={event.clientPhone}
            required
          />
          <Input
            id="clientEmail"
            name="clientEmail"
            type="email"
            label={labels.clientEmail}
            defaultValue={event.clientEmail ?? ""}
          />
        </CardBody>
      </Card>

      {/* Event Info */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-gray-900">
            {labels.eventInfo}
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <label
              htmlFor="eventType"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              {labels.eventType}
            </label>
            <select
              id="eventType"
              name="eventType"
              defaultValue={event.eventType}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
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
              defaultValue={event.eventDate.slice(0, 10)}
              required
            />
            <Input
              id="eventTime"
              name="eventTime"
              type="time"
              label={labels.eventTime}
              defaultValue={event.eventTime ?? ""}
            />
          </div>
          <Input
            id="eventLocation"
            name="eventLocation"
            label={labels.eventLocation}
            defaultValue={event.eventLocation ?? ""}
          />
        </CardBody>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-gray-900">
            {labels.updateStatus}
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <label
              htmlFor="eventStatus"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              {labels.updateStatus}
            </label>
            <select
              id="eventStatus"
              name="eventStatus"
              defaultValue={event.eventStatus}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {eventStatusOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="paymentStatus"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              {labels.paymentStatus}
            </label>
            <select
              id="paymentStatus"
              name="paymentStatus"
              defaultValue={event.paymentStatus}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {paymentStatusOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Payment */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-gray-900">
            {labels.paymentInfo}
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            id="amount"
            name="amount"
            type="number"
            label={labels.totalAmount}
            defaultValue={event.amount ?? ""}
          />
          <Input
            id="dpAmount"
            name="dpAmount"
            type="number"
            label={labels.dpAmount}
            defaultValue={event.dpAmount ?? ""}
          />
        </CardBody>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-gray-900">
            {labels.notes}
          </h2>
        </CardHeader>
        <CardBody>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            defaultValue={event.notes ?? ""}
            className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </CardBody>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="ghost" type="button" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button type="submit" isLoading={isSaving}>
          {labels.saveChanges}
        </Button>
      </div>
    </form>
  );
}
