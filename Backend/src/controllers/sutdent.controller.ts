import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import {
  createStudentService,
  getStudentProfileService,
  updateStudentService,
} from "../services/student.service";

export const createStudentController = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    const {
      departmentId,
      year,
      passingYear,
      cgpa,
      resumeUrl,
      skillIds,
      experiences,
      certificates,
    } = req.body;

    const student = await createStudentService(
      user.id,
      departmentId,
      year,
      passingYear,
      cgpa,
      resumeUrl,
      skillIds,
      experiences,
      certificates,
    );

    return sendSuccess(res, 201, "Student profile created", student);
  } catch (error: any) {
    // console.log(error);
    return sendError(res, 400, error.message);
  }
};

export const getStudentProfileController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const user = res.locals.user;

    const student = await getStudentProfileService(user.id);

    return sendSuccess(res, 200, "Student profile fetched", student);
  } catch (error: any) {
    return sendError(res, 404, error.message);
  }
};

export const updateStudentController = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    const updated = await updateStudentService(user.id, req.body);

    return sendSuccess(res, 200, "Student profile updated", updated);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};
