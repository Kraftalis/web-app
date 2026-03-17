import type { BadgeVariant } from "@/components/ui";

// ─── Vendor package / add-on (for booking form) ────────────

export interface VendorPackageVariation {
  id: string;
  label: string;
  description: string | null;
  price: string;
}

export interface VendorPackage {
  id: string;
  name: string;
  description: string | null;
  price: string; // base / fallback price
  currency: string;
  items: VendorPackageVariation[]; // price variations (empty = flat price)
}

export interface VendorAddOn {
  id: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
}

// ─── Booking portal data ────────────────────────────────────

export interface PortalPackageVariation {
  id: string;
  label: string;
  description: string | null;
  price: string;
}

export interface PortalPackage {
  id: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  items: PortalPackageVariation[];
}

export interface PortalAddOn {
  id: string;
  quantity: number;
  unitPrice: string;
  addOn: {
    id: string;
    name: string;
    description: string | null;
  };
}

export interface PortalPayment {
  id: string;
  amount: string;
  paymentType: string;
  receiptUrl: string | null;
  note: string | null;
  isVerified: boolean;
  createdAt: string;
}

export interface PortalEvent {
  id: string;
  vendorName: string;
  vendorImage: string | null;
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  eventType: string;
  eventDate: string;
  eventTime: string | null;
  eventLocation: string | null;
  amount: string | null;
  dpAmount: string | null;
  eventStatus: string;
  paymentStatus: string;
  notes: string | null;
  package: PortalPackage | null;
  addOns: PortalAddOn[];
  payments: PortalPayment[];
}

// ─── Status helpers ─────────────────────────────────────────

export const EVENT_STATUS_STEPS = [
  "INQUIRY",
  "WAITING_PAYMENT",
  "CONFIRMED",
  "ONGOING",
  "COMPLETED",
] as const;

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
