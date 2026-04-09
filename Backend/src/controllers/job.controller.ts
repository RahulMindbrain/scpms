import {
  createJobService,
  deleteJobService,
  getJobsService,
  updateJobService,
} from "../services/job.service";
import { sendError, sendSuccess } from "../utils/response";

import { Request, Response } from "express";

export const createJobController = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    const job = await createJobService(req.body, user.id);

    return sendSuccess(res, 201, "Job created", job);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

export const getJobsController = async (req: Request, res: Response) => {
  const { page, limit, status } = req.query;

  const data = await getJobsService({
    page: Number(page),
    limit: Number(limit),
    status,
  });

  return sendSuccess(res, 200, "Jobs fetched", data);
};

export const updateJobController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await updateJobService(Number(id), req.body);
  return sendSuccess(res, 200, "Job updated", data);
};

export const deleteJobController = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteJobService(Number(id));
  return sendSuccess(res, 200, "Job deleted");
};
