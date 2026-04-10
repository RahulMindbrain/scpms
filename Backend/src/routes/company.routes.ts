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
<<<<<<< HEAD
=======
import { createJobController } from "../controllers/job.controller";
import { createJobSchema } from "../validators/job.validator";
import {
  getApplicationsController,
  updateApplicationController,
} from "../controllers/application.controller";
>>>>>>> da655f8b892af87de11b7caa44408e05e94e4b71

const CompanyRoutes = Router();

CompanyRoutes.post(
  "/profile",
  authenticateUser,
  authorizeRoles("COMPANY"),
  validate(createCompanySchema),
  createCompanyController,
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
  authorizeRoles("COMPANY"),
  validate(updateCompanySchema),
  updateCompanyController,
);

<<<<<<< HEAD
=======
CompanyRoutes.post(
  "/post-job",
  authenticateUser,
  authorizeRoles("COMPANY"),
  validate(createJobSchema),
  createJobController,
);

CompanyRoutes.get(
  "/get-job-application",
  authenticateUser,
  authorizeRoles("COMPANY"),
  getApplicationsController,
);

CompanyRoutes.put(
  "/update-job-status",
  authenticateUser,
  authorizeRoles("COMPANY"),
  updateApplicationController,
);

>>>>>>> da655f8b892af87de11b7caa44408e05e94e4b71
export default CompanyRoutes;
