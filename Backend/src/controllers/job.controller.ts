import {
  createJobService,
  deleteJobService,
  getJobsService,
  updateJobService,
} from "../services/job.service";
import { sendError, sendSuccess } from "../utils/response";

import { Request, Response } from "express";
import { createJobSchema } from "../validators/job.validator";
import {
  getCompanyById,
  getCompanyByUserId,
} from "../repository/company.repository";

export const createJobController = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    const parsedData = createJobSchema.parse(req.body);

    const job = await createJobService(parsedData, user.id);

    return sendSuccess(res, 201, "Job created", job);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return sendError(
        res,
        400,
        error.errors.map((e: any) => e.message).join(", "),
      );
    }

    return sendError(res, 400, error.message);
  }
};
export const getJobsController = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return sendError(res, 401, "Unauthorized");
    }

    const { page, limit, status, companyId: bodyCompanyId } = req.body;

    let companyId: number | undefined;

    // 🔥 CASE 1: COMPANY USER → force their own company
    if (user.role === "COMPANY") {
      const company = await getCompanyByUserId(user.id);

      if (!company) {
        return sendError(res, 404, "Company not found");
      }

      companyId = company.id;
    }

    // 🔥 CASE 2: ADMIN → can pass companyId
    else if (user.role === "ADMIN") {
      if (bodyCompanyId) {
        const company = await getCompanyById(Number(bodyCompanyId));

        if (!company) {
          return sendError(res, 404, "Company not found");
        }

        companyId = company.id;
      }
    }

    // 🔥 Pagination parsing (same as before)
    const parsedPage = page === undefined ? 1 : Number(page);
    if (
      page !== undefined &&
      (!Number.isFinite(parsedPage) || parsedPage < 1)
    ) {
      return sendError(res, 400, "Invalid page number");
    }

    const parsedLimit = limit === undefined ? undefined : Number(limit);
    if (
      limit !== undefined &&
      (!Number.isFinite(parsedLimit) || parsedLimit < 1)
    ) {
      return sendError(res, 400, "Invalid limit");
    }

    const data = await getJobsService({
      page: parsedPage,
      limit: parsedLimit,
      status,
      companyId, // ✅ PASS THIS
    });

    return sendSuccess(res, 200, "Jobs fetched", data);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
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
