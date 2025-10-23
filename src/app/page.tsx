import CatalogClient from "@/components/Catalog";

export const metadata = {
  title: "CineVerzel",
};

export default async function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-semibold">🎬 Catálogo de Filmes</h1>
      <CatalogClient />
    </main>
  );
}
