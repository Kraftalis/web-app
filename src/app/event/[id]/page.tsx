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
    packageId: "pkg-001",
    packageSnapshot: null,
    amount: "15000000",
    dpAmount: "7500000",
    eventStatus: "CONFIRMED",
    paymentStatus: "DP_PAID",
    notes: "Outdoor & indoor session, include drone footage.",
    createdAt: "2026-03-01T10:00:00.000Z",
    updatedAt: "2026-03-05T14:30:00.000Z",
    bookingToken: "abc123def456",
    package: {
      id: "pkg-001",
      name: "Gold Package",
      description: "Full-day wedding coverage with premium editing.",
      price: "15000000",
      currency: "IDR",
      duration: "Full day",
      capacity: "2",
      isActive: true,
      items: [
        { id: "pi-1", name: "8 hours photo coverage", description: null },
        { id: "pi-2", name: "4 hours video coverage", description: null },
        { id: "pi-3", name: "200 edited photos", description: null },
        { id: "pi-4", name: "5-minute cinematic video", description: null },
        { id: "pi-5", name: "1 printed album (40 pages)", description: null },
      ],
    },
    eventAddOns: [
      {
        id: "eao-1",
        quantity: 1,
        unitPrice: "1500000",
        addOn: {
          id: "ao-1",
          name: "Drone Footage",
          description: "Aerial shots using DJI Mavic 3 Pro",
        },
      },
      {
        id: "eao-2",
        quantity: 2,
        unitPrice: "500000",
        addOn: {
          id: "ao-2",
          name: "Extra Printed Photo (20×30)",
          description: null,
        },
      },
    ],
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
