import { getDateString, randomInteger } from '~/helper/helper';
import type { Prisma, PrismaClient } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';

// Chooses a new operator for today
// Restrains the new operator to not have been picked in the last TOTAL_OPERATORS/2 days
const chooseNewOperator = async(db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
    const prev = await db.chosenOperators.findFirst({
        where: { date: getDateString()}
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
            if (!prev || chosenOperator.chosen.length >= Math.floor(prev.gameId / Math.floor(operators.length / 2))) {
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
    const date = getDateString();

    // Is there a game created for today?
    let chosen = await db.chosenOperators.findFirst({
        where: { date: date },
    })

    if (!chosen) {
        chosen = await handleNewDay(db, date);
    }

    const op = await db.operator.findFirst({
        where: { id: chosen.operatorId}
    })

    const res = {
        gameId: chosen.gameId,
        date: chosen.date,
        operator: op,
        timesGuessed: chosen.timesGuessed 
    }

    return res
}

// Get the stats of the currently chosen operator
export const getOperatorStats = async(db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
    return getTodayOperator(db);
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

export const updateWins = async(db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
    const date = getDateString();

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