-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "package_items" ADD COLUMN     "inclusions" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "paid_by" VARCHAR(10) NOT NULL DEFAULT 'CLIENT';

-- AlterTable
ALTER TABLE "subcategories" ALTER COLUMN "id" DROP DEFAULT;
