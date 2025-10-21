import { z } from "zod";

export const favoriteSchema = z.object({
  movieId: z.number(),
  title: z.string().min(1),
  posterPath: z.string().nullable().optional(),
  overview: z.string().nullable().optional(),
  voteAverage: z.number(),
  releaseDate: z.string().nullable().optional(),
});
export type FavoritePayload = z.infer<typeof favoriteSchema>;
