import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import * as wordle from "./wordleServer";

export const wordleRouter = createTRPCRouter({
    // Mutation because we might generate a new operator
    stats: publicProcedure
        .mutation(async ({ ctx }) => {
            return await wordle.getOperatorStats(ctx.db);
    }),
    
    compare: publicProcedure
        .input(z.object({ guess: z.string() }))
        .query(async ({ ctx, input }) => {
            return await wordle.compareGuess(ctx.db, input.guess);
    }),

    allNames: publicProcedure
        .query(async ({ ctx }) => {
            return await wordle.getAllOperatorNames(ctx.db);
        }),
    

    /**
  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          name: input.name,
        },
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),
  */
});
