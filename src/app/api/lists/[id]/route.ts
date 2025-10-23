import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

type Ctx = { params: Promise<{ id: string }> };

const idSchema = z.object({ id: z.string().min(1) });

export async function GET(_req: Request, ctx: Ctx) {
  const raw = await ctx.params;
  const parsed = idSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const { id } = parsed.data;

  const list = await prisma.favoriteList.findUnique({
    where: { id },
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
  });
}
