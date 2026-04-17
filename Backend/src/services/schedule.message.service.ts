import {
  createScheduleMessage,
  getScheduleMessages,
} from "../repository/schedule.message.repository";
import { getScheduleWithParticipants } from "../repository/schedule.repository";
import {
  resolveDirection,
  resolveParticipants,
} from "../utils/mails/mail.helper";
import { sendScheduleDiscussionEmail } from "./mail/mail.schedule.service";

export const sendScheduleMessageService = async (
  scheduleId: number,
  senderId: number,
  message: string,
) => {
  if (!message?.trim()) {
    throw new Error("Message cannot be empty");
  }

  // ✅ fetch from repo
  const schedule = await getScheduleWithParticipants(scheduleId);

  if (!schedule) {
    throw new Error("Schedule not found");
  }

  // ❗ communication allowed only before approval
  if (schedule.companyApprovalStatus !== "PENDING") {
    throw new Error("Communication closed for this schedule");
  }

  // ✅ resolve participants
  const participants = resolveParticipants(schedule);

  const { senderRole, senderName, recipientEmail } = resolveDirection(
    senderId,
    participants,
  );

  // ✅ persist message
  const savedMessage = await createScheduleMessage({
    scheduleId,
    senderId,
    message,
  });

  // ✅ async email trigger
  sendScheduleDiscussionEmail({
    schedule,
    senderRole,
    senderName,
    recipientEmail,
    message,
  }).catch(console.error);

  return savedMessage;
};

export const getScheduleMessagesService = async (
  scheduleId: number,
  userId: number,
) => {
  // ✅ 1. check schedule exists
  const schedule = await getScheduleWithParticipants(scheduleId);

  if (!schedule) {
    throw new Error("Schedule not found");
  }

  // ✅ 2. authorization (admin or company only)
  const participants = resolveParticipants(schedule);

  // reuse existing logic (clean)
  resolveDirection(userId, participants);

  // if not allowed → resolveDirection throws error

  // ✅ 3. fetch messages
  const messages = await getScheduleMessages(scheduleId);

  return messages;
};
