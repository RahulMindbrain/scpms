import jwt, { Secret } from "jsonwebtoken";
import type { StringValue } from "ms";

type Role = "STUDENT" | "COMPANY" | "ADMIN";

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TTL = process.env.JWT_ACCESS_TTL;
const REFRESH_TTL = process.env.JWT_REFRESH_TTL;

if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
if (!ACCESS_TTL) throw new Error("JWT_ACCESS_TTL is not defined");
if (!REFRESH_TTL) throw new Error("JWT_REFRESH_TTL is not defined");

const secret: Secret = JWT_SECRET;

const accessExpiresIn = ACCESS_TTL as StringValue | number;
const refreshExpiresIn = REFRESH_TTL as StringValue | number;

export const generateAccessToken = (id: number, role: Role) => {
  return jwt.sign({ id, role }, secret, {
    expiresIn: accessExpiresIn,
  });
};

export const generateRefreshToken = (id: number, role: Role) => {
  return jwt.sign({ id, role }, secret, {
    expiresIn: refreshExpiresIn,
  });
};
