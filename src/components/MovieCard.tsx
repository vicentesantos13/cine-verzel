import type { TMDbMovie } from "@/types/tmdb";
import { tmdbImage } from "@/lib/tmdb";
import Image from "next/image";
import { memo } from "react";

interface Props {
  movie: TMDbMovie;
  isFavorite: boolean;
  onAdd: () => void;
  onRemove: () => void;
}

function MovieCardBase({ movie, isFavorite, onAdd, onRemove }: Props) {
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
          ⭐ <b className="text-lg">{movie.vote_average.toFixed(1)}</b>
        </span>

        {isFavorite ? (
          <button
            onClick={onRemove}
            className="rounded-lg border px-3 py-1 text-sm"
            aria-label={`Remover ${movie.title} dos favoritos`}
          >
            Remover
          </button>
        ) : (
          <button
            onClick={onAdd}
            className="rounded-lg bg-black px-3 py-1 text-sm text-white"
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
