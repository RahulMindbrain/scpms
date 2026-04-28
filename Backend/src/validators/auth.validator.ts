import { z } from "zod";
import { Role } from "@prisma/client";

export const registerSchema = z.object({
  firstname: z.string().min(2, "Firstname must be at least 2 characters"),
  lastname: z.string().min(2, "Lastname must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
 password: z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    "Password must contain uppercase, lowercase, number, and special character (@$!%*?& only)",
  ),
  role: z.enum([Role.STUDENT, Role.COMPANY]),
});

export const adminSchema = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email format")
    .trim()
    .toLowerCase(),

  password: z
    .string({ message: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

export const updateUserSchema = z
  .object({
    firstname: z
      .string({ message: "Firstname is required" })
      .min(2, "Firstname must be at least 2 characters")
      .optional(),

    lastname: z
      .string({ message: "Lastname is required" })
      .min(2, "Lastname must be at least 2 characters")
      .optional(),
  })
  .strict();
