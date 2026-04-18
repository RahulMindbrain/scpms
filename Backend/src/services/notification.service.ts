import {
  getJobBasicDetails,
  getJobDisplayDetails,
} from "../repository/job.repository";
import {
  createNotification,
  deleteNotification,
  getNotifications,
  markAsRead,
} from "../repository/notification.repository";
import {
  getEligibleUnplacedStudents,
  getUnplacedStudents,
} from "../repository/student.repository";
import { emitToUsers } from "../socket";
import { SOCKET_EVENTS } from "../socket.event";
import { sendEmailService } from "./mail/mail.service";

// notification.service.ts
export const createNotificationService = async (data: any) => {
  return createNotification(data);
};

export const getNotificationsService = async (userId: number) => {
  return getNotifications(userId);
};

export const markAsReadService = async (id: number) => {
  return markAsRead(id);
};

export const deleteNotificationService = async (id: number) => {
  return deleteNotification(id);
};

export const notifyEligibleStudentsForJob = async (
  jobId: number,
  customSubject?: string,
  customMessage?: string,
) => {
  // ✅ 1. fetch eligible students
  const students = await getEligibleUnplacedStudents(jobId);

  if (!students.length) return 0;

  const emails = students.map((s) => s.user.email);
  const userIds = students.map((s) => s.userId);

  // ✅ 2. fetch job details
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

  // =========================
  // 🔥 SOCKET (REAL-TIME)
  // =========================
  emitToUsers(userIds, SOCKET_EVENTS.NEW_JOB, {
    jobId,
    title: job?.title,
    company: job?.company?.name,
    location: job?.location,
  });

  // =========================
  // 📧 EMAIL (FALLBACK)
  // =========================
  await sendEmailService({
    recipients: emails,
    subject,
    html: message,
  });

  return students.length;
};
