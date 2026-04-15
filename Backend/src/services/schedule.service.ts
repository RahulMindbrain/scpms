import {
  checkScheduleConflict,
  createScheduleWithJobs,
  getAllSchedules,
  getScheduleById,
  getSchedulesByCompany,
  updateSchedule,
  deleteSchedule,
  attachJobsToSchedule,
  detachJobsFromSchedule,
} from "../repository/schedule.repository";

import { getCompanyById } from "../repository/company.repository";
import { getJobsByIds } from "../repository/job.repository";

// =======================================================
// 🔹 CREATE SCHEDULE (CRITICAL)
// =======================================================
export const createInterviewScheduleService = async (data: {
  title: string;
  companyId: number;
  jobIds: number[];
  startTime: Date;
  endTime: Date;
  venue?: string;
  createdBy: number;
}) => {
  const { companyId, jobIds, startTime, endTime, venue } = data;

  // 1. Validate company
  const company = await getCompanyById(companyId);
  if (!company) throw new Error("Company not found");

  // 2. Validate jobs exist
  const jobs = await getJobsByIds(jobIds, {
    select: {
      id: true,
      companyId: true,
      status: true,
      interviewScheduleId: true, // ✅ now included
    },
  });
  if (jobs.length !== jobIds.length) {
    throw new Error("Some jobs not found");
  }

  // 3. Validate jobs
  for (const job of jobs) {
    if (job.companyId !== companyId) {
      throw new Error(`Job ${job.id} does not belong to this company`);
    }

    if (job.status !== "APPROVED") {
      throw new Error(`Job ${job.id} is not approved`);
    }

    if (job.interviewScheduleId) {
      throw new Error(`Job ${job.id} is already scheduled`);
    }
  }

  // 4. Conflict check
  const conflict = await checkScheduleConflict(
    startTime,
    endTime,
    companyId,
    venue,
  );

  if (conflict) {
    throw new Error("Schedule conflict detected");
  }

  // 5. Create with transaction
  return createScheduleWithJobs(
    {
      title: data.title,
      companyId,
      startTime,
      endTime,
      venue,
      createdBy: data.createdBy,
    },
    jobIds,
  );
};

// =======================================================
// 🔹 GET ALL (ADMIN)
// =======================================================
export const getAllSchedulesService = async () => {
  return getAllSchedules();
};

// =======================================================
// 🔹 GET BY ID
// =======================================================
export const getScheduleByIdService = async (id: number) => {
  const schedule = await getScheduleById(id);

  if (!schedule) throw new Error("Schedule not found");

  return schedule;
};

// =======================================================
// 🔹 GET COMPANY SCHEDULES
// =======================================================
export const getCompanySchedulesService = async (companyId: number) => {
  return getSchedulesByCompany(companyId);
};

// =======================================================
// 🔹 UPDATE SCHEDULE (SAFE)
// =======================================================
export const updateScheduleService = async (
  id: number,
  data: {
    title?: string;
    startTime?: Date;
    endTime?: Date;
    venue?: string;
    status?: string;
  },
) => {
  const existing = await getScheduleById(id);
  if (!existing) throw new Error("Schedule not found");

  // Conflict check only if time changes
  if (data.startTime || data.endTime) {
    const start = data.startTime || existing.startTime;
    const end = data.endTime || existing.endTime;

    const conflict = await checkScheduleConflict(
      start,
      end,
      existing.companyId,
      data.venue || existing.venue || undefined,
    );

    if (conflict && conflict.id !== id) {
      throw new Error("Schedule conflict detected");
    }
  }

  return updateSchedule(id, data);
};

// =======================================================
// 🔹 DELETE SCHEDULE (SAFE)
// =======================================================
export const deleteScheduleService = async (id: number) => {
  const existing = await getScheduleById(id);
  if (!existing) throw new Error("Schedule not found");

  // detach jobs first (important)
  if (existing.jobs?.length) {
    const jobIds = existing.jobs.map((j) => j.id);
    await detachJobsFromSchedule(jobIds);
  }

  return deleteSchedule(id);
};

// =======================================================
// 🔹 ADD JOBS TO EXISTING SCHEDULE
// =======================================================
export const addJobsToScheduleService = async (
  scheduleId: number,
  jobIds: number[],
) => {
  const schedule = await getScheduleById(scheduleId);
  if (!schedule) throw new Error("Schedule not found");

  const jobs = await getJobsByIds(jobIds);

  for (const job of jobs) {
    if (job.companyId !== schedule.companyId) {
      throw new Error(`Job ${job.id} does not belong to schedule company`);
    }

    if (job.status !== "APPROVED") {
      throw new Error(`Job ${job.id} is not approved`);
    }

    if (job.interviewScheduleId) {
      throw new Error(`Job ${job.id} already scheduled`);
    }
  }

  return attachJobsToSchedule(scheduleId, jobIds);
};

// =======================================================
// 🔹 REMOVE JOBS FROM SCHEDULE
// =======================================================
export const removeJobsFromScheduleService = async (jobIds: number[]) => {
  return detachJobsFromSchedule(jobIds);
};
