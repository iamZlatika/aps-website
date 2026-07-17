# Architecture & Patterns

This document explains the key architectural decisions and patterns used in this project.
The goal is to help new developers (and future-you) understand *why* the code is structured
this way — not just *what* is there.

This repo is the **public website** for APS Service, split out of the original `aps-service`
monorepo and rewritten on **Next.js App Router** so the public marketing pages get real SSR
(the original was a client-only Vite/React SPA — good for the admin panel, bad for SEO).
The backoffice/admin panel stays in `aps-service`, deployed separately; both repos talk to
the same Laravel backend.

## Table of Contents

- [Project Structure](#project-structure)
- [Server vs Client Components](#server-vs-client-components)
- [Data Flow: DTO → Adapter → Domain](#data-flow-dto--adapter--domain)
- [Money / Amount Fields](#money--amount-fields)
- [API Layer](#api-layer)
- [Error Handling](#error-handling)
- [Error Tracking (Sentry)](#error-tracking-sentry)
- [Server State: React Query](#server-state-react-query)
- [Authentication](#authentication)
- [Routing & Navigation](#routing--navigation)
- [Forms](#forms)
- [Enums & Shared Types](#enums--shared-types)
- [i18n](#i18n)
- [SEO](#seo)
- [Adding a New Public Page](#adding-a-new-public-page)

---

## Project Structure

```
src/
├── app/                # Next.js App Router — routing, layouts, metadata. No business logic.
│   ├── (marketing)/     # SSR public pages: /, /about, /contacts, /works, /reviews, /price-list, /warranty, /track/[token]
│   ├── (auth)/           # /auth/* — email verify, confirm account/email-change, reset password, Google OAuth callback
│   ├── (cabinet)/         # /account/* — gated by a server-side cookie check in layout.tsx
│   ├── blocked/, maintenance/, not-found.tsx
│   ├── robots.ts, sitemap.ts
│   ├── layout.tsx        # Root layout: html/body, NextIntlClientProvider, React Query provider, WebsiteLayout, site-wide JSON-LD
│   └── providers.tsx      # "use client" QueryClientProvider wrapper
├── entities/             # Domain entities shared across multiple features
│   ├── location/          # Location DTO, domain type, adapter
│   ├── order-status/      # OrderStatus DTO, domain type, adapter
│   ├── price-list/        # PriceListItem DTO, domain type, adapter
│   └── work/               # Work DTO, domain type, adapter
├── features/
│   ├── website/            # The site itself — pages, components, hooks, modules
│   │   └── modules/         # account, orders, profile — the authenticated customer cabinet
│   └── auth/
│       ├── lib/              # authService.ts, sessionManager.ts (customer scope only)
│       └── website/           # Login/registration/forgot-password modals + auth pages
├── widgets/                 # Compound components shared across features (lightbox, work-card)
└── shared/
    ├── api/                  # apiClient.ts (axios, client), server.ts (fetch, server), queryClient.ts, queryKeys.ts
    ├── components/            # Generic UI (errors/QueryPageGuard, PullToRefresh*)
    ├── hooks/                 # Shared hooks
    ├── lib/                    # Utilities, constants, error helpers, i18n/t.ts (non-component translator)
    └── types.ts                # Global enums and shared types
```

Each module inside `features/website/modules/<name>/` follows the same structure as the
original project's backoffice modules did:

```
modules/<name>/
├── api/
│   ├── dto.ts        # Zod schemas for server response shapes (snake_case)
│   ├── endpoints.ts  # API URL constants and builder functions
│   └── index.ts      # API object with typed async methods (client transport, axios)
├── lib/
│   ├── adapters.ts   # DTO → domain mappers (the only snake_case ↔ camelCase layer)
│   └── *.schema.ts   # Zod schemas for form validation
├── hooks/            # React Query hooks for this module
├── components/ or pages/components/  # UI components for this module
├── routes.ts         # Path constants (used for links/redirects — App Router doesn't need a route table)
└── navigation.ts     # Link builder functions
```

### Shared entities (`src/entities/`)

Same rule as the original project — a type moves to `entities/` only when it's genuinely
reused by two or more features. In this repo everything under `entities/` is reused by at
least the top-level `features/website` pages and one customer-cabinet module.

| Entity | Consumers |
|--------|-----------|
| `location` | Header/Footer (via `LocationsContext`), contacts page, reviews page, hero schedule |
| `order-status` | Track page, status badge, customer order list/detail |
| `price-list` | Price list page, device price modal |
| `work` | Works page, `widgets/work-card` |

---

## Server vs Client Components

This is the one thing that's genuinely different from the original Vite SPA (and from
`aps-service`, which stays a client-only React app for the admin panel).

**Default to a Server Component.** A `page.tsx`/`layout.tsx` file with no `"use client"`
directive runs on the server, can `await` data directly, and its output is embedded in the
initial HTML — no loading spinner, and it's what a crawler actually sees.

**Add `"use client"` only when a component needs:**
- `useState`/`useEffect`/`useContext`/any hook that isn't purely derived from props
- Browser-only APIs (`window`, event listeners, `IntersectionObserver`, etc.)
- A hook from `next-intl` (`useTranslations`, `useLocale`) or `next/navigation`
  (`useRouter`, `usePathname`, `useSearchParams`, `useParams`) — these only work client-side

**The boundary is contagious downward, not upward.** A Server Component can render a Client
Component as a child with no issue. A Client Component's subtree is entirely client-rendered
once you cross into it — but that doesn't mean it can't *receive* server-fetched data; the
usual pattern here is a Server Component parent fetching data and passing it down as props to
a Client Component that only handles the interactive part. See `ReviewsContent.tsx`,
`PriceListContent.tsx`, `DevicesSection`, `Hero` for real examples: the page-level component
fetches (or receives) the data, the client half never calls a data hook itself.

**SSR-safety rule:** never read `window`/`document`/`localStorage` inside a `useState`
initializer or directly during render — that code path also runs during the server prerender,
where those globals don't exist, which produces a hydration mismatch (React logs it and gives
up patching the DOM). Start state at whatever value the server would produce, correct it in a
`useEffect` right after mount. `useWebsiteThemeManager.ts` is the reference example — and the
bug it fixes actually shipped once (theme read from `localStorage` in the initializer) before
being caught via a real hydration-mismatch report from the browser console, not from code
review — worth reading the fix commit if you're touching similar code.

---

## Data Flow: DTO → Adapter → Domain

Identical principle to the original project — all data from the server goes through three
layers before reaching components.

### Layer 1 — DTO (`api/dto.ts`)

Server response shape via Zod, `snake_case` fields exactly as the server sends them. The
TypeScript type is always **inferred** from the schema — never written manually.

```ts
export const LocationDtoSchema = z.object({
  id: z.number(),
  city_ru: z.string(),
  city_ua: z.string(),
  // ...
});
export type LocationDto = z.infer<typeof LocationDtoSchema>;
```

### Layer 2 — Domain types (`types.ts`)

The frontend-facing shape in `camelCase`, no connection to the network format.

### Layer 3 — Adapter (`lib/adapters.ts`)

Pure functions mapping DTO → domain — the only place `snake_case → camelCase` happens.

```ts
export function mapLocationDtoToLocation(dto: LocationDto): Location {
  return { id: dto.id, cityRu: dto.city_ru, cityUa: dto.city_ua /* ... */ };
}
```

### The transport fork: `api/server.ts` vs `api/index.ts`

`dto.ts` and `adapters.ts` are pure and framework-agnostic — they don't know or care whether
they're called from a server-side `fetch` or a client-side `axios` call. That's what makes it
possible to have **two transport entry points** per module calling the same DTO/adapter code:

```ts
// api/server.ts — Server Components, generateMetadata, sitemap.ts
export const websiteServerApi = {
  getLocationsInfo: async (): Promise<Location[]> => {
    const response = await getServer<LocationsResponseDto>(WEBSITE_API.locations());
    const validated = parseDto(LocationsResponseDtoSchema, response);
    return validated.data.map(mapLocationDtoToLocation);
  },
};

// api/index.ts — Client Components, via React Query
export const websiteApi = {
  getLocationsInfo: async (): Promise<Location[]> => {
    const response = await get<LocationsResponseDto>(WEBSITE_API.locations());
    const validated = parseDto(LocationsResponseDtoSchema, response);
    return validated.data.map(mapLocationDtoToLocation);
  },
};
```

Not every module needs both — `modules/orders`/`modules/profile` (authenticated, customer-only
data) only ever have a client transport, since that data is never needed for a public SSR page.

**Rule:** Never parse a DTO inside a component or hook. Never use raw server shapes in the UI.
When adding an endpoint that a Server Component will need, add the `server.ts` function
alongside the existing client one rather than fetching client-side and accepting a loading
spinner where SSR would clearly be better for SEO.

---

## Money / Amount Fields

Same backend rule as `aps-service`: money amounts are whole numbers — the backend never sends
fractional strings like `"0.00"`, always `"0"`, `"150"`, etc. Exact string comparisons
(`amount === "0"`) are safe. Use `formatMoney(value)` (`shared/lib/utils.ts`) to render.

---

## API Layer

### Client HTTP client (`shared/api/apiClient.ts`)

Axios instance with interceptors — customer scope only (no backoffice branch exists in this
repo at all).

**Request interceptor** — injects `Authorization: Bearer <token>` from `customerAuthService`.

**Response interceptor**:
- 401 with an existing token → clears it and does a hard `window.location.href = "/"` redirect
- Security-blocked response → `window.location.href` to `/blocked`
- 503 → `window.location.href` to `/maintenance`
- All errors except 401/403/422/503 (or a status in the request's `silentErrorStatuses`) → Sentry
- Returns an `ApiError` with `status`/`data`

These are `window.location` redirects, not `router.push`, because an axios interceptor runs
outside React entirely — there's no router instance available there, and a hard reload is the
correct reset for "the session just got invalidated" anyway.

### Server fetch client (`shared/api/server.ts`)

```ts
export async function getServer<T>(path: string, options?: { revalidate?: number | false }): Promise<T>
```

Thin wrapper over `fetch` with Next's `next: { revalidate }` caching (defaults to 1 hour).
No auth header — every `server.ts` function is for public, unauthenticated endpoints only.

### Shared HTTP methods (`shared/api/api.ts`)

```ts
get<T>(url, config?)     // GET (client, axios)
post<T, R>(url, data?)   // POST
put<T, R>(url, data?)    // PUT
del<R>(url)              // DELETE
```

---

## Error Handling

### `ApiError`

All HTTP errors become `ApiError` (carries `status`/`data`). Narrow with `isApiError(error)`.

### `notifyError(error)`

Shows an error toast; the query client already calls it for mutations with no explicit `onError`.

### `handleFormError(error, setError, options?)`

Maps 422 validation errors to React Hook Form fields.

### `QueryPageGuard`

Loading/error boundary for Client Components using React Query — see
`shared/components/errors/QueryPageGuard.tsx`. Built on this repo's own `ws-*` design tokens,
not the shadcn kit (this repo has no shadcn dependency — see the website section of
`.claude/guidelines/PROJECT_PATTERNS.md`).

---

## Error Tracking (Sentry)

`@sentry/nextjs`, configured via `sentry.client.config.ts` / `sentry.server.config.ts` /
`sentry.edge.config.ts` at the repo root (the standard Next.js + Sentry integration — no manual
`initSentry()` call needed, unlike the old Vite setup). `shared/lib/sentry.ts` keeps the same
`captureError`/`captureErrorWithId` helper API the rest of the codebase already calls.

`silentErrorStatuses` works the same as before — pass it in a request config to opt specific
statuses out of Sentry reporting on expected-error endpoints (e.g. order-status 404s).

---

## Server State: React Query

Client-side only — Server Components fetch directly via `await`, no React Query involved
(Next's own `fetch` cache handles that side, see [Data Flow](#the-transport-fork-apiserverts-vs-apiindexts)).

### Query keys (`shared/api/queryKeys.ts`)

Trimmed to what this repo actually needs: `auth`, `customer`, `tracking`, `website`. Always use
the registry, never inline arrays.

### Default settings

| Setting | Value |
|---------|-------|
| `staleTime` | 5 minutes |
| `gcTime` | 10 minutes |
| `refetchOnWindowFocus` | disabled |
| Retry | 0 for 4xx, 1 for 5xx |

### Mutation error handling

Mutations without `onError` show an error toast via `notifyError` automatically. Set
`meta: { silent: true }` to suppress this for background mutations.

---

## Authentication

Single scope: **customer**. Cookie name `customer_auth_token`, exported as
`CUSTOMER_AUTH_COOKIE_NAME` from `features/auth/lib/authService.ts` — the client-side
`customerAuthService` and the server-side `(cabinet)/layout.tsx` gate both import this
constant rather than hardcoding the string.

**Cabinet gate**: `(cabinet)/layout.tsx` is a Server Component reading the cookie via
`next/headers` `cookies()`, calling `redirect()` if absent — before any protected HTML is
sent. Note for debugging: `curl` shows this as a `200` with `NEXT_REDIRECT` embedded in the
RSC payload, not an HTTP `3xx` header, since the redirect fires from a nested layout after
streaming has already started. A real browser executes it as client-side navigation; check
the response body for the `NEXT_REDIRECT` marker if you need to confirm the gate fired.

**Session lifecycle**: `logout(router, redirectTo?)` in `features/auth/lib/sessionManager.ts`
takes a `next/navigation` router instance (call from a Client Component via `useRouter()`) —
there's no global router object outside React the way the old React Router setup had one.

Full backend contract (endpoints, gate chain, rate limits): `.claude/docs/customer-auth-api.md`.

---

## Routing & Navigation

App Router is file-based — a route is a folder under `src/app/` with a `page.tsx`. Route
groups (`(marketing)`, `(auth)`, `(cabinet)`) organize files without affecting the URL.

`routes.ts` / `navigation.ts` still exist per module, same convention as before, even though
App Router doesn't need a route table the way React Router's `<Route path>` did — they exist
to avoid hardcoded path strings in redirects, `generateMetadata`, and link components:

```ts
// routes.ts
export const WEBSITE_ROUTES = { home: "/", contacts: "/contacts" /* ... */ } as const;

// navigation.ts
export const WEBSITE_LINKS = { home: WEBSITE_ROUTES.home, contacts: WEBSITE_ROUTES.contacts } as const;
```

**Never hardcode paths:**

```tsx
// ✅ correct
<Link href={WEBSITE_LINKS.contacts}>Контакти</Link>

// ❌ wrong
<Link href="/contacts">Контакти</Link>
```

Use `next/link`'s `Link` for internal navigation, `next/navigation`'s `useRouter()` for
programmatic navigation inside a component. Code running outside React (axios interceptor)
uses `window.location.href` — see [API Layer](#api-layer).

---

## Forms

React Hook Form + Zod resolver, same as the original project.

```ts
export const loginSchema = z.object({
  email: z.string().email(t("validation.email_invalid")),
  password: z.string().min(8, t("validation.password_min")),
});
```

**Difference from the old repo:** schema files often live at module scope, outside any
component, so they can't call the `useTranslations()` hook. Use the `t()` shim from
`shared/lib/i18n/t.ts` instead — same call shape, reads the locale cookie directly. See [i18n](#i18n).

Server validation errors map to fields via `handleFormError(error, setError)`.

---

## Enums & Shared Types

Same pattern as before — `as const` objects in `shared/types.ts`, union type always derived:

```ts
export const USER_LANGUAGES = { UK: "uk", RU: "ru" } as const;
export type UserLanguage = (typeof USER_LANGUAGES)[keyof typeof USER_LANGUAGES];
```

`shared/types.ts` here only holds the subset the website actually uses — the backoffice-only
enums from the original project (`ROLES`, `TRANSACTION_TYPES`, `SMS_*`, etc.) were
deliberately left behind. Use `zodEnumFromConst` (`shared/lib/zod-helpers.ts`) for Zod enums.

---

## i18n

**`next-intl`**, not `react-i18next` — chosen specifically because it has real Server
Component support (`getTranslations`), which `react-i18next` doesn't. Given this whole repo
exists for SSR, a client-only i18n library would have undermined the point on every page.

- Server Components: `const t = await getTranslations();`
- Client Components: `const t = useTranslations();`
- Non-component code (Zod schemas, error maps): `import { t } from "@/shared/lib/i18n/t";`

Messages: `src/messages/{ru,uk}.json`, flat structure (no more `common`/`website` namespace
split — this repo only ever had the website content).

**Locale lives in a cookie**, not `localStorage` — `src/i18n/request.ts` reads it server-side
to pick the locale for the first render. `LangSwitch.tsx` sets the cookie client-side and calls
`router.refresh()`.

**Interpolation is ICU MessageFormat**: `{count}` not `{{count}}`; pluralization is
`{count, plural, one {...} few {...} many {...} other {...}}`, not separate `key_one`/`key_few`
keys. For arrays/objects in a message value, use `t.raw(key)`, not `t(key, { returnObjects: true })`.

Locale is **not** in the URL — matches the old SPA's runtime-toggle UX.

### Why every page is SSR, not SSG/ISR (and why that's a deliberate trade-off)

Reading the locale cookie in `src/i18n/request.ts` (invoked from the root layout, so it
affects every route) uses `next/headers` `cookies()` — a "dynamic API" in Next.js terms. Any
route that touches a dynamic API gets fully dynamically rendered (SSR, fresh on every
request), which overrides the `revalidate` caching set on individual `fetch` calls in
`api/server.ts`. Confirmed via `next build` output: every content route is `ƒ (Dynamic)`,
only `sitemap.xml`/`robots.txt` are `○ (Static)`.

This is **not** an SEO problem — SSR pages are fully crawlable, with real content in the
initial HTML (the entire point of this migration), same as SSG/ISR would be from Google's
perspective. What ISR/SSG would actually buy here is faster response time and lower hosting
cost (serving cached/static HTML instead of running a render on every request) — genuinely
worth it for content that changes rarely (most pages here update roughly once a year, per the
business), but not a ranking concern.

**The only way to get true SSG/ISR while still supporting two locales** is to move the locale
out of a cookie and into the URL (`/uk/...`, `/ru/...`), decided via `next-intl`'s middleware-based
i18n routing instead of a per-request cookie read in the layout — middleware runs separately
from page rendering and can read the cookie without forcing the whole route dynamic. This was
evaluated and **deliberately deferred** (not forgotten) — it's real migration work (route
restructuring under `app/[locale]/`, middleware, `hreflang` via `alternates.languages`,
updating every `Link`/`redirect()` call, a two-locale `sitemap.ts`), and it would also fix a
separate pre-existing gap noted in `.claude/docs/SEO_ONPAGE_TEXTS.md`: with locale in a
cookie, Google only ever indexes one language version of each page, since there's a single
URL either way. If/when the ISR performance win or the two-language-indexing fix becomes worth
the effort, this is the path — not Partial Prerendering (still experimental in Next.js as of
this writing, not worth betting production SEO on).

---

## SEO

The entire point of this repo's existence — worth its own section rather than folding it into
routing.

- `generateMetadata()` on every `(marketing)` route, driven by `features/website/lib/seo.ts`'s
  `buildPageMetadata(key, path)` and the `seo.{page}.title`/`description` i18n keys.
- `(cabinet)`, `(auth)`, and `/track/[token]` set `robots: { index: false, follow: false }`
  at the layout/page level — not automatic, add it explicitly for anything behind auth.
- `app/sitemap.ts` / `app/robots.ts` are the source of truth for indexable URLs.
- JSON-LD (`features/website/lib/jsonLd.ts`): `Organization` site-wide (root layout),
  `ElectronicsStore` per office (`/contacts`), `AggregateRating`/`Review` (`/reviews`) — all
  built from real data the page already fetched, not duplicated fetches just for structured data.

---

## Adding a New Public Page

- [ ] `src/app/(marketing)/<route>/page.tsx` — Server Component, `export async function generateMetadata()`
- [ ] Add the route to `WEBSITE_ROUTES`/`WEBSITE_LINKS` if it needs to be linked from elsewhere
- [ ] Add a `seo.<key>.title`/`description` entry to both `src/messages/{ru,uk}.json`, wire it in `seo.ts`
- [ ] Add the URL to `app/sitemap.ts`'s `INDEXED_ROUTES`
- [ ] If the page needs data: add (or extend) `api/server.ts` for the module, calling the same
      `dto.ts`/`adapters.ts` as any existing client transport
- [ ] Fetch directly in the Server Component (`await websiteServerApi.someMethod()`) — no
      React Query, no loading state needed
- [ ] Only add `"use client"` to the specific piece that needs interactivity (a form, a modal,
      scroll-spy nav) — pass server-fetched data down as props rather than having the client
      component fetch it itself
