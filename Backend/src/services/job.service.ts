import { getJobs } from "../repository/admin.repository";
import { getCompanyByUserId } from "../repository/company.repository";
import { getDepartmentsByIds } from "../repository/department.repository";
import { createJob, deleteJob, updateJob } from "../repository/job.repository";
import { getSkillsByIds } from "../repository/skill.repostiory";

export const createJobService = async (data: any, userId: number) => {
  const { eligibleDepartmentIds, skillIds } = data;

  const company = await getCompanyByUserId(userId);

  if (!company) {
    throw new Error("Company profile not found");
  }

  // ✅ Department validation (existing)
  if (eligibleDepartmentIds?.length) {
    const departments = await getDepartmentsByIds(eligibleDepartmentIds);

    const foundIds = departments.map((d) => d.id);

    const missingIds = eligibleDepartmentIds.filter(
      (id: number) => !foundIds.includes(id),
    );

    if (missingIds.length) {
      throw new Error(`Invalid department IDs: ${missingIds.join(", ")}`);
    }
  }

  // ✅ NEW: Skill validation
  if (skillIds?.length) {
    const skills = await getSkillsByIds(skillIds);

    const foundIds = skills.map((s) => s.id);

    const missingIds = skillIds.filter((id: number) => !foundIds.includes(id));

    if (missingIds.length) {
      throw new Error(`Invalid skill IDs: ${missingIds.join(", ")}`);
    }
  }

  return createJob({
    ...data,
    companyId: company.id,
  });
};

export const getJobsService = async (params: {
  page?: number;
  limit?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
}) => {
  const page = params.page ?? 1;

  const envLimit = Number(process.env.DEFAULT_PAGE_LIMIT);
  const finalLimit =
    params.limit ?? (Number.isFinite(envLimit) && envLimit > 0 ? envLimit : 10);

  return getJobs({
    page,
    limit: finalLimit,
    status: params.status,
  });
};

export const updateJobService = async (id: number, data: any) => {
  return updateJob(id, data);
};

export const deleteJobService = async (id: number) => {
  return deleteJob(id);
};
