import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const list = await prisma.favoriteList.findUnique({
    where: { id: params.id },
    include: { items: { orderBy: { releaseDate: "desc" } } },
  });

  if (!list) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: list.id,
    items: list.items.map((i) => ({
      id: i.id,
      listId: i.listId,
      movieId: i.movieId,
      title: i.title,
      posterPath: i.posterPath ?? null,
      overview: i.overview ?? null,
      voteAverage: i.voteAverage,
      releaseDate: i.releaseDate ?? null,
    })),
    createdAt: list.createdAt.toISOString(),
    updatedAt: list.updatedAt.toISOString(),
  });
}
