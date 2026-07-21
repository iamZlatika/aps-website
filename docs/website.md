# Website

The entire application — there's no backoffice here (see the repo-level README for why this
split exists). Public marketing pages are server-rendered for SEO; the customer cabinet is
gated behind a server-side auth check but still mostly client-interactive once loaded.

**Source:** `src/features/` (one flat domain per page: `home`, `about`, `contacts`, `works`,
`reviews`, `price-list`, `warranty`, `track`, plus `locations`, `account`, `orders`, `profile`),
`src/widgets/site-shell/` (Header/Footer/layout chrome), `src/app/` (routing)

## Pages

| Page | Route | Rendering | Description |
|------|-------|-----------|-------------|
| Home | `/` | Server (landing data) + Client (interactivity) | Hero with quick status check, device types, PC build section |
| Contacts | `/contacts` | Server | Service center locations — addresses, phones, maps, `ElectronicsStore` JSON-LD |
| About | `/about` | Client | About-us page |
| Works | `/works` | Server | Portfolio / completed works showcase |
| Reviews | `/reviews` | Server (data) + Client (tab switching) | Customer reviews per location, `AggregateRating`/`Review` JSON-LD |
| Price List | `/price-list` | Server (data) + Client (scroll-spy nav) | Full device repair price list with category navigation |
| Warranty | `/warranty` | Client | Warranty terms, storage rates |
| Track | `/track/:token` | Client, `noindex` | Full order tracking page by unique token |
| User Account | `/account` | Client, gated | Personal account — order history, profile, phone/Telegram management |
| Account order detail | `/account/orders/:id` | Client, gated | Single order's detail within the account |
| Account profile | `/account/profile` | Client, gated | Edit avatar, name, email, password, phones, Telegram link |

