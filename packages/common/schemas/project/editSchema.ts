import { z } from "zod";

export const editProjectSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .nonempty()
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
  spaceId: z.string().nullish(),
});
