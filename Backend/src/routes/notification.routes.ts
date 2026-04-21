import { Router } from "express";
import {
  deleteNotificationController,
  getNotificationsController,
  getUnreadCountController,
  getUpcomingEventsController,
  markAllAsReadController,
  markAsReadController,
} from "../controllers/notification.controller";
import authenticateUser from "../middlewares/authenticateUser";
import { authorizeRoles } from "../middlewares/verifyRole";

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

notificationRouter.get(
  "/upcoming-events",
  authenticateUser,
  authorizeRoles("STUDENT"),
  getUpcomingEventsController,
);

export default notificationRouter;
