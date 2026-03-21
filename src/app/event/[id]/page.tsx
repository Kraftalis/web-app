import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import EventDetailTemplate from "@/templates/event/event-detail-template";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  // TODO: Replace with real DB calls when backend is ready.
  // For now, return not found since we have no mock data store.
  if (!id) {
    notFound();
  }

  // Mock event data for frontend development
  const mockEvent = {
    id,
    vendorId: session.user.id,
    clientName: "Andi & Rina",
    clientPhone: "+6281234567890",
    clientEmail: "andi.rina@email.com",
    eventType: "Wedding",
    eventDate: "2026-04-12T00:00:00.000Z",
    eventTime: "09:00",
    eventLocation: "Gedung Serbaguna, Jakarta Selatan",
    packageSnapshot: {
      name: "Gold Package",
      description: "Full-day wedding coverage with premium editing.",
      price: 15000000,
    },
    addOnsSnapshot: [
      { name: "Drone Footage", quantity: 1, price: 1500000 },
      { name: "Extra Printed Photo (20×30)", quantity: 2, price: 500000 },
    ],
    amount: "15000000",
    currency: "IDR",
    eventStatus: "CONFIRMED",
    paymentStatus: "DP_PAID",
    notes: "Outdoor & indoor session, include drone footage.",
    createdAt: "2026-03-01T10:00:00.000Z",
    updatedAt: "2026-03-05T14:30:00.000Z",
    bookingToken: "abc123def456",
    payments: [
      {
        id: "pay-001",
        amount: "7500000",
        paymentType: "DOWN_PAYMENT",
        receiptUrl: "/icons/icon-512x512.png",
        note: "DP transfer via BCA",
        isVerified: true,
        createdAt: "2026-03-02T14:30:00.000Z",
      },
      {
        id: "pay-002",
        amount: "3000000",
        paymentType: "INSTALLMENT",
        receiptUrl: "/icons/icon-512x512.png",
        note: "Cicilan ke-1 via Mandiri",
        isVerified: true,
        createdAt: "2026-03-20T10:00:00.000Z",
      },
      {
        id: "pay-003",
        amount: "2500000",
        paymentType: "INSTALLMENT",
        receiptUrl: "/icons/icon-512x512.png",
        note: "Cicilan ke-2",
        isVerified: false,
        createdAt: "2026-04-01T09:15:00.000Z",
      },
    ],
  };

  return (
    <EventDetailTemplate
      user={{
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      }}
      event={mockEvent}
    />
  );
}
