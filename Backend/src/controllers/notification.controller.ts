import {
  createNotificationService,
  deleteNotificationService,
  getNotificationsService,
  markAsReadService,
} from "../services/notification.service";
import { sendSuccess } from "../utils/response";

import { Request, Response } from "express";

export const createNotificationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const data = await createNotificationService(req.body);
    return sendSuccess(res, 201, "Notification created", data);
  } catch (e) {
    return sendError(res, 400, e.message);
  }
};

export const getNotificationsController = async (
  _req: Request,
  res: Response,
) => {
  const user = res.locals.user;
  const data = await getNotificationsService(user.id);
  return sendSuccess(res, 200, "Notifications fetched", data);
};

export const markAsReadController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await markAsReadService(Number(id));
  return sendSuccess(res, 200, "Marked as read", data);
};

export const deleteNotificationController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  await deleteNotificationService(Number(id));
  return sendSuccess(res, 200, "Deleted");
};
