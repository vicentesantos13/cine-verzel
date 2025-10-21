export type FavoriteUpsertPayload = {
  movieId: number;
  title: string;
  posterPath?: string | null;
  overview?: string | null;
  voteAverage: number;
  releaseDate?: string | null;
};

export type FavoriteDeletePayload = {
  movieId: number;
};

export type FavoriteItemDTO = {
  id: string;
  listId: string;
  movieId: number;
  title: string;
  posterPath?: string | null;
  overview?: string | null;
  voteAverage: number;
  releaseDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type FavoriteListDTO = {
  id: string;
  items: FavoriteItemDTO[];
  createdAt?: string;
  updatedAt?: string;
};
