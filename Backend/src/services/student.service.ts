import {
  createStudent,
  getStudentByUserId,
  updateStudent,
} from "../repository/student.repository";

export const createStudentService = async (
  userId: number,
  departmentId: number,
  year: number,
  passingYear: number,
  cgpa?: number,
) => {
  const existing = await getStudentByUserId(userId);

  if (existing) {
    throw new Error("Student profile already exists");
  }

  return createStudent(userId, departmentId, year, passingYear, cgpa);
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
