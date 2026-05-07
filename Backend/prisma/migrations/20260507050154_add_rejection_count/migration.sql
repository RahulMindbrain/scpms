-- AlterTable
ALTER TABLE "JobUniversity" ADD COLUMN     "rejectionCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rejectionReason" TEXT;
