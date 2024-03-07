import { BlobTags } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { isValidYoutubeLink } from "~/helper/blobHelper";
import { getDateString } from "~/helper/wordleHelper";
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
      for (const link of input.videos) {
        if (!isValidYoutubeLink(link)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "Invalid YouTube link: " + link,
          });
        }
      }

      return await ctx.db.blob.create({
        data: {
          date: getDateString(),
          title: input.title,
          description: input.description,
          tags: input.tags,
          videos: input.videos,
        }
      })
    }),
  linkImages: publicProcedure
    .input(z.object({
      id: z.number().nonnegative(),
      images: z.array(z.string()),
    }))
    .mutation(async({ ctx, input }) => {
      await ctx.db.blob.update({
        where: {
          id: input.id,
        },
        data: {
          images: input.images,
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
      await ctx.db.blob.update({
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
      await ctx.db.blob.delete({
        where: {
          id: input.id,
        }
      })
    }),
  getAll: publicProcedure
    .query(async({ ctx }) => (
      await ctx.db.blob.findMany({
        orderBy: {
          id: 'asc',
        }
      })
    ))
})

export const getAllBlobs = async() => { 
  return await db.blob.findMany({
    orderBy: {
      id: 'asc',
    }
  })
}
