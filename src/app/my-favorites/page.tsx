import Image from "next/image";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { tmdbImage } from "@/lib/tmdb";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";

export const dynamic = "force-dynamic";

export default async function Page() {
  const jar = await cookies();
  const listId = jar.get("fav_list_id")?.value ?? null;

  const list = listId
    ? await prisma.favoriteList.findUnique({
        where: { id: listId },
        include: { items: { orderBy: { title: "desc" } } },
      })
    : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">🎬 Meus Favoritos</h1>
          {list?.id ? (
            <div>
              <p className="text-sm opacity-70">
                Clique no Botão para copiar o link e compartilhar sua lista
              </p>
              <CopyButton url={`/list/${list.id}`} />
            </div>
          ) : (
            <p className="text-sm opacity-70">
              Você ainda não possui uma lista.
            </p>
          )}
        </div>
      </header>

      {!list || list.items.length === 0 ? (
        <div>
          <p className="col-span-full text-sm opacity-70">
            Sua lista está vazia. Adicione filmes pelo catálogo.
          </p>
          <Link href={"/"} className="border">
            <button
              className="rounded-lg border px-3 py-2 text-sm cursor-pointer 
                 bg-black text-white hover:bg-slate-400"
            >
              Voltar ao catálogo
            </button>
          </Link>
        </div>
      ) : (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {list.items.map((it) => {
            const src = tmdbImage(it.posterPath ?? null, "w300");
            return (
              <article key={it.id} className="rounded-xl border p-3">
                {src ? (
                  <Image
                    src={src}
                    alt={it.title}
                    width={300}
                    height={450}
                    className="mb-2 h-auto w-full rounded-lg"
                  />
                ) : (
                  <div
                    className="mb-2 aspect-2/3 w-full rounded-lg bg-gray-200"
                    aria-label={`Sem pôster disponível para ${it.title}`}
                    role="img"
                  />
                )}
                <h3 className="line-clamp-2 font-medium">{it.title}</h3>
                <div className="mt-1 text-sm">
                  ⭐ <b className="text-lg">{it.voteAverage.toFixed(1)}</b>
                </div>
                {it.overview && (
                  <p className="mt-2 line-clamp-3 text-xs opacity-70">
                    {it.overview}
                  </p>
                )}
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
