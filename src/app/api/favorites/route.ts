import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { upsertFavoriteSchema } from "@/schemas/upsertFavoriteSchema";
import { deleteFavoriteSchema } from "@/schemas/deleteFavoriteSchema";

export async function ensureListId(): Promise<string> {
  const jar = await cookies();

  const existingId = jar.get("fav_list_id")?.value;
  if (existingId) return existingId;

  const list = await prisma.favoriteList.create({ data: {} });

  jar.set("fav_list_id", list.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 180,
    path: "/",
  });

  return list.id;
}
export async function POST(req: Request) {
  const json = (await req.json()) as unknown;
  const parsed = upsertFavoriteSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const body = parsed.data;

  const listId = await ensureListId();

  await prisma.favoriteItem.upsert({
    where: { listId_movieId: { listId, movieId: body.movieId } },
    update: {
      title: body.title,
      posterPath: body.posterPath ?? undefined,
      overview: body.overview ?? undefined,
      voteAverage: body.voteAverage,
      releaseDate: body.releaseDate ?? undefined,
    },
    create: {
      listId,
      movieId: body.movieId,
      title: body.title,
      posterPath: body.posterPath ?? undefined,
      overview: body.overview ?? undefined,
      voteAverage: body.voteAverage,
      releaseDate: body.releaseDate ?? undefined,
    },
  });

  return NextResponse.json({ listId });
}

export async function DELETE(req: Request) {
  const json = (await req.json()) as unknown;
  const parsed = deleteFavoriteSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const body = parsed.data;

  const listId = await ensureListId();

  await prisma.favoriteItem.deleteMany({
    where: { listId, movieId: body.movieId },
  });

  return NextResponse.json({ listId });
}

export async function GET() {
  const jar = await cookies();
  const id = jar.get("fav_list_id")?.value;

  if (!id) {
    return NextResponse.json({ id: null, items: [] });
  }

  const list = await prisma.favoriteList.findUnique({
    where: { id },
    include: { items: { orderBy: { releaseDate: "desc" } } },
  });

  if (!list) {
    return NextResponse.json({ id: null, items: [] });
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
