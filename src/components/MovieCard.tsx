import type { TMDbMovie } from "@/types/tmdb";
import { tmdbImage } from "@/lib/tmdb";
import Image from "next/image";
import { memo } from "react";

interface Props {
  movie: TMDbMovie;
  favoriteMovieId?: number;
  onAdd: () => void;
  onRemove: () => void;
  disableActions?: boolean;
}

function MovieCardBase({
  movie,
  favoriteMovieId,
  onAdd,
  onRemove,
  disableActions,
}: Props) {
  const src = tmdbImage(movie.poster_path, "w300");

  return (
    <article className="rounded-xl border p-3">
      {src ? (
        <Image
          src={src}
          alt={movie.title}
          width={300}
          height={450}
          className="mb-2 w-full rounded-lg h-auto"
        />
      ) : (
        <div
          className="mb-2 aspect-2/3 w-full rounded-lg bg-gray-200"
          aria-label={`Sem pôster disponível para ${movie.title}`}
          role="img"
        />
      )}

      <h3 className="line-clamp-2 font-medium">{movie.title}</h3>

      <div className="mt-1 flex items-center justify-between">
        <span className="text-sm">
          ⭐ <b className="text-lg">{movie.vote_average.toFixed(1)}/10</b>
        </span>

        {favoriteMovieId === movie.id ? (
          <button
            onClick={onRemove}
            disabled={disableActions}
            className="rounded-lg bg-red-600 text-white border px-3 py-1 text-sm cursor-pointer"
            aria-label={`Remover ${movie.title} dos favoritos`}
          >
            Remover
          </button>
        ) : (
          <button
            onClick={onAdd}
            disabled={disableActions}
            className="rounded-lg bg-black px-3 py-1 text-sm text-white cursor-pointer"
            aria-label={`Adicionar ${movie.title} aos favoritos`}
          >
            Favoritar
          </button>
        )}
      </div>

      <p className="mt-2 line-clamp-3 text-xs opacity-70">{movie.overview}</p>
    </article>
  );
}

const MovieCard = memo(MovieCardBase);
export default MovieCard;
