'use client';

// app/(buyer)/listing/[id]/page.tsx
// Public listing detail — video player or photo carousel, Save button, Request Viewing modal

import { useState, use } from 'react';
import Link from 'next/link';
import { Listing } from '@/types';

// TODO: replace with db query
const MOCK_LISTING: Listing = {
  id: '1',
  agent_id: 'agent-1',
  address: '12 Ocean View Drive, Camps Bay',
  price: 4_500_000,
  beds: 3,
  baths: 2,
  type: 'apartment',
  area: 'Camps Bay',
  size_sqm: 120,
  video_url: '',
  photo_urls: [
    'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200',
  ],
  description:
    'Stunning ocean views from this modern apartment. Features open-plan living, a chef\'s kitchen, and a wrap-around balcony. Secure underground parking. Walking distance to Camps Bay beach.',
  status: 'active',
  created_at: new Date().toISOString(),
};

function formatPrice(price: number): string {
  return `R ${price.toLocaleString('en-ZA')}`;
}

interface RequestViewingModalProps {
  listingId: string;
  onClose: () => void;
}

function RequestViewingModal({ listingId, onClose }: RequestViewingModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId, buyer_name: name, buyer_phone: phone }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      window.location.href = '/viewing-confirmed';
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Request a Viewing</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        <p className="mb-6 text-sm text-gray-400">
          Fill in your details and the agent will WhatsApp you to confirm a time.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+27 82 000 0000"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 py-3 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Sending…' : 'Request Viewing'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // TODO: fetch listing from db by id
  const listing = { ...MOCK_LISTING, id };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/feed" className="text-blue-400 hover:underline">← Back to listings</Link>
          <h1 className="text-lg font-bold text-blue-400">Crestodian</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Media */}
          <div className="lg:col-span-3">
            {listing.video_url ? (
              <div className="overflow-hidden rounded-xl bg-gray-900">
                <video
                  src={listing.video_url}
                  controls
                  className="w-full rounded-xl"
                  poster={listing.photo_urls[0]}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="overflow-hidden rounded-xl bg-gray-900">
                  <img
                    src={listing.photo_urls[currentPhoto] || ''}
                    alt={listing.address}
                    className="h-72 w-full object-cover lg:h-96"
                  />
                </div>
                {listing.photo_urls.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {listing.photo_urls.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPhoto(i)}
                        className={`flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                          i === currentPhoto ? 'border-blue-500' : 'border-transparent'
                        }`}
                      >
                        <img src={url} alt="" className="h-16 w-24 object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
              <div className="mb-2 flex items-start justify-between">
                <span className="rounded-full bg-blue-900/50 px-3 py-1 text-xs font-medium uppercase text-blue-300">
                  {listing.type}
                </span>
                <button
                  onClick={() => setSaved(!saved)}
                  className={`text-2xl transition ${saved ? 'text-red-400' : 'text-gray-600 hover:text-red-400'}`}
                  title={saved ? 'Saved' : 'Save listing'}
                >
                  {saved ? '❤️' : '🤍'}
                </button>
              </div>

              <p className="mb-1 text-2xl font-bold text-blue-400">{formatPrice(listing.price)}</p>
              <p className="mb-4 text-gray-300">{listing.address}</p>

              <div className="mb-4 grid grid-cols-3 gap-3 rounded-lg bg-gray-800 p-3 text-center text-sm">
                <div>
                  <p className="text-lg font-bold">{listing.beds}</p>
                  <p className="text-gray-400">Beds</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{listing.baths}</p>
                  <p className="text-gray-400">Baths</p>
                </div>
                {listing.size_sqm && (
                  <div>
                    <p className="text-lg font-bold">{listing.size_sqm}</p>
                    <p className="text-gray-400">m²</p>
                  </div>
                )}
              </div>

              {listing.description && (
                <p className="mb-5 text-sm leading-relaxed text-gray-400">{listing.description}</p>
              )}

              <button
                onClick={() => setShowModal(true)}
                className="w-full rounded-lg bg-blue-600 py-3 font-medium hover:bg-blue-700"
              >
                Request Viewing
              </button>

              <Link
                href={`/agent/agent-1`}
                className="mt-3 block w-full rounded-lg border border-gray-700 py-3 text-center text-sm text-gray-300 hover:border-gray-500 hover:text-white"
              >
                View Agent Profile
              </Link>
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <RequestViewingModal listingId={id} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
