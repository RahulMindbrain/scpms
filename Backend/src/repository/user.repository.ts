import { Role, Status } from "@prisma/client";
import prisma from "../config/db";
import { TokenExpiredError } from "jsonwebtoken";

export const createUser = async (data: {
  firstname: string;
  lastname?: string;
  email: string;
  password: string;
  role: Role;
}) => {
  return prisma.user.create({
    data: {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
      role: data.role,

      status: data.role === Role.ADMIN ? Status.ACTIVE : Status.INACTIVE,
    },

    select: {
      id: true,
      firstname: true,
      email: true,
      role: true,
      status: true,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      status: true,
    },
  });
};

export const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      status: true,
    },
  });
};

export const checkUserProfile = async (userId: number, role: string) => {
  if (role === "STUDENT") {
    return prisma.student.findUnique({
      where: { userId },
      select: { id: true },
    });
  }

  if (role === "COMPANY") {
    return prisma.company.findUnique({
      where: { userId },
      select: { id: true },
    });
  }

  if (role === "ADMIN") {
    return prisma.admin.findUnique({
      where: { userId },
      select: { id: true },
    });
  }

  return null;
};

export const updateSocketId = async (
  userId: number,
  socketId: string | null,
) => {
  return prisma.user.update({
    where: { id: userId },
    data: { socketId },
  });
};

export const findActiveToken = async (userId: number, refreshToken: string) => {
  return prisma.token.findFirst({
    where: {
      userId,
      refreshToken: refreshToken,
      status: "ACTIVE",
    },
  });
};

export const updateUser = async (
  userId: number,
  data: Partial<{
    firstname: string;
    lastname?: string;
  }>,
) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      status: true,
    },
  });
};

export const getUsersByIds = async (userIds: number[]) => {
  return prisma.user.findMany({
    where: {
      id: { in: userIds },
    },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });
};
