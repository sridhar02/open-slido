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
                id: z.number().optional(),
                text: z.string(),
                isCorrect: z.boolean(),
              }),
            ),
            id: z.number().optional(),
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
      } else {
        const poll = await ctx.db.poll.update({
          where: { id: pollId },
          data: { title: title },
        });
        idPoll = pollId;
      }
      // const questionInput = questions[0];

      // const question =
      //   questionInput &&
      //   (await ctx.db.question.create({
      //     data: {
      //       text: questionInput.text,
      //       pollId: idPoll,
      //     },
      //   }));

      // const answers =
      //   question &&
      //   questionInput?.answers.map((option) => {
      //     return { ...option, questionId: question.id };
      //   });

      // const answerData =
      //   answers &&
      //   (await ctx.db.answer.createMany({
      //     data: answers,
      //   }));

      for (const questionInput of questions) {
        let question;
        if (questionInput?.id) {
          // Update existing question
          question = await ctx.db.question.update({
            where: { id: questionInput?.id },
            data: { text: questionInput.text },
          });
        } else {
          // Create new question
          question = await ctx.db.question.create({
            data: {
              text: questionInput.text,
              pollId: idPoll,
            },
          });
        }

        for (const answerInput of questionInput.answers) {
          if (answerInput?.id) {
            // Update existing answer
            await ctx.db.answer.update({
              where: { id: answerInput?.id },
              data: {
                text: answerInput.text,
                isCorrect: answerInput.isCorrect,
              },
            });
          } else {
            // Create new answer
            await ctx.db.answer.create({
              data: {
                text: answerInput.text,
                isCorrect: answerInput.isCorrect,
                questionId: question.id,
              },
            });
          }
        }
      }

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
