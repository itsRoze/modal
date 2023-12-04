import { APIError, Api } from "@modal/functions";
import { json } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import {
  validationError,
  type ValidationErrorResponseData,
} from "remix-validated-form";
import type { z } from "zod";

type ProcedureParams<T, R> = {
  request: Request;
  schema: z.ZodSchema<T, any, any>;
  fn: (params: T) => R;
};

export const publicProcedure = async <T, R>(
  request: ProcedureParams<T, R>["request"],
  schema: ProcedureParams<T, R>["schema"],
  fn: ProcedureParams<T, R>["fn"],
) => {
  const validator = withZod(schema);
  const formData = await validator.validate(await request.formData());

  if (formData.error) {
    return validationError(formData.error);
  }

  try {
    const result = await fn(formData.data);

    return json({ data: result });
  } catch (error) {
    console.error(error);

    if (error instanceof APIError) {
      return json({ error: error.code, message: error.message });
    }

    if (error instanceof Error) {
      return json({ error: error.message, message: error.message });
    }

    return json({ error: "UNKNOWN", message: "Something went wrong" });
  }
};

export const protectedProcedure = async <T, R>(
  request: ProcedureParams<T, R>["request"],
  schema: ProcedureParams<T, R>["schema"],
  fn: ProcedureParams<T, R>["fn"],
) => {
  const session = await Api.Auth.getSession({ request });
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  return await publicProcedure(request, schema, fn);
};

export const isValidationError = (
  data: any,
): data is ValidationErrorResponseData => !!data && "fieldErrors" in data;
