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

export const getAllSchedules = async () => {
  return prisma.interviewSchedule.findMany({
    include: baseScheduleInclude,
    orderBy: { startTime: "asc" },
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

    await tx.job.updateMany({
      where: {
        id: { in: jobIds },
        interviewScheduleId: null,
      },
      data: {
        interviewScheduleId: schedule.id,
      },
    });

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
      companyApprovalStatus: "APPROVED",
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

export const getUpcomingSchedulesForStudent = async (studentId: number) => {
  const now = new Date();

  return prisma.interviewSchedule.findMany({
    where: {
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
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
        },
      },
      jobs: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });
};
