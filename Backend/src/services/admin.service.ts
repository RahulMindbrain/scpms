// services/admin.service.ts

import bcrypt from "bcrypt";
import { JobStatus, Role } from "@prisma/client";
import { createUser, getUsersByIds } from "../repository/user.repository";
import {
  activateUsers,
  createAdmin,
  getActiveStudentsByYear,
  getAdminCount,
  getStudents,
} from "../repository/admin.repository";
import { hashPassword } from "../utils/hashPassword";
import {
  getDeptWiseStats,
  getInactiveStudents,
  getInactiveStudentUsers,
  getSalaryDataRepo,
  getTotalPlacedStudentsRepo,
} from "../repository/student.repository";
import { sendSuccess } from "../utils/response";
import {
  activateCompanies,
  getCompanies,
  getCompanyById,
  getInactiveCompanies,
} from "../repository/company.repository";
import {
  getJobById,
  getJobsByIds,
  updateJobStatus,
  updateJobStatusBulk,
} from "../repository/job.repository";

export const createAdminService = async (
  firstname: string,
  lastname: string,
  email: string,
  password: string,
) => {
  const count = await getAdminCount();

  if (count > 0) {
    throw new Error("Admin already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await createUser({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    role: Role.ADMIN,
  });

  const admin = await createAdmin(user.id);

  return admin;
};

export const getStudentsService = async (params: {
  page?: number;
  limit?: number;
  passingYear?: number;
  year?: number;
  minCgpa?: number;
  maxCgpa?: number;
  departmentId?: number;
}) => {
  const DEFAULT_LIMIT = parseInt(process.env.DEFAULT_PAGE_LIMIT || "10", 10);
  const MAX_LIMIT = 50;

  let finalLimit = params.limit ?? DEFAULT_LIMIT;

  if (!finalLimit || finalLimit < 1) {
    finalLimit = DEFAULT_LIMIT;
  }

  if (finalLimit > MAX_LIMIT) {
    finalLimit = MAX_LIMIT;
  }

  let finalPage = params.page ?? 1;

  if (!finalPage || finalPage < 1) {
    finalPage = 1;
  }

  return getStudents({
    ...params,
    page: finalPage,
    limit: finalLimit,
  });
};

// export const getCompaniesService = async (params: {
//   page?: number;
//   limit?: number;
//   status?: "ACTIVE" | "INACTIVE";
// }) => {
//   const DEFAULT_LIMIT = parseInt(process.env.DEFAULT_PAGE_LIMIT || "10", 10);
//   const MAX_LIMIT = 50;

//   let finalLimit = params.limit ?? DEFAULT_LIMIT;

//   if (!finalLimit || finalLimit < 1) {
//     finalLimit = DEFAULT_LIMIT;
//   }

//   if (finalLimit > MAX_LIMIT) {
//     finalLimit = MAX_LIMIT;
//   }

//   let finalPage = params.page ?? 1;

//   if (!finalPage || finalPage < 1) {
//     finalPage = 1;
//   }

//   return getCompanies({
//     ...params,
//     page: finalPage,
//     limit: finalLimit,
//   });
// };

export const getActiveStudentsService = async (params: {
  page?: number;
  limit?: number;
  year?: number;
  passingYear?: number;
}) => {
  const DEFAULT_LIMIT = parseInt(process.env.DEFAULT_PAGE_LIMIT || "10", 10);
  const MAX_LIMIT = 50;

  let finalPage = params.page ?? 1;
  let finalLimit = params.limit ?? DEFAULT_LIMIT;

  if (finalPage < 1) finalPage = 1;
  if (finalLimit < 1) finalLimit = DEFAULT_LIMIT;
  if (finalLimit > MAX_LIMIT) finalLimit = MAX_LIMIT;

  // ✅ optional rule (recommended)
  if (params.year === undefined && params.passingYear === undefined) {
    throw new Error("Either year or passingYear must be provided");
  }

  return getActiveStudentsByYear({
    page: finalPage,
    limit: finalLimit,
    year: params.year,
    passingYear: params.passingYear,
  });
};

