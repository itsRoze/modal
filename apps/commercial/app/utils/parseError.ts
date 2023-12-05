import { APIError, getHTTPStatusCodeFromError } from "@modal/functions";
import { ZodError } from "zod";

export default function parseError(error: unknown) {
  if (error instanceof ZodError) {
    const flattened = error.flatten();
    return {
      errors: flattened.fieldErrors,
      status: 422,
    };
  }

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
