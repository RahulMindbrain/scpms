import { Router } from "express";
import {
  activateCompaniesController,
  activateUsersController,
  getCompaniesController,
  getDashboardStatsController,
  getInactiveCompaniesController,
  getInactiveStudentsController,
  getJobsByCompanyIdController,
  getStudentsController,
  updateJobStatusByAdminController,
  registerAdminController,
  getCompanyRequestsController,
  updateCompanyRequestsController,
} from "../controllers/admin.controller";
import { validate } from "../middlewares/validate";
import { adminSchema } from "../validators/auth.validator";
import authenticateUser from "../middlewares/authenticateUser";
import { authorizeRoles } from "../middlewares/verifyRole";
import { getJobsController } from "../controllers/job.controller";
import {
  getApplicationsController,
  updateApplicationController,
} from "../controllers/application.controller";
import { sendBulkMailController } from "../controllers/bulkmail.controller";
import { getCompanyById } from "../repository/company.repository";

const adminRoutes = Router();

adminRoutes.post("/register", validate(adminSchema), registerAdminController);

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

adminRoutes.get(
  "/company-requests",
  authenticateUser,
  authorizeRoles("ADMIN"),
  getCompanyRequestsController,
);

adminRoutes.put(
  "/company-requests",
  authenticateUser,
  authorizeRoles("ADMIN"),
  updateCompanyRequestsController,
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
adminRoutes.get(
  "/dashboard",
  authenticateUser,
  authorizeRoles("ADMIN"),
  getDashboardStatsController,
);

adminRoutes.post(
  "/send-mails",
  authenticateUser,
  authorizeRoles("ADMIN"),
  sendBulkMailController,
);

adminRoutes.get(
  "/get-jobs-company/:id",
  authenticateUser,
  authorizeRoles("ADMIN"),
  getJobsByCompanyIdController,
);

export default adminRoutes;
