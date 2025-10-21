import { NextResponse } from 'next/server';
import { tmdbTrending } from '@/lib/tmdb';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const windowParam = (searchParams.get('window') ?? 'day') as 'day' | 'week';
  const page = Number(searchParams.get('page') ?? '1');

  try {
    const data = await tmdbTrending(windowParam, page);
    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
