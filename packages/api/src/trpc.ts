import { initTRPC, type inferAsyncReturnType } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

export const createInnerTRPCContext = () => {
  return {
    user: {
      id: 0,
      name: "fake user",
    },
  };
};

export const createTRPCContext = (request: Request, response: Response) => {
  return { ...createInnerTRPCContext(), request, response };
};

type TRPCContext = inferAsyncReturnType<typeof createTRPCContext>;
const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
