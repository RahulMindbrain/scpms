import prisma from "../config/db";

export const getAdminCount = async () => {
  return prisma.admin.count();
};

export const createAdmin = async (userId: number) => {
  return prisma.admin.create({
    data: { userId },
  });
};

export const getAdminByUserId = async (userId: number) => {
  return prisma.admin.findUnique({
    where: { userId },
    select: { id: true },
  });
};

export const updateUsersStatus = async (
  userIds: number[],
  status: "ACTIVE" | "INACTIVE",
  role?: "STUDENT" | "COMPANY",
) => {
  return prisma.user.updateMany({
    where: {
      id: { in: userIds },
      ...(role && { role }),
    },
    data: { status },
  });
};

export const getPendingUsers = async () => {
  return prisma.user.findMany({
    where: { status: "INACTIVE" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstname: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

export const getPendingJobs = async () => {
  return prisma.job.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,

      company: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const getUsers = async (params: {
  page?: number;
  limit?: number;
  role?: "STUDENT" | "COMPANY" | "ADMIN";
  status?: "ACTIVE" | "INACTIVE";
}) => {
  const { page, limit, role, status } = params;

  const safePage = Math.max(1, page ?? 1);
  const safeLimit = Math.max(1, limit ?? 1);
  const skip = (safePage - 1) * safeLimit;

  const where = {
    ...(role && { role }),
    ...(status && { status }),
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
        role: true,
        status: true,
        createdAt: true,
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

export const getJobs = async (params: {
  page?: number;
  limit?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
}) => {
  const { page, limit, status } = params;

  const safePage = Math.max(1, page ?? 1);
  const safeLimit = Math.max(1, limit ?? 1);
  const skip = (safePage - 1) * safeLimit;

  const where = {
    ...(status && { status }),
  };

  const [data, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: safeLimit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        salary: true,
        location: true,
        createdAt: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.job.count({ where }),
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

export const getStudents = async (params: {
  page?: number;
  limit?: number;
  status?: "ACTIVE" | "INACTIVE";
}) => {
  const { page, limit, status } = params;

  const safePage = Math.max(1, page ?? 1);
  const safeLimit = Math.max(1, limit ?? 1);
  const skip = (safePage - 1) * safeLimit;

  const where = {
    role: "STUDENT",
    ...(status && { status }),
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
        email: true,
        status: true,
        student: {
          select: {
            id: true,
            cgpa: true,
            year: true,
            passingYear: true,
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

export const getCompanies = async (params: {
  page?: number;
  limit?: number;
  status?: "ACTIVE" | "INACTIVE";
}) => {
  const { page, limit, status } = params;

  const safePage = Math.max(1, page ?? 1);
  const safeLimit = Math.max(1, limit ?? 1);
  const skip = (safePage - 1) * safeLimit;

  const where = {
    role: "COMPANY",
    ...(status && { status }),
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
        email: true,
        status: true,
        company: {
          select: {
            id: true,
            name: true,
            description: true,
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

export const getActiveStudentsByYear = async (params: {
  page: number;
  limit: number;
  year?: number;
  passingYear?: number;
}) => {
  const { page, limit, year, passingYear } = params;

  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const skip = (safePage - 1) * safeLimit;

  const where: Prisma.StudentWhereInput = {
    ...(year !== undefined && { year }),
    ...(passingYear !== undefined && { passingYear }),

    user: {
      status: "ACTIVE",
    },
  };

  const [data, total] = await Promise.all([
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
    data,
    meta: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: safeLimit ? Math.ceil(total / safeLimit) : 0,
    },
  };
};

export const getUsersByRoleAndStatus = async ({
  role,
  status,
  page,
  limit,
}: {
  role: "STUDENT" | "COMPANY";
  status: "ACTIVE" | "INACTIVE";
  page: number;
  limit: number;
}) => {
  return prisma.user.findMany({
    where: {
      role,
      status,
    },
  });
};

export const activateUsers = async (userIds: number[]) => {
  return prisma.user.updateMany({
    where: {
      id: {
        in: userIds,
      },
      role: "STUDENT",
      status: "INACTIVE",
    },
    data: {
      status: "ACTIVE",
    },
  });
};
