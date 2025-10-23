"use client";

import Image from "next/image";
import { tmdbImage } from "@/lib/tmdb";
import type { FavoriteListItemDTO } from "@/types/favorites";

export default function FavoriteItemCard({
  item,
}: {
  item: FavoriteListItemDTO;
}) {
  const src = tmdbImage(item.posterPath ?? null, "w300");

  return (
    <article className="rounded-xl border p-3">
      {src ? (
        <Image
          src={src}
          alt={item.title}
          width={300}
          height={450}
          className="mb-2 h-auto w-full rounded-lg"
        />
      ) : (
        <div
          className="mb-2 aspect-2/3 w-full rounded-lg bg-gray-200"
          aria-label={`Sem pôster disponível para ${item.title}`}
          role="img"
        />
      )}
      <h3 className="line-clamp-2 font-medium">{item.title}</h3>
      <div className="mt-1 text-sm">
        ⭐ <b className="text-lg">{item.voteAverage.toFixed(1)}</b>
      </div>
      {item.overview && (
        <p className="mt-2 line-clamp-3 text-xs opacity-70">{item.overview}</p>
      )}
    </article>
  );
}
