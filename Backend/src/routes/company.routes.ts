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
  deleteJobController,
  getJobsController,
  updateJobController,
} from "../controllers/job.controller";
import { createJobSchema, updateJobSchema } from "../validators/job.validator";
import {
  getApplicationsController,
  updateApplicationController,
} from "../controllers/application.controller";
import requireActiveUser from "../middlewares/requireActiveUser";

const CompanyRoutes = Router();

CompanyRoutes.post(
  "/profile",
  authenticateUser,
  authorizeRoles("COMPANY"),
  validate(createCompanySchema),
  createCompanyController,
  createCompanyController
);

CompanyRoutes.get(
  "/profile",
  authenticateUser,
  authorizeRoles("COMPANY"),
  getCompanyProfileController,
);

CompanyRoutes.put(
  "/profile",
  authenticateUser,
  requireActiveUser,
  authorizeRoles("COMPANY"),
  validate(updateCompanySchema),
  updateCompanyController,
);

CompanyRoutes.post(
  "/post-job",
  authenticateUser,
  requireActiveUser,
  authorizeRoles("COMPANY"),
  validate(createJobSchema),
  createJobController,
);

CompanyRoutes.put(
  "/post-job/:id",
  authenticateUser,
  requireActiveUser,
  authorizeRoles("COMPANY"),
  validate(updateJobSchema),
  updateJobController,
);

CompanyRoutes.delete(
  "/post-job/:id",
  authenticateUser,
  requireActiveUser,
  authorizeRoles("COMPANY"),
  deleteJobController,
);

CompanyRoutes.get(
  "/get-jobs",
  authenticateUser,
  requireActiveUser,
  authorizeRoles("COMPANY"),
  getJobsController,
);

CompanyRoutes.get(
  "/get-job-application",
  authenticateUser,
  requireActiveUser,
  authorizeRoles("COMPANY"),
  getApplicationsController,
);

CompanyRoutes.put(
  "/update-job-status/:id",
  authenticateUser,
  requireActiveUser,
  authorizeRoles("COMPANY"),
  updateApplicationController,
);

export default CompanyRoutes;