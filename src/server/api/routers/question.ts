import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const questionRouter = createTRPCRouter({
  getQuestions: protectedProcedure
    .input(z.object({ pollId: z.string().optional() }))
    .query(({ ctx, input }) => {
      if (input.pollId) {
        return ctx.db.question.findMany({
          where: { pollId: input.pollId },
          include: {
            answers: true,
          },
        });
      }
    }),

  createQuestion: protectedProcedure
    .input(z.object({ pollId: z.string(), text: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.question.create({
        data: { pollId: input.pollId, text: input.text },
      });
    }),

  updateQuestion: protectedProcedure
    .input(z.object({ questionId: z.number(), text: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.question.update({
        where: { id: input.questionId },
        data: { text: input.text },
      });
    }),

  deleteQuestion: protectedProcedure
    .input(z.object({ questionId: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.question.delete({
        where: { id: input.questionId },
      });
    }),
});
