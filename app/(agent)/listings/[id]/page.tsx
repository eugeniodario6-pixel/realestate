'use client';

// app/(agent)/listings/[id]/page.tsx
// Single listing detail — agent view with full stats and status toggle
// TODO: add auth guard

import { useState, use } from 'react';
import { Listing, ListingStatus, ListingStats } from '@/types';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';

// TODO: replace with db query + analytics fetch
const MOCK_LISTING: Listing & { stats: ListingStats } = {
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
  created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  stats: {
    total_views: 143,
    unique_views: 98,
    returning_views: 45,
    saves: 12,
    viewing_requests: 4,
    watch_25: 130,
    watch_50: 95,
    watch_75: 60,
    watch_100: 32,
  },
};

const STATUS_OPTIONS: ListingStatus[] = ['active', 'under_offer', 'sold', 'let'];

const STATUS_VARIANT: Record<ListingStatus, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  active: 'success',
  under_offer: 'warning',
  sold: 'error',
  let: 'info',
};

function formatPrice(price: number) {
  return `R ${price.toLocaleString('en-ZA')}`;
}

function watchPercent(count: number, total: number) {
  if (total === 0) return '0%';
  return `${Math.round((count / total) * 100)}%`;
}

export default function AgentListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [status, setStatus] = useState<ListingStatus>(MOCK_LISTING.status);
  const [saving, setSaving] = useState(false);

  // TODO: fetch listing + stats from db by id
  const listing = { ...MOCK_LISTING, id };
  const stats = listing.stats;

  async function handleStatusChange(newStatus: ListingStatus) {
    setSaving(true);
    try {
      await fetch(`/api/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setStatus(newStatus);
    } catch {
      alert('Failed to update status');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <a href="/listings" className="text-blue-400 hover:underline">← My Listings</a>
          <h1 className="text-lg font-bold text-blue-400">Listing Detail</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Listing Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">{listing.address}</h2>
            <p className="text-blue-400">{formatPrice(listing.price)}</p>
            <p className="text-sm text-gray-500">
              {listing.beds} bed · {listing.baths} bath · {listing.type}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={STATUS_VARIANT[status]} label={status.replace('_', ' ')} />
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value as ListingStatus)}
              disabled={saving}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Photo */}
        {listing.photo_urls[0] && (
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={listing.photo_urls[0]}
              alt={listing.address}
              className="h-64 w-full object-cover"
            />
          </div>
        )}

        {/* Stats Panel */}
        <h3 className="mb-4 text-lg font-semibold">Performance Stats</h3>
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Total Views" value={stats.total_views} />
          <StatCard label="Unique" value={stats.unique_views} />
          <StatCard label="Returning" value={stats.returning_views} />
          <StatCard label="Saves" value={stats.saves} />
          <StatCard label="Viewing Requests" value={stats.viewing_requests} />
        </div>

        {/* Watch-through */}
        <h3 className="mb-4 text-lg font-semibold">Video Watch-through</h3>
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="25% watched"
            value={watchPercent(stats.watch_25, stats.total_views)}
            subtitle={`${stats.watch_25} viewers`}
          />
          <StatCard
            label="50% watched"
            value={watchPercent(stats.watch_50, stats.total_views)}
            subtitle={`${stats.watch_50} viewers`}
          />
          <StatCard
            label="75% watched"
            value={watchPercent(stats.watch_75, stats.total_views)}
            subtitle={`${stats.watch_75} viewers`}
          />
          <StatCard
            label="Completed"
            value={watchPercent(stats.watch_100, stats.total_views)}
            subtitle={`${stats.watch_100} viewers`}
          />
        </div>

        {/* Public Link */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <p className="mb-2 text-sm text-gray-400">Public listing URL:</p>
          <a
            href={`/listing/${listing.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/listing/{listing.id}
          </a>
        </div>
      </main>
    </div>
  );
}
