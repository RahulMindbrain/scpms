import { ApplicationStatus, NotificationType } from "@prisma/client";

import prisma from "../config/db";

import {
  createApplication,
  createApplicationHistory,
  deleteApplication,
  getApplicationById,
  getApplications,
  getApplicationsBySchedule,
  updateApplicationStatus,
} from "../repository/application.repository";

import { getCompanyByUserId } from "../repository/company.repository";

import {
  getApplicationByStudentAndJobUniversity,
  getJobUniversityById,
} from "../repository/job.university.repository";

import { getStudentByUserId } from "../repository/student.repository";

import { emitToUser } from "../socket";

import { SOCKET_EVENTS } from "../socket.event";

import { createNotification } from "../repository/notification.repository";
import { sendMail } from "../utils/mails/transporter.mail";

export const createApplicationService = async (
  userId: number,
  jobUniversityId: number,
) => {
  const student = await getStudentByUserId(userId);

  if (!student) {
    throw new Error("Student profile not found");
  }

  const jobUniversity = await getJobUniversityById(jobUniversityId);

  if (!jobUniversity) {
    throw new Error("Job university not found");
  }

  if (jobUniversity.job.isDeleted) {
    throw new Error("Job is no longer available");
  }

  if (jobUniversity.status !== "APPROVED") {
    throw new Error("Job is not approved");
  }

  if (jobUniversity.universityId !== student.university.id) {
    throw new Error("You cannot apply for this job");
  }

  const existing = await getApplicationByStudentAndJobUniversity(
    student.id,
    jobUniversityId,
  );

  if (existing) {
    throw new Error("Already applied to this job");
  }

  let applicationStatus: ApplicationStatus | undefined;

  let rejectionReason: string | undefined;

  if (
    jobUniversity.minCgpa &&
    student.cgpa &&
    student.cgpa < jobUniversity.minCgpa
  ) {
    applicationStatus = ApplicationStatus.NOT_ELIGIBLE;

    rejectionReason = "CGPA below requirement";
  }

  const application = await prisma.$transaction(async (tx) => {
    const createdApplication = await createApplication(tx, {
      studentId: student.id,

      jobUniversityId,

      ...(applicationStatus && {
        status: applicationStatus,
      }),

      ...(rejectionReason && {
        reason: rejectionReason,
      }),
    });

    await createApplicationHistory(tx, {
      applicationId: createdApplication.id,

      status: createdApplication.status,

      round: createdApplication.currentRound,

      reason: createdApplication.reason,

      createdBy: userId,
    });

    return createdApplication;
  });

  emitToUser(
    jobUniversity.job.company.userId,

    SOCKET_EVENTS.NEW_APPLICATION,

    {
      applicationId: application.id,

      jobUniversityId,

      studentId: student.id,

      studentName: student.user
        ? `${student.user.firstname} ${student.user.lastname ?? ""}`.trim()
        : "Unknown",
    },
  );

  await createNotification({
    userId: jobUniversity.job.company.userId,

    title: "New Application",

    message: `New application received for ${jobUniversity.job.title}`,

    type: NotificationType.APPLICATION_SUBMITTED,
  });

  try {
    await sendMail({
      to: jobUniversity.job.company.user.email,

      subject: "New Student Application",

      html: `
        <h2>New Application Received</h2>

        <p>
          A new student has applied for
          <strong>
            ${jobUniversity.job.title}
          </strong>
        </p>

        <p>
          Student:
          ${student.user?.firstname}
          ${student.user?.lastname ?? ""}
        </p>
      `,
    });
  } catch (mailErr) {
    console.error("Application mail failed", mailErr);
  }

  return application;
};

export const getApplicationsService = async (
  user: any,
  filters: any,
  page: number,
  limit: number,
) => {
  try {
    let enrichedUser: any = {
      ...user,
    };

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

export const updateApplicationService = async ({
  applicationId,
  status,
  currentRound,
  reason,
  remarks,
  updatedBy,
}: {
  applicationId: number;

  status: ApplicationStatus;

  currentRound?: any;

  reason?: string;

  remarks?: string;

  updatedBy: number;
}) => {
  const existing = await getApplicationById(applicationId);

  if (!existing) {
    throw new Error("Application not found");
  }

  if (existing.status === "REJECTED" && status !== "REJECTED") {
    throw new Error("Rejected applications cannot be updated");
  }

  if (
    existing.status === "OFFER_ACCEPTED" ||
    existing.status === "OFFER_REJECTED"
  ) {
    throw new Error("Offer already finalized");
  }

  const application = await prisma.$transaction(async (tx) => {
    const updatedApplication = await updateApplicationStatus(
      tx,
      applicationId,
      {
        status,

        currentRound,

        ...(reason && {
          reason,
        }),
      },
    );

    await createApplicationHistory(tx, {
      applicationId,

      status,

      round: currentRound ?? null,

      reason: reason ?? null,

      remarks: remarks ?? null,

      createdBy: updatedBy ?? null,
    });

    return updatedApplication;
  });

  emitToUser(
    application.student.userId,

    SOCKET_EVENTS.APPLICATION_STATUS_UPDATED,

    {
      applicationId: application.id,

      status: application.status,

      currentRound: application.currentRound,

      jobUniversityId: application.jobUniversity.id,

      jobTitle: application.jobUniversity.job.title,
    },
  );

  try {
    let title = "Application Updated";

    let message = `Your application for ${application.jobUniversity.job.title} has been updated`;

    if (status === "SHORTLISTED") {
      title = "Application Shortlisted";

      message = `You have been shortlisted for ${currentRound ?? "next round"} in ${application.jobUniversity.job.title}`;
    }

    if (status === "REJECTED") {
      title = "Application Rejected";

      message = `Your application was rejected${currentRound ? ` in ${currentRound}` : ""} for ${application.jobUniversity.job.title}`;
    }

    if (status === "SELECTED") {
      title = "Application Selected";

      message = `Congratulations! You have been selected for ${application.jobUniversity.job.title}`;
    }

    await createNotification({
      userId: application.student.userId,

      title,

      message,

      type:
        status === "REJECTED"
          ? NotificationType.APPLICATION_REJECTED
          : NotificationType.APPLICATION_SELECTED,
    });

    await sendMail({
      to: application.student.user.email,

      subject: title,

      html: `
          <h2>${title}</h2>

          <p>${message}</p>

          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}

          ${remarks ? `<p><strong>Remarks:</strong> ${remarks}</p>` : ""}
        `,
    });
  } catch (err) {
    console.error("Notification failed", err);
  }

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

  return {
    deleted: true,
  };
};
