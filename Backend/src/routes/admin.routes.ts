import { Router } from "express";
import {
  createAdminController,
  getStudentsController,
} from "../controllers/admin.controller";
import { createUserController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import { adminSchema } from "../validators/auth.validator";

const adminRoutes = Router();

adminRoutes.post("/register", validate(adminSchema), createAdminController);

adminRoutes.get("/get-students", getStudentsController);

export default adminRoutes;
