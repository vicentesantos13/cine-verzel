"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { TMDbBrowseKind, TMDbMovie, TMDbResponse } from "@/types/tmdb";
import CatalogTabs from "./CatalogTabs";
import SearchForm from "./SearchForm";
import MovieGrid from "./MovieGrid";
import Pagination from "./Pagination";

type ViewState =
  | { type: "browse"; kind: TMDbBrowseKind; page: number }
  | { type: "trending"; window: "day" | "week"; page: number }
  | { type: "search"; q: string; page: number };

const INITIAL_STATE: ViewState = { type: "browse", kind: "popular", page: 1 };

export default function CatalogClient() {
  const [state, setState] = useState<ViewState>(INITIAL_STATE);
  const [data, setData] = useState<TMDbResponse | null>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [favIds, setFavIds] = useState<ReadonlySet<number>>(new Set());
  const [pendingIds, setPendingIds] = useState<ReadonlySet<number>>(new Set());

  const apiUrl = useMemo(() => {
    if (state.type === "browse")
      return `/api/tmdb/browse?kind=${state.kind}&page=${state.page}`;
    if (state.type === "trending")
      return `/api/tmdb/trending?window=${state.window}&page=${state.page}`;
    return `/api/tmdb/search?q=${encodeURIComponent(state.q)}&page=${
      state.page
    }`;
  }, [state]);

  async function addFavorite(m: TMDbMovie) {
    setFavIds((prev) => new Set([...prev, m.id]));
    markPending(m.id, true);

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: m.id,
          title: m.title,
          posterPath: m.poster_path ?? null,
          overview: m.overview ?? null,
          voteAverage: m.vote_average,
          releaseDate: m.release_date ?? null,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      setFavIds((prev) => {
        const n = new Set(prev);
        n.delete(m.id);
        return n;
      });
      console.error("Falha ao favoritar:", e);
    } finally {
      markPending(m.id, false);
    }
  }

  async function deleteFavorite(m: TMDbMovie) {
    setFavIds((prev) => {
      const n = new Set(prev);
      n.delete(m.id);
      return n;
    });
    markPending(m.id, true);

    try {
      const res = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: m.id }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      setFavIds((prev) => new Set([...prev, m.id]));
      console.error("Falha ao remover favorito:", e);
    } finally {
      markPending(m.id, false);
    }
  }

  function markPending(id: number, on: boolean) {
    setPendingIds((prev) => {
      const n = new Set(prev);
      if (on) {
        n.add(id);
      } else {
        n.delete(id);
      }
      return n;
    });
  }

  useEffect(() => {
    let alive = true;
    setError(null);
    (async () => {
      try {
        const res = await fetch(apiUrl, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as TMDbResponse;
        if (alive) setData(json);
      } catch (e) {
        if (!alive) return;
        const msg = e instanceof Error ? e.message : "Erro desconhecido";
        setError(msg);
        setData({ page: 1, results: [], total_pages: 1, total_results: 0 });
      }
    })();

    return () => {
      alive = false;
    };
  }, [apiUrl]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/favorites", { cache: "no-store" });
      if (!res.ok) return;
      const json: { items: { movieId: number }[] } = await res.json();
      setFavIds(new Set(json.items.map((i) => i.movieId)));
    })();
  }, []);

  const setBrowse = (kind: TMDbBrowseKind) =>
    start(() => setState({ type: "browse", kind, page: 1 }));
  const setTrending = (w: "day" | "week") =>
    start(() => setState({ type: "trending", window: w, page: 1 }));
  const setSearch = (q: string) =>
    start(() => setState({ type: "search", q, page: 1 }));
  const goPage = (p: number) =>
    start(() => setState((s) => ({ ...s, page: p })));

  const activeTabs =
    state.type === "search"
      ? ({ type: "search" } as const)
      : state.type === "trending"
      ? ({ type: "trending", window: state.window } as const)
      : ({ type: "browse", kind: state.kind } as const);

  return (
    <>
      <CatalogTabs
        active={activeTabs}
        pending={pending}
        onBrowse={setBrowse}
        onTrending={setTrending}
      />

      <SearchForm
        key={state.type === "search" ? state.q : "always"}
        defaultQuery={state.type === "search" ? state.q : ""}
        pending={pending}
        onSubmit={({ q }) => setSearch(q)}
      />

      {pending && <p className="my-2 text-sm opacity-70">Carregando…</p>}
      {error && <p className="my-2 text-sm text-red-600">Erro: {error}</p>}

      <MovieGrid
        movies={data?.results ?? []}
        favoritesIds={favIds}
        pendingIds={pendingIds}
        onAdd={(m) => {
          addFavorite(m);
        }}
        onRemove={(m) => {
          deleteFavorite(m);
        }}
      />

      {data && (
        <Pagination
          totalPages={data.total_pages}
          currentPage={data.page}
          pending={pending}
          onPage={goPage}
        />
      )}
    </>
  );
}
