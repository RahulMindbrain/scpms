import { Router } from "express";
import {
  loginController,
  logoutController,
  regenAccessToken,
} from "../auth/auth.controller";
import { validate } from "../middlewares/validate";
import { loginSchema } from "../validators/auth.validator";
import authenticateUser from "../middlewares/authenticateUser";

const AuthRoutes = Router();

AuthRoutes.post("/login", validate(loginSchema), loginController);

AuthRoutes.post("/refresh", regenAccessToken);

AuthRoutes.post("/logout", authenticateUser, logoutController);

export default AuthRoutes;
