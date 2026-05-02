// src/routes/superadmin.routes.ts

import { Router } from "express";

import {
  createSuperAdminController,
  getSuperAdminByIdController,
  getAllSuperAdminsController,
  updateSuperAdminController,
  deleteSuperAdminController,
  getAdminsController,
  activateAdminsController,
  deactivateAdminsController,
  getCompaniesController,
  activateCompaniesController,
  getUniversitiesController,
} from "../controllers/superadmin.controller";

import authenticateUser from "../middlewares/authenticateUser";
import { authorizeRoles } from "../middlewares/verifyRole";

const saRouter = Router();

saRouter.use(authenticateUser);
saRouter.use(authorizeRoles("SUPER_ADMIN"));

saRouter.post("/", createSuperAdminController);
saRouter.get("/", getAllSuperAdminsController);
saRouter.get("/:id", getSuperAdminByIdController);
saRouter.put("/:id", updateSuperAdminController);
saRouter.delete("/:id", deleteSuperAdminController);

saRouter.get("/admins", getAdminsController);

saRouter.put("/admins/activate", activateAdminsController);

saRouter.put("/admins/deactivate", deactivateAdminsController);

saRouter.get("/companies", getCompaniesController);

saRouter.put("/companies/activate", activateCompaniesController);

saRouter.get("/universities", getUniversitiesController);

export default saRouter;
