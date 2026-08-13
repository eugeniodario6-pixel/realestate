// app/api/analytics/route.ts
// POST: track a listing view — calls trackListingView from lib/analytics
// GET: ?listingId= → returns getListingStats

import { NextRequest, NextResponse } from 'next/server';
import { trackListingView, getListingStats } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listingId, sessionId, watchPercent, saved } = body as {
      listingId: string;
      sessionId: string;
      watchPercent?: number;
      saved?: boolean;
    };

    if (!listingId || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: listingId, sessionId' },
        { status: 400 }
      );
    }

    const view = await trackListingView({
      listingId,
      sessionId,
      watchPercent: watchPercent ?? 0,
      saved: saved ?? false,
    });

    return NextResponse.json(view, { status: 201 });
  } catch (error) {
    console.error('[POST /api/analytics]', error);
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');

    if (!listingId) {
      return NextResponse.json({ error: 'Missing required query param: listingId' }, { status: 400 });
    }

    const stats = await getListingStats(listingId);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('[GET /api/analytics]', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
