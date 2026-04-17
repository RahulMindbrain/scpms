import { ApplicationStatus } from "@prisma/client";
import prisma from "../config/db";

export const createApplication = async (data: any) => {
  return prisma.application.create({ data });
};

export const getApplications = async (
  user: any,
  filters: any,
  page: number,
  limit: number,
) => {
  try {
    console.log(user);
    let where: any = {};

    // =========================
    // ROLE BASE FILTER
    // =========================

    if (user.role === "STUDENT") {
      where.studentId = user.studentId; // ✅ correct
    } else if (user.role === "COMPANY") {
      where.job = {
        companyId: user.companyId, // ✅ correct
      };
    } else if (user.role === "ADMIN") {
      // no restriction
    }
    console.log("WHERE:", where);
    // =========================
    // FILTERS
    // =========================

    if (filters.studentId) {
      where.studentId = filters.studentId;
    }

    if (filters.companyId) {
      where.job = {
        ...(where.job || {}),
        companyId: filters.companyId,
      };
    }

    if (filters.jobId) {
      where.jobId = filters.jobId;
    }

    if (filters.applicationId) {
      where.id = filters.applicationId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const skip = (page - 1) * limit;

    const [applications, totalCount, statusCounts] = await Promise.all([
      prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },

        // ✅ FIXED SELECT
        select: {
          id: true,
          status: true,
          createdAt: true,
          updatedAt: true,

          job: {
            select: {
              id: true,
              title: true,
              location: true,
              status: true,
              companyId: true,
            },
          },

          student: {
            select: {
              id: true,

              user: {
                select: {
                  firstname: true,
                  lastname: true,
                  email: true,
                },
              },

              department: {
                select: {
                  id: true,
                  name: true, // ✅ THIS IS WHAT YOU WANTED
                },
              },

              cgpa: true,
              activeBacklogs: true,
              isPlaced: true,
            },
          },
        },
      }),

      prisma.application.count({ where }),

      prisma.application.groupBy({
        by: ["status"],
        _count: { status: true },
        where,
      }),
    ]);

    return {
      applications,
      statusCounts,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit,
      },
    };
  } catch (error) {
    console.error("Repository Error:", error);
    throw error;
  }
};

export const updateApplicationStatus = async (id: number, status: any) => {
  return prisma.application.update({
    where: { id },
    data: { status },
    include: {
      student: {
        select: {
          userId: true,
        },
      },
      job: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

export const deleteApplication = async (id: number) => {
  return prisma.application.delete({ where: { id } });
};

export const getTotalPlacedStudents = async () => {
  return prisma.application.groupBy({
    by: ["studentId"],
    where: {
      status: "SELECTED",
    },
  });
};

export const getApplicationById = async (id: number) => {
  return prisma.application.findUnique({
    where: { id },
  });
};

export const acceptApplication = async (id: number) => {
  return prisma.application.update({
    where: { id },
    data: {
      isAccepted: true,
      acceptedAt: new Date(),
    },
  });
};

export const withdrawApplication = async (id: number) => {
  return prisma.application.update({
    where: { id },
    data: {
      status: "WITHDRAWN",
    },
  });
};

export const getApplicationByIdAndStudent = async (
  applicationId: number,
  studentId: number,
) => {
  return prisma.application.findFirst({
    where: {
      id: applicationId,
      studentId: studentId,
    },
  });
};

export const withdrawOtherApplications = async (
  studentId: number,
  acceptedApplicationId: number,
) => {
  return prisma.application.updateMany({
    where: {
      studentId: studentId,
      id: {
        not: acceptedApplicationId,
      },
      status: "SELECTED",
    },
    data: {
      status: "WITHDRAWN",
    },
  });
};
