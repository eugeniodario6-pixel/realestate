// app/api/leads/[id]/route.ts
// PATCH: update lead stage; if viewing_confirmed → send buyer WhatsApp confirmation

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendBuyerViewingConfirmation } from '@/lib/whatsapp';
import { LeadStage } from '@/types';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { stage, viewingTime } = body as { stage: LeadStage; viewingTime?: string };

    if (!stage) {
      return NextResponse.json({ error: 'Missing required field: stage' }, { status: 400 });
    }

    const updatedLead = await db.lead.update({
      where: { id },
      data: {
        stage,
        updated_at: new Date(),
      },
      include: {
        listing: { include: { agent: true } },
      },
    });

    // Send buyer confirmation if stage is now viewing_confirmed
    if (stage === 'viewing_confirmed') {
      try {
        await sendBuyerViewingConfirmation(
          updatedLead.buyer_phone,
          updatedLead.listing?.address || 'the property',
          viewingTime || 'TBC',
        );
      } catch (waError) {
        console.warn('[PATCH /api/leads/[id]] WhatsApp confirmation failed:', waError);
      }
    }

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error('[PATCH /api/leads/[id]]', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
