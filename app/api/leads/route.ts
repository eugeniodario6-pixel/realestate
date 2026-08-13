// app/api/leads/route.ts
// POST: create lead + notify agent via WhatsApp
// GET: list leads by ?agentId=

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifyAgentViewingRequest } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listing_id, buyer_name, buyer_phone } = body;

    if (!listing_id || !buyer_phone) {
      return NextResponse.json(
        { error: 'Missing required fields: listing_id, buyer_phone' },
        { status: 400 }
      );
    }

    // Fetch the listing to get agent_id
    const listing = await db.listing.findUnique({
      where: { id: listing_id },
      include: { agent: true },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Create the lead
    const lead = await db.lead.create({
      data: {
        listing_id,
        agent_id: listing.agent_id,
        buyer_name: buyer_name || null,
        buyer_phone,
        stage: 'viewing_requested',
      },
      include: { listing: true },
    });

    // Notify agent via WhatsApp — wrapped in try/catch so failure doesn't block
    try {
      await notifyAgentViewingRequest(
        listing.agent?.whatsapp || '',
        buyer_name || 'A buyer',
        buyer_phone,
        listing.address,
      );
    } catch (waError) {
      console.warn('[POST /api/leads] WhatsApp notification failed:', waError);
    }

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('[POST /api/leads]', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');

    const where = agentId ? { agent_id: agentId } : {};

    const leads = await db.lead.findMany({
      where,
      include: { listing: true, feedback: true },
      orderBy: { updated_at: 'desc' },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error('[GET /api/leads]', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
