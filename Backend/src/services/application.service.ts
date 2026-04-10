import {
  createApplication,
  deleteApplication,
  getApplications,
  updateApplicationStatus,
} from "../repository/application.repository";
import {
  getApplicationByStudentAndJob,
  getJobById,
} from "../repository/job.repository";
import { getStudentByUserId } from "../repository/student.repository";

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

  if (job.minCgpa && student.cgpa && student.cgpa < job.minCgpa) {
    return createApplication({
      studentId: student.id,
      jobId,
      status: "NOT_ELIGIBLE",
      reason: "CGPA below requirement",
    });
  }

  return createApplication({
    studentId: student.id,
    jobId,
  });
};

export const getApplicationsService = async (studentId: number) => {
  return getApplications(studentId);
};

export const updateApplicationService = async (id: number, status: any) => {
  return updateApplicationStatus(id, status);
};

export const deleteApplicationService = async (id: number) => {
  return deleteApplication(id);
};
