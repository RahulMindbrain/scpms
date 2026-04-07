import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import {
  createCompanyService,
  getCompanyProfileService,
  updateCompanyService,
} from "../services/company.service";

export const createCompanyController = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    const { name, description } = req.body;

    const company = await createCompanyService(user.id, name, description);

    return sendSuccess(res, 201, "Company profile created", company);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

export const getCompanyProfileController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = res.locals.user;

    const company = await getCompanyProfileService(user.id);

    return sendSuccess(res, 200, "Company profile fetched", company);
  } catch (error: any) {
    return sendError(res, 404, error.message);
  }
};

export const updateCompanyController = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    const updated = await updateCompanyService(user.id, req.body);

    return sendSuccess(res, 200, "Company profile updated", updated);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};
