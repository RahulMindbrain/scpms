import { Router } from "express";
import {
  deleteNotificationController,
  getNotificationsController,
  getUnreadCountController,
  markAllAsReadController,
  markAsReadController,
} from "../controllers/notification.controller";
import authenticateUser from "../middlewares/authenticateUser";

const notificationRouter = Router();

notificationRouter.get("/", authenticateUser, getNotificationsController);

notificationRouter.get(
  "/unread-count",
  authenticateUser,
  getUnreadCountController,
);

notificationRouter.put(
  "/mark-all-read",
  authenticateUser,
  markAllAsReadController,
);

notificationRouter.put("/:id/read", authenticateUser, markAsReadController);

notificationRouter.delete(
  "/:id",
  authenticateUser,
  deleteNotificationController,
);

export default notificationRouter;
