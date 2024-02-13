import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import * as wordle from "./wordleServer";
import { db } from "~/server/db";
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
                guessId: z.string(), 
                guesses: z.array(z.string()),
                correctId: z.string(),
            }
        ))
        .query(async ({ ctx, input }) => {
            return await wordle.compareGuess(ctx.db, input.guessId, input.guesses, input.correctId);
    }),

    allNames: publicProcedure
        .query(async ({ ctx }) => {
            return await wordle.getAllOperators(ctx.db);
        }),
});

export const getStats = async() => {
    return await wordle.getOperatorStats(db);
}

export const getAllNames = async() => {
    return await wordle.getAllOperators(db);
}

export type Stats = {
    gameId: number;
    date: string;
    operatorId: string;
    timesGuessed: number;
}