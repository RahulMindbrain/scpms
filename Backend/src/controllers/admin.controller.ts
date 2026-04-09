import { Request, Response, NextFunction } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { Role } from "@prisma/client";
import { createAdmin, getAdminCount } from "../repository/admin.repository";
import {
  activateCompaniesService,
  activateUsersService,
  createAdminService,
  getActiveStudentsService,
  getCompaniesService,
  getInactiveCompaniesService,
  getInactiveStudentsService,
  getStudentsService,
} from "../services/admin.service";

export const createAdminController = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return sendError(res, 400, "All fields are required");
    }

    const admin = await createAdminService(
      firstname,
      lastname,
      email,
      password,
    );

    return sendSuccess(res, 201, "Admin created successfully", admin);
  } catch (error: any) {
    console.error(error);

    if (error.message === "Admin already exists") {
      return sendError(res, 403, error.message);
    }

    return sendError(res, 500, error.message || "Something went wrong");
  }
};

export const getStudentsController = async (req: Request, res: Response) => {
  try {
    const { page, limit, passingYear, year, minCgpa, maxCgpa, departmentId } =
      req.query;

    const students = await getStudentsService({
      page: page !== undefined ? Number(page) : undefined,
      limit: limit !== undefined ? Number(limit) : undefined,
      passingYear: passingYear !== undefined ? Number(passingYear) : undefined,
      year: year !== undefined ? Number(year) : undefined,
      minCgpa: minCgpa !== undefined ? Number(minCgpa) : undefined,
      maxCgpa: maxCgpa !== undefined ? Number(maxCgpa) : undefined,
      departmentId:
        departmentId !== undefined ? Number(departmentId) : undefined,
    });

    return sendSuccess(res, 200, "Students fetched", students);
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const getCompaniesController = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;

    const result = await getCompaniesService({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    return sendSuccess(res, 200, "Companies fetched", result);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

export const getActiveStudentsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { page, limit, year, passingYear } = req.query;

    const students = await getActiveStudentsService({
      page: page !== undefined ? Number(page) : undefined,
      limit: limit !== undefined ? Number(limit) : undefined,
      year: year !== undefined ? Number(year) : undefined,
      passingYear: passingYear !== undefined ? Number(passingYear) : undefined,
    });

    return sendSuccess(res, 200, "Active students fetched", students);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

export const getInactiveStudentsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { page, limit, passingYearFrom } = req.query;

    const result = await getInactiveStudentsService({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      passingYearFrom: passingYearFrom ? Number(passingYearFrom) : undefined,
    });

    return sendSuccess(res, 200, "Inactive students fetched", result);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

export const activateUsersController = async (req: Request, res: Response) => {
  try {
    const { userIds } = req.body;

    const result = await activateUsersService(userIds);

    return sendSuccess(res, 200, "Users activated successfully", result);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

export const activateCompaniesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userIds } = req.body;

    const result = await activateCompaniesService(userIds);

    return sendSuccess(res, 200, "Companies activated successfully", result);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

export const getInactiveCompaniesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { page, limit } = req.query;

    const result = await getInactiveCompaniesService({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    return sendSuccess(res, 200, "Inactive companies fetched", result);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};
