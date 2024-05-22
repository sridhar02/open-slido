import { z } from "zod";
import { customAlphabet } from "nanoid";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const slidoRouter = createTRPCRouter({
  createSlido: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const nanoid = customAlphabet("0123456789", 7);

      const joinCode = nanoid(7);

      return ctx.db.slido.create({
        data: {
          title: input.title,
          userId: ctx.session.user.id,
          joinCode,
          startDate: input.startDate,
          endDate: input.endDate,
        },
      });
    }),

  getAllSlidos: protectedProcedure.query(({ ctx }) => {
    return ctx.db.slido.findMany({
      orderBy: { createdAt: "desc" },
      where: { userId: ctx.session.user.id },
    });
  }),

  getSlido: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.slido.findUnique({
        where: { id: input.id },
      });
    }),
});
