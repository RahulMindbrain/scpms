import { Request, Response } from "express";
import { sendBulkMailByCompanyService } from "../services/bulkmail.service";
import { sendSuccess, sendError } from "../utils/response";

// =======================================================
// 🔹 SEND BULK MAIL (ADMIN ONLY)
// =======================================================
export const sendBulkMailController = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    // 🔐 Safety: ensure admin
    if (!user || user.role !== "ADMIN") {
      return sendError(res, 403, "Only admin can send bulk mail");
    }

    const { companyId, jobIds, subject, message } = req.body;

    // ✅ Validate companyId
    if (!companyId || !Number.isFinite(Number(companyId))) {
      return sendError(res, 400, "Valid companyId is required");
    }

    // ✅ Validate jobIds
    if (!Array.isArray(jobIds) || jobIds.length === 0) {
      return sendError(res, 400, "jobIds must be a non-empty array");
    }

    // ensure all jobIds are numbers
    const parsedJobIds = jobIds.map(Number);
    if (parsedJobIds.some((id) => !Number.isFinite(id))) {
      return sendError(res, 400, "Invalid jobIds provided");
    }

    // ✅ Call service
    const result = await sendBulkMailByCompanyService({
      companyId: Number(companyId),
      jobIds: parsedJobIds,
      subject,
      message,
    });

    return sendSuccess(res, 200, "Bulk mail sent successfully", result);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};
