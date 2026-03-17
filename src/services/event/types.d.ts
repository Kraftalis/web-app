import type { Package, AddOn } from "@/services/pricing/types";

// ─── Event list item ────────────────────────────────────────

export interface EventItem {
  id: string;
  vendorId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  eventType: string;
  eventDate: string;
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

// ─── Event detail ───────────────────────────────────────────

export interface EventDetailPackageItem {
  id: string;
  name: string;
  description: string | null;
}

export interface EventDetailPackage {
  id: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  duration: string | null;
  capacity: string | null;
  isActive: boolean;
  items: EventDetailPackageItem[];
}

export interface EventDetailAddOn {
  id: string;
  quantity: number;
  unitPrice: string;
  addOn: {
    id: string;
    name: string;
    description: string | null;
  };
}

export interface EventDetailPayment {
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
  package: EventDetailPackage | null;
  eventAddOns: EventDetailAddOn[];
  bookingToken: string | null;
  payments: EventDetailPayment[];
}

// ─── Payloads ───────────────────────────────────────────────

export interface CreateEventPayload {
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  eventType: string;
  eventDate: string;
  eventTime?: string | null;
  eventLocation?: string | null;
  packageId?: string | null;
  addOnIds?: { addOnId: string; quantity: number }[];
  amount?: number | null;
  dpAmount?: number | null;
  notes?: string | null;
}

export interface UpdateEventPayload extends Partial<CreateEventPayload> {
  eventStatus?: string;
  paymentStatus?: string;
}

// ─── Booking link ───────────────────────────────────────────

export interface BookingLinkData {
  token: string;
  vendorId: string;
  vendor: { id: string; name: string | null; image: string | null };
  eventId: string | null;
  expiresAt: string;
  packages: Package[];
  addOns: AddOn[];
}

export interface BookingSubmitPayload {
  token: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  eventType: string;
  eventDate: string;
  eventTime?: string | null;
  eventLocation?: string | null;
  packageId: string;
  addOnIds?: { addOnId: string; quantity: number }[];
  dpAmount: number;
  notes?: string | null;
}

export interface BookingSubmitResponse {
  eventId: string;
  token: string;
}

// ─── Booking link generation ────────────────────────────────

export interface GenerateBookingLinkResponse {
  token: string;
  expiresAt: string;
}
