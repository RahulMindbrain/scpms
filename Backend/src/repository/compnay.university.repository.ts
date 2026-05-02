import prisma from "../config/db";
import { CompanyApprovalStatus } from "@prisma/client";

// export const createCompanyUniversityRequest = async (
//   companyId: number,
//   universityId: number,
// ) => {
//   return prisma.companyUniversity.create({
//     data: {
//       companyId,
//       universityId,
//       status: CompanyApprovalStatus.PENDING,
//     },
//     select: {
//       id: true,
//       companyId: true,
//       universityId: true,
//       status: true,
//       createdAt: true,
//     },
//   });
// };

export const createCompanyUniversityRequest = async (
  companyId: number,
  universityIds: number[],
) => {
  return prisma.companyUniversity.createMany({
    data: universityIds.map((id) => ({
      companyId,
      universityId: id,
      status: CompanyApprovalStatus.PENDING,
    })),
    skipDuplicates: true,
  });
};

export const getCompanyUniversityByPair = async (
  companyId: number,
  universityId: number,
) => {
  return prisma.companyUniversity.findUnique({
    where: {
      companyId_universityId: { companyId, universityId },
    },
  });
};

export const getCompanyRequests = async (companyId: number) => {
  return prisma.companyUniversity.findMany({
    where: { companyId },
    include: {
      university: {
        select: {
          id: true,
          name: true,
          city: true,
          state: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getRequestsByUniversity = async (
  universityId: number,
  status?: CompanyApprovalStatus,
) => {
  return prisma.companyUniversity.findMany({
    where: {
      universityId,
      ...(status ? { status } : {}),
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          user: {
            select: {
              email: true,
              status: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateCompanyRequestStatus = async (
  ids: number[],
  status: CompanyApprovalStatus,
  adminId: number,
) => {
  const now = new Date();

  return prisma.companyUniversity.updateMany({
    where: {
      id: { in: ids },
      status: CompanyApprovalStatus.PENDING,
    },
    data: {
      status,
      approvedBy: adminId,
      ...(status === CompanyApprovalStatus.APPROVED && { approvedAt: now }),
      ...(status === CompanyApprovalStatus.REJECTED && { rejectedAt: now }),
    },
  });
};

export const findExistingCompanyUniversityPairs = async (
  companyId: number,
  universityIds: number[],
) => {
  return prisma.companyUniversity.findMany({
    where: {
      companyId,
      universityId: { in: universityIds },
    },
    select: {
      universityId: true,
      status: true,
    },
  });
};

// export const updateCompanyRequestStatus = async (
//   ids: number[],
//   status: CompanyApprovalStatus,
//   adminId: number,
//   universityId: number,
// ) => {
//   const now = new Date();

//   return prisma.companyUniversity.updateMany({
//     where: {
//       id: { in: ids },
//       universityId,
//       status: CompanyApprovalStatus.PENDING,
//     },
//     data: {
//       status,
//       approvedBy: adminId,
//       ...(status === CompanyApprovalStatus.APPROVED && { approvedAt: now }),
//       ...(status === CompanyApprovalStatus.REJECTED && { rejectedAt: now }),
//     },
//   });
// };
