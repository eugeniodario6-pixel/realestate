// app/api/feedback/route.ts
// POST: submit objection chip feedback for a viewing
// In prod this would be triggered by WhatsApp webhook; for now a direct POST

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ObjectionChip } from '@/types';

const VALID_CHIPS: ObjectionChip[] = [
  'price', 'condition', 'location', 'size', 'timing', 'financing', 'just_looking', 'loved_it',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, listingId, objectionChip } = body as {
      leadId: string;
      listingId: string;
      objectionChip: ObjectionChip;
    };

    if (!leadId || !listingId || !objectionChip) {
      return NextResponse.json(
        { error: 'Missing required fields: leadId, listingId, objectionChip' },
        { status: 400 }
      );
    }

    if (!VALID_CHIPS.includes(objectionChip)) {
      return NextResponse.json(
        { error: `Invalid objectionChip. Must be one of: ${VALID_CHIPS.join(', ')}` },
        { status: 400 }
      );
    }

    const feedback = await db.viewingFeedback.create({
      data: {
        lead_id: leadId,
        listing_id: listingId,
        objection_chip: objectionChip,
      },
    });

    // Also move lead to 'viewed' stage if it hasn't been updated yet
    try {
      const lead = await db.lead.findUnique({ where: { id: leadId } });
      if (lead && lead.stage === 'viewing_confirmed') {
        await db.lead.update({
          where: { id: leadId },
          data: { stage: 'viewed', updated_at: new Date() },
        });
      }
    } catch (stageError) {
      console.warn('[POST /api/feedback] Stage update failed:', stageError);
    }

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error('[POST /api/feedback]', error);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}
