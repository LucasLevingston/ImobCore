-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('Apartment', 'House', 'Land', 'Commercial', 'Farm', 'Studio', 'Penthouse');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('Available', 'Reserved', 'Sold', 'Rented', 'Inactive');

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "PropertyType" NOT NULL,
    "status" "PropertyStatus" NOT NULL DEFAULT 'Available',
    "price" DECIMAL(12,2) NOT NULL,
    "condominium_fee" DECIMAL(12,2),
    "iptu" DECIMAL(12,2),
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "garage_spaces" INTEGER NOT NULL,
    "area" DECIMAL(10,2) NOT NULL,
    "lot_area" DECIMAL(10,2),
    "floor" INTEGER,
    "furnished" BOOLEAN NOT NULL DEFAULT false,
    "accepts_financing" BOOLEAN NOT NULL DEFAULT false,
    "accepts_pets" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "broker_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "properties_city_idx" ON "properties"("city");

-- CreateIndex
CREATE INDEX "properties_district_idx" ON "properties"("district");

-- CreateIndex
CREATE INDEX "properties_type_idx" ON "properties"("type");

-- CreateIndex
CREATE INDEX "properties_status_idx" ON "properties"("status");

-- CreateIndex
CREATE INDEX "properties_broker_id_idx" ON "properties"("broker_id");
