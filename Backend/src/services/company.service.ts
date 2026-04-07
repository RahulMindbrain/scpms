import {
  createCompany,
  getCompanyByUserId,
  updateCompany,
} from "../repository/company.repository";

export const createCompanyService = async (
  userId: number,
  name: string,
  description?: string,
) => {
  const existing = await getCompanyByUserId(userId);

  if (existing) {
    throw new Error("Company profile already exists");
  }

  return createCompany(userId, name, description);
};

export const getCompanyProfileService = async (userId: number) => {
  const company = await getCompanyByUserId(userId);

  if (!company) {
    throw new Error("Company profile not found");
  }

  return company;
};

export const updateCompanyService = async (
  userId: number,
  data: {
    name?: string;
    description?: string;
  },
) => {
  const existing = await getCompanyByUserId(userId);

  if (!existing) {
    throw new Error("Company profile not found");
  }

  return updateCompany(userId, data);
};
