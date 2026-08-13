// components/ui/Badge.tsx
// Simple status badge for lead stages and listing status

import React from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: 'bg-gray-700 text-gray-300 border-gray-600',
  success: 'bg-green-900/50 text-green-300 border-green-800',
  warning: 'bg-yellow-900/50 text-yellow-300 border-yellow-800',
  error:   'bg-red-900/50 text-red-300 border-red-800',
  info:    'bg-blue-900/50 text-blue-300 border-blue-800',
};

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
};

export default function Badge({
  label,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border font-medium uppercase tracking-wide',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      ].join(' ')}
    >
      {label}
    </span>
  );
}
