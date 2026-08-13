// app/(agent)/crm/page.tsx
// CRM pipeline — kanban-style columns for lead stages
// TODO: add auth guard

import Link from 'next/link';
import { Lead, LeadStage } from '@/types';
import Badge from '@/components/ui/Badge';

// TODO: replace with db query by authenticated agentId
const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-1',
    listing_id: '1',
    agent_id: 'agent-1',
    buyer_name: 'Thabo Nkosi',
    buyer_phone: '+27831234567',
    stage: 'lead',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    listing: {
      id: '1',
      agent_id: 'agent-1',
      address: '12 Ocean View Drive, Camps Bay',
      price: 4_500_000,
      beds: 3, baths: 2, type: 'apartment', area: 'Camps Bay',
      photo_urls: [], status: 'active', created_at: '',
    },
  },
  {
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
  },
  {
    id: 'lead-3',
    listing_id: '2',
    agent_id: 'agent-1',
    buyer_name: 'James van der Berg',
    buyer_phone: '+27601112233',
    stage: 'viewing_confirmed',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    listing: {
      id: '2',
      agent_id: 'agent-1',
      address: '7 Vineyard Lane, Stellenbosch',
      price: 3_200_000,
      beds: 4, baths: 3, type: 'house', area: 'Stellenbosch',
      photo_urls: [], status: 'under_offer', created_at: '',
    },
  },
  {
    id: 'lead-4',
    listing_id: '2',
    agent_id: 'agent-1',
    buyer_name: 'Ayanda Zulu',
    buyer_phone: '+27841234567',
    stage: 'offer',
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    listing: {
      id: '2',
      agent_id: 'agent-1',
      address: '7 Vineyard Lane, Stellenbosch',
      price: 3_200_000,
      beds: 4, baths: 3, type: 'house', area: 'Stellenbosch',
      photo_urls: [], status: 'under_offer', created_at: '',
    },
  },
];

const STAGES: { key: LeadStage; label: string }[] = [
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

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

export default function CRMPage() {
  const leadsByStage = STAGES.reduce<Record<LeadStage, Lead[]>>((acc, { key }) => {
    acc[key] = MOCK_LEADS.filter((l) => l.stage === key);
    return acc;
  }, {} as Record<LeadStage, Lead[]>);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4">
        <div className="mx-auto flex max-w-full items-center justify-between">
          <h1 className="text-xl font-bold text-blue-400">Crestodian Agent</h1>
          <nav className="flex gap-4 text-sm text-gray-400">
            <a href="/listings" className="hover:text-white">My Listings</a>
            <a href="/profile" className="hover:text-white">Profile</a>
          </nav>
        </div>
      </header>

      <main className="px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">CRM Pipeline</h2>
          <p className="text-gray-400">{MOCK_LEADS.length} leads total</p>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-6">
          {STAGES.map(({ key, label }) => {
            const stageLeads = leadsByStage[key];
            return (
              <div
                key={key}
                className="w-64 flex-shrink-0 rounded-xl border border-gray-800 bg-gray-900"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-gray-800 p-3">
                  <h3 className="text-sm font-semibold text-gray-300">{label}</h3>
                  <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 p-3">
                  {stageLeads.length === 0 && (
                    <p className="py-4 text-center text-xs text-gray-600">No leads</p>
                  )}
                  {stageLeads.map((lead) => (
                    <Link
                      key={lead.id}
                      href={`/crm/${lead.id}`}
                      className="block rounded-lg border border-gray-700 bg-gray-800 p-3 transition hover:border-blue-700 hover:bg-gray-750"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium">{lead.buyer_name || 'Unknown'}</p>
                        <Badge variant={STAGE_VARIANT[lead.stage]} label="" size="sm" />
                      </div>
                      <p className="mb-1 text-xs text-gray-500">{lead.buyer_phone}</p>
                      {lead.listing && (
                        <p className="text-xs text-gray-400 line-clamp-2">{lead.listing.address}</p>
                      )}
                      <p className="mt-2 text-xs text-gray-600">{timeAgo(lead.updated_at)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
