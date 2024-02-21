import { wordleRouter } from "~/server/api/routers/wordle";
import { createTRPCRouter } from "~/server/api/trpc";
import { blobRouter } from "./routers/blob";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  wordle: wordleRouter,
  blob: blobRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
