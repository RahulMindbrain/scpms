import { Role } from "@prisma/client";
import {
  createUser,
  findUserByEmail,
  getUserById,
  updateUser,
} from "../repository/user.repository";
import { hashPassword } from "../utils/hashPassword";

export const createUserService = async (
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  role: Role,
) => {
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
  const existing = await getUserById(userId);

  if (!existing) {
    throw new Error("User not found");
  }

  return updateUser(userId, data);
};
