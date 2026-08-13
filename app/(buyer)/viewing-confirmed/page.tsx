// app/(buyer)/viewing-confirmed/page.tsx
// Confirmation screen after requesting a viewing

import Link from 'next/link';

export default function ViewingConfirmedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-6 text-center text-white">
      <div className="max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-10">
        <div className="mb-6 text-6xl">✅</div>

        <h1 className="mb-4 text-2xl font-bold">You're on the list!</h1>

        <p className="mb-2 text-gray-300">
          Your viewing request has been sent!
        </p>
        <p className="mb-8 text-gray-400">
          The agent will WhatsApp you to confirm a time. Keep an eye on your messages.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/feed"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium hover:bg-blue-700"
          >
            Browse More Listings
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-gray-700 px-6 py-3 text-sm text-gray-400 hover:border-gray-500 hover:text-white"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
