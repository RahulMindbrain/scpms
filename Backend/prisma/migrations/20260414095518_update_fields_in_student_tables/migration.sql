-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "isPlaced" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "placedAt" TIMESTAMP(3);
