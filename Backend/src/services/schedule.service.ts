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
  getScheduleWithJobsAndApplications,
  updateScheduleApprovalStatus,
  getSchedulesByCompanyIdRepo,
} from "../repository/schedule.repository";

import {
  getCompanyById,
  getCompanyByUserId,
} from "../repository/company.repository";
import { getJobsByIds } from "../repository/job.repository";
import { sendInterviewNotificationEmail } from "./mail/mail.notify.service";
import { getAppliedStudentsForJobs } from "../repository/student.repository";
import { sendScheduleDiscussionEmail } from "./mail/mail.schedule.service";

// =======================================================
// 🔹 CREATE SCHEDULE (CRITICAL)
// =======================================================
export const createInterviewScheduleService = async (data) => {
  const { companyId, jobIds, startTime, endTime, venue, createdBy } = data;

  if (new Date(startTime) >= new Date(endTime)) {
    throw new Error("Invalid time range");
  }

  const company = await getCompanyById(companyId);
  if (!company) throw new Error("Company not found");

  const jobs = await getJobsByIds(jobIds);

  for (const job of jobs) {
    if (job.companyId !== companyId) throw new Error("Invalid job");
    if (job.status !== "APPROVED") throw new Error("Job not approved");
    if (job.interviewScheduleId) throw new Error("Already scheduled");
  }

  const conflict = await checkScheduleConflict(
    startTime,
    endTime,
    companyId,
    venue,
  );

  if (conflict) throw new Error("Schedule conflict");

  return createScheduleWithJobs(
    {
      title: data.title,
      companyId,
      startTime,
      endTime,
      venue,
      createdBy,
      status: "SCHEDULED",
      companyApprovalStatus: "PENDING",
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
export const updateScheduleService = async (id: number, data) => {
  const existing = await getScheduleById(id);
  if (!existing) throw new Error("Schedule not found");

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

  // 🔥 decide if approval needs reset
  const shouldReset =
    data.title !== undefined ||
    data.startTime !== undefined ||
    data.endTime !== undefined ||
    data.venue !== undefined;

  return updateSchedule(id, {
    ...data,
    ...(shouldReset && {
      companyApprovalStatus: "PENDING",
      approvedAt: null,
      rejectedAt: null,
      rejectionReason: null,
    }),
  });
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

export const approveScheduleService = async (
  scheduleId: number,
  companyUserId: number,
) => {
  // 1. fetch schedule
  const schedule = await getScheduleWithJobsAndApplications(scheduleId);

  if (!schedule) throw new Error("Schedule not found");

  // 2. auth
  if (schedule.company.userId !== companyUserId) {
    throw new Error("Unauthorized");
  }

  // 3. status
  if (schedule.companyApprovalStatus !== "PENDING") {
    throw new Error("Already processed");
  }

  // 4. get jobIds
  const jobIds = schedule.jobs.map((j) => j.id);

  // 5. fetch students via repo (✅ clean)
  const applications = await getAppliedStudentsForJobs(jobIds);

  // 6. dedupe
  const uniqueStudentsMap = new Map();

  for (const app of applications) {
    const student = app.student;
    const email = student.user.email;

    if (!uniqueStudentsMap.has(email)) {
      uniqueStudentsMap.set(email, {
        email,
        firstname: student.user.firstname,
      });
    }
  }

  const students = Array.from(uniqueStudentsMap.values());

  // 7. update
  const updated = await updateScheduleApprovalStatus(scheduleId, {
    companyApprovalStatus: "APPROVED",
    approvedAt: new Date(),
  });

  // 8. notify
  if (students.length) {
    sendInterviewNotificationEmail({
      students,
      schedule,
      companyName: schedule.company.name,
    }).catch(console.error);
  }

  return updated;
};

export const updateScheduleApprovalService = async (
  scheduleId: number,
  companyUserId: number,
  status: "APPROVED" | "REJECTED",
  rejectionReason?: string,
) => {
  // 1. fetch
  const schedule = await getScheduleById(scheduleId);

  if (!schedule) throw new Error("Schedule not found");

  // 2. auth
  if (schedule.company.userId !== companyUserId) {
    throw new Error("Unauthorized");
  }

  // 3. prevent double approval
  if (schedule.companyApprovalStatus === "APPROVED") {
    throw new Error("Already approved");
  }

  // =========================
  // REJECT FLOW
  // =========================
  if (status === "REJECTED") {
    if (!rejectionReason?.trim()) {
      throw new Error("Rejection reason required");
    }

    const updated = await updateScheduleApprovalStatus(scheduleId, {
      companyApprovalStatus: "REJECTED",
      rejectedAt: new Date(),
      rejectionReason,
    });

    // 🔥 notify admin
    sendScheduleDiscussionEmail({
      schedule,
      senderRole: "COMPANY",
      senderName: schedule.company.name,
      recipientEmail: schedule.admin.user.email,
      message: `Schedule rejected: ${rejectionReason}`,
    }).catch(console.error);

    return updated;
  }

  // =========================
  // APPROVE FLOW
  // =========================
  if (status === "APPROVED") {
    const jobIds = schedule.jobs.map((j) => j.id);

    const applications = await getAppliedStudentsForJobs(jobIds);

    const map = new Map();

    for (const app of applications) {
      const student = app.student;
      const email = student.user.email;

      if (!map.has(email)) {
        map.set(email, {
          email,
          firstname: student.user.firstname,
        });
      }
    }

    const students = Array.from(map.values());

    const updated = await updateScheduleApprovalStatus(scheduleId, {
      companyApprovalStatus: "APPROVED",
      approvedAt: new Date(),
      rejectionReason: null,
    });

    // 🔥 notify students
    if (students.length) {
      sendInterviewNotificationEmail({
        students,
        schedule,
        companyName: schedule.company.name,
      }).catch(console.error);
    }

    // 🔥 OPTIONAL: notify admin
    sendScheduleDiscussionEmail({
      schedule,
      senderRole: "COMPANY",
      senderName: "Placement Cell",
      recipientEmail: schedule.admin.user.email,
      message: `Schedule approved by ${schedule.company.name}`,
    }).catch(console.error);

    return updated;
  }

  throw new Error("Invalid status");
};

export const getSchedulesForUserService = async (
  userId: number,
  role: "ADMIN" | "COMPANY",
  companyIdFromQuery?: number,
) => {
  let companyId: number;

  // =========================
  // COMPANY FLOW
  // =========================
  if (role === "COMPANY") {
    const company = await getCompanyByUserId(userId);

    if (!company) {
      throw new Error("Company not found");
    }

    companyId = company.id;
  }

  // =========================
  // ADMIN FLOW
  // =========================
  else if (role === "ADMIN") {
    if (!companyIdFromQuery) {
      throw new Error("companyId is required for admin");
    }

    companyId = companyIdFromQuery;
  } else {
    throw new Error("Unauthorized role");
  }

  const schedules = await getSchedulesByCompanyIdRepo(companyId);

  // 🔥 format for frontend
  return schedules.map((s) => ({
    id: s.id,
    title: s.title,
    startTime: s.startTime,
    endTime: s.endTime,
    venue: s.venue,
    companyName: s.company.name,
    jobCount: s.jobs.length,
  }));
};
