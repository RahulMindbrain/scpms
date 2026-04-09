import { getDepartmentById } from "../repository/department.repository";
import {
  createStudent,
  getStudentByUserId,
  updateStudent,
} from "../repository/student.repository";

// export const createStudentService = async (
//   userId: number,
//   departmentId: number,
//   year: number,
//   passingYear: number,
//   cgpa?: number,
// ) => {
//   const existing = await getStudentByUserId(userId);

//   if (existing) {
//     throw new Error("Student profile already exists");
//   }

//   const departmentExist = await getDepartmentById(departmentId);

//   if (!departmentExist) {
//     throw new Error("Department doesnot exist, Kindly choose valid id");
//   }

//   return createStudent(userId, departmentId, year, passingYear, cgpa);
// };

export const createStudentService = async (
  userId: number,
  departmentId: number,
  year: number,
  passingYear: number,
  cgpa?: number,
  resumeUrl?: string,
  skills?: string[],
  experiences?: any[],
  certificates?: any[],
) => {
  const existing = await getStudentByUserId(userId);

  if (existing) {
    throw new Error("Student profile already exists");
  }

  const departmentExist = await getDepartmentById(departmentId);

  if (!departmentExist) {
    throw new Error("Department does not exist");
  }

  return createStudent(
    userId,
    departmentId,
    year,
    passingYear,
    cgpa,
    resumeUrl,
    skills,
    experiences,
    certificates,
  );
};

export const getStudentProfileService = async (userId: number) => {
  const student = await getStudentByUserId(userId);

  if (!student) {
    throw new Error("Student profile not found");
  }

  return student;
};

export const updateStudentService = async (
  userId: number,
  data: {
    departmentId?: number;
    year?: number;
    passingYear?: number;
    cgpa?: number;
  },
) => {
  const existing = await getStudentByUserId(userId);

  if (!existing) {
    throw new Error("Student profile not found");
  }

  return updateStudent(userId, data);
};
