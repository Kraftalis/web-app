-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('INQUIRY', 'WAITING_PAYMENT', 'CONFIRMED', 'ONGOING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'DP_PAID', 'PAID');

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "vendor_id" UUID NOT NULL,
    "client_name" VARCHAR(255) NOT NULL,
    "client_phone" VARCHAR(50) NOT NULL,
    "client_email" VARCHAR(320),
    "event_type" VARCHAR(100) NOT NULL,
    "event_date" DATE NOT NULL,
    "event_time" VARCHAR(20),
    "event_location" TEXT,
    "package_name" VARCHAR(255),
    "add_ons" TEXT,
    "amount" DECIMAL(12,2),
    "dp_amount" DECIMAL(12,2),
    "event_status" "EventStatus" NOT NULL DEFAULT 'INQUIRY',
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_links" (
    "id" UUID NOT NULL,
    "vendor_id" UUID NOT NULL,
    "token" VARCHAR(64) NOT NULL,
    "event_id" UUID,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "used_at" TIMESTAMPTZ,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "events_vendor_id_idx" ON "events"("vendor_id");

-- CreateIndex
CREATE INDEX "events_event_status_idx" ON "events"("event_status");

-- CreateIndex
CREATE INDEX "events_payment_status_idx" ON "events"("payment_status");

-- CreateIndex
CREATE INDEX "events_event_date_idx" ON "events"("event_date");

-- CreateIndex
CREATE INDEX "events_created_at_idx" ON "events"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "booking_links_token_key" ON "booking_links"("token");

-- CreateIndex
CREATE INDEX "booking_links_token_idx" ON "booking_links"("token");

-- CreateIndex
CREATE INDEX "booking_links_vendor_id_idx" ON "booking_links"("vendor_id");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_links" ADD CONSTRAINT "booking_links_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_links" ADD CONSTRAINT "booking_links_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
