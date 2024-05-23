import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const answerRouter = createTRPCRouter({
  getAnswers: protectedProcedure
    .input(z.object({ questionId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.answer.findMany({
        where: { questionId: input.questionId },
      });
    }),

  createAnswer: protectedProcedure
    .input(z.object({ questionId: z.number(), text: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.answer.create({
        data: { questionId: input.questionId, text: input.text },
      });
    }),

  updateAnswer: protectedProcedure
    .input(
      z.object({
        answerId: z.number(),
        text: z.string(),
        isCorrect: z.optional(z.boolean()),
      }),
    )
    .mutation(({ ctx, input }) => {
      const data: { text?: string; isCorrect?: boolean } = {};

      if (input.text) data.text = input.text;
      if (input.isCorrect) data.isCorrect = input.isCorrect;

      return ctx.db.question.update({
        where: { id: input.answerId },
        data,
      });
    }),

  deleteQuestion: protectedProcedure
    .input(z.object({ answerId: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.answer.delete({
        where: { id: input.answerId },
      });
    }),
});
