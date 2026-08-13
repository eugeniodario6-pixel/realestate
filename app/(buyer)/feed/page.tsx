// app/(buyer)/feed/page.tsx
// Public discovery feed — listings grid with area/price filter

import Link from 'next/link';
import { Listing } from '@/types';

// TODO: replace with db query
const MOCK_LISTINGS: Listing[] = [
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
    description: 'Stunning ocean views from this modern apartment.',
    status: 'active',
    created_at: new Date().toISOString(),
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
    photo_urls: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'],
    description: 'Charming family home surrounded by vineyards.',
    status: 'active',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    agent_id: 'agent-2',
    address: '3 Palm Court, Sea Point',
    price: 2_800_000,
    beds: 2,
    baths: 2,
    type: 'apartment',
    area: 'Sea Point',
    size_sqm: 95,
    photo_urls: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
    description: 'Lock-up-and-go lifestyle apartment steps from the promenade.',
    status: 'active',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    agent_id: 'agent-2',
    address: '22 Heritage Close, Paarl',
    price: 1_950_000,
    beds: 3,
    baths: 2,
    type: 'townhouse',
    area: 'Paarl',
    size_sqm: 150,
    photo_urls: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    description: 'Modern townhouse in a secure complex.',
    status: 'active',
    created_at: new Date().toISOString(),
  },
];

const AREAS = ['All Areas', 'Camps Bay', 'Sea Point', 'Stellenbosch', 'Paarl', 'Constantia'];

function formatPrice(price: number): string {
  return `R ${price.toLocaleString('en-ZA')}`;
}

interface FeedPageProps {
  searchParams: Promise<{ area?: string; maxPrice?: string }>;
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const params = await searchParams;
  const { area, maxPrice } = params;

  // TODO: replace with db query using area/maxPrice filters
  let listings = MOCK_LISTINGS;
  if (area && area !== 'All Areas') {
    listings = listings.filter((l) => l.area === area);
  }
  if (maxPrice) {
    const max = parseInt(maxPrice, 10);
    if (!isNaN(max)) listings = listings.filter((l) => l.price <= max);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-bold text-blue-400">Crestodian</h1>
          <nav className="flex gap-4 text-sm text-gray-400">
            <Link href="/feed" className="text-white">Browse</Link>
            <Link href="/agent/login" className="hover:text-white">Agent Login</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="mb-2 text-3xl font-bold">Find Your Property</h2>
        <p className="mb-8 text-gray-400">Browse listings across South Africa</p>

        {/* Filters */}
        <form method="GET" className="mb-8 flex flex-wrap gap-4">
          <select
            name="area"
            defaultValue={area || 'All Areas'}
            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
          >
            {AREAS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price (R)"
            defaultValue={maxPrice || ''}
            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium hover:bg-blue-700"
          >
            Filter
          </button>
        </form>

        {/* Listings Grid */}
        {listings.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            <p className="text-lg">No listings found for your filters.</p>
            <Link href="/feed" className="mt-4 inline-block text-blue-400 hover:underline">
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <article
                key={listing.id}
                className="group overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition-all hover:border-gray-700 hover:shadow-xl hover:shadow-black/40"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-gray-800">
                  {listing.photo_urls[0] ? (
                    <img
                      src={listing.photo_urls[0]}
                      alt={listing.address}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-600">
                      <span className="text-4xl">🏠</span>
                    </div>
                  )}
                  <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-medium uppercase">
                      {listing.type}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4">
                  <p className="mb-1 text-xl font-bold text-blue-400">{formatPrice(listing.price)}</p>
                  <p className="mb-3 line-clamp-1 text-sm text-gray-300">{listing.address}</p>

                  <div className="mb-4 flex gap-4 text-sm text-gray-400">
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
      </main>
    </div>
  );
}
