import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const pollRouter = createTRPCRouter({
  createPoll: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        questionText: z.string(),
        slidoId: z.string(),
        options: z.array(
          z.object({
            isCorrect: z.boolean(),
            text: z.string(),
            id: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const poll = await ctx.db.poll.create({
        data: { title: input.title, slidoId: input.slidoId },
      });

      const question = await ctx.db.question.create({
        data: {
          text: input.questionText,
          pollId: poll.id,
        },
      });

      const answers = input.options.map((option) => {
        return { ...option, questionId: question.id };
      });

      const answerData = await ctx.db.answer.createMany({
        data: answers,
      });
      const pollData = await ctx.db.poll.findMany({
        where: {
          id: poll.id,
        },
        include: {
          Question: true,
        },
      });

      return pollData;
    }),

  getAll: protectedProcedure
    .input(z.object({ slidoId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.poll.findMany({
        where: { slidoId: input.slidoId },
      });
    }),

  // getPoll: protectedProcedure
  //   .input(z.object({ slidoId: z.string() }))
  //   .query(({ ctx, input }) => {
  //     return ctx.db.poll.findUnique({
  //       where: { slidoId: input.slidoId },
  //     });
  //   }),
});
