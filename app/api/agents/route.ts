// app/api/agents/route.ts
// GET: list agents
// POST: create agent (auto-generate profile_url from name)

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function generateProfileUrl(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function GET() {
  try {
    const agents = await db.agent.findMany({
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(agents);
  } catch (error) {
    console.error('[GET /api/agents]', error);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, bio, ppra_number, agency, whatsapp, areas_served } = body;

    if (!name) {
      return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 });
    }

    const baseSlug = generateProfileUrl(name);
    // Ensure unique profile_url by appending random suffix if needed
    const existing = await db.agent.findUnique({ where: { profile_url: baseSlug } });
    const profile_url = existing
      ? `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`
      : baseSlug;

    const agent = await db.agent.create({
      data: {
        name,
        bio: bio || null,
        ppra_number: ppra_number || null,
        agency: agency || null,
        whatsapp: whatsapp || null,
        areas_served: areas_served || [],
        profile_url,
      },
    });

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error('[POST /api/agents]', error);
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}
