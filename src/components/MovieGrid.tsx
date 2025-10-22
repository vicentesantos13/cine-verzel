import { memo } from "react";
import type { TMDbMovie } from "@/types/tmdb";
import MovieCard from "./MovieCard";

interface Props {
  movies: TMDbMovie[];
  favoritesIds?: ReadonlySet<number>;
  onAdd: (movie: TMDbMovie) => void;
  onRemove: (movie: TMDbMovie) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  pendingIds?: ReadonlySet<number>; 
}

function MovieGridBase({
  movies,
  favoritesIds,
  onAdd,
  onRemove,
  isLoading = false,
  emptyMessage = "Nenhum filme encontrado.",
  pendingIds
}: Props) {
  const favSet = favoritesIds ?? new Set<number>();


  if (isLoading && movies.length === 0) {
    return (
      <section
        aria-busy="true"
        className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-3">
            <div className="mb-2 aspect-2/3 w-full animate-pulse rounded-lg bg-gray-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </section>
    );
  }

  if (movies.length === 0) {
    return <p className="mt-6 text-sm opacity-70">{emptyMessage}</p>;
  }

  return (
    <section className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {movies.map((m) => (
        <MovieCard
          key={m.id}
          movie={m}
          favoriteMovieId={favSet.has(m.id) ? m.id : undefined}
          onAdd={() => onAdd(m)}
          onRemove={() => onRemove(m)}
          disableActions={pendingIds?.has(m.id) ?? false}
        />
      ))}
    </section>
  );
}

const MovieGrid = memo(MovieGridBase);
export default MovieGrid;
