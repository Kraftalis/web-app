import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import EventListTemplate from "@/templates/event/event-list-template";

// ─── Dummy data (hardcoded) ─────────────────────────────────

const DUMMY_EVENTS = [
  {
    id: "evt-001",
    vendorId: "vendor-1",
    clientName: "Andi & Rina",
    clientPhone: "+6281234567890",
    clientEmail: "andi.rina@email.com",
    eventType: "Wedding",
    eventDate: "2026-04-12T00:00:00.000Z",
    eventTime: "09:00",
    eventLocation: "Gedung Serbaguna, Jakarta Selatan",
    packageName: "Gold Package",
    amount: "15000000",
    dpAmount: "7500000",
    eventStatus: "CONFIRMED",
    paymentStatus: "DP_PAID",
    notes: "Outdoor & indoor session, include drone footage.",
    bookingToken: "abc123def456",
    createdAt: "2026-03-01T10:00:00.000Z",
    updatedAt: "2026-03-05T14:30:00.000Z",
  },
  {
    id: "evt-002",
    vendorId: "vendor-1",
    clientName: "Budi Santoso",
    clientPhone: "+6285678901234",
    clientEmail: null,
    eventType: "Birthday",
    eventDate: "2026-03-20T00:00:00.000Z",
    eventTime: "14:00",
    eventLocation: "Kafe Nusantara, Bandung",
    packageName: "Silver Package",
    amount: "5000000",
    dpAmount: "2500000",
    eventStatus: "WAITING_PAYMENT",
    paymentStatus: "UNPAID",
    notes: null,
    bookingToken: "xyz789ghi012",
    createdAt: "2026-03-10T08:00:00.000Z",
    updatedAt: "2026-03-10T08:00:00.000Z",
  },
  {
    id: "evt-003",
    vendorId: "vendor-1",
    clientName: "Citra Dewi",
    clientPhone: "+6287654321098",
    clientEmail: "citra.dewi@gmail.com",
    eventType: "Graduation",
    eventDate: "2026-03-25T00:00:00.000Z",
    eventTime: "08:00",
    eventLocation: "Universitas Indonesia, Depok",
    packageName: "Platinum Package",
    amount: "3500000",
    dpAmount: "1750000",
    eventStatus: "CONFIRMED",
    paymentStatus: "PAID",
    notes: "Group photo 10 orang, include printed album.",
    bookingToken: null,
    createdAt: "2026-03-08T12:00:00.000Z",
    updatedAt: "2026-03-12T09:15:00.000Z",
  },
  {
    id: "evt-004",
    vendorId: "vendor-1",
    clientName: "PT Maju Jaya",
    clientPhone: "+6211234567",
    clientEmail: "hrd@majujaya.co.id",
    eventType: "Corporate",
    eventDate: "2026-05-10T00:00:00.000Z",
    eventTime: "08:30",
    eventLocation: "Hotel Mulia, Jakarta",
    packageName: "Gold Package",
    amount: "25000000",
    dpAmount: "12500000",
    eventStatus: "INQUIRY",
    paymentStatus: "UNPAID",
    notes: "Annual company gathering, ~200 pax. Awaiting final confirmation.",
    bookingToken: "corp456token",
    createdAt: "2026-03-14T16:00:00.000Z",
    updatedAt: "2026-03-14T16:00:00.000Z",
  },
  {
    id: "evt-005",
    vendorId: "vendor-1",
    clientName: "Dian & Fajar",
    clientPhone: "+6289012345678",
    clientEmail: "dian.fajar@email.com",
    eventType: "Engagement",
    eventDate: "2026-04-05T00:00:00.000Z",
    eventTime: "16:00",
    eventLocation: "Taman Mini, Jakarta Timur",
    packageName: "Silver Package",
    amount: "8000000",
    dpAmount: "4000000",
    eventStatus: "ONGOING",
    paymentStatus: "DP_PAID",
    notes: "Sunset session preferred.",
    bookingToken: "eng567token",
    createdAt: "2026-02-20T11:00:00.000Z",
    updatedAt: "2026-03-15T07:00:00.000Z",
  },
  {
    id: "evt-006",
    vendorId: "vendor-1",
    clientName: "Eko Prasetyo",
    clientPhone: "+6281122334455",
    clientEmail: null,
    eventType: "Birthday",
    eventDate: "2026-02-14T00:00:00.000Z",
    eventTime: "19:00",
    eventLocation: "Restoran Padang Sederhana, Surabaya",
    packageName: "Silver Package",
    amount: "4000000",
    dpAmount: "2000000",
    eventStatus: "COMPLETED",
    paymentStatus: "PAID",
    notes: "Event selesai. Client sangat puas.",
    bookingToken: null,
    createdAt: "2026-01-25T09:00:00.000Z",
    updatedAt: "2026-02-15T10:00:00.000Z",
  },
];

// ─── Page ───────────────────────────────────────────────────

export default async function EventPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // TODO: Replace with real DB calls when backend is ready.
  return (
    <EventListTemplate
      user={{
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      }}
      events={DUMMY_EVENTS}
    />
  );
}
