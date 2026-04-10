import { Request, Response, NextFunction } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { JobStatus, Role } from "@prisma/client";
import { createAdmin, getAdminCount } from "../repository/admin.repository";
import {
  createAdminService,
  getStudentsService,
  updateJobStatusByAdminService,
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
    const { userIds } = req.body || {};

    if (!userIds || !Array.isArray(userIds)) {
      return sendError(res, 400, "userIds must be an array");
    }

    const ids = userIds.map(Number);

    if (ids.some((id) => !Number.isInteger(id) || id <= 0)) {
      return sendError(res, 400, "Invalid user IDs");
    }

    const result = await activateUsersService(ids);

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

export const updateJobStatusByAdminController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { jobId, jobIds, status } = req.body;
    const user = res.locals.user;

    if (!user?.id) {
      return sendError(res, 401, "Unauthorized");
    }

    if (user.role !== "ADMIN") {
      return sendError(res, 403, "Only admin can perform this action");
    }

    if (!status) {
      return sendError(res, 400, "status is required");
    }

    // ✅ Normalize to array
    const ids = jobIds ?? (jobId ? [jobId] : []);

    if (!ids.length) {
      return sendError(res, 400, "jobId or jobIds is required");
    }

    const updatedJobs = await updateJobStatusByAdminService(
      ids.map(Number),
      status as JobStatus,
      user.id,
    );

    return sendSuccess(
      res,
      200,
      "Job status updated successfully",
      updatedJobs,
    );
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};
