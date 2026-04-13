import { JobStatus } from "@prisma/client";
import prisma from "../config/db";

export const createJob = async (data: any) => {
  const { eligibleDepartmentIds, skillIds, companyId, salary, ...rest } = data;

  // ✅ Validate salary
  if (!salary || salary <= 0) {
    throw new Error("Valid salary is required");
  }

  return prisma.job.create({
    data: {
      ...rest,
      salary, // ✅ explicitly include

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
      skills: true,
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
  const { eligibleDepartmentIds, salary, ...rest } = data;

  // ✅ Optional validation
  if (salary !== undefined && salary <= 0) {
    throw new Error("Salary must be positive");
  }

  return prisma.job.update({
    where: { id },
    data: {
      ...rest,
      ...(salary !== undefined && { salary }), // ✅ update salary safely

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

// export const getJobs = async (params: {
//   page: number;
//   limit: number;
//   status?: JobStatus;
//   minSalary?: number;
//   maxSalary?: number;
// }) => {
//   const { page, limit, status, minSalary, maxSalary } = params;

//   const where = {
//     ...(status && { status }),
//     ...(minSalary && { salary: { gte: minSalary } }),
//     ...(maxSalary && { salary: { lte: maxSalary } }),
//   };
