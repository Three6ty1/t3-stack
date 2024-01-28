import { PrismaClient } from "@prisma/client";
import db from '../operator_db.json'

// To run
// "npx prisma db seed"
// dumb shit prisma seeding
// https://github.com/prisma/prisma/issues/7053#issuecomment-1679880184
interface Dictionary<T> {
  [Key: string]: T;
}

interface Operator {
  charId: string;
  gender: string;
  race: string;
  group?: string;
  nation: string;
  profession: string;
  archetype: string;
  position: string;
  rarity: number;
  cost: number[];
  infected: string;
}

const prisma = new PrismaClient()
async function main() {
  let amt = 0
  const operator_db:Dictionary<Operator> = db;
  // await prisma.operator.deleteMany()
  const operators = await prisma.operator.count();
  for (const key in operator_db) {
      const operator = operator_db[key]
      if (!operator) {
        throw `Missing operator ${key}`
      }
      if (!operator.cost[0] || !operator.cost[1]) {
        throw `Missing operator cost for ${key}`
      }
      await prisma.operator.upsert({
          where: {
              charId: operator.charId,
          },
          create: { charId: operator.charId,
              name: key,
              gender: operator.gender,
              race: operator.race,
              nation: operator.nation,
              profession: operator.profession,
              archetype: operator.archetype,
              position: operator.position,
              rarity: operator.rarity,
              costE0: operator.cost[0],
              costE2: operator.cost[1],
              infected: operator.infected,
          },
          update: {
              name: key,
              gender: operator.gender,
              race: operator.race,
              nation: operator.nation,
              profession: operator.profession,
              archetype: operator.archetype,
              position: operator.position,
              rarity: operator.rarity,
              costE0: operator.cost[0],
              costE2: operator.cost[1],
              infected: operator.infected,
          },
      });

      if (operator.group !== '') {
          await prisma.operator.update({
              where: {
                  charId: operator.charId
              },
              data: {
                  group: operator.group
              }
          })
      }

      amt += 1
  }

  console.log(amt + ' total operators seeded into db');
  console.log(`(${await prisma.operator.count() - operators}) new operators seeded (Old ${operators})`);

  // Doesnt have an icon yet...
  await prisma.operator.delete(
    {
      where: {
        name: 'Friston-3',
      }
    }
  )
}

main()
.then(async () => {
  await prisma.$disconnect()
})
.catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
