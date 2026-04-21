import { sendSuccess, sendError } from "../utils/response";
import { sendMail } from "../utils/mails/transporter.mail";
import { getEligibleUnplacedStudentsForJobs } from "../repository/student.repository";
import { getActiveJobsByCompanyId } from "../repository/job.repository";

export const sendBulkMailByCompanyService = async ({
  companyId,
  jobIds,
  subject,
  message,
}: {
  companyId: number;
  jobIds: number[];
  subject?: string;
  message?: string;
}) => {
  const jobs = await getActiveJobsByCompanyId(companyId);

  const selectedJobs = jobs.filter((j) => jobIds.includes(j.id));

  if (!selectedJobs.length) {
    throw new Error("No valid jobs selected");
  }

  const validJobIds = selectedJobs.map((j) => j.id);

  const students = await getEligibleUnplacedStudentsForJobs(validJobIds);

  if (!students.length) {
    return { sent: 0 };
  }

  const emails = students.map((s) => s.user.email);

  const jobTitles = selectedJobs.map((j) => j.title).join(", ");

  const finalSubject = subject || `New Opportunities Available`;

  const finalMessage =
    message ||
    `
      <p>New job opportunities are available.</p>
      <p><strong>Roles:</strong> ${jobTitles}</p>
      <p>Please login and apply.</p>
    `;

  await sendMail({
    to: emails,
    subject: finalSubject,
    html: finalMessage,
  });

  return {
    sent: students.length,
    jobs: jobTitles,
  };
};
