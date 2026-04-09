import { Router } from "express";
import {
  activateCompaniesController,
  activateUsersController,
  createAdminController,
  getCompaniesController,
  getInactiveCompaniesController,
  getInactiveStudentsController,
  getStudentsController,
} from "../controllers/admin.controller";
import { createUserController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import { adminSchema } from "../validators/auth.validator";
import authenticateUser from "../middlewares/authenticateUser";
import { authorizeRoles } from "../middlewares/verifyRole";

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

export default adminRoutes;
