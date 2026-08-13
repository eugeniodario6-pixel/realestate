import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-2">RealEstate</h1>
      <p className="text-gray-400 mb-12 text-center max-w-md">
        Property discovery &amp; transparency platform — Agent MVP
      </p>
      <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
        <Link href="/feed" className="bg-blue-600 hover:bg-blue-700 text-white text-center py-4 px-6 rounded-xl font-medium transition">
          Browse Listings →
        </Link>
        <Link href="/agent/profile" className="bg-gray-800 hover:bg-gray-700 text-white text-center py-4 px-6 rounded-xl font-medium transition">
          Agent Dashboard →
        </Link>
        <Link href="/seller/dashboard" className="bg-gray-800 hover:bg-gray-700 text-white text-center py-4 px-6 rounded-xl font-medium transition">
          Seller Dashboard →
        </Link>
      </div>
    </main>
  )
}
