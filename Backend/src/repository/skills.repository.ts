import prisma from "../config/db";

// =========================
// CREATE
// =========================
export const createSkill = async (name: string) => {
  return prisma.skill.create({
    data: { name },
  });
};

// =========================
// GET ALL
// =========================
export const getAllSkills = async () => {
  return prisma.skill.findMany({
    orderBy: { name: "asc" },
  });
};

// =========================
// GET BY ID
// =========================
export const getSkillById = async (id: number) => {
  return prisma.skill.findUnique({
    where: { id },
  });
};

// =========================
// GET BY NAME (for duplicate check)
// =========================
export const getSkillByName = async (name: string) => {
  return prisma.skill.findUnique({
    where: { name },
  });
};

// =========================
// UPDATE
// =========================
export const updateSkill = async (id: number, name: string) => {
  return prisma.skill.update({
    where: { id },
    data: { name },
  });
};

// =========================
// DELETE
// =========================
export const deleteSkill = async (id: number) => {
  return prisma.skill.delete({
    where: { id },
  });
};