Also present: standalone auth pages under `/auth/*` (email verify, confirm account, confirm
email change, reset password, Google OAuth callback — see [Auth pages](#auth--utility-pages)),
and utility pages `not-found`, `maintenance`, `blocked`.

"Server" here means the page component is `async`, fetches via that domain's own
`api/server.ts` (e.g. `homeServerApi`, `locationsServerApi`), and has no `"use client"`
directive — see [architecture.md](architecture.md#server-vs-client-components)
for the full explanation of the pattern and why some pages are a Server/Client split rather
than fully one or the other.

---

## Routing

App Router — a route is a folder under `src/app/` with a `page.tsx`. Three route groups:

```
app/
├── (marketing)/    # public pages, wrapped in the same root layout/WebsiteLayout as everything else
├── (auth)/          # token-verification pages, robots: noindex at the group's layout.tsx
└── (cabinet)/        # /account/*, gated by a server-side cookie check in layout.tsx
```

Route groups (the parenthesized names) don't appear in the URL — they're purely for organizing
files and letting different subtrees have different `layout.tsx`/`metadata`.

`WEBSITE_ROUTES` (`widgets/site-shell/routes.ts`) still exists as a path-constant registry, even
though App Router doesn't require one the way React Router's `<Route path>` config did — it's
there so redirects, `generateMetadata`, and `sitemap.ts` don't hardcode path strings. It lives
in `widgets/site-shell/` rather than split one-per-page because its main consumers are the
site-wide Header/Footer nav lists that already live there and need the whole set at once:

```ts
export const WEBSITE_ROUTES = {
  home: "/",
  contacts: "/contacts",
  works: "/works",
  reviews: "/reviews",
  priceList: "/price-list",
  warranty: "/warranty",
  about: "/about",
} as const;
```

Static links are in `WEBSITE_LINKS`. The `track` route isn't in `WEBSITE_LINKS` because it
needs a dynamic token — build it manually when needed.

**Account routes** live in their own module `routes.ts` files:

```ts
// modules/account/routes.ts
export const CUSTOMER_ACCOUNT_ROUTES = { root: "/account" } as const;
// modules/orders/routes.ts
export const CUSTOMER_ORDERS_ROUTES = { detail: "/account/orders/:id" } as const;
// modules/profile/routes.ts
export const CUSTOMER_PROFILE_ROUTES = { root: "/account/profile" } as const;
```

---

## Pages in detail

### Home (`/`)

`app/(marketing)/page.tsx` is an `async` Server Component: fetches landing data once
(`homeServerApi.getLanding()`) and passes it down as props — `activeCount` to `Hero`,
the full `landing` object to `DevicesSection`. Neither section fetches its own data anymore.

Three sections, each a Client Component (they hold interactive state — modals, theme-aware
images) even though their data arrives as props:

- **Hero** — tagline, active order count (server-fetched, embedded in the initial HTML),
  button to the personal account, and a "Track order" button opening `TrackStatusModal`
- **Devices** — cards for each device category, with live min-price per category
  (`findCheapestCategory`, computed from the server-fetched `landing.prices`)
- **PC Build** — PC assembly service promo section, its own modal

**`TrackStatusModal`** — order-number quick-check dialog (`OrderPreview` via `useOrderStatus`,
a mutation, not the full track page's query). Clicking through opens `/track/:token`.

---

### Track (`/track/:token`)

Client Component (`useOrderTracking(token)`, a React Query hook — this page is `noindex`
anyway, per `robots.txt`, so there's no SEO reason to make it a Server Component).

Displays order number, status badge, issue type/estimated cost, full history accordion
(`OrderHistoryAccordion`, built via `buildOrderHistory()` in `lib/orderHistory.ts`), device
specs table (`TrackSpecsTable`).

---

### Price List (`/price-list`)

`app/(marketing)/price-list/page.tsx` is a Server Component: fetches the **entire** price
list server-side (`priceListServerApi.getAllPriceList()`, looping through all pages internally —
the API caps at 100 items/page), groups it by category (`groupPriceListByCategory`, a pure
function), and renders the heading directly plus `<PriceListContent groups={groups} />`.

`PriceListContent.tsx` is the Client Component half — owns the `IntersectionObserver`-based
scroll-spy nav (`usePricePageNav`) and the sticky category pill bar (`PriceNavBar`). It
receives `groups` as a prop; it never fetches anything itself. This replaced the old
`usePriceListAll()` hook (client-side `useSuspenseInfiniteQuery` + a `useEffect` that
auto-fetched every remaining page) — since the server just fetches everything in one
request-response cycle, there's no more "fetch page 1, then eagerly fetch the rest" dance and
no loading skeleton needed.

---

### Contacts (`/contacts`)

Full Server Component. Fetches locations via `locationsServerApi.getLocationsInfo()` (the same
data Header/Footer get from `LocationsContext` — Next's `fetch` cache dedupes the identical
request within one render pass, so this costs nothing extra), renders one `ElectronicsStore`
JSON-LD block per office (`buildLocalBusinessJsonLd`, real address/phone from the same data
already on the page) plus a per-office `OfficeCard`.

`OfficeCard.tsx` is `"use client"` — it uses `useLocalize()` (reads `next-intl`'s
`useLocale()`) and `OfficeCardInfo` uses `useCopyToClipboard()`/`useIsMobile()`, all
client-only hooks. The page fetching the data and the card rendering it are two different
components on purpose — see [architecture.md](architecture.md#server-vs-client-components).

---

### Works (`/works`)

Full Server Component. `worksServerApi.getAllWorks()` loops through every page server-side
(same "fetch it all, no pagination UI" reasoning as price list — the old client version auto-
fetched every page via a `useEffect` anyway), renders a `WorkCard` (`src/widgets/work-card`)
per item. `WorkCard.tsx` itself is `"use client"` (image zoom, lightbox gallery state) — it's
the client boundary for that whole subtree, same pattern as `OfficeCard`.

---

### Reviews (`/reviews`)

`app/(marketing)/reviews/page.tsx` fetches locations, then every location's reviews in
parallel (`Promise.all`, mirroring what the old client-side `useAllLocationReviews` did with
`useSuspenseQueries` — all locations' reviews were always fetched eagerly, tab-switching never
triggered a new request even before this became SSR). Renders `AggregateRating`/`Review`
JSON-LD from the flattened review list, then `<ReviewsContent locations={...} allReviews={...} />`.

`ReviewsContent.tsx` is the Client half — owns `activeLocationId` state (which tab is open) and
composes `ReviewsAside` (score card, distribution bars, "leave a review" CTA),
`ReviewBranchTabs` (one tab per location with its review count), `ReviewBranchNote` (active
location's address), and the masonry `ReviewCard` wall. All of `allReviews` is already in
memory client-side (passed as a prop) — switching tabs is a pure state update, no refetch.

**Service functions** (`lib/service.ts`): `getAvatarColor(name)` (deterministic color from
author name), `computeReviewStats(ratings)` (`{ avg, dist }` in one reduce pass).

---

### User Account (`/account`)

Gated by `(cabinet)/layout.tsx` — see [architecture.md](architecture.md#authentication) for
how the server-side redirect works. Everything under `(cabinet)` is a Client Component tree
(React Query, same as the pre-migration SPA) — there's no SEO reason to server-render
authenticated, `noindex` content.

Split across three sibling domains, flat under `src/features/`:

#### `account` — `/account`

Landing page: `AccountHeader` (name/avatar/logout) + `OrdersPanel` (paginated order list via
`useCustomerOrders`). `VerifyGate`/`AddPhoneGate` prompt phone verification; `TelegramBanner`
prompts linking Telegram.

#### `orders` — `/account/orders/:id`

Order detail: device info (`OrderDeviceInfo`), line items (`OrderLineItemsCard`), payments
(`OrderPaymentsCard`), documents with download (`OrderDocumentsList`, `useDownloadOrderDocument`).
Reads the `:id` param via `useParams()` from `next/navigation` (not a route prop — this page
is still a Client Component, same `useCustomerOrder(id)` React Query hook as before).

**Key types** (`orders/types.ts`): `OrderListItem`, `OrderDetail` (extends
`OrderListItem` with `issueType`/`location`/`payments`/`services`/`products`/`documents`),
`OrderDocument`, `OrderLineItem`.

#### `profile` — `/account/profile`

Avatar upload/crop (`AvatarEditorModal`, `useAvatarEditorFlow`), name, email change with
confirmation flow, password change, primary + extra phone numbers, Telegram link/QR
(`TelegramRow`, `useProfileTelegram`).

---

### About (`/about`)

Client Component: company stats, process steps (`AboutProcess`, uses the shared `Lightbox`
widget), partner logos (`AboutPartners`, reads `t.raw("about.partnersNetworks")` — an array
value in the message JSON, not a plain string), "why us" section, office list with map pins.

---

### Auth & Utility Pages

Login, registration, and password/email flows live in `src/features/auth/`, wired into
`(auth)/auth/*` route folders and reachable from the site header/account flows:

- `email-verify`, `confirm-account`, `confirm-email-change`, `reset-password` — standalone
  pages for links sent by email (e.g. `/auth/email-verify`), all Client Components (read
  `?token=`/`?verify_url=` via `useSearchParams()`)
- `google-callback` — handles the redirect back from Google OAuth
- Login, registration, forgot-password are **modals**, not routed pages — rendered inside
  `WebsiteLayout` (so they're mountable from any page) and opened via `useModalParam`, e.g.
  `?modal=login`. `useModalParam` (`shared/hooks/useModalParam.ts`) is a thin
  wrapper over `next/navigation`'s `useSearchParams`/`useRouter`/`usePathname`.

Utility pages: `not-found` (global 404, `src/app/not-found.tsx`), `maintenance` (503 from the
API interceptor redirects here via `window.location.href`), `blocked` (security-blocked
response, same redirect mechanism).

---

## API

Public endpoints are all under `/api` (no auth required):

```ts
// api/endpoints.ts
const BASE = "/api";
WEBSITE_API = {
  locations: ()                 => `${BASE}/dictionaries/locations`,
  track: (token)                => `${BASE}/orders/track/${token}`,
  status: (orderNumber)         => `${BASE}/orders/status/${orderNumber}`,
  landing: ()                   => `${BASE}/landing`,
  priceList: ()                 => `${BASE}/dictionaries/price-list`,
  landingWorks: ()              => `${BASE}/landing/works`,
  reviews: (locationId)         => `${BASE}/landing/reviews/${locationId}`,
}
```

Each has **two** implementations — see [architecture.md](architecture.md#the-transport-fork-apiserverts-vs-apiindexts):

| Function | `api/server.ts` (fetch, Server Components) | `api/index.ts` (axios + React Query, Client Components) |
|----------|:---:|:---:|
| `getLanding()` | ✅ | ✅ |
| `getLocationsInfo()` | ✅ | ✅ |
| `getAllWorks()` / `getWorksPage(page)` | ✅ (loops all pages) | ✅ (one page at a time — only the modal that filters by category still needs this shape) |
| `getAllPriceList()` / `getPriceListPage(page)` / `getPriceList(categories)` | ✅ (loops all pages) | ✅ |
| `getReviews(locationId)` | ✅ | — (no client consumer left; reviews are always server-fetched now) |
| `getOrderTracking(token)` | — | ✅ (track page is `noindex`, no SSR benefit) |
| `getOrderStatus(orderNumber)` | — | ✅ (quick-check modal, mutation not query) |

`getOrderStatus` silences 404s from Sentry via `silentErrorStatuses: [404]` — a not-found
order number is expected user input, not a bug.

### Account API (customer-auth only)

`modules/account`, `modules/orders`, `modules/profile` each have their own API surface — not
part of `WEBSITE_API`, since these require the customer auth token and are never called
server-side (no SSR value for authenticated, per-customer data):

```ts
// modules/orders/api/endpoints.ts
const BASE = "/api/orders";
CUSTOMER_ORDERS_API = {
  orders: ()                              => BASE,
  order: (id)                              => `${BASE}/${id}`,
  downloadDocument: (orderId, documentId)  => `${BASE}/${orderId}/documents/${documentId}/download`,
}

// modules/profile/api/endpoints.ts
const BASE = "/api/profile";
CUSTOMER_PROFILE_API = {
  update: ()                    => BASE,
  avatar: ()                    => `${BASE}/avatar`,
  changePassword: ()            => `${BASE}/password`,
  changeEmail: ()                => `${BASE}/email/change`,
  primaryPhone: ()              => `${BASE}/phone`,
  phones: ()                    => `${BASE}/phones`,
  phoneById: (id)                => `${BASE}/phones/${id}`,
  generateTelegramLink: ()      => `${BASE}/telegram/generate-link`,
  revokeTelegramLink: ()        => `${BASE}/telegram/revoke-link`,
}
```

---

## Key types

Page-domain types live next to their domain, not in one shared file: `Track`/`OrderPreview`/
`OrderHistoryItem` in `src/features/track/types.ts`, `Review` in `src/features/reviews/types.ts`,
`LandingData`/`CategoryMinPrice` in `src/features/home/types.ts`. Shared entity types: `src/entities/`.

**`Track`** — full order data for the tracking page (device specs, financial info, products,
services, payments, status history, flags).

**`OrderPreview`** — lightweight version for the quick-check modal:
`Pick<Track, "orderNumber" | "status" | "manufacturer" | "deviceType" | "deviceModel" | "issueType">`.

**`LandingData`** — `activeCount` (active order count) + `prices` (`CategoryMinPrice[]`,
min price per device category) — fetched once per home page render, see [Home](#home-).

**`PriceListItem`** — `src/entities/price-list/types.ts`. `id`, `name`, `categoryKey`,
`price`, optional `sortOrder`.

**`Review`** — `id`, `authorName`, `authorPhotoUrl`, `rating` (1–5), `text`, `publishedAt`.

**`OrderHistoryItem`** (UI layer, built by `buildOrderHistory()`) — discriminated union:
status change, payment, product added/deleted, service added/deleted.

---

## Hooks

| Hook | Description |
|------|-------------|
| `useOrderTracking(token)` | Client-side `Track` fetch. `{ track, isLoading, isError, error, refetch }` |
| `useOrderStatus({ onSuccess })` | Mutation — `OrderPreview` by order number, quick-check modal |
| `useLocations()` | Reads office list from `LocationsContext` (server-fetched once in root layout) — **not** a network call, see [architecture.md](architecture.md#server-vs-client-components) |
| `usePriceList(categories)` | Client-side, `useSuspenseQuery` — device price modal only (filtered by category) |
| `useModalParam(key)` | Reads/writes a `next/navigation` URL search param driving modal open state (`?modal=login`) |
| `useAddPhoneFlow({ onSuccess? })` | Orchestrates send-code → verify-code → set-as-primary, with resend countdown |
| `useMobileNav()` | Mobile nav drawer state: `{ isOpen, open, close }`. Locks scroll, handles Escape |
| `useWebsiteThemeManager()` | Theme selection/persistence — used once inside `WebsiteLayout`, SSR-safe (see [architecture.md](architecture.md#server-vs-client-components)) |
| `useLocalize()` | `shared/hooks/` — pick ru/ua string pair from `next-intl`'s current locale |

**Deleted during the Next.js migration** (superseded by server-side fetching, no longer exist):
`useLanding`, `useActiveCount`, `useAllLocationReviews`, `usePriceListAll`, `useWorks`,
`useWebsiteSeo` (replaced by `generateMetadata`, see [SEO](#seo)).

---

## Layout

`WebsiteLayout` (`widgets/site-shell/WebsiteLayout.tsx`) lives in the **root**
`app/layout.tsx` — not scoped to a single route group, since every route in this repo is
website content (unlike the original monorepo, where it had to stay out of the backoffice
tree). It's `"use client"` (holds mobile-nav/theme/pull-to-refresh state) and:

- Provides `LocationsContext` (received as a `locations` prop from the root layout, which
  fetched it server-side) and `WebsiteThemeContext`
- Renders `Header`, `{children}`, `Footer`, the auth modals, and a `Toaster`

**Header** is responsive: `DesktopNav` + `HeaderInfo` on desktop, `MobileBar` + `MobileNav`
(slide-in drawer) + `MobileBottomBar` on mobile.

`WebsiteLayout` tracks the header's rendered height via `ResizeObserver`, writing it to
`--ws-header-height` on the root `.website` element — pages with sticky elements (price list's
category nav) use `top: var(--ws-header-height)`.

---

## Theme system

`light` / `dark` / `system`, defined in `websiteTheme.ts` as `WEBSITE_THEMES`. Read/change via:

```ts
import { useWebsiteTheme } from "@/widgets/site-shell/websiteTheme";
const { theme, resolvedTheme, setTheme } = useWebsiteTheme();
```

`resolvedTheme` is always `"light"` or `"dark"` — safe for conditional rendering.

Persisted to `localStorage` via `THEME_STORAGE_KEY` — **this is intentionally different from
locale**, which moved to a cookie. Theme has no SSR requirement (no server-rendered visual
depends on knowing the theme ahead of time the way metadata/content needs the locale), so
`useWebsiteThemeManager` just starts from a safe default and corrects itself client-side after
mount — see [architecture.md](architecture.md#server-vs-client-components) for the exact
mechanism and why this matters for hydration.

---

## Styling

Custom CSS design tokens in `styles/website.css`, all prefixed `ws-`, scoped under a
`.website` wrapper class (`.website.light` is the light-theme override — dark is the base):

| Token group | Examples |
|-------------|---------|
| Backgrounds | `ws-bg`, `ws-bg-2`, `ws-bg-3` |
| Text | `ws-ink`, `ws-ink-mute`, `ws-ink-soft` |
| Borders | `ws-line`, `ws-line-soft` |
| Accent | `ws-ember-bright`, `ws-ember-deep` |
| Typography scale | `ws-sm`, `ws-lg`, `ws-xl`, `ws-hero-title` |

This repo has **no shadcn/Radix UI kit** beyond `@radix-ui/react-dialog` (used by
`WebsiteModal`) — the design system was already fully custom before the migration and stayed
that way; don't introduce shadcn components here.

Messenger button styles (Telegram, Viber, WhatsApp) configured in `widgets/site-shell/lib/messengers.ts` via `MESSENGERS`/`MESSENGER_ICONS`.

---

## SEO

See [architecture.md § SEO](architecture.md#seo) for the full pattern. Quick reference for
this feature's files:

- `shared/lib/seo.ts` — `buildPageMetadata(key, path)`, called from every
  `(marketing)` route's `generateMetadata()`
- `shared/lib/jsonLd.ts` — `buildOrganizationJsonLd()`; `features/locations/lib/jsonLd.ts` —
  `buildLocalBusinessJsonLd(locations)`; `features/reviews/lib/jsonLd.ts` — `buildReviewsJsonLd(reviews)`
- `.claude/docs/SEO_ONPAGE_TEXTS.md` — the source copy (title/description per page, both
  locales) that `seo.*` message keys are built from
