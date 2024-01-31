import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import * as wordle from "./wordleServer";
export const wordleRouter = createTRPCRouter({
    // Mutation because we might generate a new operator
    stats: publicProcedure
        .query(async ({ ctx }) => {
            const res = await wordle.getOperatorStats(ctx.db);
            return res;
    }),
    
    compare: publicProcedure
        .input(z.object(
            { 
                guess: z.string(), 
                guesses: z.array(z.string())
            }
        ))
        .query(async ({ ctx, input }) => {
            return await wordle.compareGuess(ctx.db, input.guess, input.guesses);
    }),

    allNames: publicProcedure
        .query(async ({ ctx }) => {
            return await wordle.getAllOperators(ctx.db);
        }),
});
