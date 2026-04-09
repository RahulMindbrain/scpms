import prisma from "../config/db";
import { Prisma } from "@prisma/client";

// export const createStudent = async (
//   userId: number,
//   departmentId: number,
//   year: number,
//   passingYear: number,
//   cgpa?: number,
// ) => {
//   return prisma.student.create({
//     data: {
//       userId,
//       departmentId,
//       year,
//       passingYear,
//       ...(cgpa !== undefined && { cgpa }),
//     },
//   });
// };

export const createStudent = async (
  userId: number,
  departmentId: number,
  year: number,
  passingYear: number,
  cgpa?: number,
  resumeUrl?: string,
  skills?: string[],
  experiences?: {
    companyName: string;
    role: string;
    description?: string;
    startDate: string;
    endDate?: string;
  }[],
  certificates?: {
    title: string;
    issuer: string;
    certificateUrl?: string;
    issuedDate?: string;
  }[],
) => {
  return prisma.student.create({
    data: {
      userId,
      departmentId,
      year,
      passingYear,

      ...(cgpa !== undefined && { cgpa }),
      ...(resumeUrl && { resumeUrl }),

      ...(skills?.length && {
        skills: {
          connectOrCreate: skills.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      }),

      ...(experiences?.length && {
        experiences: {
          create: experiences.map((exp) => ({
            ...exp,
            startDate: new Date(exp.startDate),
            ...(exp.endDate && { endDate: new Date(exp.endDate) }),
          })),
        },
      }),

      ...(certificates?.length && {
        certificates: {
          create: certificates.map((cert) => ({
            ...cert,
            ...(cert.issuedDate && {
              issuedDate: new Date(cert.issuedDate),
            }),
          })),
        },
      }),
    },
  });
};

export const getStudentByUserId = async (userId: number) => {
  return prisma.student.findUnique({
    where: { userId },
    select: {
      id: true,
      cgpa: true,
      year: true,
      passingYear: true,
      resumeUrl: true,

      department: {
        select: {
          id: true,
          name: true,
        },
      },

      // ✅ ADD THESE

      skills: {
        select: {
          id: true,
          name: true,
        },
      },

      experiences: {
        select: {
          id: true,
          companyName: true,
          role: true,
          description: true,
          startDate: true,
          endDate: true,
        },
        orderBy: {
          startDate: "desc",
        },
      },

      certificates: {
        select: {
          id: true,
          title: true,
          issuer: true,
          certificateUrl: true,
          issuedDate: true,
        },
        orderBy: {
          issuedDate: "desc",
        },
      },
    },
  });
};

export const updateStudent = async (
  userId: number,
  data: {
    cgpa?: number;
    departmentId?: number;
    year?: number;
    passingYear?: number;
  },
) => {
  const existing = await prisma.student.findUnique({
    where: { userId },
  });

  if (!existing) {
    throw new Error("Student profile not found");
  }

  return prisma.student.update({
    where: { userId },
    data,
  });
};

export const getStudentDetails = async (userId: number) => {
  return prisma.student.findUnique({
    where: { userId },
    select: {
      id: true,
      cgpa: true,
      year: true,
      passingYear: true,
      createdAt: true,

      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          status: true,
        },
      },

      department: {
        select: {
          id: true,
          name: true,
        },
      },

      applications: {
        select: {
          id: true,
          status: true,
          createdAt: true,

          job: {
            select: {
              id: true,
              title: true,
              location: true,
              salary: true,

              company: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const getInactiveStudentUsers = async (params: {
  page: number;
  limit: number;
}) => {
  const { page, limit } = params;

  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const skip = (safePage - 1) * safeLimit;

  const where: Prisma.UserWhereInput = {
    role: "STUDENT",
    status: "INACTIVE",
  };

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: safeLimit,
      orderBy: { createdAt: "desc" },

      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        status: true,
        createdAt: true,

        // ✅ include student if exists
        student: {
          select: {
            id: true,
            year: true,
            passingYear: true,
            cgpa: true,
          },
        },
      },
    }),

    prisma.user.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: safeLimit ? Math.ceil(total / safeLimit) : 0,
    },
  };
};
