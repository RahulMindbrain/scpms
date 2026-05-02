import z from "zod";

export const universitySchema = z.object({
  name: z.string().min(2),
  code: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});
