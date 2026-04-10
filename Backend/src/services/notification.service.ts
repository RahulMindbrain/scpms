import {
  createNotification,
  deleteNotification,
  getNotifications,
  markAsRead,
} from "../repository/notification.repository";

// notification.service.ts
export const createNotificationService = async (data: any) => {
  return createNotification(data);
};

export const getNotificationsService = async (userId: number) => {
  return getNotifications(userId);
};

export const markAsReadService = async (id: number) => {
  return markAsRead(id);
};

export const deleteNotificationService = async (id: number) => {
  return deleteNotification(id);
};
