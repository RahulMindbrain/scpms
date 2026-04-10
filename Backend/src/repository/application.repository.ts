import { ApplicationStatus } from "@prisma/client";
import prisma from "../config/db";

export const createApplication = async (data: any) => {
  return prisma.application.create({ data });
};

export const getApplications = async (studentId: number) => {
  return prisma.application.findMany({
    where: { studentId },
    include: { job: true },
  });
};

export const updateApplicationStatus = async (
  id: number,
  status: ApplicationStatus,
) => {
  return prisma.application.update({
    where: { id },
    data: { status },
  });
};

export const deleteApplication = async (id: number) => {
  return prisma.application.delete({ where: { id } });
};
