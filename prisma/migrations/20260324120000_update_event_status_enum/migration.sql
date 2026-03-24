-- AlterEnum: Rename WAITING_PAYMENT → WAITING_CONFIRMATION, CONFIRMED → BOOKED
-- PostgreSQL requires recreating the enum type to rename/remove values.

-- Step 1: Create the new enum type
CREATE TYPE "EventStatus_new" AS ENUM ('INQUIRY', 'WAITING_CONFIRMATION', 'BOOKED', 'ONGOING', 'COMPLETED');

-- Step 2: Drop default, convert column to text, migrate data, cast to new enum
ALTER TABLE "events" ALTER COLUMN "event_status" DROP DEFAULT;
ALTER TABLE "events" ALTER COLUMN "event_status" TYPE TEXT;

UPDATE "events" SET "event_status" = 'WAITING_CONFIRMATION' WHERE "event_status" = 'WAITING_PAYMENT';
UPDATE "events" SET "event_status" = 'BOOKED' WHERE "event_status" = 'CONFIRMED';

ALTER TABLE "events" ALTER COLUMN "event_status" TYPE "EventStatus_new" USING "event_status"::"EventStatus_new";
ALTER TABLE "events" ALTER COLUMN "event_status" SET DEFAULT 'INQUIRY';

-- Step 3: Drop old enum and rename new one
DROP TYPE "EventStatus";
ALTER TYPE "EventStatus_new" RENAME TO "EventStatus";
