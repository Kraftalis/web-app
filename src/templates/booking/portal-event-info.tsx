"use client";

import { Card, CardHeader, CardBody } from "@/components/ui";
import {
  IconCalendar,
  IconClock,
  IconMapPin,
  IconCheck,
  IconEvent,
} from "@/components/icons";
import type { PortalEvent } from "./types";
import { formatCurrency } from "./types";

// ─── Event Info Card ────────────────────────────────────────

interface PortalEventInfoProps {
  event: PortalEvent;
  labels: {
    portalEventDetails: string;
    portalEventType: string;
    portalEventDate: string;
    portalEventTime: string;
    portalEventLocation: string;
    portalYourPackage: string;
    portalNoPackage: string;
    portalYourAddOns: string;
    portalNoAddOns: string;
    portalIncluded: string;
  };
  addOnLabels: {
    qty: string;
    perUnit: string;
  };
  formatDate: (dateStr: string) => string;
}

export function PortalEventInfo({
  event,
  labels,
  addOnLabels,
  formatDate,
}: PortalEventInfoProps) {
  return (
    <div className="space-y-4">
      {/* Event Details */}
      <Card>
        <CardHeader>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <IconEvent size={16} className="text-blue-500" />
            {labels.portalEventDetails}
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoItem
              icon={<IconEvent size={14} className="text-gray-400" />}
              label={labels.portalEventType}
              value={event.eventType}
            />
            <InfoItem
              icon={<IconCalendar size={14} className="text-gray-400" />}
              label={labels.portalEventDate}
              value={formatDate(event.eventDate)}
            />
            {event.eventTime && (
              <InfoItem
                icon={<IconClock size={14} className="text-gray-400" />}
                label={labels.portalEventTime}
                value={event.eventTime}
              />
            )}
            {event.eventLocation && (
              <InfoItem
                icon={<IconMapPin size={14} className="text-gray-400" />}
                label={labels.portalEventLocation}
                value={event.eventLocation}
              />
            )}
          </div>
        </CardBody>
      </Card>

      {/* Package */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-gray-900">
            {labels.portalYourPackage}
          </h2>
        </CardHeader>
        <CardBody>
          {event.package ? (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {event.package.name}
                  </p>
                  {event.package.description && (
                    <p className="mt-0.5 text-xs text-gray-500">
                      {event.package.description}
                    </p>
                  )}
                </div>
                <p className="text-sm font-bold text-blue-600">
                  {formatCurrency(event.package.price, event.package.currency)}
                </p>
              </div>

              {event.package.items.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {labels.portalIncluded}
                  </p>
                  <ul className="space-y-1.5">
                    {event.package.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <IconCheck
                          size={14}
                          className="shrink-0 text-green-500"
                        />
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-gray-400">
              {labels.portalNoPackage}
            </p>
          )}
        </CardBody>
      </Card>

      {/* Add-ons */}
      {event.addOns.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-gray-900">
              {labels.portalYourAddOns}
            </h2>
          </CardHeader>
          <CardBody>
            <div className="divide-y divide-gray-100">
              {event.addOns.map((ea) => (
                <div
                  key={ea.id}
                  className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {ea.addOn.name}
                    </p>
                    {ea.addOn.description && (
                      <p className="text-xs text-gray-500">
                        {ea.addOn.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(ea.unitPrice)}
                    </p>
                    {ea.quantity > 1 && (
                      <p className="text-xs text-gray-400">
                        {addOnLabels.qty}: {ea.quantity} ×{" "}
                        {formatCurrency(ea.unitPrice)} {addOnLabels.perUnit}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

// ─── InfoItem helper ────────────────────────────────────────

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
