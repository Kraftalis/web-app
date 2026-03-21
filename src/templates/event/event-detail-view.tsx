"use client";

import { Card, CardHeader, CardBody } from "@/components/ui";
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconClock,
  IconCalendar,
  IconNotes,
} from "@/components/icons";
import type { EventDetail } from "./types";
import { formatCurrency } from "./types";

// ─── View Mode ──────────────────────────────────────────────

interface EventDetailViewProps {
  event: EventDetail;
  formatDate: (dateStr: string) => string;
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
    packageInfo: string;
    packageName: string;
    addOns: string;
    paymentInfo: string;
    totalAmount: string;
    notes: string;
    noNotes: string;
  };
  bookingLabels: {
    totalPaid: string;
    remaining: string;
  };
  totalPaid: number;
  remaining: number;
}

export function EventDetailView({
  event,
  formatDate,
  labels,
  bookingLabels,
  totalPaid,
  remaining,
}: EventDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* Client Info */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-gray-900">
            {labels.clientInfo}
          </h2>
        </CardHeader>
        <CardBody className="space-y-3">
          <InfoRow label={labels.clientName}>{event.clientName}</InfoRow>
          <InfoRow label={labels.clientPhone} icon={<IconPhone size={14} />}>
            {event.clientPhone}
          </InfoRow>
          {event.clientEmail && (
            <InfoRow label={labels.clientEmail} icon={<IconMail size={14} />}>
              {event.clientEmail}
            </InfoRow>
          )}
        </CardBody>
      </Card>

      {/* Event Info */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-gray-900">
            {labels.eventInfo}
          </h2>
        </CardHeader>
        <CardBody className="space-y-3">
          <InfoRow label={labels.eventType}>{event.eventType}</InfoRow>
          <InfoRow label={labels.eventDate} icon={<IconCalendar size={14} />}>
            {formatDate(event.eventDate)}
          </InfoRow>
          {event.eventTime && (
            <InfoRow label={labels.eventTime} icon={<IconClock size={14} />}>
              {event.eventTime}
            </InfoRow>
          )}
          {event.eventLocation && (
            <InfoRow
              label={labels.eventLocation}
              icon={<IconMapPin size={14} />}
            >
              {event.eventLocation}
            </InfoRow>
          )}
        </CardBody>
      </Card>

      {/* Package (from snapshot) */}
      {event.packageSnapshot != null && (
        <PackageSnapshotCard
          snapshot={event.packageSnapshot as Record<string, unknown>}
          currency={event.currency}
          labels={labels}
        />
      )}

      {/* Add-ons (from snapshot) */}
      {Array.isArray(event.addOnsSnapshot) &&
        (event.addOnsSnapshot as Record<string, unknown>[]).length > 0 && (
          <AddOnsSnapshotCard
            snapshot={event.addOnsSnapshot as Record<string, unknown>[]}
            currency={event.currency}
            label={labels.addOns}
          />
        )}

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-gray-900">
            {labels.paymentInfo}
          </h2>
        </CardHeader>
        <CardBody className="space-y-3">
          <InfoRow label={labels.totalAmount}>
            {formatCurrency(event.amount, event.currency)}
          </InfoRow>
          <InfoRow label={bookingLabels.totalPaid}>
            <span className="text-green-600">
              {formatCurrency(totalPaid.toString())}
            </span>
          </InfoRow>
          <InfoRow label={bookingLabels.remaining}>
            <span className={remaining > 0 ? "text-red-600" : "text-green-600"}>
              {formatCurrency(remaining.toString())}
            </span>
          </InfoRow>
        </CardBody>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <IconNotes size={16} />
            {labels.notes}
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-gray-600">
            {event.notes || labels.noNotes}
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

// ─── InfoRow helper ─────────────────────────────────────────

function InfoRow({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="flex items-center gap-1.5 text-sm text-gray-500">
        {icon}
        {label}
      </span>
      <span className="text-right text-sm font-medium text-gray-900">
        {children}
      </span>
    </div>
  );
}

// ─── Package Snapshot Card ──────────────────────────────────

function PackageSnapshotCard({
  snapshot,
  currency,
  labels,
}: {
  snapshot: Record<string, unknown>;
  currency: string;
  labels: { packageInfo: string; packageName: string };
}) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-gray-900">
          {labels.packageInfo}
        </h2>
      </CardHeader>
      <CardBody className="space-y-3">
        <InfoRow label={labels.packageName}>
          {(snapshot.name as string) ?? "-"}
        </InfoRow>
        {typeof snapshot.description === "string" && snapshot.description && (
          <p className="text-sm text-gray-600">{snapshot.description}</p>
        )}
        {snapshot.price != null && (
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(String(snapshot.price), currency)}
          </p>
        )}
      </CardBody>
    </Card>
  );
}

// ─── AddOns Snapshot Card ───────────────────────────────────

function AddOnsSnapshotCard({
  snapshot,
  currency,
  label,
}: {
  snapshot: Record<string, unknown>[];
  currency: string;
  label: string;
}) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-gray-900">{label}</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-2">
          {snapshot.map((addon, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-700">
                {addon.name as string}
                {(addon.quantity as number) > 1 && (
                  <span className="ml-1 text-gray-400">
                    ×{addon.quantity as number}
                  </span>
                )}
              </span>
              {addon.price != null && (
                <span className="font-medium text-gray-900">
                  {formatCurrency(String(addon.price), currency)}
                </span>
              )}
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
