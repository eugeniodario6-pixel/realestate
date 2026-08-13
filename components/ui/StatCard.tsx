// components/ui/StatCard.tsx
// Stat display card: label + value + optional subtitle. Used in dashboards.

import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

export default function StatCard({ label, value, subtitle, className = '' }: StatCardProps) {
  return (
    <div
      className={[
        'rounded-xl border border-gray-800 bg-gray-800 p-4 text-center',
        className,
      ].join(' ')}
    >
      <p className="mb-1 text-2xl font-bold text-white">{value}</p>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      {subtitle && (
        <p className="mt-1 text-xs text-gray-600">{subtitle}</p>
      )}
    </div>
  );
}
