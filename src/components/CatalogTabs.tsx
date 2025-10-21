"use client";

import type { TMDbBrowseKind } from "@/types/tmdb";

interface Props {
  active:
    | { type: "browse"; kind: TMDbBrowseKind }
    | { type: "trending"; window: "day" | "week" }
    | { type: "search" };
  pending: boolean;
  onBrowse: (kind: TMDbBrowseKind) => void;
  onTrending: (window: "day" | "week") => void;
  onSearch: () => void;
}

export default function CatalogTabs({
  active,
  pending,
  onBrowse,
  onTrending,
  onSearch,
}: Props) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <Tab
        label="Popular"
        active={active.type === "browse" && active.kind === "popular"}
        onClick={() => onBrowse("popular")}
        pending={pending}
      />
      <Tab
        label="Top Rated"
        active={active.type === "browse" && active.kind === "top_rated"}
        onClick={() => onBrowse("top_rated")}
        pending={pending}
      />
      <Tab
        label="Now Playing"
        active={active.type === "browse" && active.kind === "now_playing"}
        onClick={() => onBrowse("now_playing")}
        pending={pending}
      />
      <Tab
        label="Upcoming"
        active={active.type === "browse" && active.kind === "upcoming"}
        onClick={() => onBrowse("upcoming")}
        pending={pending}
      />
      <Tab
        label="Trending (Dia)"
        active={active.type === "trending" && active.window === "day"}
        onClick={() => onTrending("day")}
        pending={pending}
      />
      <Tab
        label="Trending (Semana)"
        active={active.type === "trending" && active.window === "week"}
        onClick={() => onTrending("week")}
        pending={pending}
      />
      <Tab
        label="Pesquisar"
        active={active.type === "search"}
        onClick={onSearch}
        pending={pending}
      />
    </div>
  );
}

function Tab({
  label,
  active,
  onClick,
  pending,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  pending: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className={`rounded-lg border px-3 py-2 text-sm ${
        active ? "bg-black text-white" : "hover:bg-gray-50"
      } ${pending ? "opacity-60" : ""}`}
    >
      {label}
    </button>
  );
}
