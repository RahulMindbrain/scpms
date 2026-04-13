import { getJobBasicDetails } from "../repository/job.repository";
import {
  createNotification,
  deleteNotification,
  getNotifications,
  markAsRead,
} from "../repository/notification.repository";
import { getUnplacedStudents } from "../repository/student.repository";
import { sendEmailService } from "./mail.service";

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

export const notifyUnplacedStudentsForJob = async (
  jobId: number,
  customSubject?: string,
  customMessage?: string,
) => {
  const students = await getUnplacedStudents();

  if (!students.length) return 0;

  const emails = students.map((s) => s.user.email);

  const job = await getJobBasicDetails(jobId);

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

  await sendEmailService({
    recipients: emails,
    subject,
    html: message,
  });
  return students.length;
};
