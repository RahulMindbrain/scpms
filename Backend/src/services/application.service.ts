import {
  createApplication,
  deleteApplication,
  getApplications,
  updateApplicationStatus,
} from "../repository/application.repository";

export const createApplicationService = async (data: any) => {
  return createApplication(data);
};

export const getApplicationsService = async (studentId: number) => {
  return getApplications(studentId);
};

export const updateApplicationService = async (id: number, status: any) => {
  return updateApplicationStatus(id, status);
};

export const deleteApplicationService = async (id: number) => {
  return deleteApplication(id);
};
