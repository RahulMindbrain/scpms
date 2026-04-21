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
import { NotificationType, ScheduleStatus } from "@prisma/client";
import { createManyNotifications } from "../repository/notification.repository";
import { runInBackground } from "../utils/Background.task";
import { emitToUsers } from "../socket";
import { SOCKET_EVENTS } from "../socket.event";

type CreateInterviewScheduleInput = {
  title: string;
  companyId: number;
  jobIds: number[];
  startTime: Date | string;
  endTime: Date | string;
  venue?: string;
  createdBy: number;
};

type UpdateScheduleInput = {
  title?: string;
  startTime?: Date | string;
  endTime?: Date | string;
  venue?: string;
};

export const createInterviewScheduleService = async (
  data: CreateInterviewScheduleInput,
) => {
  const { companyId, jobIds, startTime, endTime, venue, createdBy } = data;

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start >= end) {
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

  const conflict = await checkScheduleConflict(start, end, companyId, venue);
  if (conflict) throw new Error("Schedule conflict");

  const schedule = await createScheduleWithJobs(
    {
      title: data.title,
      companyId,
      startTime: start,
      endTime: end,
      ...(venue && { venue }),
      createdBy,
    },
    jobIds,
  );

  if (!schedule) {
    throw new Error("Failed to create schedule");
  }

  runInBackground(async () => {
    try {
      const applications = await getAppliedStudentsForJobs(jobIds);

      const userIds = [
        ...new Set(applications.map((app) => app.student.user.id)),
      ];

      if (!userIds.length) return;

      emitToUsers(userIds, SOCKET_EVENTS.SCHEDULE_CREATED, {
        scheduleId: schedule.id,
        title: schedule.title,
        startTime: schedule.startTime,
      });

      await createManyNotifications(
        userIds.map((userId) => ({
          userId,
          title: "Interview Scheduled",
          message: `Interview scheduled for ${schedule.title}`,
          type: NotificationType.SCHEDULE_CREATED,
        })),
      );
    } catch (err) {
      console.error("Schedule notification failed", err);
    }
  });

  return schedule;
};

export const getAllSchedulesService = async () => {
  return getAllSchedules();
};

export const getScheduleByIdService = async (id: number) => {
  const schedule = await getScheduleById(id);

  if (!schedule) throw new Error("Schedule not found");

  return schedule;
};

export const getCompanySchedulesService = async (companyId: number) => {
  return getSchedulesByCompany(companyId);
};

export const updateScheduleService = async (
  id: number,
  data: UpdateScheduleInput,
) => {
  const existing = await getScheduleById(id);
  if (!existing) throw new Error("Schedule not found");

  const start = data.startTime ? new Date(data.startTime) : existing.startTime;

  const end = data.endTime ? new Date(data.endTime) : existing.endTime;

  if (start >= end) {
    throw new Error("Invalid time range");
  }

  const venue =
    data.venue !== undefined ? data.venue : (existing.venue ?? undefined);

  const conflict = await checkScheduleConflict(
    start,
    end,
    existing.companyId,
    venue,
  );

  if (conflict && conflict.id !== id) {
    throw new Error("Schedule conflict detected");
  }

  const updatePayload = {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.startTime !== undefined && { startTime: start }),
    ...(data.endTime !== undefined && { endTime: end }),
    ...(data.venue !== undefined && { venue: data.venue }),
  };

  const shouldReset =
    data.title !== undefined ||
    data.startTime !== undefined ||
    data.endTime !== undefined ||
    data.venue !== undefined;

  return updateSchedule(id, {
    ...updatePayload,
    ...(shouldReset && {
      companyApprovalStatus: "PENDING",
      approvedAt: null,
      rejectedAt: null,
      rejectionReason: null,
    }),
  });
};

export const deleteScheduleService = async (id: number) => {
  const existing = await getScheduleById(id);
  if (!existing) throw new Error("Schedule not found");

  if (existing.jobs?.length) {
    const jobIds = existing.jobs.map((j) => j.id);
    await detachJobsFromSchedule(jobIds);
  }

  return deleteSchedule(id);
};

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

export const removeJobsFromScheduleService = async (jobIds: number[]) => {
  return detachJobsFromSchedule(jobIds);
};

export const approveScheduleService = async (
  scheduleId: number,
  companyUserId: number,
) => {
  const schedule = await getScheduleWithJobsAndApplications(scheduleId);

  if (!schedule) throw new Error("Schedule not found");

  if (schedule.company.userId !== companyUserId) {
    throw new Error("Unauthorized");
  }

  if (schedule.companyApprovalStatus !== "PENDING") {
    throw new Error("Already processed");
  }

  const jobIds = schedule.jobs.map((j) => j.id);

  const applications = await getAppliedStudentsForJobs(jobIds);

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

  const updated = await updateScheduleApprovalStatus(scheduleId, {
    companyApprovalStatus: "APPROVED",
    approvedAt: new Date(),
  });

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
  const schedule = await getScheduleById(scheduleId);

  if (!schedule) throw new Error("Schedule not found");

  if (schedule.company.userId !== companyUserId) {
    throw new Error("Unauthorized");
  }

  if (schedule.companyApprovalStatus === "APPROVED") {
    throw new Error("Already approved");
  }

  if (status === "REJECTED") {
    if (!rejectionReason?.trim()) {
      throw new Error("Rejection reason required");
    }

    const updated = await updateScheduleApprovalStatus(scheduleId, {
      companyApprovalStatus: "REJECTED",
      rejectedAt: new Date(),
      rejectionReason,
    });

    sendScheduleDiscussionEmail({
      schedule,
      senderRole: "COMPANY",
      senderName: schedule.company.name,
      recipientEmail: schedule.admin.user.email,
      message: `Schedule rejected: ${rejectionReason}`,
    }).catch(console.error);

    return updated;
  }

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
          userId: student.user.id,
        });
      }
    }

    const students = Array.from(map.values());

    const updated = await updateScheduleApprovalStatus(scheduleId, {
      companyApprovalStatus: "APPROVED",
      approvedAt: new Date(),
      rejectionReason: null,
    });

    runInBackground(async () => {
      try {
        const userIds = students.map((s) => s.userId);

        if (!userIds.length) return;

        emitToUsers(userIds, SOCKET_EVENTS.SCHEDULE_APPROVED, {
          scheduleId,
          title: schedule.title,
        });

        await createManyNotifications(
          userIds.map((userId) => ({
            userId,
            title: "Schedule Approved",
            message: `Interview schedule approved for ${schedule.title}`,
            type: NotificationType.SCHEDULE_APPROVED,
          })),
        );
      } catch (err) {
        console.error("Schedule approval notification failed", err);
      }
    });
    if (students.length) {
      sendInterviewNotificationEmail({
        students,
        schedule,
        companyName: schedule.company.name,
      }).catch(console.error);
    }

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

  if (role === "COMPANY") {
    const company = await getCompanyByUserId(userId);

    if (!company) {
      throw new Error("Company not found");
    }

    companyId = company.id;
  } else if (role === "ADMIN") {
    if (!companyIdFromQuery) {
      throw new Error("companyId is required for admin");
    }

    companyId = companyIdFromQuery;
  } else {
    throw new Error("Unauthorized role");
  }

  const schedules = await getSchedulesByCompanyIdRepo(companyId);

  return schedules.map((s) => ({
    id: s.id,
    title: s.title,
    startTime: s.startTime,
    endTime: s.endTime,
    venue: s.venue,
    companyName: s.company.name,
    jobCount: s.jobs.length,
    jobs: s.jobs,
  }));
};
