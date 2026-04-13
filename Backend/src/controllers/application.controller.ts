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
  req: Request,
  res: Response,
) => {
  try {
    const user = res.locals.user;

    const filters = {
      applicationId: req.query.applicationId
        ? Number(req.query.applicationId)
        : undefined,
      jobId: req.query.jobId ? Number(req.query.jobId) : undefined,
      companyId: req.query.companyId ? Number(req.query.companyId) : undefined,
      studentId: req.query.studentId ? Number(req.query.studentId) : undefined,
      status: req.query.status as any,
    };

    // ✅ Pagination params
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const data = await getApplicationsService(user, filters, page, limit);

    return sendSuccess(res, 200, "Applications fetched", data);
  } catch (error: any) {
    console.error("Controller Error:", error);
    return sendError(res, 500, "Failed to fetch applications");
  }
};

export const updateApplicationController = async (
  req: Request,
  res: Response,
) => {
  // const { id } = req.body;
  const { id } = req.params;
  console.log(id);
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
