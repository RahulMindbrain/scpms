/*
  Warnings:

  - You are about to drop the column `socketId` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ScheduleMode" AS ENUM ('ONLINE', 'OFFLINE', 'HYBRID');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "interviewScheduleId" INTEGER,
ADD COLUMN     "maxBacklogs" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "socketId";

-- CreateTable
CREATE TABLE "InterviewSchedule" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "venue" TEXT,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InterviewSchedule_startTime_endTime_idx" ON "InterviewSchedule"("startTime", "endTime");

-- CreateIndex
CREATE INDEX "InterviewSchedule_companyId_idx" ON "InterviewSchedule"("companyId");

-- CreateIndex
CREATE INDEX "InterviewSchedule_status_idx" ON "InterviewSchedule"("status");

-- CreateIndex
CREATE INDEX "Job_interviewScheduleId_idx" ON "Job"("interviewScheduleId");

-- CreateIndex
CREATE INDEX "Student_isPlaced_idx" ON "Student"("isPlaced");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_interviewScheduleId_fkey" FOREIGN KEY ("interviewScheduleId") REFERENCES "InterviewSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSchedule" ADD CONSTRAINT "InterviewSchedule_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSchedule" ADD CONSTRAINT "InterviewSchedule_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
