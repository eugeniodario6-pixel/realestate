'use client';

// app/(agent)/profile/page.tsx
// Agent profile setup/edit form
// TODO: add auth guard

import { useState } from 'react';

export default function AgentProfilePage() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [ppra, setPpra] = useState('');
  const [agency, setAgency] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [areas, setAreas] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          bio,
          ppra_number: ppra,
          agency,
          whatsapp,
          areas_served: areas.split(',').map((a) => a.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error('Failed to save profile');
      setSuccess(true);
    } catch {
      setError('Failed to save profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <h1 className="text-xl font-bold text-blue-400">Crestodian Agent</h1>
          <nav className="flex gap-4 text-sm text-gray-400">
            <a href="/listings" className="hover:text-white">My Listings</a>
            <a href="/crm" className="hover:text-white">CRM</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="mb-2 text-2xl font-bold">Agent Profile</h2>
        <p className="mb-8 text-gray-400">Set up your public profile that buyers will see.</p>

        {success ? (
          <div className="rounded-xl border border-green-800 bg-green-900/20 p-8 text-center">
            <div className="mb-4 text-4xl">✅</div>
            <h3 className="mb-2 text-xl font-bold">Profile Saved!</h3>
            <p className="mb-6 text-gray-400">Your profile is now live.</p>
            <a
              href="/listings"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium hover:bg-blue-700"
            >
              Go to My Listings
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <div className="space-y-5">
              {/* Photo Upload Placeholder */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Profile Photo</label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full border-2 border-dashed border-gray-700 bg-gray-800 flex items-center justify-center text-2xl text-gray-600">
                    👤
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-gray-500"
                  >
                    Upload Photo
                    {/* TODO: implement photo upload */}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Dlamini"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">Agency</label>
                <input
                  type="text"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  placeholder="Crestodian Properties"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">PPRA Number</label>
                <input
                  type="text"
                  value={ppra}
                  onChange={(e) => setPpra(e.target.value)}
                  placeholder="PPRA-WC-2020-000001"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">WhatsApp Number</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+27 82 000 0000"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Areas Served{' '}
                  <span className="text-gray-500">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={areas}
                  onChange={(e) => setAreas(e.target.value)}
                  placeholder="Camps Bay, Sea Point, Clifton"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Tell buyers about your experience and what areas you specialise in…"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-blue-600 py-3 font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Saving…' : 'Save Profile'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
