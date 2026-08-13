# Crestodian — Real Estate Agent Platform MVP1

A modern, video-first real estate platform for South African agents. Built for mobile-first discovery, WhatsApp-native lead management, and seller transparency.

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Prisma ORM |
| Notifications | WhatsApp Cloud API |
| Analytics | Custom (ListingView table) |

---

## Project Structure

```
app/
  (buyer)/          # Public buyer-facing pages
    feed/           # Listings discovery grid
    listing/[id]/   # Listing detail with video/carousel + viewing request
    agent/[profileId]/ # Public agent profile
    viewing-confirmed/ # Post-request confirmation screen
  (agent)/          # Agent portal (TODO: add auth)
    profile/        # Profile setup/edit
    listings/       # Listings dashboard
    listings/upload/ # Upload new listing
    listings/[id]/  # Listing detail with stats + status toggle
    crm/            # Kanban pipeline
    crm/[leadId]/   # Lead detail + stage management
  (seller)/         # Seller dashboard (TODO: add auth)
    dashboard/      # Per-listing views, objection chip tally
  api/
    listings/       # GET list, POST create
    agents/         # GET list, POST create
    agents/[id]/    # GET single, PATCH update
    leads/          # GET list, POST create + WhatsApp notify
    leads/[id]/     # PATCH stage (→ triggers buyer WhatsApp if confirmed)
    feedback/       # POST objection chip
    analytics/      # POST track view, GET stats
components/
  ui/
    Badge.tsx       # Status badge
    StatCard.tsx    # Dashboard stat card
lib/
  db.ts             # Prisma client singleton
  whatsapp.ts       # WhatsApp Cloud API helpers
  analytics.ts      # Listing view tracking
types/
  index.ts          # All domain types
prisma/
  schema.prisma     # Full data model
```

---

## Setup

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `WHATSAPP_PHONE_ID` | Meta WhatsApp Cloud API phone number ID |
| `WHATSAPP_TOKEN` | Meta WhatsApp Cloud API Bearer token |
| `NEXT_PUBLIC_APP_URL` | Public URL (for links in WhatsApp messages) |

### 2. Database

```bash
# Run Prisma migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to inspect data
npx prisma studio
```

### 3. Dev Server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## MVP Screens

| Route | Who | Description |
|-------|-----|-------------|
| `/feed` | Buyer | Discovery grid with area/price filters |
| `/listing/[id]` | Buyer | Listing detail, photo carousel/video, viewing request modal |
| `/agent/[profileId]` | Buyer | Public agent profile with listings + WhatsApp CTA |
| `/viewing-confirmed` | Buyer | Post-request confirmation screen |
| `/profile` | Agent | Profile setup/edit form |
| `/listings` | Agent | Listings dashboard with quick stats |
| `/listings/upload` | Agent | Upload new listing |
| `/listings/[id]` | Agent | Listing detail: stats panel + status toggle |
| `/crm` | Agent | Kanban pipeline |
| `/crm/[leadId]` | Agent | Lead detail + stage management |
| `/dashboard` | Seller | Per-listing views, watch-through, objection chips |

---

## Build Sequence (Product Map)

1. **Auth** — Add NextAuth or Clerk for agent/seller login. Apply auth guards (marked `// TODO: add auth guard`).
2. **Photo Upload** — Replace URL textarea with real S3/Cloudflare R2 uploads.
3. **Video Analytics** — Wire `POST /api/analytics` to video player `timeupdate` events on the buyer listing page.
4. **WhatsApp Webhook** — Receive buyer objection chip responses from WhatsApp → `POST /api/feedback`.
5. **Seller Onboarding** — Link sellers to listings; seller dashboard shows only their properties.
6. **Payments** — Agent subscription billing (Stripe) to publish listings.
7. **Search** — Full-text search with PostGIS for geo-radius area search.
8. **Mobile PWA** — Service worker + manifest for add-to-home-screen.

---

## WhatsApp Flow

```
Buyer fills "Request Viewing" form
  → POST /api/leads
  → Lead created with stage: viewing_requested
  → Agent receives WhatsApp: "New viewing request from [Buyer] for [Address]"

Agent confirms via CRM (PATCH /api/leads/[id] { stage: "viewing_confirmed", viewingTime })
  → Buyer receives WhatsApp: "Your viewing is confirmed for [time]"

Post-viewing: WhatsApp bot sends chip survey to buyer
  → Buyer replies with chip (e.g. "price")
  → POST /api/feedback → ViewingFeedback record created
  → Lead moves to stage: viewed
```

---

## Contributing

- All pages dark theme: `bg-gray-950` pages, `bg-gray-900` cards, `bg-gray-800` inputs
- Accent: `blue-600`
- Tailwind only — no extra UI libraries
- Server components by default; add `"use client"` only for forms/interactive state
- API routes: always wrap db calls in try/catch, return proper status codes

---

Built with ❤️ for the South African property market.
