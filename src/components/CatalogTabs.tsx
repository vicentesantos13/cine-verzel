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
}

export default function CatalogTabs({
  active,
  pending,
  onBrowse,
  onTrending,
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
        label="Melhores Notas"
        active={active.type === "browse" && active.kind === "top_rated"}
        onClick={() => onBrowse("top_rated")}
        pending={pending}
      />
      <Tab
        label="Em exibição"
        active={active.type === "browse" && active.kind === "now_playing"}
        onClick={() => onBrowse("now_playing")}
        pending={pending}
      />
      <Tab
        label="Em Breve"
        active={active.type === "browse" && active.kind === "upcoming"}
        onClick={() => onBrowse("upcoming")}
        pending={pending}
      />
      <Tab
        label="Em alta (Dia)"
        active={active.type === "trending" && active.window === "day"}
        onClick={() => onTrending("day")}
        pending={pending}
      />
      <Tab
        label="Em alta (Semana)"
        active={active.type === "trending" && active.window === "week"}
        onClick={() => onTrending("week")}
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
      className={`rounded-lg border px-3 py-2 text-sm cursor-pointer ${
        active ? "bg-slate-400 text-white" : "hover:bg-slate-400"
      } ${pending ? "opacity-60" : ""}`}
    >
      {label}
    </button>
  );
}
