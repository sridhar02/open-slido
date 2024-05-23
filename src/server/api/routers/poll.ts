import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const pollRouter = createTRPCRouter({
  createPoll: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        slidoId: z.string(),
        pollId: z.string().optional(),
        questions: z.array(
          z.object({
            answers: z.array(
              z.object({
                text: z.string(),
                isCorrect: z.boolean(),
              }),
            ),
            text: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { title, slidoId, questions, pollId } = input;
      let idPoll;
      if (!pollId) {
        const poll = await ctx.db.poll.create({
          data: { title: title, slidoId },
        });
        idPoll = poll.id;
      } else idPoll = pollId;

      const questionInput = questions[0];

      const question =
        questionInput &&
        (await ctx.db.question.create({
          data: {
            text: questionInput.text,
            pollId: idPoll,
          },
        }));

      const answers =
        question &&
        questionInput?.answers.map((option) => {
          return { ...option, questionId: question.id };
        });

      const answerData =
        answers &&
        (await ctx.db.answer.createMany({
          data: answers,
        }));

      const pollData = await ctx.db.poll.findMany({
        where: {
          id: idPoll,
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
