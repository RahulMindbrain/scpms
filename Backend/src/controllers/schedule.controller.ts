import { Request, Response } from "express";
import {
  createInterviewScheduleService,
  getAllSchedulesService,
  getScheduleByIdService,
  getCompanySchedulesService,
  updateScheduleService,
  deleteScheduleService,
  addJobsToScheduleService,
  removeJobsFromScheduleService,
} from "../services/schedule.service";

import { sendSuccess, sendError } from "../utils/response";

// =======================================================
// CREATE
// =======================================================
export const createScheduleController = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    const schedule = await createInterviewScheduleService({
      ...req.body,
      createdBy: user.id,
    });

    return sendSuccess(res, 201, "Schedule created", schedule);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

// =======================================================
// GET ALL (ADMIN)
// =======================================================
export const getAllSchedulesController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const data = await getAllSchedulesService();
    return sendSuccess(res, 200, "Schedules fetched", data);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

// =======================================================
// GET BY ID
// =======================================================
export const getScheduleByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    const data = await getScheduleByIdService(id);

    return sendSuccess(res, 200, "Schedule fetched", data);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

// =======================================================
// COMPANY SCHEDULES
// =======================================================
export const getCompanySchedulesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = res.locals.user;

    const data = await getCompanySchedulesService(user.company.id);

    return sendSuccess(res, 200, "Company schedules fetched", data);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

// =======================================================
// UPDATE
// =======================================================
export const updateScheduleController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const data = await updateScheduleService(id, req.body);

    return sendSuccess(res, 200, "Schedule updated", data);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

// =======================================================
// DELETE
// =======================================================
export const deleteScheduleController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await deleteScheduleService(id);

    return sendSuccess(res, 200, "Schedule deleted", {});
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

// =======================================================
// ADD JOBS
// =======================================================
export const addJobsController = async (req: Request, res: Response) => {
  try {
    const scheduleId = Number(req.params.id);
    const { jobIds } = req.body;

    const result = await addJobsToScheduleService(scheduleId, jobIds);

    return sendSuccess(res, 200, "Jobs added to schedule", result);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

// =======================================================
// REMOVE JOBS
// =======================================================
export const removeJobsController = async (req: Request, res: Response) => {
  try {
    const { jobIds } = req.body;

    await removeJobsFromScheduleService(jobIds);

    return sendSuccess(res, 200, "Jobs removed from schedule", {});
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};
