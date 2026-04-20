import {
  createNotificationService,
  deleteNotificationService,
  getNotificationsService,
  markAsReadService,
} from "../services/notification.service";
import { sendError, sendSuccess } from "../utils/response";

import { Request, Response } from "express";

export const createNotificationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const data = await createNotificationService(req.body);
    return sendSuccess(res, 201, "Notification created", data);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

export const getNotificationsController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const user = res.locals.user;
    const data = await getNotificationsService(user.id);
    return sendSuccess(res, 200, "Notifications fetched", data);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

export const markAsReadController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await markAsReadService(Number(id));
    return sendSuccess(res, 200, "Marked as read", data);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

export const deleteNotificationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    await deleteNotificationService(Number(id));
    return sendSuccess(res, 200, "Deleted");
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};
