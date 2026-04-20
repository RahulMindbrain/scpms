import { z } from "zod";

export const createJobSchema = z
  .object({
    title: z
      .string({ message: "Title is required" })
      .min(3, "Title must be at least 3 characters"),

    description: z
      .string({ message: "Description is required" })
      .min(10, "Description must be at least 10 characters"),

    salary: z
      .number({ message: "Salary must be a number" })
      .positive("Salary must be greater than 0"),

    location: z
      .string({ message: "Location is required" })
      .min(2, "Location must be valid"),

    minCgpa: z
      .number({ message: "Min CGPA must be a number" })
      .min(0, "Min CGPA cannot be negative")
      .max(10, "Min CGPA cannot exceed 10"),

    maxCgpa: z.number({ message: "Max CGPA must be a number" }).min(0).max(10),

    skillIds: z
      .array(
        z.number({ message: "Skill ID must be a number" }).int().positive(),
      )
      .optional(),
    eligibleDepartmentIds: z
      .array(
        z
          .number({ message: "Department ID must be a number" })
          .int()
          .positive(),
      )
      .optional(),
  })
  .refine((data) => data.maxCgpa >= data.minCgpa, {
    message: "maxCgpa must be greater than or equal to minCgpa",
    path: ["maxCgpa"],
  });
