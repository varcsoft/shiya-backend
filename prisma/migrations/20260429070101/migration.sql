-- AlterTable
ALTER TABLE "specification" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "superspecification" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
