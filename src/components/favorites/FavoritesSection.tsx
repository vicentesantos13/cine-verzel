"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import FavoriteItemCard from "./FavoriteItemCard";
import type { FavoriteListResponse } from "@/types/favorites";
import { usePathname } from "next/navigation";

interface Props {
  listId: string | null;
}

export default function FavoritesSection({ listId }: Props) {
  const [list, setList] = useState<FavoriteListResponse>();

  const pathname = usePathname();

  // mostra o botão apenas em /my-favorites
  const showCopyButton = pathname === "/my-favorites";

  const shareUrl = useMemo(() => {
    if (!listId) return "";
    return `/list/${listId}`;
  }, [listId]);

  useEffect(() => {
    const fetchFavoriteList = async () => {
      if (listId) {
        const res = await fetch(`/api/lists/${listId}`);
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setList(data);
      }
    };
    fetchFavoriteList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!list) {
    return (
      <div>
        <p className="text-sm opacity-70">
          Sua lista está vazia. Adicione filmes pelo catálogo.
        </p>
        <Link href="/" className="inline-block mt-3">
          <button className="rounded-lg border px-3 py-2 text-sm bg-black text-white hover:bg-slate-400">
            Voltar ao catálogo
          </button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {showCopyButton && shareUrl && (
        <div className="mb-4 flex items-center gap-3">
          <CopyButton url={shareUrl} />
        </div>
      )}

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {list.items.map((it) => (
          <FavoriteItemCard key={it.id} item={it} />
        ))}
      </section>
    </>
  );
}
