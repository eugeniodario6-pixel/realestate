'use client';

// app/(agent)/crm/[leadId]/page.tsx
// Lead detail card — buyer info, listing, stage update, objection chip, timestamps
// TODO: add auth guard

import { useState, use } from 'react';
import { Lead, LeadStage } from '@/types';
import Badge from '@/components/ui/Badge';

// TODO: replace with db query by leadId
const MOCK_LEAD: Lead = {
  id: 'lead-2',
  listing_id: '1',
  agent_id: 'agent-1',
  buyer_name: 'Priya Naidoo',
  buyer_phone: '+27729876543',
  stage: 'viewing_requested',
  created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  listing: {
    id: '1',
    agent_id: 'agent-1',
    address: '12 Ocean View Drive, Camps Bay',
    price: 4_500_000,
    beds: 3, baths: 2, type: 'apartment', area: 'Camps Bay',
    photo_urls: [], status: 'active', created_at: '',
  },
  feedback: undefined,
};

const ALL_STAGES: { key: LeadStage; label: string }[] = [
  { key: 'lead', label: 'Lead' },
  { key: 'viewing_requested', label: 'Viewing Requested' },
  { key: 'viewing_confirmed', label: 'Viewing Confirmed' },
  { key: 'viewed', label: 'Viewed' },
  { key: 'offer', label: 'Offer' },
  { key: 'closed', label: 'Closed' },
];

const STAGE_VARIANT: Record<LeadStage, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
  lead: 'default',
  viewing_requested: 'info',
  viewing_confirmed: 'warning',
  viewed: 'info',
  offer: 'warning',
  closed: 'success',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-ZA', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function formatPrice(price: number) {
  return `R ${price.toLocaleString('en-ZA')}`;
}

export default function LeadDetailPage({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  const { leadId } = use(params);
  const [stage, setStage] = useState<LeadStage>(MOCK_LEAD.stage);
  const [viewingTime, setViewingTime] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // TODO: fetch lead from db by leadId
  const lead = { ...MOCK_LEAD, id: leadId };

  async function handleStageUpdate() {
    setSaving(true);
    setMessage('');
    try {
      const body: Record<string, string> = { stage };
      if (stage === 'viewing_confirmed' && viewingTime) body.viewingTime = viewingTime;

      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to update');
      setMessage('Stage updated successfully.');
    } catch {
      setMessage('Failed to update stage. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <a href="/crm" className="text-blue-400 hover:underline">← CRM Pipeline</a>
          <h1 className="text-lg font-bold text-blue-400">Lead Detail</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
        {/* Buyer Card */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">{lead.buyer_name || 'Unknown Buyer'}</h2>
            <Badge variant={STAGE_VARIANT[stage]} label={stage.replace(/_/g, ' ')} />
          </div>

          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="mb-1 text-gray-500">Phone</p>
              <a
                href={`tel:${lead.buyer_phone}`}
                className="font-medium text-blue-400 hover:underline"
              >
                {lead.buyer_phone}
              </a>
            </div>
            <div>
              <p className="mb-1 text-gray-500">WhatsApp</p>
              <a
                href={`https://wa.me/${lead.buyer_phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-green-400 hover:underline"
              >
                Message on WhatsApp →
              </a>
            </div>
            <div>
              <p className="mb-1 text-gray-500">Lead Created</p>
              <p className="font-medium">{formatDate(lead.created_at)}</p>
            </div>
            <div>
              <p className="mb-1 text-gray-500">Last Updated</p>
              <p className="font-medium">{formatDate(lead.updated_at)}</p>
            </div>
          </div>
        </div>

        {/* Listing Card */}
        {lead.listing && (
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h3 className="mb-3 font-semibold text-gray-300">Listing</h3>
            <p className="font-medium">{lead.listing.address}</p>
            <p className="text-blue-400">{formatPrice(lead.listing.price)}</p>
            <p className="text-sm text-gray-500">
              {lead.listing.beds} bed · {lead.listing.baths} bath · {lead.listing.type}
            </p>
            <a
              href={`/listing/${lead.listing.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-blue-400 hover:underline"
            >
              View public listing →
            </a>
          </div>
        )}

        {/* Stage Update */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h3 className="mb-4 font-semibold text-gray-300">Update Stage</h3>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-sm text-gray-400">Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as LeadStage)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                {ALL_STAGES.map(({ key, label }) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {stage === 'viewing_confirmed' && (
              <div className="flex-1">
                <label className="mb-1 block text-sm text-gray-400">Viewing Time</label>
                <input
                  type="datetime-local"
                  value={viewingTime}
                  onChange={(e) => setViewingTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}

            <button
              onClick={handleStageUpdate}
              disabled={saving}
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Update'}
            </button>
          </div>
          {message && <p className="mt-3 text-sm text-green-400">{message}</p>}
        </div>

        {/* Feedback / Objection Chip */}
        {lead.feedback ? (
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h3 className="mb-3 font-semibold text-gray-300">Buyer Feedback</h3>
            <span className="rounded-full border border-orange-700 bg-orange-900/30 px-4 py-2 text-sm text-orange-300 capitalize">
              {lead.feedback.objection_chip.replace('_', ' ')}
            </span>
            <p className="mt-3 text-xs text-gray-500">
              Submitted: {formatDate(lead.feedback.submitted_at)}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-800 p-6 text-center text-sm text-gray-600">
            No feedback submitted yet
          </div>
        )}
      </main>
    </div>
  );
}
