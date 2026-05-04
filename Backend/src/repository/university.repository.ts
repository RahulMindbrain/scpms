import prisma from "../config/db";

export const getUniversitiesByIds = async (ids: number[]) => {
  return prisma.university.findMany({
    where: {
      id: { in: ids },
    },
    select: {
      id: true,
      name: true,
      status: true,
    },
  });
};

export const getUniversityByAdminId = async (adminId: number) => {
  return prisma.admin.findUnique({
    where: { id: adminId },
    select: {
      id: true,
      university: {
        select: {
          id: true,
          name: true,
          code: true,
          city: true,
          state: true,
          country: true,
          status: true,
        },
      },
    },
  });
};
