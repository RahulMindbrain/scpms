import { Request, Response, NextFunction } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { JobStatus, Role } from "@prisma/client";
import { createAdmin, getAdminCount } from "../repository/admin.repository";
import {
  activateCompaniesService,
  activateUsersService,
  createAdminService,
  getActiveStudentsService,
  getCompaniesService,
  getJobsByCompanyIdServices,
  getDashboardStatsService,
  getInactiveCompaniesService,
  getInactiveStudentsService,
  getStudentsService,
  updateJobStatusByAdminService,
} from "../services/admin.service";
import { notifyEligibleStudentsForJob } from "../services/notification.service";
import { runInBackground } from "../utils/Background.task";
import { send } from "node:process";

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
    const {
      page,
      limit,
      passingYear,
      year,
      minCgpa,
      maxCgpa,
      departmentId,
      status,
    } = req.query;

    const parseNumber = (value: any) => {
      if (value === undefined) return undefined;
      const num = Number(value);
      return Number.isFinite(num) ? num : undefined;
    };
    const parseStatus = (value: unknown): "ACTIVE" | "INACTIVE" | undefined => {
      if (value === "ACTIVE" || value === "INACTIVE") return value;
      return undefined;
    };

    const parsedPage = parseNumber(page) ?? 1;
    const parsedLimit = parseNumber(limit);

    if (parsedPage < 1) {
      return sendError(res, 400, "Invalid page");
    }

    if (parsedLimit !== undefined && parsedLimit < 1) {
      return sendError(res, 400, "Invalid limit");
    }

    const params: any = {
      page: parsedPage,
      ...(parsedLimit !== undefined && { limit: parsedLimit }),
      ...(parseNumber(passingYear) !== undefined && {
        passingYear: parseNumber(passingYear),
      }),
      ...(parseNumber(year) !== undefined && {
        year: parseNumber(year),
      }),
      ...(parseNumber(minCgpa) !== undefined && {
        minCgpa: parseNumber(minCgpa),
      }),
      ...(parseNumber(maxCgpa) !== undefined && {
        maxCgpa: parseNumber(maxCgpa),
      }),
      ...(parseNumber(departmentId) !== undefined && {
        departmentId: parseNumber(departmentId),
      }),
      ...(parseStatus(status) && { status: parseStatus(status) }),
    };

    const students = await getStudentsService(params);

    return sendSuccess(res, 200, "Students fetched", students);
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const getCompaniesController = async (req: Request, res: Response) => {
  try {
    const { page, limit, status } = req.query;

    const parseNumber = (value: any) => {
      if (value === undefined) return undefined;
      const num = Number(value);
      return Number.isFinite(num) ? num : undefined;
    };

    const parseStatus = (value: unknown): "ACTIVE" | "INACTIVE" | undefined => {
      if (value === "ACTIVE" || value === "INACTIVE") {
        return value;
      }
      return undefined;
    };

    const parsedPage = parseNumber(page);
    const parsedLimit = parseNumber(limit);
    const parsedStatus = parseStatus(status);

    const params = {
      ...(parsedPage !== undefined && { page: parsedPage }),
      ...(parsedLimit !== undefined && { limit: parsedLimit }),
      ...(parsedStatus !== undefined && { status: parsedStatus }),
    };

    const result = await getCompaniesService(params);

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

    const parseNumber = (value: any) => {
      if (value === undefined) return undefined;
      const num = Number(value);
      return Number.isFinite(num) ? num : undefined;
    };

    const parsedPage = parseNumber(page);
    const parsedLimit = parseNumber(limit);
    const parsedYear = parseNumber(year);
    const parsedPassingYear = parseNumber(passingYear);

    if (parsedPage !== undefined && parsedPage < 1) {
      return sendError(res, 400, "Invalid page");
    }

    if (parsedLimit !== undefined && parsedLimit < 1) {
      return sendError(res, 400, "Invalid limit");
    }

    const params = {
      ...(parsedPage !== undefined && { page: parsedPage }),
      ...(parsedLimit !== undefined && { limit: parsedLimit }),
      ...(parsedYear !== undefined && { year: parsedYear }),
      ...(parsedPassingYear !== undefined && {
        passingYear: parsedPassingYear,
      }),
    };

    const students = await getActiveStudentsService(params);

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

    const parseNumber = (value: any) => {
      if (value === undefined) return undefined;
      const num = Number(value);
      return Number.isFinite(num) ? num : undefined;
    };

    const parsedPage = parseNumber(page);
    const parsedLimit = parseNumber(limit);
    const parsedPassingYearFrom = parseNumber(passingYearFrom);

    if (parsedPage !== undefined && parsedPage < 1) {
      return sendError(res, 400, "Invalid page");
    }

    if (parsedLimit !== undefined && parsedLimit < 1) {
      return sendError(res, 400, "Invalid limit");
    }

    const params = {
      ...(parsedPage !== undefined && { page: parsedPage }),
      ...(parsedLimit !== undefined && { limit: parsedLimit }),
      ...(parsedPassingYearFrom !== undefined && {
        passingYearFrom: parsedPassingYearFrom,
      }),
    };

    const result = await getInactiveStudentsService(params);

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
    console.log(error);
    return sendError(res, 400, error.message);
  }
};

export const getInactiveCompaniesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { page, limit } = req.query;

    const parsedPage =
      page !== undefined && Number.isFinite(Number(page))
        ? Number(page)
        : undefined;

    const parsedLimit =
      limit !== undefined && Number.isFinite(Number(limit))
        ? Number(limit)
        : undefined;

    const result = await getInactiveCompaniesService({
      ...(parsedPage !== undefined && { page: parsedPage }),
      ...(parsedLimit !== undefined && { limit: parsedLimit }),
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

export const getDashboardStatsController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const data = await getDashboardStatsService();

    return sendSuccess(res, 200, "Dashboard stats fetched successfully", data);
  } catch (error: any) {
    console.error("Dashboard Controller Error:", error);
    return sendError(res, 500, "Failed to fetch dashboard stats");
  }
};

export const getJobsByCompanyIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const page = req.query.page !== undefined ? Number(req.query.page) : 1;

    const limit =
      req.query.limit !== undefined
        ? Number(req.query.limit)
        : Number(process.env.DEFAULT_LIMIT) || 10;

    const status = req.query.status as JobStatus;

    const data = await getJobsByCompanyIdServices({
      companyId: Number(id),
      page,
      limit,
      status,
    });

    return sendSuccess(res, 200, "Company Jobs Fetched", data);
  } catch (error: any) {
    console.log(error);
    return sendError(res, 500, "Failed");
  }
};

// export const getJobsByCompanyController = async(req:Request, res:Response)=>{
//   try{

//     const {id:companyId} = req.body;

//     if(!)

//     if()

//   }catch(error:any){
//     console.log(error);
//     return sendError(res,500,"Failed to fetch jobs by company");
//   }
// }
