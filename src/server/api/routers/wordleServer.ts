import { randomInteger } from '~/helper/helper';
import type { Prisma, PrismaClient } from '@prisma/client';
import type { Operator } from '@prisma/client';
import { Range, Correctness } from '~/helper/helper';
import type { DefaultArgs } from '@prisma/client/runtime/library';
import { TRPCError } from '@trpc/server';


export type GuessResult = {
    charId: string,
    name: string,
    gender: {guess: string, result: boolean},
    race: {guess: string, result: boolean},
    allegiance: {guess: string, result: Correctness},
    infected: {guess: string, result: boolean},
    profession: {guess: string, result: boolean},
    rarity: {guess: number, result: Range},
    cost: {guess: number[], result: Range},
    correct: boolean,
}

// Chooses a new operator for today
// Restrains the new operator to not have been picked in the last TOTAL_OPERATORS/2 days
const chooseNewOperator = async(db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
    const prev = await db.chosenOperators.findFirst({
        where: { date: new Date().toLocaleString(undefined, {timeZone: "Australia/Sydney", dateStyle: "short"})}
    });

    const operators = await db.operator.findMany();

    while(true) {
        // Get a random operator
        const toChoose = operators[randomInteger(0, operators.length)];

        if (!toChoose) {
            throw "Invalid operator chosen. Not possible?"
        }

        const chosenOperator = await db.operator.findFirst({
            where: {
                id: toChoose.id
            },
            include: {
                chosen: true,
            },
        });

        // An operator might not have been chosen before.
        if (chosenOperator) {  
            // If amount of times chosen is more than the total games played / half the amount of operators, choose a new operator.
            if (!prev || chosenOperator.chosen.length <= Math.floor(prev.gameId / Math.floor(operators.length / 2))) {
                return chosenOperator
            }
        }
    } 
}

const handleNewDay = async(db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, date: string) => {
    const chosen = await chooseNewOperator(db);
    
    const res = await db.chosenOperators.create({
        data: {
            date: date,
            operatorId: chosen.id,
            timesGuessed: 0,
        }
    });
    console.log(`New Operator chosen ${chosen.name}`)

    return res;
}

const getTodayOperator = async(db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
    const date = new Date().toLocaleString(undefined, {timeZone: "Australia/Sydney", dateStyle: "short"});

    // Is there a game created for today?
    let res = await db.chosenOperators.findFirst({
        where: { date: date },
    })

    if (!res) {
        res = await handleNewDay(db, date);
    }

    return res
}

// Get the stats of the currently chosen operator
export const getOperatorStats = async(db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
    return getTodayOperator(db);
}

const compareGuessLogic = (answer: Operator, guess: Operator):GuessResult => {
    /**
     * Groups take precedence in allegiances over nation (more specific)
     * 
     * AG, GG (Answer Group, Guess Group)
     * AG, GN (Guess Nation)
     * AN, GG etc...
     * AN, GN
    */
    let allegiance_res;
    if (answer.group && guess.group) { // AG, GG
        // Answer has group, guess has group
        if (answer.group == guess.group) {
            allegiance_res = Correctness.Correct;
        } else { // Wrong group but same nation (Like Rhodes Island)
            allegiance_res = (answer.nation == guess.nation) ? Correctness.Half : Correctness.Wrong;
        }
    } else if (!answer.group && !guess.group) { // AN, GN
        allegiance_res = (answer.nation == guess.nation) ? Correctness.Correct : Correctness.Wrong;
    } else { // AG, GN || AN, GG Can't compare the groups to nations as their scope is different, can only compare nations and be half correct.
        allegiance_res = (answer.nation == guess.nation) ? Correctness.Half : Correctness.Wrong;
    }

    const res = {
        gender: {guess: guess.gender, result: answer.gender === guess.gender},
        race: {guess: guess.race, result: answer.race === guess.race},
        allegiance: { guess: guess.group ? guess.group : guess.nation, result: allegiance_res },
        infected: {guess: guess.infected, result: answer.infected === guess.infected},
        profession: {guess: guess.profession, result: answer.profession === guess.profession},
        rarity: {guess: guess.rarity, result: ((answer.rarity < guess.rarity) ? Range.Lower : (answer.rarity > guess.rarity) ? Range.Higher : Range.Correct)},
        cost: {guess: [guess.costE0, guess.costE2], result: ((answer.costE2 < guess.costE2) ? Range.Lower : (answer.costE2 > guess.costE2) ? Range.Higher : Range.Correct)},
    }
    
    return {
        charId: guess.charId,
        name: guess.name,
        ...res,
        correct: res.gender.result &&
        res.race.result &&
        res.allegiance.result == Correctness.Correct &&
        res.profession.result &&
        res.rarity.result == Range.Correct &&
        res.cost.result == Range.Correct &&
        res.infected.result,
    }
}

// Compare the guess with the operator of the day
export const compareGuess = async(db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, guessOp: Operator, guesses: string[], correctId: number) => {
    if (guesses.includes(guessOp.name)) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Operator has already been guessed: `,
        })
    }

    const compareOp = await db.operator.findFirstOrThrow({ where: { id: correctId } })
    
    const result = compareGuessLogic(compareOp, guessOp);

    result.correct && updateWins(db).catch(() => {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Could not update wins',
        })
    });

    return compareGuessLogic(compareOp, guessOp);
}

// Get a list of all the operator names in the database
export const getAllOperators = async(db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
    const ops = await db.operator.findMany({
        orderBy: {
            name: 'asc',
        }
    });

    return ops;
}

const updateWins = async(db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
    const date = new Date().toLocaleString(undefined, {timeZone: "Australia/Sydney", dateStyle: "short"});

    // Need transaction here to prevenot race condition on updating the wins.
    await db.$transaction(async (tx) => {
        const chosenOperator = await tx.chosenOperators.findFirst({
            where: { date: date },
        })

        await tx.chosenOperators.update({
            where: { gameId: chosenOperator?.gameId },
            data: {timesGuessed: {
                increment: 1,
            }}
        })
    })
}