-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "isAccepted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "activeBacklogs" INTEGER NOT NULL DEFAULT 0;
