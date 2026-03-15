import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PricingTemplate from "@/templates/pricing/pricing-template";

// ─── Dummy data (hardcoded) ─────────────────────────────────

const DUMMY_PACKAGES = [
  {
    id: "pkg-001",
    name: "Silver Package",
    description:
      "Paket hemat untuk sesi foto singkat. Cocok untuk wisuda, birthday, atau portrait session.",
    price: "1500000",
    currency: "IDR",
    duration: "1.5 jam",
    capacity: "1-3 orang",
    isActive: true,
    items: [
      { id: "pi-001", name: "30 menit foto outdoor" },
      { id: "pi-002", name: "1 jam foto studio" },
      { id: "pi-003", name: "20 foto edited" },
      { id: "pi-004", name: "Semua file via Google Drive" },
    ],
  },
  {
    id: "pkg-002",
    name: "Gold Package",
    description:
      "Paket lengkap untuk event menengah. Termasuk foto & video highlights.",
    price: "5000000",
    currency: "IDR",
    duration: "4 jam",
    capacity: "5-10 orang",
    isActive: true,
    items: [
      { id: "pi-005", name: "Unlimited photoshoot" },
      { id: "pi-006", name: "50+ foto edited" },
      { id: "pi-007", name: "Video highlights 1 menit" },
      { id: "pi-008", name: "Semua file via Google Drive" },
      { id: "pi-009", name: "1 cetak foto 10R" },
      { id: "pi-010", name: "Free 1x revisi" },
    ],
  },
  {
    id: "pkg-003",
    name: "Platinum Package",
    description:
      "Paket premium all-in untuk wedding atau event besar. Full day coverage dengan tim lengkap.",
    price: "15000000",
    currency: "IDR",
    duration: "Full day (8 jam)",
    capacity: "Unlimited",
    isActive: true,
    items: [
      { id: "pi-011", name: "2 fotografer + 1 videografer" },
      { id: "pi-012", name: "Unlimited photoshoot" },
      { id: "pi-013", name: "100+ foto edited" },
      { id: "pi-014", name: "Cinematic video 3-5 menit" },
      { id: "pi-015", name: "Drone aerial footage" },
      { id: "pi-016", name: "Semua file via Google Drive" },
      { id: "pi-017", name: "Album cetak 20 halaman" },
      { id: "pi-018", name: "Free 2x revisi" },
    ],
  },
  {
    id: "pkg-004",
    name: "Paket Wisuda Group",
    description: "Paket khusus foto wisuda berkelompok.",
    price: "500000",
    currency: "IDR",
    duration: "1 jam",
    capacity: "5-6 orang",
    isActive: true,
    items: [
      { id: "pi-019", name: "Foto outdoor kampus" },
      { id: "pi-020", name: "10 foto edited per orang" },
      { id: "pi-021", name: "File via Google Drive" },
    ],
  },
  {
    id: "pkg-005",
    name: "Basic Portrait",
    description: "Sesi portrait singkat untuk kebutuhan profil atau CV.",
    price: "350000",
    currency: "IDR",
    duration: "30 menit",
    capacity: "1 orang",
    isActive: false,
    items: [
      { id: "pi-022", name: "5 foto edited" },
      { id: "pi-023", name: "Background polos / outdoor" },
      { id: "pi-024", name: "File via Google Drive" },
    ],
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
  {
    id: "addon-006",
    name: "Album Premium 30 Halaman",
    description: "Upgrade album cetak hardcover 30 halaman.",
    price: "1200000",
    currency: "IDR",
    isActive: false,
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
