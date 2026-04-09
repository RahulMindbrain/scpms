import { JobStatus } from "@prisma/client";
import prisma from "../config/db";

export const createJob = async (data: any) => {
  const { eligibleDepartmentIds, companyId, ...rest } = data;

  return prisma.job.create({
    data: {
      ...rest,

      // ✅ REQUIRED
      company: {
        connect: { id: companyId },
      },

      // ✅ FIX relation mapping
      ...(eligibleDepartmentIds?.length && {
        eligibleDepartments: {
          connect: eligibleDepartmentIds.map((id: number) => ({ id })),
        },
      }),
    },
  });
};

export const getJobs = async (params: {
  page: number;
  limit: number;
  status?: JobStatus;
}) => {
  const { page, limit, status } = params;
  const skip = (page - 1) * limit;

  const where = {
    ...(status && { status }),
  };

  const [data, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { company: true },
    }),
    prisma.job.count({ where }),
  ]);

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const updateJob = async (id: number, data: any) => {
  return prisma.job.update({
    where: { id },
    data,
  });
};

export const deleteJob = async (id: number) => {
  return prisma.job.delete({ where: { id } });
};
