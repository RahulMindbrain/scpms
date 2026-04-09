import {
  createApplicationService,
  deleteApplicationService,
  getApplicationsService,
  updateApplicationService,
} from "../services/application.service";
import { sendSuccess } from "../utils/response";
import { Request, Response } from "express";

export const createApplicationController = async (
  req: Request,
  res: Response,
) => {
  const data = await createApplicationService(req.body);
  return sendSuccess(res, 201, "Applied successfully", data);
};

export const getApplicationsController = async (
  req: Request,
  res: Response,
) => {
  const user = res.locals.user;
  const data = await getApplicationsService(user.id);
  return sendSuccess(res, 200, "Applications fetched", data);
};

export const updateApplicationController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  const { status } = req.body;

  const data = await updateApplicationService(Number(id), status);
  return sendSuccess(res, 200, "Application updated", data);
};

export const deleteApplicationController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  await deleteApplicationService(Number(id));
  return sendSuccess(res, 200, "Application deleted");
};
