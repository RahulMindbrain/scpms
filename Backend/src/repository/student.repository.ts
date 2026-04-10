import prisma from "../config/db";
import { Prisma } from "@prisma/client";

export const createStudent = async (
  userId: number,
  departmentId: number,
  year: number,
  passingYear: number,
  cgpa?: number,
  resumeUrl?: string,
  skillIds?: number[],
  experiences?: any[],
  certificates?: any[],
) => {
  return prisma.student.create({
    data: {
      userId,
      departmentId,
      year,
      passingYear,
      ...(cgpa !== undefined && { cgpa }),
      ...(resumeUrl && { resumeUrl }),

      ...(skillIds?.length && {
        skills: {
          connect: skillIds.map((id: number) => ({ id })),
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
    include: {
      skills: true,
      experiences: true,
      certificates: true,
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
      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const updateStudent = async (userId: number, data: any) => {
  const { skillIds, experiences, certificates, ...rest } = data;

  const existing = await prisma.student.findUnique({
    where: { userId },
  });

  if (!existing) {
    throw new Error("Student profile not found");
  }

  return prisma.student.update({
    where: { userId },
    data: {
      // ✅ scalar fields
      ...rest,

      // ✅ skills (replace)
      ...(skillIds && {
        skills: {
          connect: skillIds.map((id: number) => ({ id })),
        },
      }),

      // ✅ experiences (replace strategy)
      ...(experiences && {
        experiences: {
          deleteMany: {}, // remove old
          create: experiences.map((exp: any) => ({
            ...exp,
            startDate: new Date(exp.startDate),
            ...(exp.endDate && { endDate: new Date(exp.endDate) }),
          })),
        },
      }),

      // ✅ certificates (replace strategy)
      ...(certificates && {
        certificates: {
          deleteMany: {},
          create: certificates.map((cert: any) => ({
            ...cert,
            ...(cert.issuedDate && {
              issuedDate: new Date(cert.issuedDate),
            }),
          })),
        },
      }),
    },
    include: {
      skills: true,
      experiences: true,
      certificates: true,
    },
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

export const getStudents = async (params: {
  page?: number;
  limit?: number;
  passingYear?: number;
  year?: number;
  minCgpa?: number;
  maxCgpa?: number;
  departmentId?: number;
}) => {
  const {
    page = 1,
    limit = 10,
    passingYear,
    year,
    minCgpa,
    maxCgpa,
    departmentId,
  } = params;

  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);

  const skip = (safePage - 1) * safeLimit;

  const where: Prisma.StudentWhereInput = {
    ...(passingYear !== undefined && { passingYear }),
    ...(year !== undefined && { year }),
    ...(departmentId !== undefined && { departmentId }),

    ...(minCgpa !== undefined || maxCgpa !== undefined
      ? {
          cgpa: {
            not: null,
            ...(minCgpa !== undefined && { gte: minCgpa }),
            ...(maxCgpa !== undefined && { lte: maxCgpa }),
          },
        }
      : {}),
  };

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      skip,
      take: safeLimit,
      orderBy: { createdAt: "desc" },

      select: {
        id: true,
        cgpa: true,
        year: true,
        passingYear: true,

        user: {
          select: {
            id: true,
            firstname: true,
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
      },
    }),

    prisma.student.count({ where }),
  ]);

  return {
    data: students,
    meta: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};
