import {
  findByEmail,
  findById,
  logoutRepo,
  storeRefreshToken,
} from "../repository/auth.repository";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenGeneration";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginService = async (mobile: string, password: string) => {
  const existUser = await findByEmail(mobile);

  if (!existUser) {
    throw new Error("Invalid email or password");
  }

  //   if (existUser.status === "INACTIVE") {
  //     throw new Error("Account not approved");
  //   }

  const isPassword = await bcrypt.compare(password, existUser.password);

  if (!isPassword) {
    throw new Error("Invalid mobile or password");
  }

  const { password: _p, ...safeUser } = existUser;

  const accessToken = generateAccessToken(existUser.id, existUser.role);
  const refreshToken = generateRefreshToken(existUser.id, existUser.role);

  await storeRefreshToken(existUser.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: safeUser,
  };
};

export const generateAccessService = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.jwtRefreshSecret as string,
    ) as { id: number; role: string };

    const user = await findById(decoded.id);

    if (!user) {
      throw new Error("Invalid or expired refresh token");
    }

    if (user.status === "INACTIVE") {
      throw new Error("Account not approved");
    }

    if (user.refreshToken !== refreshToken) {
      throw new Error("Invalid or expired refresh token");
    }

    const newAccessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id, user.role);

    await storeRefreshToken(user.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch {
    throw new Error("Invalid or expired refresh token");
  }
};

export const logoutService = async (id: number) => {
  if (!id) {
    throw new Error("User id is required");
  }

  await logoutRepo(id);
  return true;
};
