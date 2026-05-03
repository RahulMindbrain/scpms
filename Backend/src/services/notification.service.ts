import { NotificationType } from "@prisma/client";
import {
  //getJobBasicDetails,
  getJobDisplayDetails,
} from "../repository/job.repository";
import {
  createManyNotifications,
  createNotification,
  deleteNotification,
  getNotificationById,
  getNotifications,
  getNotificationsPaginated,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from "../repository/notification.repository";
import {
  getEligibleUnplacedStudents,
  getStudentByUserId,
  //getUnplacedStudents,
} from "../repository/student.repository";
import { emitToUsers } from "../socket";
import { SOCKET_EVENTS } from "../socket.event";
import { sendEmailService } from "./mail/mail.service";
import {
  getUpcomingSchedulesForAdmin,
  getUpcomingSchedulesForCompany,
  getUpcomingSchedulesForStudent,
} from "../repository/schedule.repository";
import { getCompanyByUserId } from "../repository/company.repository";

export const createNotificationService = async (data: any) => {
  return createNotification(data);
};

export const getNotificationsService = async (userId: number) => {
  return getNotifications(userId);
};

export const markAsReadService = async (id: number) => {
  return markAsRead(id);
};

export const notifyEligibleStudentsForJob = async (
  jobId: number,
  customSubject?: string,
  customMessage?: string,
) => {
  const students = await getEligibleUnplacedStudents(jobId);

  if (!students.length) return 0;

  const emails = students.map((s) => s.user.email);
  const userIds = students.map((s) => s.userId);

  const job = await getJobDisplayDetails(jobId);

  const subject =
    customSubject || `New Job Opportunity: ${job?.title || "Apply Now"}`;

  const message =
    customMessage ||
    `
      <p>A new job has been posted on the portal.</p>
      <p><strong>Role:</strong> ${job?.title || "N/A"}</p>
      <p><strong>Company:</strong> ${job?.company?.name || "N/A"}</p>
      <p><strong>Location:</strong> ${job?.location || "N/A"}</p>
      <p>Login to your dashboard and apply now.</p>
    `;

  emitToUsers(userIds, SOCKET_EVENTS.NEW_JOB, {
    jobId,
    title: job?.title,
    company: job?.company?.name,
    location: job?.location,
  });

  await sendEmailService({
    recipients: emails,
    subject,
    html: message,
  });

  await createManyNotifications(
    userIds.map((userId) => ({
      userId,
      title: "New Job Posted",
      message: `New job: ${job?.title || "Apply Now"} at ${job?.company?.name || ""}`,
      type: NotificationType.JOB_POSTED,
      entityId: jobId,
      entityType: "JOB",
    })),
  );

  return students.length;
};

export const getUnreadCountService = async (userId: number) => {
  if (!userId) throw new Error("User ID required");

  return getUnreadCount(userId);
};

export const markAllAsReadService = async (userId: number) => {
  if (!userId) throw new Error("User ID required");

  const result = await markAllAsRead(userId);

  return {
    updatedCount: result.count,
  };
};

export const getNotificationsPaginatedService = async (
  userId: number,
  page: number = 1,
  limit: number = 10,
) => {
  if (!userId) throw new Error("User ID required");

  if (page < 1) page = 1;
  if (limit < 1 || limit > 50) limit = 10;

  return getNotificationsPaginated(userId, page, limit);
};

export const markNotificationAsReadService = async (
  notificationId: number,
  userId: number,
) => {
  if (!notificationId) throw new Error("Notification ID required");

  const notification = await getNotificationById(notificationId);

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (notification.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return markAsRead(notificationId);
};

export const deleteNotificationService = async (
  notificationId: number,
  userId: number,
) => {
  const notification = await getNotificationById(notificationId);

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (notification.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return await deleteNotification(notificationId);
};

export const getUpcomingEventsService = async (
  userId: number,
  role: "STUDENT" | "COMPANY" | "ADMIN",
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  switch (role) {
    case "STUDENT": {
      const student = await getStudentByUserId(userId);
      if (!student) throw new Error("Student not found");

      return getUpcomingSchedulesForStudent(student.id, skip, limit, page);
    }

    case "COMPANY": {
      const company = await getCompanyByUserId(userId);
      if (!company) throw new Error("Company not found");

      return getUpcomingSchedulesForCompany(company.id, skip, limit, page);
    }

    case "ADMIN": {
      return getUpcomingSchedulesForAdmin(userId, skip, limit, page);
    }

    default:
      throw new Error("Invalid role");
  }
};