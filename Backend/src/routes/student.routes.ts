import { Router } from "express";
import {
  createStudentController,
  getStudentProfileController,
  updateStudentController,
} from "../controllers/sutdent.controller";
import { authorizeRoles } from "../middlewares/verifyRole";
import authenticateUser from "../middlewares/authenticateUser";
import { validate } from "../middlewares/validate";
import {
  createStudentSchema,
  updateStudentSchema,
} from "../validators/sudent.validator";
import { getJobsController } from "../controllers/job.controller";
import { createApplicationController } from "../controllers/application.controller";

const StudentRoutes = Router();

StudentRoutes.post(
  "/profile",
  authenticateUser,
  authorizeRoles("STUDENT"),
  validate(createStudentSchema),
  createStudentController,
);

StudentRoutes.get(
  "/profile",
  authenticateUser,
  authorizeRoles("STUDENT"),
  getStudentProfileController,
);

StudentRoutes.put(
  "/profile",
  authenticateUser,
  authorizeRoles("STUDENT"),
  updateStudentController,
);

StudentRoutes.get(
  "/show-all-jobs",
  authenticateUser,
  authorizeRoles("STUDENT"),
  getJobsController,
);

StudentRoutes.post(
  "/apply-job",
  authenticateUser,
  authorizeRoles("STUDENT"),
  createApplicationController,
);

export default StudentRoutes;
