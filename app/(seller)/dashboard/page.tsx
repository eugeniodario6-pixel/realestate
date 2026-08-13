// app/(seller)/dashboard/page.tsx
// Seller dashboard — per-listing views, watch-through, viewing count, objection chip tally
// TODO: add auth guard

import { Listing, ObjectionChip } from '@/types';
import StatCard from '@/components/ui/StatCard';

interface SellerListingData {
  listing: Listing;
  stats: {
    total_views: number;
    unique_views: number;
    returning_views: number;
    watch_25: number;
    watch_50: number;
    watch_75: number;
    watch_100: number;
    saves: number;
    viewing_requests: number;
  };
  objections: Partial<Record<ObjectionChip, number>>;
}

// TODO: replace with db query by authenticated sellerId
const MOCK_DATA: SellerListingData[] = [
  {
    listing: {
      id: '1',
      agent_id: 'agent-1',
      address: '12 Ocean View Drive, Camps Bay',
      price: 4_500_000,
      beds: 3, baths: 2, type: 'apartment', area: 'Camps Bay',
      photo_urls: ['https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400'],
      status: 'active', created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    stats: {
      total_views: 143,
      unique_views: 98,
      returning_views: 45,
      watch_25: 130,
      watch_50: 95,
      watch_75: 60,
      watch_100: 32,
      saves: 12,
      viewing_requests: 4,
    },
    objections: {
      price: 3,
      condition: 1,
      loved_it: 2,
    },
  },
];

function formatPrice(price: number) {
  return `R ${price.toLocaleString('en-ZA')}`;
}

function watchPercent(count: number, total: number) {
  if (total === 0) return '0%';
  return `${Math.round((count / total) * 100)}%`;
}

const OBJECTION_LABELS: Record<ObjectionChip, string> = {
  price: '💰 Price',
  condition: '🔧 Condition',
  location: '📍 Location',
  size: '📐 Size',
  timing: '⏰ Timing',
  financing: '🏦 Financing',
  just_looking: '👀 Just Looking',
  loved_it: '❤️ Loved It',
};

export default function SellerDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-xl font-bold text-blue-400">Crestodian Seller</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="mb-2 text-2xl font-bold">Your Property Performance</h2>
        <p className="mb-8 text-gray-400">
          Real-time insights on how buyers are engaging with your listing.
        </p>

        {MOCK_DATA.map(({ listing, stats, objections }) => (
          <div
            key={listing.id}
            className="mb-10 rounded-2xl border border-gray-800 bg-gray-900 p-6"
          >
            {/* Listing Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              {listing.photo_urls[0] && (
                <img
                  src={listing.photo_urls[0]}
                  alt={listing.address}
                  className="h-24 w-36 flex-shrink-0 rounded-lg object-cover"
                />
              )}
              <div>
                <h3 className="text-lg font-bold">{listing.address}</h3>
                <p className="text-blue-400">{formatPrice(listing.price)}</p>
                <p className="text-sm text-gray-500">
                  {listing.beds} bed · {listing.baths} bath · {listing.type}
                </p>
              </div>
            </div>

            {/* Overview Stats */}
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Overview
            </h4>
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <StatCard label="Total Views" value={stats.total_views} />
              <StatCard label="Unique Viewers" value={stats.unique_views} />
              <StatCard label="Returning" value={stats.returning_views} />
              <StatCard label="Saves" value={stats.saves} />
              <StatCard label="Viewing Requests" value={stats.viewing_requests} />
            </div>

            {/* Watch-through */}
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Video Watch-through
            </h4>
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard
                label="25%"
                value={watchPercent(stats.watch_25, stats.total_views)}
                subtitle={`${stats.watch_25} viewers`}
              />
              <StatCard
                label="50%"
                value={watchPercent(stats.watch_50, stats.total_views)}
                subtitle={`${stats.watch_50} viewers`}
              />
              <StatCard
                label="75%"
                value={watchPercent(stats.watch_75, stats.total_views)}
                subtitle={`${stats.watch_75} viewers`}
              />
              <StatCard
                label="Completed"
                value={watchPercent(stats.watch_100, stats.total_views)}
                subtitle={`${stats.watch_100} viewers`}
              />
            </div>

            {/* Objection Tally */}
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Buyer Feedback Chips
            </h4>
            <div className="flex flex-wrap gap-3">
              {Object.entries(objections).length === 0 ? (
                <p className="text-sm text-gray-600">No feedback submitted yet.</p>
              ) : (
                Object.entries(objections).map(([chip, count]) => (
                  <div
                    key={chip}
                    className="flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-4 py-2 text-sm"
                  >
                    <span>{OBJECTION_LABELS[chip as ObjectionChip] || chip}</span>
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold">
                      {count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
