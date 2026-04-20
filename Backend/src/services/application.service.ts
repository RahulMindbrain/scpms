import prisma from "../config/db";
import {
  createApplication,
  deleteApplication,
  getApplicationById,
  getApplications,
  getApplicationsBySchedule,
  updateApplicationStatus,
} from "../repository/application.repository";
import { getCompanyByUserId } from "../repository/company.repository";
import {
  getApplicationByStudentAndJob,
  getJobById,
} from "../repository/job.repository";
import { getStudentByUserId } from "../repository/student.repository";
import { emitToUser } from "../socket";
import { SOCKET_EVENTS } from "../socket.event";

export const createApplicationService = async (
  userId: number,
  jobId: number,
) => {
  const student = await getStudentByUserId(userId);

  if (!student) {
    throw new Error("Student profile not found");
  }

  const job = await getJobById(jobId);

  if (!job) {
    throw new Error("Job not found");
  }

  const existing = await getApplicationByStudentAndJob(student.id, jobId);

  if (existing) {
    throw new Error("Already applied to this job");
  }

  let application;

  if (job.minCgpa && student.cgpa && student.cgpa < job.minCgpa) {
    application = await createApplication({
      studentId: student.id,
      jobId,
      status: "NOT_ELIGIBLE",
      reason: "CGPA below requirement",
    });

    return application;
  }

  application = await createApplication({
    studentId: student.id,
    jobId,
  });

  emitToUser(job.company.userId, SOCKET_EVENTS.NEW_APPLICATION, {
    applicationId: application.id,
    jobId,
    studentId: student.id,
    studentName: student.user
      ? `${student.user.firstname} ${student.user.lastname ?? ""}`.trim()
      : "Unknown",
  });

  return application;
};

export const getApplicationsService = async (
  user: any,
  filters: any,
  page: number,
  limit: number,
) => {
  try {
    let enrichedUser: any = { ...user };

    if (user.role === "COMPANY") {
      const company = await getCompanyByUserId(user.id);

      if (!company) {
        throw new Error("Company not found");
      }

      enrichedUser.companyId = company.id;
    }

    if (user.role === "STUDENT") {
      const student = await getStudentByUserId(user.id);

      if (!student) {
        throw new Error("Student not found");
      }

      enrichedUser.studentId = student.id;
    }

    return await getApplications(enrichedUser, filters, page, limit);
  } catch (error) {
    console.error("Service Error:", error);
    throw error;
  }
};

export const updateApplicationService = async (id: number, status: any) => {
  const application = await updateApplicationStatus(id, status);

  emitToUser(
    application.student.userId,
    SOCKET_EVENTS.APPLICATION_STATUS_UPDATED,
    {
      applicationId: application.id,
      status: application.status,
      jobId: application.job.id,
      jobTitle: application.job.title,
    },
  );

  return application;
};

export const getScheduleApplicationsService = async (
  scheduleId: number,
  page?: number,
  limit?: number,
) => {
  const applications = await getApplicationsBySchedule(scheduleId, page, limit);

  if (Array.isArray(applications)) {
    if (applications.length === 0) {
      throw new Error("No applications found for this schedule");
    }
  } else {
    if (applications.data.length === 0) {
      return applications;
    }
  }

  return applications;
};

export const deleteApplicationService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid application id");
  }

  const existing = await getApplicationById(id);

  if (!existing) {
    throw new Error("Application not found");
  }

  await deleteApplication(id);

  return { deleted: true };
};
