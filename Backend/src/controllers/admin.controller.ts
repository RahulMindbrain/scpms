import { Request, Response, NextFunction } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { Role } from "@prisma/client";
import { createAdmin, getAdminCount } from "../repository/admin.repository";
import {
  createAdminService,
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
