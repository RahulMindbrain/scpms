import {
  createApplicationService,
  deleteApplicationService,
  getApplicationsService,
  updateApplicationService,
} from "../services/application.service";
import { sendError, sendSuccess } from "../utils/response";
import { Request, Response } from "express";

export const createApplicationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = res.locals.user;
    const { jobId } = req.body;

    if (!user?.id) {
      return sendError(res, 401, "Unauthorized");
    }

    const parsedJobId = Number(jobId);

    if (!Number.isInteger(parsedJobId) || parsedJobId <= 0) {
      return sendError(res, 400, "Invalid jobId");
    }

    const data = await createApplicationService(user.id, parsedJobId);

    return sendSuccess(res, 201, "Applied successfully", data);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

export const getApplicationsController = async (
  _req: Request,
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
