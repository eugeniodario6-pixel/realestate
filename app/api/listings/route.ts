// app/api/listings/route.ts
// GET: list listings (optional ?area=&maxPrice=&agentId= filters)
// POST: create listing

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get('area');
    const maxPrice = searchParams.get('maxPrice');
    const agentId = searchParams.get('agentId');

    // Build Prisma where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};
    if (area) where.area = { contains: area, mode: 'insensitive' };
    if (maxPrice) where.price = { lte: parseInt(maxPrice, 10) };
    if (agentId) where.agent_id = agentId;

    const listings = await db.listing.findMany({
      where,
      include: { agent: true },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error('[GET /api/listings]', error);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, price, beds, baths, type, area, agent_id, size_sqm, description, video_url, photo_urls } = body;

    // Validate required fields
    if (!address || price == null || beds == null || baths == null || !type || !area || !agent_id) {
      return NextResponse.json(
        { error: 'Missing required fields: address, price, beds, baths, type, area, agent_id' },
        { status: 400 }
      );
    }

    const listing = await db.listing.create({
      data: {
        address,
        price: Number(price),
        beds: Number(beds),
        baths: Number(baths),
        type,
        area,
        agent_id,
        size_sqm: size_sqm ? Number(size_sqm) : null,
        description: description || null,
        video_url: video_url || null,
        photo_urls: photo_urls || [],
        status: 'active',
      },
      include: { agent: true },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error('[POST /api/listings]', error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
