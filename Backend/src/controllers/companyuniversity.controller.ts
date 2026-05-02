// src/controllers/companyUniversity.controller.ts

import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import {
  requestUniversityService,
  getCompanyRequestsService,
} from "../services/company.university.service";
import { getCompanyByUserId } from "../repository/company.repository";

export const requestUniversityController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = res.locals.user;

    if (!user || !user.id) {
      return sendError(res, 403, "Unauthorized");
    }

    const company = await getCompanyByUserId(user.id);

    if (!company) {
      return sendError(res, 400, "Company profile not found");
    }

    const { universityId } = req.body;

    if (!universityId) {
      return sendError(res, 400, "UniversityId required");
    }

    const data = await requestUniversityService(
      company.id,
      Number(universityId),
    );

    return sendSuccess(res, 201, "Request sent", data);
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const getCompanyRequestsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = res.locals.user;

    if (!user || !user.id) {
      return sendError(res, 403, "Unauthorized");
    }

    const company = await getCompanyByUserId(user.id);

    if (!company) {
      return sendError(res, 400, "Company profile not found");
    }

    const data = await getCompanyRequestsService(company.id);

    return sendSuccess(res, 200, "Requests fetched", data);
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};
