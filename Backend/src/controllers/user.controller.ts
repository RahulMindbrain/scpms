import { Request, Response, NextFunction } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { Role } from "@prisma/client";
import { createUserService } from "../services/user.service";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;

    if (!firstname || !lastname || !email || !password || !role) {
      return sendError(res, 400, "All fields are required");
    }

    if (![Role.STUDENT, Role.COMPANY].includes(role)) {
      return sendError(res, 400, "Invalid role");
    }
    const user = await createUserService(
      firstname,
      lastname,
      email,
      password,
      role,
    );

    return sendSuccess(res, 201, "User registered successfully", user);
  } catch (error: any) {
    console.error(error);

    return sendError(res, 500, error.message || "Something went wrong");
  }
};
