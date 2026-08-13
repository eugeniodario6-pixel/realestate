// app/(agent)/listings/page.tsx
// Agent's own listings dashboard
// TODO: add auth guard

import Link from 'next/link';
import { Listing, ListingStatus } from '@/types';

interface ListingWithQuickStats extends Listing {
  quickStats: { views: number; saves: number; viewing_requests: number };
}

// TODO: replace with db query by authenticated agentId
const MOCK_LISTINGS: ListingWithQuickStats[] = [
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
    photo_urls: ['https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400'],
    status: 'active',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    quickStats: { views: 143, saves: 12, viewing_requests: 4 },
  },
  {
    id: '2',
    agent_id: 'agent-1',
    address: '7 Vineyard Lane, Stellenbosch',
    price: 3_200_000,
    beds: 4,
    baths: 3,
    type: 'house',
    area: 'Stellenbosch',
    size_sqm: 280,
    photo_urls: [],
    status: 'under_offer',
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    quickStats: { views: 89, saves: 7, viewing_requests: 2 },
  },
];

const STATUS_COLORS: Record<ListingStatus, string> = {
  active: 'bg-green-900/50 text-green-300',
  under_offer: 'bg-yellow-900/50 text-yellow-300',
  sold: 'bg-red-900/50 text-red-300',
  let: 'bg-blue-900/50 text-blue-300',
};

function formatPrice(price: number) {
  return `R ${price.toLocaleString('en-ZA')}`;
}

export default function AgentListingsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-xl font-bold text-blue-400">Crestodian Agent</h1>
          <nav className="flex gap-4 text-sm text-gray-400">
            <a href="/profile" className="hover:text-white">Profile</a>
            <a href="/crm" className="hover:text-white">CRM</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">My Listings</h2>
            <p className="text-gray-400">{MOCK_LISTINGS.length} active listings</p>
          </div>
          <Link
            href="/listings/upload"
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium hover:bg-blue-700"
          >
            + Upload Listing
          </Link>
        </div>

        {MOCK_LISTINGS.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            <p className="mb-4 text-lg">No listings yet.</p>
            <Link href="/listings/upload" className="text-blue-400 hover:underline">
              Upload your first listing →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {MOCK_LISTINGS.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition hover:border-gray-700 sm:flex-row"
              >
                {/* Thumbnail */}
                <div className="h-40 w-full flex-shrink-0 bg-gray-800 sm:h-auto sm:w-40">
                  {listing.photo_urls[0] ? (
                    <img
                      src={listing.photo_urls[0]}
                      alt={listing.address}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-3xl text-gray-600">🏠</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="mb-1 flex items-center gap-3">
                      <p className="text-lg font-bold">{listing.address}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium uppercase ${STATUS_COLORS[listing.status]}`}
                      >
                        {listing.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-blue-400">{formatPrice(listing.price)}</p>
                    <p className="text-sm text-gray-500">
                      {listing.beds} bed · {listing.baths} bath · {listing.type}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-4 flex gap-6 text-sm">
                    <div>
                      <p className="font-bold text-white">{listing.quickStats.views}</p>
                      <p className="text-gray-500">Views</p>
                    </div>
                    <div>
                      <p className="font-bold text-white">{listing.quickStats.saves}</p>
                      <p className="text-gray-500">Saves</p>
                    </div>
                    <div>
                      <p className="font-bold text-white">{listing.quickStats.viewing_requests}</p>
                      <p className="text-gray-500">Viewing Requests</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center px-5 text-gray-500">
                  →
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
