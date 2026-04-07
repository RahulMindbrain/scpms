import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
