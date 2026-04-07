import { z } from "zod";

export const createStudentSchema = z
  .object({
    departmentId: z
      .number({ invalid_type_error: "Department is required" })
      .int()
      .positive(),

    year: z
      .number({ invalid_type_error: "Year is required" })
      .int()
      .min(1, "Year must be at least 1")
      .max(4, "Year cannot be more than 4"),

    passingYear: z
      .number({ invalid_type_error: "Passing year is required" })
      .int()
      .min(2000, "Invalid passing year")
      .max(2100, "Invalid passing year"),

    cgpa: z
      .number()
      .min(0, "CGPA cannot be negative")
      .max(10, "CGPA cannot exceed 10")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.year === 1 && data.cgpa !== undefined) {
        return false;
      }
      return true;
    },
    {
      message: "CGPA is not allowed for 1st year students",
      path: ["cgpa"],
    },
  );
