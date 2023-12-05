import { z } from "zod";

// Does not include zod parse because that's done within Remix validated form

type ApiZodFn<T, R> = (params: T) => R;

export function ApiZod<T, R>(
  schema: z.ZodSchema<T, any, any>,
  fn: ApiZodFn<T, R>,
) {
  const result = (...input: Parameters<ApiZodFn<T, R>>) => {
    const parsed = schema.parse(...input);
    return fn(parsed);
  };

  result.schema = schema;
  return result;
}
