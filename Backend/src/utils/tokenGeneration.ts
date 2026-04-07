import jwt from "jsonwebtoken";

type Role = "STUDENT" | "COMPANY" | "ADMIN";

export const generateAccessToken = (id: number, role: Role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_ACCESS_TTL,
  });
};

export const generateRefreshToken = (id: number, role: Role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_REFRESH_TTL,
  });
};
