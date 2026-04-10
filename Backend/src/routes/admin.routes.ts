import { Router } from "express";
import {
  activateCompaniesController,
  activateUsersController,
  createAdminController,
  getCompaniesController,
  getInactiveCompaniesController,
  getInactiveStudentsController,
  getStudentsController,
  updateJobStatusByAdminController,
} from "../controllers/admin.controller";
import { createUserController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import { adminSchema } from "../validators/auth.validator";
import authenticateUser from "../middlewares/authenticateUser";
import { authorizeRoles } from "../middlewares/verifyRole";
import { getJobsController } from "../controllers/job.controller";
import {
  getApplicationsController,
  updateApplicationController,
} from "../controllers/application.controller";

const adminRoutes = Router();

adminRoutes.post("/register", validate(adminSchema), createAdminController);

adminRoutes.get(
  "/get-students",
  authenticateUser,
  authorizeRoles("ADMIN"),
  getStudentsController,
);

adminRoutes.get(
  "/get-companies",
  authenticateUser,
  authorizeRoles("ADMIN"),
  getCompaniesController,
);

adminRoutes.get(
  "/get-inactive-students",
  authenticateUser,
  authorizeRoles("ADMIN"),
  getInactiveStudentsController,
);

adminRoutes.put(
  "/activate-users",
  authenticateUser,
  authorizeRoles("ADMIN"),
  activateUsersController,
);

adminRoutes.get(
  "/get-inactive-companies",
  authenticateUser,
  authorizeRoles("ADMIN"),
  getInactiveCompaniesController,
);

adminRoutes.put(
  "/activate-companies",
  authenticateUser,
  authorizeRoles("ADMIN"),
  activateCompaniesController,
);

adminRoutes.put(
  "/update-job-status",
  authenticateUser,
  authorizeRoles("ADMIN"),
  updateJobStatusByAdminController,
);

adminRoutes.get(
  "/get-jobs",
  authenticateUser,
  authorizeRoles("ADMIN"),
  getJobsController,
);

adminRoutes.get(
  "/get-jobs",
  authenticateUser,
  authorizeRoles("ADMIN"),
  getApplicationsController,
);

adminRoutes.put(
  "/get-jobs",
  authenticateUser,
  authorizeRoles("ADMIN"),
  updateApplicationController,
);

export default adminRoutes;
