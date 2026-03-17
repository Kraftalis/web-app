import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PricingTemplate from "@/templates/pricing/pricing-template";

// ─── Dummy data (hardcoded, to be replaced with DB calls) ───

const DUMMY_PACKAGES = [
  {
    id: "pkg-001",
    name: "Wisuda Photoshoot",
    description:
      "Paket foto wisuda dengan berbagai pilihan kapasitas dan durasi.",
    price: "200000",
    currency: "IDR",
    isActive: true,
    items: [
      {
        id: "var-001",
        label: "2 Orang – 1 Jam",
        description: "20 foto edited · file via GDrive",
        price: "200000",
      },
      {
        id: "var-002",
        label: "3 Orang – 1.5 Jam",
        description: "30 foto edited · file via GDrive",
        price: "300000",
      },
      {
        id: "var-003",
        label: "5-6 Orang – 2 Jam",
        description: "50 foto edited · file via GDrive · bonus cetak 10R",
        price: "500000",
      },
    ],
  },
  {
    id: "pkg-002",
    name: "Gold Package",
    description:
      "Paket lengkap untuk event menengah. Termasuk foto & video highlights.",
    price: "5000000",
    currency: "IDR",
    isActive: true,
    items: [
      {
        id: "var-004",
        label: "4 Jam Coverage",
        description:
          "Unlimited shoot · 50+ foto edited · video highlights 1 menit",
        price: "5000000",
      },
      {
        id: "var-005",
        label: "8 Jam Coverage (Full Day)",
        description:
          "Unlimited shoot · 100+ foto edited · cinematic video 3-5 menit",
        price: "8500000",
      },
    ],
  },
  {
    id: "pkg-003",
    name: "Basic Portrait",
    description: "Sesi portrait singkat untuk profil atau CV.",
    price: "350000",
    currency: "IDR",
    isActive: false,
    items: [], // flat price, no variations
  },
];

const DUMMY_ADDONS = [
  {
    id: "addon-001",
    name: "Extra 1 Jam",
    description: "Tambah durasi sesi foto/video 1 jam.",
    price: "750000",
    currency: "IDR",
    isActive: true,
  },
  {
    id: "addon-002",
    name: "Cetak Foto 10R",
    description: "Cetak foto ukuran 10R (25×20cm) frame minimalis.",
    price: "150000",
    currency: "IDR",
    isActive: true,
  },
  {
    id: "addon-003",
    name: "Photo Booth",
    description: "Setup photo booth dengan properti & backdrop untuk event.",
    price: "2500000",
    currency: "IDR",
    isActive: true,
  },
  {
    id: "addon-004",
    name: "Drone Aerial",
    description: "Tambahan footage aerial menggunakan drone.",
    price: "1000000",
    currency: "IDR",
    isActive: true,
  },
  {
    id: "addon-005",
    name: "Express Editing",
    description: "Hasil edit selesai dalam 3 hari kerja (normal 7 hari).",
    price: "500000",
    currency: "IDR",
    isActive: true,
  },
];

// ─── Page ───────────────────────────────────────────────────

export default async function PricingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // TODO: Replace with real DB calls when backend is ready.
  return (
    <PricingTemplate
      user={{
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      }}
      packages={DUMMY_PACKAGES}
      addOns={DUMMY_ADDONS}
    />
  );
}
