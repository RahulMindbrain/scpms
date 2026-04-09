import { getJobs } from "../repository/admin.repository";
import { createJob, deleteJob, updateJob } from "../repository/job.repository";

export const createJobService = async (data: any, userId: number) => {
  // ✅ Resolve company from user
  const company = userId;

  if (!company) {
    throw new Error("Company profile not found");
  }

  // ✅ Pass clean structured data to repo
  return createJob({
    ...data,
    companyId: company,
  });
};

export const getJobsService = async (params: any) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  return getJobs({ ...params, page, limit });
};

export const updateJobService = async (id: number, data: any) => {
  return updateJob(id, data);
};

export const deleteJobService = async (id: number) => {
  return deleteJob(id);
};
