-- DropForeignKey: event_add_ons -> events, event_add_ons -> add_ons
ALTER TABLE "event_add_ons" DROP CONSTRAINT IF EXISTS "event_add_ons_event_id_fkey";
ALTER TABLE "event_add_ons" DROP CONSTRAINT IF EXISTS "event_add_ons_add_on_id_fkey";

-- DropForeignKey: events -> packages (packageId)
ALTER TABLE "events" DROP CONSTRAINT IF EXISTS "events_package_id_fkey";

-- Drop the event_add_ons junction table (replaced by snapshot)
DROP TABLE IF EXISTS "event_add_ons";

-- Drop old columns from events
ALTER TABLE "events" DROP COLUMN IF EXISTS "package_id";
ALTER TABLE "events" DROP COLUMN IF EXISTS "dp_amount";

-- Change package_snapshot from TEXT to JSONB
ALTER TABLE "events" DROP COLUMN IF EXISTS "package_snapshot";
ALTER TABLE "events" ADD COLUMN "package_snapshot" JSONB;

-- Add new columns to events
ALTER TABLE "events" ADD COLUMN "add_ons_snapshot" JSONB;
ALTER TABLE "events" ADD COLUMN "currency" VARCHAR(10) NOT NULL DEFAULT 'IDR';

-- Add new columns to booking_links
ALTER TABLE "booking_links" ADD COLUMN "client_name" VARCHAR(255);
ALTER TABLE "booking_links" ADD COLUMN "client_phone" VARCHAR(50);
ALTER TABLE "booking_links" ADD COLUMN "event_date" DATE;
ALTER TABLE "booking_links" ADD COLUMN "event_time" VARCHAR(20);
ALTER TABLE "booking_links" ADD COLUMN "event_location" TEXT;
ALTER TABLE "booking_links" ADD COLUMN "package_snapshot" JSONB;
ALTER TABLE "booking_links" ADD COLUMN "add_ons_snapshot" JSONB;
ALTER TABLE "booking_links" ADD COLUMN "total_amount" DECIMAL(12,2);

-- Drop old indexes that referenced removed columns
DROP INDEX IF EXISTS "events_package_id_idx";
