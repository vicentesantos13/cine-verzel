import FavoritesSection from "@/components/favorites/FavoritesSection";

type Ctx = { params: Promise<{ id: string }> };

export async function generateMetadata(ctx: Ctx) {
  const { id } = await ctx.params;
  return { title: `Lista ${id}` };
}

export default async function Page(ctx: Ctx) {
  const { id } = await ctx.params;
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">🎬 Lista pública</h1>
        <p className="text-sm opacity-70">
          Esta é uma visualização somente leitura da lista compartilhada. ID:
          {id}
        </p>
      </header>

      <FavoritesSection listId={id} />
    </main>
  );
}
