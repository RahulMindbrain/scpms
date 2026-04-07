import prisma from "../config/db";

const authUserSelect = {
  id: true,
  firstname: true,
  lastname: true,
  email: true,
  password: true,
  role: true,
  status: true,
};

export const findByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: authUserSelect,
  });
};

export const findById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: authUserSelect,
  });
};

export const getUserProfileByRole = async (
  userId: number,
  role: "STUDENT" | "COMPANY" | "ADMIN",
) => {
  if (role === "STUDENT") {
    return prisma.student.findUnique({
      where: { userId },
      select: {
        id: true,
        cgpa: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  if (role === "COMPANY") {
    return prisma.company.findUnique({
      where: { userId },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }

  if (role === "ADMIN") {
    return prisma.admin.findUnique({
      where: { userId },
      select: {
        id: true,
      },
    });
  }

  return null;
};

export const storeRefreshToken = async (
  userId: number,
  refreshToken: string,
) => {
  await prisma.token.updateMany({
    where: { userId },
    data: { status: "INACTIVE" },
  });

  return prisma.token.create({
    data: {
      userId,
      refreshToken,
      status: "ACTIVE",
    },
  });
};

export const validateRefreshToken = async (
  userId: number,
  refreshToken: string,
) => {
  return prisma.token.findFirst({
    where: {
      userId,
      refreshToken,
      status: "ACTIVE",
    },
  });
};

export const logoutRepo = async (userId: number) => {
  await prisma.token.updateMany({
    where: { userId },
    data: { status: "INACTIVE" },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { socketId: null },
  });

  return true;
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
