// Passive analytics helpers — track listing views without buyer effort

import { db } from './db'

export async function trackListingView({
  listingId,
  sessionId,
  watchPercent = 0,
  saved = false,
}: {
  listingId: string
  sessionId: string
  watchPercent?: number
  saved?: boolean
}) {
  const existing = await db.listingView.findFirst({
    where: { listing_id: listingId, session_id: sessionId },
  })

  if (existing) {
    return db.listingView.update({
      where: { id: existing.id },
      data: {
        is_returning: true,
        watch_percent: Math.max(existing.watch_percent, watchPercent),
        saved: existing.saved || saved,
      },
    })
  }

  return db.listingView.create({
    data: {
      listing_id: listingId,
      session_id: sessionId,
      is_returning: false,
      watch_percent: watchPercent,
      saved,
    },
  })
}

export async function getListingStats(listingId: string) {
  const views = await db.listingView.findMany({ where: { listing_id: listingId } })
  const leads = await db.lead.count({ where: { listing_id: listingId } })

  return {
    total_views: views.length,
    unique_views: views.filter((v) => !v.is_returning).length,
    returning_views: views.filter((v) => v.is_returning).length,
    saves: views.filter((v) => v.saved).length,
    viewing_requests: leads,
    watch_25: views.filter((v) => v.watch_percent >= 25).length,
    watch_50: views.filter((v) => v.watch_percent >= 50).length,
    watch_75: views.filter((v) => v.watch_percent >= 75).length,
    watch_100: views.filter((v) => v.watch_percent >= 100).length,
  }
}
