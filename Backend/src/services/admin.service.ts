// services/admin.service.ts

import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import { createUser } from "../repository/user.repository";
import { createAdmin, getAdminCount } from "../repository/admin.repository";
import { hashPassword } from "../utils/hashPassword";
import { getStudents } from "../repository/student.repository";

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
