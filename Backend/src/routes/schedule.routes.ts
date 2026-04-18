import { Router } from "express";
import {
  createScheduleController,
  getAllSchedulesController,
  getScheduleByIdController,
  getCompanySchedulesController,
  updateScheduleController,
  deleteScheduleController,
  addJobsController,
  removeJobsController,
  updateScheduleApprovalController,
  getSchedulesForUserController,
} from "../controllers/schedule.controller";

import authenticateUser from "../middlewares/authenticateUser";
import { authorizeRoles } from "../middlewares/verifyRole";

import {
  getScheduleMessagesController,
  sendScheduleMessageController,
} from "../controllers/schedule.message.controller";

import { getScheduleApplicationsController } from "../controllers/application.controller";

const scheduleRoute = Router();

// =======================================================
// 🔹 ADMIN ROUTES
// =======================================================

scheduleRoute.post(
  "/",
  authenticateUser,
  authorizeRoles("ADMIN"),
  createScheduleController,
);

scheduleRoute.get(
  "/",
  authenticateUser,
  authorizeRoles("ADMIN"),
  getAllSchedulesController,
);

scheduleRoute.put(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN"),
  updateScheduleController,
);

scheduleRoute.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN"),
  deleteScheduleController,
);

scheduleRoute.post(
  "/:id/jobs",
  authenticateUser,
  authorizeRoles("ADMIN"),
  addJobsController,
);

scheduleRoute.delete(
  "/jobs",
  authenticateUser,
  authorizeRoles("ADMIN"),
  removeJobsController,
);

// =======================================================
// 🔹 COMPANY ROUTES
// =======================================================

scheduleRoute.get(
  "/company",
  authenticateUser,
  authorizeRoles("COMPANY"),
  getCompanySchedulesController,
);

// =======================================================
// 🔹 SPECIFIC ROUTES (VERY IMPORTANT ORDER)
// =======================================================

// 🔹 Get applications for a schedule
scheduleRoute.get(
  "/:id/applications",
  authenticateUser,
  authorizeRoles("ADMIN", "COMPANY"),
  getScheduleApplicationsController,
);

// 🔹 Messages
scheduleRoute.post(
  "/:id/messages",
  authenticateUser,
  authorizeRoles("ADMIN", "COMPANY"),
  sendScheduleMessageController,
);

scheduleRoute.get(
  "/:id/messages",
  authenticateUser,
  authorizeRoles("ADMIN", "COMPANY"),
  getScheduleMessagesController,
);

// 🔹 Approval
scheduleRoute.put(
  "/:id/approval",
  authenticateUser,
  authorizeRoles("COMPANY"),
  updateScheduleApprovalController,
);

// 🔹 Custom route (must come before /:id)
scheduleRoute.get(
  "/by-company-id",
  authenticateUser,
  authorizeRoles("ADMIN", "COMPANY"),
  getSchedulesForUserController,
);

// =======================================================
// 🔹 GENERIC ROUTE (ALWAYS LAST)
// =======================================================

scheduleRoute.get(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN", "COMPANY", "STUDENT"),
  getScheduleByIdController,
);

export default scheduleRoute;
