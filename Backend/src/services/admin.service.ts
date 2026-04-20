// services/admin.service.ts

import bcrypt from "bcrypt";
import {
  Company,
  Job,
  JobStatus,
  NotificationType,
  Role,
} from "@prisma/client";
import { createUser, getUsersByIds } from "../repository/user.repository";
import {
  activateUsers,
  createAdmin,
  getActiveStudentsByYear,
  getAdminCount,
  getJobs,
  getStudents,
} from "../repository/admin.repository";
import { hashPassword } from "../utils/hashPassword";
import {
  getDeptWiseStats,
  getEligibleUnplacedStudents,
  // getInactiveStudents,
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
import { sendEmailService } from "./mail/mail.service";
import { emitToUsers } from "../socket";
import { SOCKET_EVENTS } from "../socket.event";
import { createManyNotifications } from "../repository/notification.repository";
import { runInBackground } from "../utils/Background.task";

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

  const query: {
    page: number;
    limit: number;
    year?: number;
    passingYear?: number;
  } = {
    page: finalPage,
    limit: finalLimit,
  };

  if (params.year !== undefined) {
    query.year = params.year;
  }

  if (params.passingYear !== undefined) {
    query.passingYear = params.passingYear;
  }

  return getActiveStudentsByYear(query);
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

  const query: {
    page: number;
    limit: number;
    status?: "ACTIVE" | "INACTIVE";
  } = {
    page,
    limit,
  };

  if (params.status !== undefined) {
    query.status = params.status;
  }

  return getCompanies(query);
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
  if (
    !([JobStatus.APPROVED, JobStatus.REJECTED] as JobStatus[]).includes(status)
  ) {
    throw new Error("Invalid status. Only APPROVED or REJECTED allowed");
  }

  const jobs = (await getJobsByIds(jobIds, {
    include: {
      company: true,
    },
  })) as (Job & { company: Company })[];

  if (!jobs.length) {
    throw new Error("No jobs found");
  }

  const invalidJobs = jobs.filter((job) => job.status !== JobStatus.PENDING);

  if (invalidJobs.length) {
    throw new Error(
      `Some jobs already processed: ${invalidJobs.map((j) => j.id).join(", ")}`,
    );
  }

  const result =
    jobIds.length === 1
      ? await updateJobStatus(jobIds[0]!, status, adminId)
      : await updateJobStatusBulk(jobIds, status, adminId);

  if (status === JobStatus.APPROVED) {
    runInBackground(async () => {
      await Promise.all(
        jobs.map(async (job) => {
          try {
            const students = await getEligibleUnplacedStudents(job.id);

            if (!students.length) return;

            const userIds = students.map((s) => s.userId);
            const emails = students.map((s) => s.user.email);

            emitToUsers(userIds, SOCKET_EVENTS.NEW_JOB, {
              jobId: job.id,
              title: job.title,
              company: job.company.name,
              location: job.location,
            });

            await sendEmailService({
              recipients: emails,
              subject: `New Job Opportunity: ${job.title}`,
              html: `
                <p>A new job has been posted.</p>
                <p><strong>${job.title}</strong> at ${job.company.name}</p>
              `,
            });

            await createManyNotifications(
              userIds.map((userId) => ({
                userId,
                title: "New Job Posted",
                message: `New job: ${job.title} at ${job.company.name}`,
                type: NotificationType.JOB_POSTED,
              })),
            );
          } catch (err) {
            console.error(`Notification failed for job ${job.id}`, err);
          }
        }),
      );
    });
  }

  return result;
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

export const getJobsByCompanyIdServices = async (params: {
  companyId: number;
  page: number;
  limit: number;
  status?: JobStatus;
}) => {
  try {
    const query: {
      page: number;
      limit: number;
      status?: JobStatus;
      companyId: number;
    } = {
      page: params.page,
      limit: params.limit,
      companyId: params.companyId,
    };

    if (params.status !== undefined) {
      query.status = params.status;
    }

    const jobs = await getJobs(query);
    return jobs;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
