import { z } from "zod";

export const editSpaceSchema = z.object({
  id: z.string(),
  name: z.string().refine(
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
});
