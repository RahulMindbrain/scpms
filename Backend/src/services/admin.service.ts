// services/admin.service.ts

import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import { createUser } from "../repository/user.repository";
import {
  activateUsers,
  createAdmin,
  getActiveStudentsByYear,
  getAdminCount,
  getStudents,
} from "../repository/admin.repository";
import { hashPassword } from "../utils/hashPassword";
import {
  getInactiveStudents,
  getInactiveStudentUsers,
} from "../repository/student.repository";
import { sendSuccess } from "../utils/response";
import {
  activateCompanies,
  getCompanies,
  getInactiveCompanies,
} from "../repository/company.repository";

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
