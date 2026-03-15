"use client";

import { Card, CardHeader, CardBody } from "@/components/ui";
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconClock,
  IconCalendar,
  IconNotes,
  IconCheck,
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
    dpAmount: string;
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

      {/* Package */}
      {event.package && (
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-gray-900">
              {labels.packageInfo}
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <InfoRow label={labels.packageName}>{event.package.name}</InfoRow>
            {event.package.description && (
              <p className="text-sm text-gray-600">
                {event.package.description}
              </p>
            )}
            <p className="text-sm font-medium text-gray-900">
              {formatCurrency(event.package.price, event.package.currency)}
            </p>
            {event.package.items.length > 0 && (
              <ul className="mt-2 space-y-1">
                {event.package.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <IconCheck size={14} className="text-green-500" />
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      )}

      {/* Add-ons */}
      {event.eventAddOns.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-gray-900">
              {labels.addOns}
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {event.eventAddOns.map((ea) => (
                <div
                  key={ea.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">
                    {ea.addOn.name}
                    {ea.quantity > 1 && (
                      <span className="ml-1 text-gray-400">×{ea.quantity}</span>
                    )}
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(ea.unitPrice)}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
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
            {formatCurrency(event.amount)}
          </InfoRow>
          <InfoRow label={labels.dpAmount}>
            {formatCurrency(event.dpAmount)}
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
