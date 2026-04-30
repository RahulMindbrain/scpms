import { Role } from "@prisma/client";
import {
  createUser,
  findUserByEmail,
  getUserById,
  updateUser,
} from "../repository/user.repository";
import { hashPassword } from "../utils/hashPassword";
import { normalizeEmails, normalizeName } from "../utils/normalize.utils";

export const createUserService = async (
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  role: Role,
) => {
  firstname = normalizeName(firstname);
  lastname = normalizeName(lastname);
  email = normalizeEmails(email);

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await hashPassword(password);

  const user = await createUser({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    role,
  });

  return user;
};

export const getUserService = async (userId: number) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateUserService = async (
  userId: number,
  data: {
    firstname?: string;
    lastname?: string;
  },
) => {
  if (data.firstname !== undefined) {
    data.firstname = normalizeName(data.firstname);
  }

  if (data.lastname !== undefined) {
    data.lastname = normalizeName(data.lastname);
  }
  const existing = await getUserById(userId);

  if (!existing) {
    throw new Error("User not found");
  }

  return updateUser(userId, data);
};
