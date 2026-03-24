-- ============================================================================
-- Migration: Business Profile as central entity
-- Moves ownership of events, booking_links, packages, add_ons from users
-- to business_profiles.
-- ============================================================================

-- 1. Add new business_profile_id columns (nullable first for data migration)

ALTER TABLE "events" ADD COLUMN "business_profile_id" UUID;
ALTER TABLE "booking_links" ADD COLUMN "business_profile_id" UUID;
ALTER TABLE "packages" ADD COLUMN "business_profile_id" UUID;
ALTER TABLE "add_ons" ADD COLUMN "business_profile_id" UUID;

-- 2. Migrate existing data: map vendor_id (user) → business_profile_id

UPDATE "events" e
SET "business_profile_id" = bp.id
FROM "business_profiles" bp
WHERE bp.user_id = e.vendor_id;

UPDATE "booking_links" bl
SET "business_profile_id" = bp.id
FROM "business_profiles" bp
WHERE bp.user_id = bl.vendor_id;

UPDATE "packages" p
SET "business_profile_id" = bp.id
FROM "business_profiles" bp
WHERE bp.user_id = p.vendor_id;

UPDATE "add_ons" a
SET "business_profile_id" = bp.id
FROM "business_profiles" bp
WHERE bp.user_id = a.vendor_id;

-- 3. Delete orphaned rows that have no matching business profile
--    (safety: should be 0 in production if all vendors have profiles)

DELETE FROM "events" WHERE "business_profile_id" IS NULL;
DELETE FROM "booking_links" WHERE "business_profile_id" IS NULL;
DELETE FROM "packages" WHERE "business_profile_id" IS NULL;
DELETE FROM "add_ons" WHERE "business_profile_id" IS NULL;

-- 4. Make columns non-nullable

ALTER TABLE "events" ALTER COLUMN "business_profile_id" SET NOT NULL;
ALTER TABLE "booking_links" ALTER COLUMN "business_profile_id" SET NOT NULL;
ALTER TABLE "packages" ALTER COLUMN "business_profile_id" SET NOT NULL;
ALTER TABLE "add_ons" ALTER COLUMN "business_profile_id" SET NOT NULL;

-- 5. Drop old vendor_id columns and their indexes

DROP INDEX IF EXISTS "events_vendor_id_idx";
ALTER TABLE "events" DROP COLUMN "vendor_id";

DROP INDEX IF EXISTS "booking_links_vendor_id_idx";
ALTER TABLE "booking_links" DROP COLUMN "vendor_id";

DROP INDEX IF EXISTS "packages_vendor_id_idx";
ALTER TABLE "packages" DROP COLUMN "vendor_id";

DROP INDEX IF EXISTS "add_ons_vendor_id_idx";
ALTER TABLE "add_ons" DROP COLUMN "vendor_id";

-- 6. Add new indexes and foreign key constraints

CREATE INDEX "events_business_profile_id_idx" ON "events"("business_profile_id");
ALTER TABLE "events" ADD CONSTRAINT "events_business_profile_id_fkey"
  FOREIGN KEY ("business_profile_id") REFERENCES "business_profiles"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "booking_links_business_profile_id_idx" ON "booking_links"("business_profile_id");
ALTER TABLE "booking_links" ADD CONSTRAINT "booking_links_business_profile_id_fkey"
  FOREIGN KEY ("business_profile_id") REFERENCES "business_profiles"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "packages_business_profile_id_idx" ON "packages"("business_profile_id");
ALTER TABLE "packages" ADD CONSTRAINT "packages_business_profile_id_fkey"
  FOREIGN KEY ("business_profile_id") REFERENCES "business_profiles"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "add_ons_business_profile_id_idx" ON "add_ons"("business_profile_id");
ALTER TABLE "add_ons" ADD CONSTRAINT "add_ons_business_profile_id_fkey"
  FOREIGN KEY ("business_profile_id") REFERENCES "business_profiles"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
