import { JobStatus } from "@prisma/client";
import prisma from "../config/db";

export const createJob = async (data: any) => {
  const { eligibleDepartmentIds, skillIds, companyId, ...rest } = data;

  return prisma.job.create({
    data: {
      ...rest,

      company: {
        connect: { id: companyId },
      },

      ...(eligibleDepartmentIds?.length && {
        eligibleDepartments: {
          connect: eligibleDepartmentIds.map((id: number) => ({ id })),
        },
      }),

      ...(skillIds?.length && {
        skills: {
          connect: skillIds.map((id: number) => ({ id })),
        },
      }),
    },

    include: {
      company: true,
      eligibleDepartments: true,
      skills: true, // include for response
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
      include: {
        company: true,
        eligibleDepartments: true,
      },
    }),
    prisma.job.count({ where }),
  ]);

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const getJobById = async (id: number) => {
  return prisma.job.findUnique({
    where: { id },
    include: {
      company: true,
      eligibleDepartments: true,
    },
  });
};

export const getCompanyByUserId = async (userId: number) => {
  return prisma.company.findUnique({
    where: { userId },
  });
};

export const updateJob = async (id: number, data: any) => {
  const { eligibleDepartmentIds, ...rest } = data;

  return prisma.job.update({
    where: { id },
    data: {
      ...rest,

      ...(eligibleDepartmentIds && {
        eligibleDepartments: {
          set: eligibleDepartmentIds.map((id: number) => ({ id })),
        },
      }),
    },
    include: {
      company: true,
      eligibleDepartments: true,
    },
  });
};

export const deleteJob = async (id: number) => {
  return prisma.job.delete({ where: { id } });
};

export const updateJobStatus = async (
  id: number,
  status: JobStatus,
  approvedBy: number,
) => {
  return prisma.job.update({
    where: { id },
    data: {
      status,
      approvedBy,
    },
    include: {
      company: true,
      eligibleDepartments: true,
    },
  });
};

export const updateJobStatusBulk = async (
  ids: number[],
  status: JobStatus,
  approvedBy: number,
) => {
  return prisma.job.updateMany({
    where: {
      id: { in: ids },
    },
    data: {
      status,
      approvedBy,
    },
  });
};

export const getPendingJobs = async (params: {
  page: number;
  limit: number;
}) => {
  const { page, limit } = params;
  const skip = (page - 1) * limit;

  const where = {
    status: JobStatus.PENDING,
  };

  const [data, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        company: true,
        eligibleDepartments: true,
      },
    }),
    prisma.job.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getRejectedJobs = async (params: {
  page: number;
  limit: number;
}) => {
  const { page, limit } = params;
  const skip = (page - 1) * limit;

  const where = {
    status: JobStatus.REJECTED,
  };

  const [data, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        company: true,
        eligibleDepartments: true,
      },
    }),
    prisma.job.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getJobsByIds = async (ids: number[]) => {
  if (!ids.length) return [];
  return prisma.job.findMany({
    where: {
      id: { in: ids },
    },
  });
};

export const getApplicationByStudentAndJob = async (
  studentId: number,
  jobId: number,
) => {
  return prisma.application.findUnique({
    where: {
      studentId_jobId: {
        studentId,
        jobId,
      },
    },
  });
};
