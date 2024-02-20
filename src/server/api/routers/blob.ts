import { $Enums, BlobTags } from "@prisma/client";
import { z } from "zod";
import { getDateString } from "~/helper/helper";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export type Blob = {
  id: number;
  date: Date;
  edit: Date | null;
  title: string;
  description: string | null;
  tags: $Enums.BlobTags[];
  images: string[];
  videos: string[];
  likes: number;
}

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
  edit: publicProcedure
    .input(z.object({
      id: z.number().nonnegative(),
      title: z.string().min(3),
      description: z.string().nullable(),
      tags: z.array(z.nativeEnum(BlobTags)),
      images: z.array(z.string()),
      videos: z.array(z.string()),
    }))
    .mutation(async({ ctx, input}) => {
      ctx.db.blob.update({
        where: {
          id: input.id
        },
        data: {
          edit: getDateString(),
          title: input.title,
          description: input.description,
          tags: input.tags,
          images: input.images,
          videos: input.videos,
        }
      })
    }),
  delete: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async({ ctx, input }) => {
      ctx.db.blob.delete({
        where: {
          id: input.id,
        }
      })
    })
})

export const getAllBlobs = async() => { 
  return await db.blob.findMany({
    orderBy: {
      id: 'asc',
    }
  })
}
