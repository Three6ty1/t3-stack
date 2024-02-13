import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import * as wordle from "./wordleServer";
import { db } from "~/server/db";

const operatorSchema = z.object({
    id: z.number(),
    charId: z.string(),
    name: z.string(),
    gender: z.string(),
    race: z.string(),
    group: z.string().nullable(),
    nation: z.string(),
    profession: z.string(),
    archetype: z.string(),
    position: z.string(),
    infected: z.string(),
    rarity: z.number(),
    costE0: z.number(),
    costE2: z.number(),
})

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
                guessOp: operatorSchema, 
                guesses: z.array(z.string()),
                correctId: z.number(),
            }
        ))
        .query(async ({ ctx, input }) => {
            return await wordle.compareGuess(ctx.db, input.guessOp, input.guesses, input.correctId);
    }),

    allOperators: publicProcedure
        .query(async ({ ctx }) => {
            return await wordle.getAllOperators(ctx.db);
        }),
});

export const getStats = async() => {
    return await wordle.getOperatorStats(db);
}

export const getAllOperators = async() => {
    return await wordle.getAllOperators(db);
}

export type Stats = {
    gameId: number;
    date: string;
    operatorId: number;
    timesGuessed: number;
}