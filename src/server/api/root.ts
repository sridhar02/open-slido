import { slidoRouter } from "~/server/api/routers/slido";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { pollRouter } from "./routers/poll";
import { answerRouter } from "./routers/answer";
import { questionRouter } from "./routers/question";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  poll: pollRouter,
  slido: slidoRouter,
  question: questionRouter,
  answer: answerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
