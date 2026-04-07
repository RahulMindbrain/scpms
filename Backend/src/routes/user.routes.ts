import { Router } from "express";
import { createAdminController } from "../controllers/admin.controller";
import { createUserController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import { registerSchema } from "../validators/auth.validator";

const UserRoutes = Router();

UserRoutes.post("/register", validate(registerSchema), createUserController);

export default UserRoutes;
