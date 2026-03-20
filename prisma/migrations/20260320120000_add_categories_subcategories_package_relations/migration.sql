-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcategories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "subcategories_pkey" PRIMARY KEY ("id")
);

-- AlterTable: Add category_id, subcategory_id, inclusions to packages
ALTER TABLE "packages" ADD COLUMN "category_id" UUID;
ALTER TABLE "packages" ADD COLUMN "subcategory_id" UUID;
ALTER TABLE "packages" ADD COLUMN "inclusions" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
CREATE INDEX "categories_sort_order_idx" ON "categories"("sort_order");
CREATE INDEX "categories_is_active_idx" ON "categories"("is_active");

CREATE UNIQUE INDEX "subcategories_category_id_name_key" ON "subcategories"("category_id", "name");
CREATE INDEX "subcategories_category_id_idx" ON "subcategories"("category_id");
CREATE INDEX "subcategories_sort_order_idx" ON "subcategories"("sort_order");
CREATE INDEX "subcategories_is_active_idx" ON "subcategories"("is_active");

CREATE INDEX "packages_category_id_idx" ON "packages"("category_id");
CREATE INDEX "packages_subcategory_id_idx" ON "packages"("subcategory_id");

-- AddForeignKey
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "packages" ADD CONSTRAINT "packages_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "packages" ADD CONSTRAINT "packages_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "subcategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
