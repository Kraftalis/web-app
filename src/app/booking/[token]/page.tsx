import BookingFormTemplate from "@/templates/booking/booking-form-template";
import { cookies } from "next/headers";
import { getDictionary } from "@/i18n/get-dictionary";
import { defaultLocale, type Locale } from "@/i18n/config";

interface BookingPageProps {
  params: Promise<{ token: string }>;
}

// ─── Dummy vendor packages & add-ons ────────────────────────

const DUMMY_PACKAGES = [
  {
    id: "pkg-001",
    name: "Silver Package",
    description:
      "Paket hemat untuk sesi foto singkat. Cocok untuk wisuda, birthday, atau portrait session.",
    price: "1500000",
    currency: "IDR",
    items: [
      {
        id: "pi-001",
        label: "30 menit foto outdoor",
        description: null,
        price: "1000000",
      },
      {
        id: "pi-002",
        label: "1 jam foto studio",
        description: null,
        price: "1500000",
      },
      {
        id: "pi-003",
        label: "20 foto edited + file digital",
        description: "Semua file via Google Drive",
        price: "2000000",
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
    items: [
      {
        id: "pi-005",
        label: "Paket Foto 4 Jam",
        description: "50+ foto edited + semua file digital",
        price: "4000000",
      },
      {
        id: "pi-006",
        label: "Paket Foto + Video 4 Jam",
        description: "50+ foto + video highlights 1 menit",
        price: "5000000",
      },
      {
        id: "pi-007",
        label: "Paket Foto + Video Full Day",
        description: "100+ foto + video 3 menit + drone",
        price: "8000000",
      },
    ],
  },
  {
    id: "pkg-003",
    name: "Platinum Package",
    description:
      "Paket premium all-in untuk wedding atau event besar. Full day coverage dengan tim lengkap.",
    price: "15000000",
    currency: "IDR",
    items: [
      {
        id: "pi-011",
        label: "2 Fotografer – Full Day",
        description: "Unlimited photos + 100 edited + album cetak",
        price: "12000000",
      },
      {
        id: "pi-012",
        label: "2 Fotografer + Videografer – Full Day",
        description: "Unlimited + cinematic video 3-5 menit + drone",
        price: "15000000",
      },
    ],
  },
  {
    id: "pkg-004",
    name: "Paket Wisuda",
    description:
      "Paket khusus foto wisuda, tersedia untuk berbagai jumlah orang.",
    price: "200000",
    currency: "IDR",
    items: [
      {
        id: "pi-019",
        label: "2 Orang – 1 Jam",
        description: "Foto outdoor kampus, 10 foto edited per orang",
        price: "200000",
      },
      {
        id: "pi-020",
        label: "3 Orang – 1.5 Jam",
        description: "Foto outdoor kampus, 10 foto edited per orang",
        price: "300000",
      },
      {
        id: "pi-021",
        label: "4 Orang – 2 Jam",
        description: "Foto outdoor kampus, 10 foto edited per orang",
        price: "400000",
      },
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
  },
  {
    id: "addon-002",
    name: "Cetak Foto 10R",
    description: "Cetak foto ukuran 10R (25×20cm) frame minimalis.",
    price: "150000",
    currency: "IDR",
  },
  {
    id: "addon-003",
    name: "Photo Booth",
    description: "Setup photo booth dengan properti & backdrop untuk event.",
    price: "2500000",
    currency: "IDR",
  },
  {
    id: "addon-004",
    name: "Drone Aerial",
    description: "Tambahan footage aerial menggunakan drone.",
    price: "1000000",
    currency: "IDR",
  },
  {
    id: "addon-005",
    name: "Express Editing",
    description: "Hasil edit selesai dalam 3 hari kerja (normal 7 hari).",
    price: "500000",
    currency: "IDR",
  },
];

// ─── Page ───────────────────────────────────────────────────

export default async function BookingPage({ params }: BookingPageProps) {
  const { token } = await params;

  // Determine locale for SSR
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale: Locale =
    localeCookie === "en" || localeCookie === "id"
      ? localeCookie
      : defaultLocale;
  const dict = await getDictionary(locale);

  // TODO: Replace with real DB lookup when backend is ready.
  return (
    <BookingFormTemplate
      token={token}
      vendorName="Kraftalis Studio"
      vendorImage={null}
      status="valid"
      serverDict={dict}
      serverLocale={locale}
      packages={DUMMY_PACKAGES}
      addOns={DUMMY_ADDONS}
    />
  );
}
