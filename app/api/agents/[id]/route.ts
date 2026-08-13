// app/api/agents/[id]/route.ts
// GET: single agent with their listings
// PATCH: update agent profile

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agent = await db.agent.findUnique({
      where: { id },
      include: {
        listings: {
          where: { status: 'active' },
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json(agent);
  } catch (error) {
    console.error('[GET /api/agents/[id]]', error);
    return NextResponse.json({ error: 'Failed to fetch agent' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, bio, ppra_number, agency, whatsapp, areas_served, photo } = body;

    const agent = await db.agent.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(bio !== undefined && { bio }),
        ...(ppra_number !== undefined && { ppra_number }),
        ...(agency !== undefined && { agency }),
        ...(whatsapp !== undefined && { whatsapp }),
        ...(areas_served && { areas_served }),
        ...(photo !== undefined && { photo }),
      },
    });

    return NextResponse.json(agent);
  } catch (error) {
    console.error('[PATCH /api/agents/[id]]', error);
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
  }
}
