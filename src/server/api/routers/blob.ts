import { BlobTags } from "@prisma/client";
import { z } from "zod";
import { getDateString } from "~/helper/helper";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const blobRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
      title: z.string().min(3),
      description: z.string().nullable(),
      tags: z.array(z.nativeEnum(BlobTags)),
      images: z.array(z.string()),
      videos: z.array(z.string()),
    }))
    .mutation(async({ ctx, input }) => {
      ctx.db.blob.create({
        data: {
          date: getDateString(),
          title: input.title,
          description: input.description,
          tags: input.tags,
          images: input.images,
          videos: input.videos,
        }
      })
    }),
})