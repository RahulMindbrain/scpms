import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "../repository/department.repository";

export const createDepartmentService = async (name: string) => {
  return createDepartment(name);
};

export const getDepartmentsService = async (page?: number, limit?: number) => {
  return getDepartments(page, limit);
};

export const getDepartmentByIdService = async (id: number) => {
  const dept = await getDepartmentById(id);

  if (!dept) {
    throw new Error("Department not found");
  }

  return dept;
};

export const updateDepartmentService = async (id: number, name: string) => {
  return updateDepartment(id, name);
};

export const deleteDepartmentService = async (id: number) => {
  return deleteDepartment(id);
};
