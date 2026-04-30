import { getCompanyByUserId } from "../repository/company.repository";
import { getDepartmentsByIds } from "../repository/department.repository";
import {
  createJob,
  deleteJob,
  getJobs,
  updateJob,
} from "../repository/job.repository";
import { getSkillsByIds } from "../repository/skill.repostiory";
import { normalizeText } from "../utils/normalize.utils";

export const createJobService = async (data: any, userId: number) => {
  const { eligibleDepartmentIds, skillIds } = data;

  const company = await getCompanyByUserId(userId);

  if (data.title !== undefined) {
    data.title = normalizeText(data.title);
  }

  if (data.description !== undefined) {
    data.description = normalizeText(data.description);
  }

  if (data.location !== undefined) {
    data.location = normalizeText(data.location);
  }

  if (!company) {
    throw new Error("Company profile not found");
  }

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
  companyId?: number;
}) => {
  const page = params.page ?? 1;

  const envLimit = Number(process.env.DEFAULT_PAGE_LIMIT);
  const finalLimit =
    params.limit ?? (Number.isFinite(envLimit) && envLimit > 0 ? envLimit : 10);

  const query: {
    page: number;
    limit: number;
    status?: "PENDING" | "APPROVED" | "REJECTED";
    companyId?: number;
  } = {
    page,
    limit: finalLimit,
  };

  if (params.status !== undefined) {
    query.status = params.status;
  }

  if (params.companyId !== undefined) {
    query.companyId = params.companyId;
  }

  return getJobs(query);
};

export const updateJobService = async (id: number, data: any) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid job id");
  }

  if (data.title !== undefined) {
    data.title = normalizeText(data.title);
  }

  if (data.description !== undefined) {
    data.description = normalizeText(data.description);
  }

  if (data.location !== undefined) {
    data.location = normalizeText(data.location);
  }

  if (data.eligibleDepartmentIds?.length) {
    const departments = await getDepartmentsByIds(data.eligibleDepartmentIds);

    const foundIds = departments.map((d) => d.id);

    const missingIds = data.eligibleDepartmentIds.filter(
      (deptId: number) => !foundIds.includes(deptId),
    );

    if (missingIds.length) {
      throw new Error(`Invalid department IDs: ${missingIds.join(", ")}`);
    }
  }

  return updateJob(id, data);
};

export const deleteJobService = async (id: number) => {
  return deleteJob(id);
};
