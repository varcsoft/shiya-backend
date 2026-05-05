-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('TEST', 'LIVE');

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "orderType" "OrderType" NOT NULL DEFAULT 'TEST';
