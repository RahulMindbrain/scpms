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
      .min(1)
      .max(4),

    passingYear: z
      .number({ invalid_type_error: "Passing year is required" })
      .int()
      .min(2000)
      .max(2100),

    cgpa: z.number().min(0).max(10).optional(),

    // ✅ NEW FIELDS

    resumeUrl: z.string().url("Invalid resume URL").optional(),

    skillIds: z
      .array(z.number().int().positive("Skill ID must be positive"))
      .optional(),
    experiences: z
      .array(
        z.object({
          companyName: z.string().min(1),
          role: z.string().min(1),
          description: z.string().optional(),
          startDate: z.string(), // ISO date
          endDate: z.string().optional(),
        }),
      )
      .optional(),

    certificates: z
      .array(
        z.object({
          title: z.string().min(1),
          issuer: z.string().min(1),
          certificateUrl: z.string().url().optional(),
          issuedDate: z.string().optional(),
        }),
      )
      .optional(),
  })
  .refine((data) => !(data.year === 1 && data.cgpa !== undefined), {
    message: "CGPA is not allowed for 1st year students",
    path: ["cgpa"],
  });

export const updateStudentSchema = z
  .object({
    year: z.number().int().min(1).max(4).optional(),

    passingYear: z.number().int().min(2000).max(2100).optional(),

    cgpa: z.number().min(0).max(10).optional(),

    // ✅ NEW OPTIONAL FIELDS

    resumeUrl: z.string().url().optional(),

    skillIds: z.array(z.number().int().positive()).optional(),
    experiences: z
      .array(
        z.object({
          companyName: z.string().min(1),
          role: z.string().min(1),
          description: z.string().optional(),
          startDate: z.string(),
          endDate: z.string().optional(),
        }),
      )
      .optional(),

    certificates: z
      .array(
        z.object({
          title: z.string().min(1),
          issuer: z.string().min(1),
          certificateUrl: z.string().url().optional(),
          issuedDate: z.string().optional(),
        }),
      )
      .optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.year === 1 && data.cgpa !== undefined) {
      ctx.addIssue({
        path: ["cgpa"],
        message: "CGPA is not allowed for 1st year students",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.year >= 2 && data.cgpa === undefined) {
      ctx.addIssue({
        path: ["cgpa"],
        message: "CGPA is required for students in 2nd year or above",
        code: z.ZodIssueCode.custom,
      });
    }
  });
