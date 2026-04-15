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
} from "../controllers/schedule.controller";
import authenticateUser from "../middlewares/authenticateUser";
import { authorizeRoles } from "../middlewares/verifyRole";

const scheduleRoute = Router();

// =======================================================
// 🔹 ADMIN ROUTES
// =======================================================

// Create schedule
scheduleRoute.post(
  "/",
  authenticateUser,
  authorizeRoles("ADMIN"),
  createScheduleController,
);

// Get all schedules
scheduleRoute.get(
  "/",
  authenticateUser,
  authorizeRoles("ADMIN"),
  getAllSchedulesController,
);

// Update schedule
scheduleRoute.put(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN"),
  updateScheduleController,
);

// Delete schedule
scheduleRoute.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN"),
  deleteScheduleController,
);

// Add jobs to schedule
scheduleRoute.post(
  "/:id/jobs",
  authenticateUser,
  authorizeRoles("ADMIN"),
  addJobsController,
);

// Remove jobs from schedule
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
// 🔹 COMMON (ALL ROLES CAN VIEW BY ID)
// =======================================================

scheduleRoute.get(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN", "COMPANY", "STUDENT"),
  getScheduleByIdController,
);

export default scheduleRoute;