export const getInactiveStudentsService = async (params: {
  page?: number;
  limit?: number;
  passingYearFrom?: number;
}) => {
  const DEFAULT_LIMIT = parseInt(process.env.DEFAULT_PAGE_LIMIT || "10", 10);
  const MAX_LIMIT = 50;

  let page = params.page ?? 1;
  let limit = params.limit ?? DEFAULT_LIMIT;

  if (page < 1) page = 1;
  if (limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  return getInactiveStudentUsers({
    page,
    limit,
  });
};

export const getCompaniesService = async (params: {
  page?: number;
  limit?: number;
  status?: "ACTIVE" | "INACTIVE";
}) => {
  const DEFAULT_LIMIT = parseInt(process.env.DEFAULT_PAGE_LIMIT || "10", 10);
  const MAX_LIMIT = 50;

  let page = params.page ?? 1;
  let limit = params.limit ?? DEFAULT_LIMIT;

  if (page < 1) page = 1;
  if (limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  return getCompanies({
    page,
    limit,
    status: params.status,
  });
};

export const activateUsersService = async (userIds: number[]) => {
  if (!userIds || userIds.length === 0) {
    throw new Error("User IDs are required");
  }

  const users = await getUsersByIds(userIds);

  if (!users.length) {
    throw new Error("No users found");
  }

  const foundIds = users.map((u) => u.id);
  const missingIds = userIds.filter((id) => !foundIds.includes(id));

  if (missingIds.length) {
    throw new Error(`Users not found: ${missingIds.join(", ")}`);
  }

  const invalidUsers = users.filter(
    (u) => u.role !== "STUDENT" || u.status !== "INACTIVE",
  );

  if (invalidUsers.length) {
    throw new Error(
      `Invalid users (must be STUDENT & INACTIVE): ${invalidUsers.map((u) => u.id).join(", ")}`,
    );
  }

  const result = await activateUsers(userIds);

  return {
    updatedCount: result.count,
  };
};

export const getInactiveCompaniesService = async (params: {
  page?: number;
  limit?: number;
}) => {
  const DEFAULT_LIMIT = parseInt(process.env.DEFAULT_PAGE_LIMIT || "10", 10);
  const MAX_LIMIT = 50;

  let page = params.page ?? 1;
  let limit = params.limit ?? DEFAULT_LIMIT;

  if (page < 1) page = 1;
  if (limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  return getInactiveCompanies({ page, limit });
};

export const updateJobStatusByAdminService = async (
  jobIds: number[],
  status: JobStatus,
  adminId: number,
) => {
  // ✅ Validate status
  if (![JobStatus.APPROVED, JobStatus.REJECTED].includes(status)) {
    throw new Error("Invalid status. Only APPROVED or REJECTED allowed");
  }

  // ✅ Fetch jobs via repository
  const jobs = await getJobsByIds(jobIds);

  if (!jobs.length) {
    throw new Error("No jobs found");
  }

  // ✅ Validate all are PENDING
  const invalidJobs = jobs.filter((job) => job.status !== JobStatus.PENDING);

  if (invalidJobs.length) {
    throw new Error(
      `Some jobs already processed: ${invalidJobs.map((j) => j.id).join(", ")}`,
    );
  }

  // ✅ Single vs Bulk handling
  if (jobIds.length === 1) {
    return updateJobStatus(jobIds[0], status, adminId);
  }

  // ✅ Bulk
  return updateJobStatusBulk(jobIds, status, adminId);
};

export const activateCompaniesService = async (userIds: number[]) => {
  const users = await getUsersByIds(userIds);

  if (!users.length) {
    throw new Error("No users found");
  }

  const nonCompanyUsers = users.filter((u) => u.role !== "COMPANY");

  if (nonCompanyUsers.length) {
    throw new Error(
      `Some users are not companies: ${nonCompanyUsers
        .map((u) => u.id)
        .join(", ")}`,
    );
  }

  const alreadyActive = users.filter((u) => u.status === "ACTIVE");

  if (alreadyActive.length) {
    throw new Error(
      `Some companies already active: ${alreadyActive
        .map((u) => u.id)
        .join(", ")}`,
    );
  }

  if (userIds.length === 1) {
    return activateCompanies(userIds);
  }

  return activateCompanies(userIds);
};

export const getDashboardStatsService = async () => {
  try {
    const [students, totalPlaced, salaryData] = await Promise.all([
      getDeptWiseStats(),
      getTotalPlacedStudentsRepo(),
      getSalaryDataRepo(),
    ]);

    const deptMap: any = {};

    students.forEach((student) => {
      const dept = student.department.name;

      if (!deptMap[dept]) {
        deptMap[dept] = {
          total: 0,
          placed: 0,
        };
      }

      deptMap[dept].total++;

      if (student.applications.length > 0) {
        deptMap[dept].placed++;
      }
    });

    const deptStats = Object.entries(deptMap).map(([dept, data]: any) => ({
      department: dept,
      totalStudents: data.total,
      placedStudents: data.placed,
      percentage:
        data.total > 0
          ? Number(((data.placed / data.total) * 100).toFixed(2))
          : 0,
    }));

    let totalSalary = 0;

    const deptSalaryMap: any = {};

    salaryData.forEach((item) => {
      const salary = item.job.salary;
      const deptId = item.student.departmentId;

      totalSalary += salary;

      if (!deptSalaryMap[deptId]) {
        deptSalaryMap[deptId] = [];
      }

      deptSalaryMap[deptId].push(salary);
    });

    const avgSalary =
      salaryData.length > 0 ? Math.round(totalSalary / salaryData.length) : 0;

    const deptAvgSalary = Object.entries(deptSalaryMap).map(
      ([deptId, salaries]: any) => ({
        departmentId: Number(deptId),
        avgSalary: Math.round(
          salaries.reduce((a: number, b: number) => a + b, 0) / salaries.length,
        ),
      }),
    );

    return {
      totalPlacedStudents: totalPlaced,
      avgSalary,
      deptStats,
      deptAvgSalary,
    };
  } catch (error) {
    console.error("Dashboard Service Error:", error);
    throw error;
  }
};

export const getCompanyByIdServices = async (companyId: number) => {
  try {
    const company = await getCompanyById(companyId);

    return company;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
