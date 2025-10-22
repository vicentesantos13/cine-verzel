import z from "zod";

export const deleteFavoriteSchema = z.object({
  movieId: z.number(),
});