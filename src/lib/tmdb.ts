import type { TMDbResponse, TMDbBrowseKind } from "@/types/tmdb";

const TMDB_API = "https://api.themoviedb.org/3";

function getKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("TMDB_API_KEY missing");
  return key;
}

export async function tmdbSearch(
  query: string,
  page = 1
): Promise<TMDbResponse> {
  const url = `${TMDB_API}/search/movie?query=${encodeURIComponent(
    query
  )}&include_adult=false&language=pt-BR&page=${page}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getKey()}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`TMDb search error: ${res.status}`);
  return res.json() as Promise<TMDbResponse>;
}

export async function tmdbTrending(
  window: "day" | "week" = "day",
  page: number = 1
): Promise<TMDbResponse> {
  const url = `${TMDB_API}/trending/movie/${window}?language=pt-BR&page=${page}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getKey()}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`TMDb trending error: ${res.status}`);
  return res.json() as Promise<TMDbResponse>;
}

export async function tmdbBrowse(
  kind: TMDbBrowseKind,
  page = 1
): Promise<TMDbResponse> {
  const url = `${TMDB_API}/movie/${kind}?language=pt-BR&page=${page}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getKey()}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`TMDb ${kind} error: ${res.status}`);
  return res.json() as Promise<TMDbResponse>;
}

export function tmdbImage(
  path?: string | null,
  size: "w200" | "w300" | "w500" = "w300"
): string | undefined {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : undefined;
}
