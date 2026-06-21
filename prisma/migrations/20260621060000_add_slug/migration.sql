ALTER TABLE "Product" ADD COLUMN "slug" TEXT NOT NULL DEFAULT '';
UPDATE "Product" SET "slug" = "id";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
