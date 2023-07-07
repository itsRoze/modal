import { z } from "zod";

export const editSpaceSchema = z.object({
  name: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value) {
          return value.trim() !== "";
        }
        return true;
      },
      {
        message: "Name must not be empty or whitespace only",
      },
    ),
  spaceId: z.string().optional(),
});
