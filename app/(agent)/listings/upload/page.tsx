'use client';

// app/(agent)/listings/upload/page.tsx
// Listing upload form
// TODO: add auth guard

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ListingType } from '@/types';

const LISTING_TYPES: ListingType[] = ['apartment', 'house', 'townhouse', 'commercial', 'land'];

export default function UploadListingPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    address: '',
    price: '',
    beds: '',
    baths: '',
    type: 'apartment' as ListingType,
    area: '',
    size_sqm: '',
    description: '',
    video_url: '',
    photo_urls: '',
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: form.address,
          price: parseInt(form.price, 10),
          beds: parseInt(form.beds, 10),
          baths: parseInt(form.baths, 10),
          type: form.type,
          area: form.area,
          size_sqm: form.size_sqm ? parseInt(form.size_sqm, 10) : undefined,
          description: form.description,
          video_url: form.video_url || undefined,
          photo_urls: form.photo_urls
            .split('\n')
            .map((u) => u.trim())
            .filter(Boolean),
          // TODO: attach authenticated agent_id from session
          agent_id: 'agent-1',
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create listing');
      }
      const data = await res.json();
      router.push(`/listings/${data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none';
  const labelClass = 'mb-1 block text-sm font-medium text-gray-300';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <a href="/listings" className="text-blue-400 hover:underline">← My Listings</a>
          <h1 className="text-xl font-bold text-blue-400">Upload Listing</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="mb-6 text-2xl font-bold">New Listing</h2>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-gray-800 bg-gray-900 p-6">
          {/* Address */}
          <div>
            <label className={labelClass}>Full Address *</label>
            <input
              name="address"
              type="text"
              required
              value={form.address}
              onChange={handleChange}
              placeholder="12 Ocean View Drive, Camps Bay, Cape Town"
              className={inputClass}
            />
          </div>

          {/* Price */}
          <div>
            <label className={labelClass}>Asking Price (ZAR) *</label>
            <input
              name="price"
              type="number"
              required
              min="0"
              value={form.price}
              onChange={handleChange}
              placeholder="4500000"
              className={inputClass}
            />
          </div>

          {/* Beds / Baths / Type / Area */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <label className={labelClass}>Beds *</label>
              <input
                name="beds"
                type="number"
                required
                min="0"
                value={form.beds}
                onChange={handleChange}
                placeholder="3"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Baths *</label>
              <input
                name="baths"
                type="number"
                required
                min="0"
                value={form.baths}
                onChange={handleChange}
                placeholder="2"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Type *</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={inputClass}
              >
                {LISTING_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Size (m²)</label>
              <input
                name="size_sqm"
                type="number"
                min="0"
                value={form.size_sqm}
                onChange={handleChange}
                placeholder="120"
                className={inputClass}
              />
            </div>
          </div>

          {/* Area */}
          <div>
            <label className={labelClass}>Area / Suburb *</label>
            <input
              name="area"
              type="text"
              required
              value={form.area}
              onChange={handleChange}
              placeholder="Camps Bay"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the property — key features, lifestyle, finishes…"
              className={inputClass}
            />
          </div>

          {/* Video URL */}
          <div>
            <label className={labelClass}>Video URL</label>
            <input
              name="video_url"
              type="url"
              value={form.video_url}
              onChange={handleChange}
              placeholder="https://…"
              className={inputClass}
            />
          </div>

          {/* Photo URLs */}
          <div>
            <label className={labelClass}>
              Photo URLs{' '}
              <span className="text-gray-500">(one per line)</span>
            </label>
            <textarea
              name="photo_urls"
              value={form.photo_urls}
              onChange={handleChange}
              rows={4}
              placeholder={`https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg`}
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 py-3 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Uploading…' : 'Publish Listing'}
          </button>
        </form>
      </main>
    </div>
  );
}
