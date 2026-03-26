/*
  Warnings:

  - You are about to drop the column `business_profile_id` on the `event_categories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `event_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "event_categories" DROP CONSTRAINT "event_categories_business_profile_id_fkey";

-- DropIndex
DROP INDEX "event_categories_business_profile_id_idx";

-- DropIndex
DROP INDEX "event_categories_business_profile_id_name_key";

-- AlterTable
ALTER TABLE "event_categories" DROP COLUMN "business_profile_id";

-- CreateIndex
CREATE UNIQUE INDEX "event_categories_name_key" ON "event_categories"("name");
