import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ScheduleTemplate from "@/templates/schedule/schedule-template";

// ─── Dummy data (hardcoded) — same events as /event page ────

const DUMMY_EVENTS = [
  {
    id: "evt-001",
    clientName: "Andi & Rina",
    eventType: "Wedding",
    eventDate: "2026-04-12T00:00:00.000Z",
    eventTime: "09:00",
    eventLocation: "Gedung Serbaguna, Jakarta Selatan",
    packageName: "Gold Package",
    eventStatus: "CONFIRMED",
    paymentStatus: "DP_PAID",
  },
  {
    id: "evt-002",
    clientName: "Budi Santoso",
    eventType: "Birthday",
    eventDate: "2026-03-20T00:00:00.000Z",
    eventTime: "14:00",
    eventLocation: "Kafe Nusantara, Bandung",
    packageName: "Silver Package",
    eventStatus: "WAITING_PAYMENT",
    paymentStatus: "UNPAID",
  },
  {
    id: "evt-003",
    clientName: "Citra Dewi",
    eventType: "Graduation",
    eventDate: "2026-03-25T00:00:00.000Z",
    eventTime: "08:00",
    eventLocation: "Universitas Indonesia, Depok",
    packageName: "Platinum Package",
    eventStatus: "CONFIRMED",
    paymentStatus: "PAID",
  },
  {
    id: "evt-004",
    clientName: "PT Maju Jaya",
    eventType: "Corporate",
    eventDate: "2026-05-10T00:00:00.000Z",
    eventTime: "08:30",
    eventLocation: "Hotel Mulia, Jakarta",
    packageName: "Gold Package",
    eventStatus: "INQUIRY",
    paymentStatus: "UNPAID",
  },
  {
    id: "evt-005",
    clientName: "Dian & Fajar",
    eventType: "Engagement",
    eventDate: "2026-04-05T00:00:00.000Z",
    eventTime: "16:00",
    eventLocation: "Taman Mini, Jakarta Timur",
    packageName: "Silver Package",
    eventStatus: "ONGOING",
    paymentStatus: "DP_PAID",
  },
  {
    id: "evt-006",
    clientName: "Eko Prasetyo",
    eventType: "Birthday",
    eventDate: "2026-02-14T00:00:00.000Z",
    eventTime: "19:00",
    eventLocation: "Restoran Padang Sederhana, Surabaya",
    packageName: "Silver Package",
    eventStatus: "COMPLETED",
    paymentStatus: "PAID",
  },
  // Extra events for calendar density
  {
    id: "evt-007",
    clientName: "Fitri & Hasan",
    eventType: "Wedding",
    eventDate: "2026-03-20T00:00:00.000Z",
    eventTime: "10:00",
    eventLocation: "Balai Sudirman, Jakarta Pusat",
    packageName: "Platinum Package",
    eventStatus: "CONFIRMED",
    paymentStatus: "DP_PAID",
  },
  {
    id: "evt-008",
    clientName: "Gina Maharani",
    eventType: "Graduation",
    eventDate: "2026-03-15T00:00:00.000Z",
    eventTime: "07:30",
    eventLocation: "ITB, Bandung",
    packageName: "Silver Package",
    eventStatus: "ONGOING",
    paymentStatus: "PAID",
  },
  {
    id: "evt-009",
    clientName: "Hari Wibowo",
    eventType: "Birthday",
    eventDate: "2026-04-12T00:00:00.000Z",
    eventTime: "18:00",
    eventLocation: "Rumah, Tangerang",
    packageName: "Silver Package",
    eventStatus: "WAITING_PAYMENT",
    paymentStatus: "UNPAID",
  },
  {
    id: "evt-010",
    clientName: "Indah Permata",
    eventType: "Other",
    eventDate: "2026-03-15T00:00:00.000Z",
    eventTime: "13:00",
    eventLocation: "Studio Kraftalis",
    packageName: null,
    eventStatus: "CONFIRMED",
    paymentStatus: "PAID",
  },
];

// ─── Page ───────────────────────────────────────────────────

export default async function SchedulePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // TODO: Replace with real DB calls when backend is ready.
  return (
    <ScheduleTemplate
      user={{
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      }}
      events={DUMMY_EVENTS}
    />
  );
}
