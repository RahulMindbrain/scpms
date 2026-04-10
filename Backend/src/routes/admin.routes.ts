import { Router } from "express";
import {
  createAdminController,
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

adminRoutes.get("/get-students", getStudentsController);

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
