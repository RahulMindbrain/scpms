import { JobStatus } from "@prisma/client";
import prisma from "../config/db";

export const createJob = async (data: any) => {
  const { eligibleDepartmentIds, skillIds, companyId, salary, ...rest } = data;

  if (!salary || salary <= 0) {
    throw new Error("Valid salary is required");
  }

  return prisma.job.create({
    data: {
      ...rest,
      salary,

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
  companyId?: number;
}) => {
  const { page, limit, status, companyId } = params;
  const skip = (page - 1) * limit;

  const where = {
    ...(status && { status }),
    ...(companyId && { companyId }),
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
        skills: true,
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
export const getJobById = async (id: number) => {
  return prisma.job.findUnique({
    where: { id },
    include: {
      company: {
        select: {
          userId: true,
          name: true,
        },
      },
    },
  });
};

export const getCompanyByUserId = async (userId: number) => {
  return prisma.company.findUnique({
    where: { userId },
  });
};

export const updateJob = async (id: number, data: any) => {
  const {
    addEligibleDepartmentIds,
    removeEligibleDepartmentIds,

    addSkillIds,
    removeSkillIds,

    salary,
    ...rest
  } = data;

  if (salary !== undefined && salary <= 0) {
    throw new Error("Salary must be positive");
  }

  const eligibleDepartmentOps: any = {};

  if (addEligibleDepartmentIds?.length) {
    eligibleDepartmentOps.connect = addEligibleDepartmentIds.map(
      (deptId: number) => ({ id: deptId }),
    );
  }

  if (removeEligibleDepartmentIds?.length) {
    eligibleDepartmentOps.disconnect = removeEligibleDepartmentIds.map(
      (deptId: number) => ({ id: deptId }),
    );
  }

  const skillOps: any = {};

  if (addSkillIds?.length) {
    skillOps.connect = addSkillIds.map((skillId: number) => ({ id: skillId }));
  }

  if (removeSkillIds?.length) {
    skillOps.disconnect = removeSkillIds.map((skillId: number) => ({
      id: skillId,
    }));
  }

  return prisma.job.update({
    where: { id },

    data: {
      ...rest,

      ...(salary !== undefined && { salary }),

      ...(Object.keys(eligibleDepartmentOps).length && {
        eligibleDepartments: eligibleDepartmentOps,
      }),

      ...(Object.keys(skillOps).length && {
        skills: skillOps,
      }),
    },

    include: {
      company: true,
      eligibleDepartments: true,
      skills: true,
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

// export const getJobsByIds = async (ids: number[]) => {
//   if (!ids.length) return [];
//   return prisma.job.findMany({
//     where: {
//       id: { in: ids },
//     },
//   });
// };

export const getJobsByIds = async (
  ids: number[],
  options?: {
    include?: any;
    select?: any;
  },
) => {
  if (!ids.length) return [];

  return prisma.job.findMany({
    where: {
      id: { in: ids },
    },
    ...(options?.include && { include: options.include }),
    ...(options?.select && { select: options.select }),
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

export const getJobDisplayDetails = async (id: number) => {
  return prisma.job.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      location: true,
      company: {
        select: {
          name: true,
          userId: true,
        },
      },
    },
  });
};

export const getJobEligibilityDetails = async (id: number) => {
  return prisma.job.findUnique({
    where: { id },
    select: {
      minCgpa: true,
      maxCgpa: true,
      maxBacklogs: true,
      eligibleDepartments: {
        select: {
          id: true,
        },
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

// job.repository.ts
export const getActiveJobsByCompanyId = async (companyId: number) => {
  return prisma.job.findMany({
    where: {
      companyId,
      status: "APPROVED",
    },
    select: {
      id: true,
      title: true,
      eligibleDepartments: {
        select: { id: true },
      },
    },
  });
};
