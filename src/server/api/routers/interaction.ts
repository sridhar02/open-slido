import { z } from "zod";
import { customAlphabet } from "nanoid";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const interactionRouter = createTRPCRouter({
  createInteraction: protectedProcedure
    .input(z.object({ title: z.string(), slidoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.interaction.create({
        data: { title: input.title, slidoId: input.slidoId },
      });
    }),

  getAll: protectedProcedure
    .input(z.object({ slidoId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.interaction.findMany({
        where: { slidoId: input.slidoId },
      });
    }),
});