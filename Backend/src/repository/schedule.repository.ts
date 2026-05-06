import { ScheduleStatus } from "@prisma/client";
import prisma from "../config/db";

const baseScheduleInclude = {
  company: {
    select: {
      id: true,
      name: true,
      userId: true,
    },
  },
  jobs: {
    select: {
      id: true,
      title: true,
      status: true,
      companyId: true,
    },
  },
};

export const createInterviewSchedule = async (data: {
  title: string;
  companyId: number;
  startTime: Date;
  endTime: Date;
  venue?: string;
  createdBy: number;
}) => {
  return prisma.interviewSchedule.create({
    data,
    include: baseScheduleInclude,
  });
};

export const attachJobsToSchedule = async (
  scheduleId: number,
  jobIds: number[],
) => {
  return prisma.job.updateMany({
    where: {
      id: { in: jobIds },
      interviewScheduleId: null,
    },
    data: {
      interviewScheduleId: scheduleId,
    },
  });
};

export const detachJobsFromSchedule = async (jobIds: number[]) => {
  return prisma.job.updateMany({
    where: {
      id: { in: jobIds },
    },
    data: {
      interviewScheduleId: null,
    },
  });
};

export const getScheduleById = async (id: number) => {
  return prisma.interviewSchedule.findUnique({
    where: { id },
    include: {
      company: true,
      admin: {
        include: {
          user: true,
        },
      },
      jobs: {
        select: { id: true },
      },
    },
  });
};

export const getAllSchedules = async (companyId: number) => {
  return prisma.interviewSchedule.findMany({
    where: {
      companyId,
    },
    include: baseScheduleInclude,
    orderBy: {
      startTime: "asc",
    },
  });
};

export const getSchedulesByCompany = async (companyId: number) => {
  return prisma.interviewSchedule.findMany({
    where: { companyId },
    include: baseScheduleInclude,
    orderBy: { startTime: "asc" },
  });
};

export const getUpcomingSchedules = async () => {
  const now = new Date();

  return prisma.interviewSchedule.findMany({
    where: {
      endTime: {
        gte: now,
      },
    },
    include: baseScheduleInclude,
    orderBy: { startTime: "asc" },
  });
};

export const getOngoingSchedules = async () => {
  const now = new Date();

  return prisma.interviewSchedule.findMany({
    where: {
      startTime: { lte: now },
      endTime: { gte: now },
    },
    include: baseScheduleInclude,
  });
};

export const updateSchedule = async (
  id: number,
  data: Partial<{
    title: string;
    startTime: Date;
    endTime: Date;
    venue: string;
    status: ScheduleStatus;
  }>,
) => {
  return prisma.interviewSchedule.update({
    where: { id },
    data,
    include: baseScheduleInclude,
  });
};

export const deleteSchedule = async (id: number) => {
  return prisma.interviewSchedule.delete({
    where: { id },
  });
};

