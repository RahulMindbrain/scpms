import { Role } from "@prisma/client";
import { createUser, findUserByEmail } from "../repository/user.repository";
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
