/*
  Warnings:

  - Added the required column `passingYear` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "passingYear" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL,
ALTER COLUMN "cgpa" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Student_passingYear_idx" ON "Student"("passingYear");
