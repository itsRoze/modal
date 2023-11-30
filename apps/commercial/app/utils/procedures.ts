import { AuthAPI } from "@modal/functions";
import { withZod } from "@remix-validated-form/with-zod";
import type { ValidationErrorResponseData } from "remix-validated-form";
import type { z } from "zod";

export const publicProcedure = async (
  request: Request,
  schema: z.ZodSchema,
) => {
  const validator = withZod(schema);
  return await validator.validate(await request.formData());
};

export const protectedProcedure = async (
  request: Request,
  schema: z.ZodSchema,
) => {
  const isLoggedIn = await AuthAPI.isLoggedIn({ request });
  if (!isLoggedIn) {
    throw new Error("UNAUTHORIZED");
  }

  return await publicProcedure(request, schema);
};

export const isValidationError = (
  data: any,
): data is ValidationErrorResponseData => !!data && "fieldErrors" in data;
