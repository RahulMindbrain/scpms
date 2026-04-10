import { NotificationType } from "@prisma/client";
import prisma from "../config/db";

export const createNotification = async (data: {
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
}) => {
  return prisma.notification.create({ data });
};

export const getNotifications = async (userId: number) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const markAsRead = async (id: number) => {
  return prisma.notification.update({
    where: { id },
    data: { read: true },
  });
};

export const deleteNotification = async (id: number) => {
  return prisma.notification.delete({ where: { id } });
};
