import { sendEmailService } from "../../services/mail/mail.service";

export const triggerScheduleEmail = async (schedule, senderId, message) => {
  const isAdmin = schedule.createdBy === senderId;

  const recipient = isAdmin
    ? schedule.company.user.email
    : schedule.admin.user.email;

  await sendEmailService({
    to: recipient,
    subject: `Schedule Discussion: ${schedule.title}`,
    body: message,
  });
};
