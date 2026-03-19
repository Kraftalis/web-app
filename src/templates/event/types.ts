export interface BookingLinkConfig {
  clientName: string;
  location: string;
  packageId: string | null;
  variationId: string | null;
  selectedAddOnIds: string[];
  customPackage: {
    name: string;
    flatPrice: string;
    variations: { label: string; description: string; price: string }[];
  } | null;
  customAddOns: {
    name: string;
    description: string;
    price: string;
  }[];
}

import type { BadgeVariant } from "@/components/ui";

// ─── Event Item (list view) ─────────────────────────────────

export interface EventItem {
  id: string;
  vendorId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  eventType: string;
  eventDate: string; // ISO
  eventTime: string | null;
  eventLocation: string | null;
  packageName: string | null;
  amount: string | null;
  dpAmount: string | null;
  eventStatus: string;
  paymentStatus: string;
  notes: string | null;
  bookingToken: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Event Detail ───────────────────────────────────────────

export interface PackageItemSerialized {
  id: string;
  name: string;
  description: string | null;
}

export interface PackageSerialized {
  id: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  duration: string | null;
  capacity: string | null;
  isActive: boolean;
  items: PackageItemSerialized[];
}

export interface EventAddOnSerialized {
  id: string;
  quantity: number;
  unitPrice: string;
  addOn: {
    id: string;
    name: string;
    description: string | null;
  };
}

export interface PaymentSerialized {
  id: string;
  amount: string;
  paymentType: string;
  receiptUrl: string | null;
  note: string | null;
  isVerified: boolean;
  createdAt: string;
}

export interface EventDetail {
  id: string;
  vendorId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  eventType: string;
  eventDate: string;
  eventTime: string | null;
  eventLocation: string | null;
  packageId: string | null;
  packageSnapshot: unknown;
  amount: string | null;
  dpAmount: string | null;
  eventStatus: string;
  paymentStatus: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  package: PackageSerialized | null;
  eventAddOns: EventAddOnSerialized[];
  bookingToken: string | null;
  payments: PaymentSerialized[];
}

// ─── Status helpers ─────────────────────────────────────────

export function eventStatusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    INQUIRY: "info",
    WAITING_PAYMENT: "warning",
    CONFIRMED: "success",
    ONGOING: "primary",
    COMPLETED: "default",
  };
  return map[status] ?? "default";
}

export function paymentStatusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    UNPAID: "danger",
    DP_PAID: "warning",
    PAID: "success",
  };
  return map[status] ?? "default";
}

export function formatCurrency(
  amount: string | null,
  currency = "IDR",
): string {
  if (!amount) return "-";
  const num = parseFloat(amount);
  if (isNaN(num)) return "-";
  return `${currency} ${num.toLocaleString()}`;
}

export const EVENT_STATUSES = [
  "INQUIRY",
  "WAITING_PAYMENT",
  "CONFIRMED",
  "ONGOING",
  "COMPLETED",
] as const;

export type EventStatus = (typeof EVENT_STATUSES)[number];

export const EVENT_STATUS_COLORS: Record<string, string> = {
  INQUIRY: "bg-sky-500",
  WAITING_PAYMENT: "bg-amber-500",
  CONFIRMED: "bg-green-500",
  ONGOING: "bg-blue-500",
  COMPLETED: "bg-slate-400",
};
