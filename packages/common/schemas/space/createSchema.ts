import { z } from "zod";

export const createSpaceSchema = z.object({
  name: z
    .string()
    .nonempty()
    .refine((value) => value.trim() !== "", {
      message: "Name must not be empty or whitespace only",
    }),
});