export const checkScheduleConflict = async (
  startTime: Date,
  endTime: Date,
  companyId: number,
  venue?: string,
) => {
  return prisma.interviewSchedule.findFirst({
    where: {
      AND: [
        {
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
        {
          OR: [{ companyId: companyId }, ...(venue ? [{ venue: venue }] : [])],
        },
      ],
    },
  });
};

export const createScheduleWithJobs = async (
  scheduleData: {
    title: string;
    companyId: number;
    universityId?: number;
    startTime: Date;
    endTime: Date;
    venue?: string;
    createdBy: number;
  },
  jobIds: number[],
) => {
  return prisma.$transaction(async (tx) => {
    const schedule = await tx.interviewSchedule.create({
      data: scheduleData,
    });

    const updated = await tx.job.updateMany({
      where: {
        id: { in: jobIds },
        interviewScheduleId: null,
      },
      data: {
        interviewScheduleId: schedule.id,
      },
    });

    if (updated.count !== jobIds.length) {
      throw new Error("Some jobs were already scheduled");
    }

    return tx.interviewSchedule.findUnique({
      where: { id: schedule.id },
      include: baseScheduleInclude,
    });
  });
};

export const getScheduleWithParticipants = async (scheduleId: number) => {
  return prisma.interviewSchedule.findUnique({
    where: { id: scheduleId },
    include: {
      company: {
        include: {
          user: true,
        },
      },
      admin: {
        include: {
          user: true,
        },
      },
    },
  });
};

export const getScheduleWithJobsAndApplications = async (
  scheduleId: number,
) => {
  return prisma.interviewSchedule.findUnique({
    where: { id: scheduleId },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          userId: true,
        },
      },
      jobs: {
        select: {
          id: true,
          title: true,
          applications: {
            select: {
              id: true,
              student: {
                select: {
                  id: true,
                  user: {
                    select: {
                      id: true,
                      firstname: true,
                      lastname: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};

export const updateScheduleApprovalStatus = async (
  scheduleId: number,
  data: {
    companyApprovalStatus: "APPROVED" | "REJECTED";
    approvedAt?: Date;
    rejectedAt?: Date;
    rejectionReason?: string | null;
  },
) => {
  return prisma.interviewSchedule.update({
    where: { id: scheduleId },
    data,
  });
};

export const getSchedulesByCompanyIdRepo = async (companyId: number) => {
  return prisma.interviewSchedule.findMany({
    where: {
      companyId,
      //companyApprovalStatus: "APPROVED",
    },
    include: {
      jobs: true,
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { startTime: "asc" },
  });
};

// export const getUpcomingSchedulesForStudent = async (studentId: number) => {
//   const now = new Date();

//   return prisma.interviewSchedule.findMany({
//     where: {
//       startTime: {
//         gte: now,
//       },
//       jobs: {
//         some: {
//           applications: {
//             some: {
//               studentId,
//             },
//           },
//         },
//       },
//     },
//     include: {
//       company: {
//         select: {
//           id: true,
//           name: true,
//         },
//       },
//       jobs: {
//         select: {
//           id: true,
//           title: true,
//         },
//       },
//     },
//     orderBy: {
//       startTime: "asc",
//     },
//   });
// };

export const getUpcomingSchedulesForStudent = async (
  studentId: number,
  skip: number,
  take: number,
  page: number,
) => {
  const now = new Date();

  const where = {
    startTime: {
      gte: now,
    },

    jobs: {
      some: {
        applications: {
          some: {
            studentId,
          },
        },
      },
    },
  };

  const [items, total] = await prisma.$transaction([
    prisma.interviewSchedule.findMany({
      where,

      include: {
        company: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },

        jobs: {
          where: {
            applications: {
              some: {
                studentId,
              },
            },
          },

          select: {
            id: true,
            title: true,
            description: true,
            salary: true,
            location: true,
            status: true,
            minCgpa: true,
            maxCgpa: true,
            maxBacklogs: true,
            createdAt: true,

            skills: {
              select: {
                id: true,
                name: true,
              },
            },

            eligibleDepartments: {
              select: {
                id: true,
                name: true,
              },
            },

            applications: {
              where: {
                studentId,
              },
              select: {
                id: true,
                status: true,
                isAccepted: true,
                acceptedAt: true,
                createdAt: true,
              },
            },
          },
        },
      },

      orderBy: {
        startTime: "asc",
      },

      skip,
      take,
    }),

    prisma.interviewSchedule.count({
      where,
    }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  };
};

export const getUpcomingSchedulesForCompany = async (
  companyId: number,
  skip: number,
  take: number,
  page: number,
) => {
  const now = new Date();

  const where = {
    companyId,
    startTime: {
      gte: now,
    },
  };

  const [items, total] = await prisma.$transaction([
    prisma.interviewSchedule.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },

        jobs: {
          select: {
            id: true,
            title: true,
            description: true,
            salary: true,
            location: true,
            status: true,
            minCgpa: true,
            maxCgpa: true,
            maxBacklogs: true,
            createdAt: true,

            skills: {
              select: {
                id: true,
                name: true,
              },
            },

            eligibleDepartments: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },

      orderBy: {
        startTime: "asc",
      },

      skip,
      take,
    }),

    prisma.interviewSchedule.count({
      where,
    }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  };
};

export const getUpcomingSchedulesForAdmin = async (
  userId: number,
  skip: number,
  take: number,
  page: number,
) => {
  const now = new Date();

  const admin = await prisma.admin.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!admin) {
    throw new Error("Admin not found");
  }

  const where = {
    createdBy: admin.id,
    startTime: {
      gte: now,
    },
  };

  const [items, total] = await prisma.$transaction([
    prisma.interviewSchedule.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },

        jobs: {
          select: {
            id: true,
            title: true,
            description: true,
            salary: true,
            location: true,
            status: true,
            minCgpa: true,
            maxCgpa: true,
            maxBacklogs: true,
            createdAt: true,

            skills: {
              select: {
                id: true,
                name: true,
              },
            },

            eligibleDepartments: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },

      orderBy: {
        startTime: "asc",
      },

      skip,
      take,
    }),

    prisma.interviewSchedule.count({
      where,
    }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  };
};
