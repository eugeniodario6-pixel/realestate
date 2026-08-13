// app/(buyer)/agent/[profileId]/page.tsx
// Public agent profile — bio, PPRA, areas served, listings feed, WhatsApp CTA

import Link from 'next/link';
import { Agent, Listing } from '@/types';

// TODO: replace with db query by profileId
const MOCK_AGENT: Agent = {
  id: 'agent-1',
  name: 'Sipho Dlamini',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  bio: 'With over 12 years in the Western Cape property market, I specialise in luxury coastal and winelands properties. My clients benefit from honest, no-pressure advice and full digital marketing for their listings.',
  ppra_number: 'PPRA-WC-2012-004821',
  agency: 'Crestodian Properties',
  areas_served: ['Camps Bay', 'Sea Point', 'Clifton', 'Bantry Bay', 'Green Point'],
  profile_url: 'sipho-dlamini',
  whatsapp: '+27821234567',
  created_at: new Date().toISOString(),
};

// TODO: replace with db query
const MOCK_AGENT_LISTINGS: Listing[] = [
  {
    id: '1',
    agent_id: 'agent-1',
    address: '12 Ocean View Drive, Camps Bay',
    price: 4_500_000,
    beds: 3,
    baths: 2,
    type: 'apartment',
    area: 'Camps Bay',
    size_sqm: 120,
    photo_urls: ['https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800'],
    status: 'active',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    agent_id: 'agent-1',
    address: '3 Palm Court, Sea Point',
    price: 2_800_000,
    beds: 2,
    baths: 2,
    type: 'apartment',
    area: 'Sea Point',
    size_sqm: 95,
    photo_urls: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
    status: 'active',
    created_at: new Date().toISOString(),
  },
];

function formatPrice(price: number) {
  return `R ${price.toLocaleString('en-ZA')}`;
}

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const { profileId } = await params;

  // TODO: fetch agent from db by profileId
  const agent = MOCK_AGENT;
  const listings = MOCK_AGENT_LISTINGS;

  const whatsappUrl = agent.whatsapp
    ? `https://wa.me/${agent.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hi ${agent.name}, I found your profile on Crestodian and would like to enquire about a property.`
      )}`
    : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/feed" className="text-blue-400 hover:underline">← Browse listings</Link>
          <h1 className="text-lg font-bold text-blue-400">Crestodian</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {/* Agent Hero */}
        <div className="mb-8 flex flex-col items-start gap-6 rounded-xl border border-gray-800 bg-gray-900 p-6 sm:flex-row sm:items-center">
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-2 border-blue-600 bg-gray-800">
            {agent.photo ? (
              <img src={agent.photo} alt={agent.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-3xl">👤</div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold">{agent.name}</h2>
            {agent.agency && <p className="text-blue-400">{agent.agency}</p>}
            {agent.ppra_number && (
              <p className="mt-1 text-xs text-gray-500">PPRA: {agent.ppra_number}</p>
            )}
            {agent.bio && (
              <p className="mt-3 text-sm leading-relaxed text-gray-400">{agent.bio}</p>
            )}
          </div>

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 rounded-lg bg-green-600 px-5 py-3 font-medium hover:bg-green-700"
            >
              💬 WhatsApp
            </a>
          )}
        </div>

        {/* Areas Served */}
        {agent.areas_served.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-3 font-semibold text-gray-300">Areas Served</h3>
            <div className="flex flex-wrap gap-2">
              {agent.areas_served.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-blue-800 bg-blue-900/30 px-3 py-1 text-sm text-blue-300"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Agent's Listings */}
        <h3 className="mb-4 font-semibold text-gray-300">Current Listings ({listings.length})</h3>
        {listings.length === 0 ? (
          <p className="text-gray-500">No active listings at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {listings.map((listing) => (
              <article
                key={listing.id}
                className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition hover:border-gray-700"
              >
                <div className="h-40 bg-gray-800">
                  {listing.photo_urls[0] && (
                    <img
                      src={listing.photo_urls[0]}
                      alt={listing.address}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <p className="mb-1 text-lg font-bold text-blue-400">{formatPrice(listing.price)}</p>
                  <p className="mb-2 text-sm text-gray-300">{listing.address}</p>
                  <div className="mb-3 flex gap-3 text-sm text-gray-400">
                    <span>🛏 {listing.beds}</span>
                    <span>🚿 {listing.baths}</span>
                    {listing.size_sqm && <span>📐 {listing.size_sqm}m²</span>}
                  </div>
                  <Link
                    href={`/listing/${listing.id}`}
                    className="block w-full rounded-lg bg-blue-600 py-2 text-center text-sm font-medium hover:bg-blue-700"
                  >
                    View Listing
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        {whatsappUrl && (
          <div className="mt-10 rounded-xl border border-green-800 bg-green-900/20 p-6 text-center">
            <p className="mb-4 text-gray-300">
              Interested in working with {agent.name}?
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-green-600 px-8 py-3 font-medium hover:bg-green-700"
            >
              💬 Contact on WhatsApp
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
