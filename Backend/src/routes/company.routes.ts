import { Router } from "express";
import {
  createCompanyController,
  getCompanyProfileController,
  updateCompanyController,
} from "../controllers/company.controller";
import { authorizeRoles } from "../middlewares/verifyRole";
import { validate } from "../middlewares/validate";
import {
  createCompanySchema,
  updateCompanySchema,
} from "../validators/company.validators";
import authenticateUser from "../middlewares/authenticateUser";
import {
  createJobController,
  getJobsController,
  updateJobController,
} from "../controllers/job.controller";
import {
  createJobSchema,
  updateJobSchema,
} from "../validators/job.validator";
import {
  getApplicationsController,
  updateApplicationController,
} from "../controllers/application.controller";
import requireActiveUser from "../middlewares/requireActiveUser";

const CompanyRoutes = Router();

// Company Profile
CompanyRoutes.post(
  "/profile",
  authenticateUser,
  authorizeRoles("COMPANY"),
  validate(createCompanySchema),
  createCompanyController
);

CompanyRoutes.get(
  "/profile",
  authenticateUser,
  authorizeRoles("COMPANY"),
  getCompanyProfileController
);

CompanyRoutes.put(
  "/profile",
  authenticateUser,
  requireActiveUser,
  authorizeRoles("COMPANY"),
  validate(updateCompanySchema),
  updateCompanyController
);

// Jobs
CompanyRoutes.post(
  "/jobs",
  authenticateUser,
  requireActiveUser,
  authorizeRoles("COMPANY"),
  validate(createJobSchema),
  createJobController
);

CompanyRoutes.put(
  "/jobs/:id",
  authenticateUser,
  requireActiveUser,
  authorizeRoles("COMPANY"),
  validate(updateJobSchema),
  updateJobController
);

CompanyRoutes.get(
  "/jobs",
  authenticateUser,
  requireActiveUser,
  authorizeRoles("COMPANY"),
  getJobsController
);

// Applications
CompanyRoutes.get(
  "/applications",
  authenticateUser,
  requireActiveUser,
  authorizeRoles("COMPANY"),
  getApplicationsController
);

CompanyRoutes.put(
  "/applications/:id/status",
  authenticateUser,
  requireActiveUser,
  authorizeRoles("COMPANY"),
  updateApplicationController
);

export default CompanyRoutes;