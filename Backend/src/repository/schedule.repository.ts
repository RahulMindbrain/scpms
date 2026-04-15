import prisma from "../config/db";

const baseScheduleInclude = {
  job: {
    select: {
      id: true,
      title: true,
      eligibleDepartments: {
        select: { id: true },
      },
      company: {
        select: {
          id: true,
          name: true,
          userId: true,
        },
      },
    },
  },
  company: {
    select: {
      id: true,
      name: true,
      userId: true,
    },
  },
};

export const createInterviewSchedule = async (data: {
  jobId: number;
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
          OR: [{ companyId }, ...(venue ? [{ venue }] : [])],
        },
      ],
    },
  });
};

export const getScheduleById = async (id: number) => {
  return prisma.interviewSchedule.findUnique({
    where: { id },
    include: baseScheduleInclude,
  });
};

export const getAllSchedules = async () => {
  return prisma.interviewSchedule.findMany({
    include: baseScheduleInclude,
    orderBy: { startTime: "asc" },
  });
};

export const getCompanySchedules = async (companyId: number) => {
  return prisma.interviewSchedule.findMany({
    where: { companyId },
    include: baseScheduleInclude,
    orderBy: { startTime: "asc" },
  });
};

export const getStudentSchedules = async (student: {
  id: number;
  departmentId: number;
  isPlaced: boolean;
}) => {
  if (student.isPlaced) return [];

  return prisma.interviewSchedule.findMany({
    where: {
      job: {
        eligibleDepartments: {
          some: {
            id: student.departmentId,
          },
        },
      },
    },
    include: baseScheduleInclude,
    orderBy: { startTime: "asc" },
  });
};

export const deleteSchedule = async (id: number) => {
  return prisma.interviewSchedule.delete({
    where: { id },
  });
};

export const updateSchedule = async (
  id: number,
  data: Partial<{
    startTime: Date;
    endTime: Date;
    venue: string;
  }>,
) => {
  return prisma.interviewSchedule.update({
    where: { id },
    data,
    include: baseScheduleInclude,
  });
};
