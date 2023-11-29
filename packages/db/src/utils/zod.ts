/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type z } from "zod";

export function zod<Schema extends z.ZodSchema<any, any, any>, Return>(
  schema: Schema,
  func: (value: z.infer<Schema>) => Return,
) {
  const result = (input: z.infer<Schema>) => {
    const parsed = schema.parse(input);
    return func(parsed);
  };
  result.schema = schema;
  return result;
}
