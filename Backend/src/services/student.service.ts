import { getDepartmentById } from "../repository/department.repository";
import { getSkillsByIds } from "../repository/skill.repostiory";
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
  resumeUrl?: string,
  skillIds?: number[],
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

  if (skillIds?.length) {
    const skills = await getSkillsByIds(skillIds);

    const foundIds = skills.map((s) => s.id);

    const missingIds = skillIds.filter((id) => !foundIds.includes(id));

    if (missingIds.length) {
      throw new Error(`Invalid skill IDs: ${missingIds.join(", ")}`);
    }
  }

  return createStudent(
    userId,
    departmentId,
    year,
    passingYear,
    cgpa,
    resumeUrl,
    skillIds,
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

export const updateStudentService = async (userId: number, data: any) => {
  const existing = await getStudentByUserId(userId);

  if (!existing) {
    throw new Error("Student profile not found");
  }

  const { skillIds, ...rest } = data;

  if (skillIds?.length) {
    const skills = await getSkillsByIds(skillIds);

    const foundIds = skills.map((s) => s.id);

    const missingIds = skillIds.filter((id) => !foundIds.includes(id));

    if (missingIds.length) {
      throw new Error(`Invalid skill IDs: ${missingIds.join(", ")}`);
    }
  }

  return updateStudent(userId, {
    ...rest,
    skillIds,
  });
};
