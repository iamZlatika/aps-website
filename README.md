# APS Website

The public website for APS Service — a Zaporizhzhia electronics repair service center.
Company information, repair status tracking, price list, portfolio, reviews, and a personal
customer account.

## Why this repo exists

This used to be part of `aps-service`, a single Vite + React SPA that also contained the
internal backoffice/admin panel. The public site was split out into its own repo and rewritten
on **Next.js App Router** so the marketing pages get real server-side rendering — the original
was 100% client-rendered, which meant search engines saw an empty shell on first load. The
backoffice stays in `aps-service` as a separate deployment; both talk to the same backend API.

## Overview

- **Public marketing pages** — home, about, contacts, works (portfolio), reviews, price list,
  warranty, order tracking. Server-rendered for SEO.
- **Customer account** — order history, profile (avatar/name/email/password/phones),
  Telegram notification linking. Gated behind customer authentication, client-rendered.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router), React 19, TypeScript 5.9 |
| Server state (client-side) | TanStack Query 5 |
| Forms | React Hook Form 7 + Zod 4 |
| Styling | Tailwind CSS 3 (custom `ws-*` design tokens — no shadcn/UI kit) |
| i18n | next-intl (ru / uk), SSR-aware |
| HTTP client | Axios (client-side), native `fetch` (server-side, see [architecture.md](docs/architecture.md)) |
| Error tracking | Sentry (`@sentry/nextjs`) |
| Testing | Vitest, Testing Library |

## Getting Started

**Prerequisites:** Node.js 20+, npm

```bash
git clone <repo-url>
cd aps-website
npm install
```

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_SITE_URL` | Public site base URL (SEO canonical/OG links, sitemap, OAuth callback) |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | Google Maps API key (contacts page map embed) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID (optional) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics measurement ID (optional) |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN for error tracking (optional) |

```bash
npm run dev        # development server (http://localhost:3000)
npm run build      # production build
npm run start      # run the production build locally
npm run test       # run tests in watch mode
npm run test:run   # run tests once
npm run lint        # lint
npm run lint:fix    # lint and auto-fix
```

## Project Structure

```
src/
├── app/              # Next.js App Router — routes, layouts, metadata
│   ├── (marketing)/   # SSR public pages
│   ├── (auth)/         # Email verify / confirm / reset / OAuth callback pages
│   └── (cabinet)/       # Customer account, server-side auth gate
├── entities/          # Shared domain entities (location, order-status, price-list, work)
├── features/
│   ├── website/        # The site itself: pages, components, hooks, account/orders/profile modules
│   └── auth/            # Customer auth (login/registration/session)
├── widgets/             # Reusable compound components (lightbox, work-card)
├── messages/             # next-intl message files (ru.json, uk.json)
└── shared/
    ├── api/               # HTTP clients (axios client-side, fetch server-side), query client/keys
    ├── components/         # Generic UI (error states, pull-to-refresh)
    ├── hooks/              # Shared hooks
    └── lib/                # Utilities, constants, error helpers, i18n
```

## Documentation

- [Architecture & patterns](docs/architecture.md) — Server/Client Components, data flow, auth, SEO, i18n
- [Website](docs/website.md) — every page, route, hook, and component in detail
- [Shared utilities & components](docs/shared.md)

## Deployment

Deployed on Netlify (`@netlify/plugin-nextjs`). The backoffice (`aps-service`) deploys
separately, on Cloudflare Pages, under a subdomain — the two apps don't share a session
(independent auth cookies) or a codebase.
