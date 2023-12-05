import { APIError, Api, getHTTPStatusCodeFromError } from "@modal/functions";
import { redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import type { FieldErrors } from "remix-validated-form";
import type { z } from "zod";

export type ProcedureError = {
  error: string;
  message: string;
  status: number;
};

export type ValidationError = {
  fieldErrors: FieldErrors;
  status: number;
};

export type SuccessfulResult<R> = {
  data: Awaited<R>;
  status: 200;
};

type ProcedureResult<R> =
  | ProcedureError
  | ValidationError
  | SuccessfulResult<R>;

type ProcedureParams<T, R> = {
  formData: FormData;
  request: Request;
  schema: z.ZodSchema<T, any, any>;
  fn: (params: T) => R;
};

export const publicProcedure = async <T, R>(
  formData: ProcedureParams<T, R>["formData"],
  schema: ProcedureParams<T, R>["schema"],
  fn: ProcedureParams<T, R>["fn"],
): Promise<ProcedureResult<R>> => {
  console.log("here");
  const validator = withZod(schema);
  const validatedData = await validator.validate(formData);
  console.log("valid", validatedData);
  console.log("here1");

  if (validatedData.error) {
    const validationError: ValidationError = {
      fieldErrors: validatedData.error.fieldErrors,
      status: 422,
    };
    return validationError;
  }

  try {
    const result = await fn(validatedData.data);
    const successfulResult: SuccessfulResult<R> = { data: result, status: 200 };

    return successfulResult;
  } catch (error) {
    if (error instanceof APIError) {
      return {
        error: error.code,
        message: error.message,
        status: getHTTPStatusCodeFromError(error.code),
      };
    }

    if (error instanceof Error) {
      return { error: error.message, message: error.message, status: 401 };
    }

    return { error: "UNKNOWN", message: "Something went wrong", status: 400 };
  }
};

export const protectedProcedure = async <T, R>(
  request: ProcedureParams<T, R>["request"],
  formData: ProcedureParams<T, R>["formData"],
  schema: ProcedureParams<T, R>["schema"],
  fn: ProcedureParams<T, R>["fn"],
) => {
  const session = await Api.Auth.getSession({ request });
  if (!session) {
    throw redirect("/login");
  }

  return await publicProcedure(formData, schema, fn);
};

export const isProcedureError = (data: any): data is ProcedureError => {
  return !!data && "error" in data;
};

export const isValidationError = (data: any): data is ValidationError =>
  !!data && "fieldErrors" in data;

export const isSuccessfulResult = <R>(
  data: any,
): data is SuccessfulResult<R> => {
  return !!data && "data" in data && "status" in data;
};
