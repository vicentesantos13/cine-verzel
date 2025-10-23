import { cookies } from "next/headers";
import FavoritesSection from "@/components/favorites/FavoritesSection";


async function getMyListId(): Promise<string | null> {
  const jar = await cookies();
  return jar.get("fav_list_id")?.value ?? null;
}

export const metadata = {
  title: "Meus Favoritos",
};

export default async function Page() {
  const listId = await getMyListId();

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">🎬 Meus Favoritos</h1>
        <p className="text-sm opacity-70">
          Gerencie e compartilhe sua lista de favoritos.
        </p>
      </header>

      <FavoritesSection listId={listId} />
    </main>
  );
}
