import { NextResponse } from "next/server";
import { tmdbBrowse } from "@/lib/tmdb";
import type { TMDbBrowseKind } from "@/types/tmdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const kind = (searchParams.get("kind") ?? "popular") as TMDbBrowseKind;
  const page = Number(searchParams.get("page") ?? "1");
  try {
    const data = await tmdbBrowse(kind, page);
    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
