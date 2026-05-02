import {
  createCompanyUniversityRequest,
  findExistingCompanyUniversityPairs,
  getCompanyRequests,
  getCompanyUniversityByPair,
} from "../repository/compnay.university.repository";

export const requestUniversitiesService = async (
  companyId: number,
  universityIds: number[],
) => {
  if (!companyId || !Array.isArray(universityIds) || !universityIds.length) {
    throw new Error("Invalid input");
  }

  const existing = await findExistingCompanyUniversityPairs(
    companyId,
    universityIds,
  );

  if (existing.length) {
    const ids = existing.map((e) => e.universityId).join(", ");
    throw new Error(`Already applied for universities: ${ids}`);
  }

  // 2) Create new requests (all are fresh)
  await createCompanyUniversityRequest(companyId, universityIds);

  // 3) Return created rows with details
  return getCompanyUniversityRequestsByIds(companyId, universityIds);
};

export const getCompanyRequestsService = async (companyId: number) => {
  return getCompanyRequests(companyId);
};
