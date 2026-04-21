-- CreateEnum
CREATE TYPE "CompanyApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "InterviewSchedule" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "companyApprovalStatus" "CompanyApprovalStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "rejectedAt" TIMESTAMP(3),
ADD COLUMN     "rejectionReason" TEXT;

-- CreateTable
CREATE TABLE "ScheduleMessage" (
    "id" SERIAL NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScheduleMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScheduleMessage_scheduleId_idx" ON "ScheduleMessage"("scheduleId");

-- CreateIndex
CREATE INDEX "InterviewSchedule_companyApprovalStatus_idx" ON "InterviewSchedule"("companyApprovalStatus");

-- AddForeignKey
ALTER TABLE "ScheduleMessage" ADD CONSTRAINT "ScheduleMessage_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "InterviewSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleMessage" ADD CONSTRAINT "ScheduleMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
