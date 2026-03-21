"use client";

import Image from "next/image";
import { Badge } from "@/components/ui";
import { IconWhatsApp } from "@/components/icons";
import type { PortalEvent } from "./types";
import { eventStatusVariant, paymentStatusVariant } from "./types";

// ─── Portal Header ──────────────────────────────────────────

interface PortalHeaderProps {
  event: PortalEvent;
  vendorName: string;
  vendorImage: string | null;
  vendorPhone?: string;
  eventStatusLabel: Record<string, string>;
  paymentStatusLabel: Record<string, string>;
  labels: {
    portalWelcome: string;
    portalWelcomeDesc: string;
    portalContactVendor: string;
  };
}

export function PortalHeader({
  event,
  vendorName,
  vendorImage,
  vendorPhone,
  eventStatusLabel,
  paymentStatusLabel,
  labels,
}: PortalHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg sm:p-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: vendor + welcome */}
        <div className="flex items-start gap-4">
          {vendorImage ? (
            <Image
              src={vendorImage}
              alt={vendorName}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full border-2 border-white/30 object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 text-xl font-bold">
              {vendorName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-blue-100">{vendorName}</p>
            <h1 className="mt-0.5 text-xl font-bold leading-tight sm:text-2xl">
              {labels.portalWelcome}
            </h1>
            <p className="mt-1 max-w-md text-sm text-blue-200">
              {labels.portalWelcomeDesc}
            </p>
          </div>
        </div>

        {/* Right: statuses + CTA */}
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="flex flex-wrap gap-2">
            <Badge variant={eventStatusVariant(event.eventStatus)} dot>
              {eventStatusLabel[event.eventStatus] ?? event.eventStatus}
            </Badge>
            <Badge variant={paymentStatusVariant(event.paymentStatus)} dot>
              {paymentStatusLabel[event.paymentStatus] ?? event.paymentStatus}
            </Badge>
          </div>
          {vendorPhone && (
            <a
              href={`https://wa.me/${vendorPhone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              <IconWhatsApp size={16} />
              {labels.portalContactVendor}
            </a>
          )}
        </div>
      </div>

      {/* Client quick summary bar */}
      <div className="relative mt-6 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
          <span className="font-semibold">{event.clientName}</span>
          <span className="text-blue-200">{event.eventType}</span>
          {event.eventDate && (
            <span className="text-blue-200">
              {new Date(event.eventDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
