/*
  Warnings:

  - You are about to drop the column `interviewScheduleId` on the `Job` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_interviewScheduleId_fkey";

-- DropIndex
DROP INDEX "Job_interviewScheduleId_idx";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "interviewScheduleId";

-- AlterTable
ALTER TABLE "JobUniversity" ADD COLUMN     "interviewScheduleId" INTEGER;

-- CreateIndex
CREATE INDEX "JobUniversity_interviewScheduleId_idx" ON "JobUniversity"("interviewScheduleId");

-- AddForeignKey
ALTER TABLE "JobUniversity" ADD CONSTRAINT "JobUniversity_interviewScheduleId_fkey" FOREIGN KEY ("interviewScheduleId") REFERENCES "InterviewSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
