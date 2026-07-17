# Shared Utilities & Components

**Before writing a new utility, hook, or component — check this document first.**

This repo has no shadcn/Radix UI kit and no backoffice widgets (`SmartTable`, `PersonCard`,
`SearchableSelect`, etc.) — those stayed in `aps-service`. What's listed here is the actual,
much smaller shared surface this repo has.

## Table of Contents

- [Hooks](#hooks)
- [Utilities](#utilities)
- [Constants](#constants)
- [Error Handling Helpers](#error-handling-helpers)
- [Error & State Components](#error--state-components)
- [Widgets](#widgets)

---

## Hooks

All in `src/shared/hooks/`.

### `useIsMobile(breakpoint?)`

Returns `true` if the viewport width is below the breakpoint (default 767px). SSR-safe —
guards `typeof window === "undefined"` in its `useState` initializer (returns `false` on the
server, corrects on mount). This is the reference example for the SSR-safety pattern
described in [architecture.md](architecture.md#server-vs-client-components).

```ts
import { useIsMobile } from "@/shared/hooks/useMobile";
const isMobile = useIsMobile();
```

---

### `useCopyToClipboard()`

Copies text to the clipboard. Returns `{ copied, copy }` — `copied` is `true` for 2 seconds
after a successful copy, then resets. Shows an error toast if the clipboard API fails.

```ts
const { copied, copy } = useCopyToClipboard();
<button onClick={() => copy(phone)}>{copied ? "Скопійовано!" : "Копіювати"}</button>
```

---

### `useLocalizedName()`

Returns a function that picks the correct locale string from an object with `nameRu`/`nameUa` fields.

---

### `useLocalize()`

Returns a function that picks between two raw strings based on the current locale (reads
`next-intl`'s `useLocale()`).

```ts
import { useLocalize } from "@/shared/hooks/useLocalize";
const localize = useLocalize();
localize(location.cityRu, location.cityUa);
```

---

### `usePullToRefresh(containerRef)`

Mobile-only pull-to-refresh gesture. Invalidates all React Query caches once the pull
threshold is met. Returns `{ progress, status }` — drives `PullToRefreshIndicator`/
`PullToRefreshBackdrop`/`PullToRefreshLoaderFrame` (`shared/components/`). Mounted once, in
`WebsiteLayout`.

---

## Utilities

All in `src/shared/lib/`.

### `cn(...classes)` — `utils.ts`

Merges Tailwind class names conditionally (`clsx` + `tailwind-merge`). Always use this instead
of string concatenation.

### `formatDate(isoString)` / `formatDateTime(isoString)` / `stripNonDigits(value)` / `formatMoney(value)` — `utils.ts`

`formatDate` → `dd.MM.yyyy`, `formatDateTime` → `dd.MM.yyyy HH:mm`, both `null` on empty/invalid
input. `stripNonDigits` removes non-digit characters (phone formatting). `formatMoney` → `"1 500,00 ₴"`.
See [Money / Amount Fields](architecture.md#money--amount-fields).

### `assertNever(x)` — `assertNever.ts`

Exhaustiveness check for switch statements over unions — compile-time error if a case is
missing, runtime throw if one slips through anyway.

### `zodEnumFromConst(obj)`, `phoneField(message?)`, `optionalPhoneField(message?)` — `zod-helpers.ts`

`zodEnumFromConst` turns an `as const` object into a Zod enum (use instead of `z.enum([...])`).
`phoneField`/`optionalPhoneField` validate Ukrainian mobile numbers (format + operator check,
via `phoneRegex` + `isSupportedMobileOperator`); the optional variant treats an empty string as
`undefined`.

### `storageGet(key)` / `storageSet(key, value)` — `storage.ts`

Safe `localStorage` wrappers, swallow errors silently (private browsing, quota exceeded). Only
used for theme preference now — locale moved to a cookie, see
[i18n](architecture.md#i18n) and the note in [website.md § Theme system](website.md#theme-system)
about why the two are handled differently.

### `phone.ts`

`MOBILE_OPERATOR_CODES`, `isSupportedMobileOperator(phone)`, `extractLocalPhoneDigits(chars)` —
Ukrainian mobile phone helpers backing the validators above and masked phone inputs.

### `pagination.ts`

`getPageNumbers(currentPage, lastPage)` — page-number list with `"ellipsis"` entries for a
pagination control. Used by the customer orders list in the cabinet.

### `imageCompression.ts`

`IMAGE_COMPRESSION_OPTIONS` for `browser-image-compression` (`maxSizeMB: 2`,
`maxWidthOrHeight: 1920`, `useWebWorker: true`) — used before uploading avatars.

### `pullToRefresh.ts`

Pure helpers backing `usePullToRefresh`: `PULL_TO_REFRESH_STATUS`, `PULL_THRESHOLD_PX` (70),
`PULL_MAX_DISTANCE_PX` (120), `PULL_RESISTANCE` (0.5), `calculatePullDistance`, `isPullThresholdMet`.

### `errors/getErrorDescription(error, eventId?)`

Dev: raw error message. Prod: `"Error ID: <eventId>"` if Sentry captured one, else `undefined`.

### `errors/serverMessageMap.ts` — `getSharedServerMessageMap()`

Maps known raw server error strings to translated messages, shared by `notifyError` and
`handleFormError`.

### `i18n/t.ts` — `t(key)`

Non-component translator — reads the locale cookie directly and looks up the key in the
bundled message JSON. Use only where `useTranslations()`/`getTranslations()` genuinely isn't
available (Zod schemas defined at module scope, error-message maps). See
[architecture.md § i18n](architecture.md#i18n).

---

## Constants

From `src/shared/lib/constants.ts` — trimmed to what this repo actually uses (the original
project's backoffice-only constants like `SEARCH_PAGE_SIZE`/`ACCESSORY_QUICK_SELECT` didn't
come along):

| Constant | Value | Use for |
|----------|-------|---------|
| `QUERY_STALE_TIME` | 5 min | React Query default stale time |
| `QUERY_GC_TIME` | 10 min | React Query default GC time |
| `emailRegex` | RegExp | Email validation pattern |
| `phoneRegex` | RegExp | Ukrainian phone format validation (`+380XXXXXXXXX`) |
| `LANG_STORAGE_KEY` | string | **Cookie** name for language preference (not localStorage — see [i18n](architecture.md#i18n)) |
| `THEME_STORAGE_KEY` | string | localStorage key for theme preference |

---

## Error Handling Helpers

### `isApiError(error)` / `notifyError(error)` — `shared/lib/errors/services.ts`

`isApiError` narrows `unknown` to `ApiError`. `notifyError` shows an error toast (403 gets a
localized "forbidden" message automatically); called automatically by the query client for
mutations without an explicit `onError`.

### `handleFormError(error, setError, options?)` — `shared/lib/errors/handleFormError.ts`

Maps 422 server validation errors to React Hook Form fields. See
[architecture.md § Error Handling](architecture.md#error-handling).

### Sentry — `shared/lib/sentry.ts`

`captureError()`, `captureErrorWithId()` — the app-level init now lives in
`sentry.{client,server,edge}.config.ts` at the repo root (`@sentry/nextjs`'s standard setup),
not a manual call from these helpers. See
[architecture.md § Error Tracking](architecture.md#error-tracking-sentry).

---

## Error & State Components

From `src/shared/components/errors/` — ported from the original project's version, rebuilt on
this repo's own `ws-*` tokens instead of the shadcn kit (no shadcn dependency here at all).

### `QueryPageGuard`

Loading/error boundary for a Client Component page driven by React Query.

```tsx
import { QueryPageGuard } from "@/shared/components/errors/QueryPageGuard";

<QueryPageGuard
  isLoading={query.isLoading}
  isError={query.isError}
  error={query.error}
  onRetry={query.refetch}
>
  <OrderDetail order={query.data} />
</QueryPageGuard>
```

Props: `isLoading`, `isError`, `error`, `onRetry?`, `loadingFallback?`, `title?`,
`unknownMessage?`, `buttonClassName?`, `children`.

### `ErrorPage` (`PageError`)

Generic error state — icon, title, description, optional retry button. Used internally by
`QueryPageGuard`; usable standalone too.

---

## Widgets

### `Lightbox` — `src/widgets/lightbox`

Fullscreen image viewer (Radix `Dialog`) with arrow-key navigation. Used by `work-card` and
directly by the About page's process gallery (`AboutProcess`).

### `WorkCard` — `src/widgets/work-card`

Renders one portfolio entry on [`/works`](website.md#works-works): device photos (`WorkMedia`,
opens `Lightbox` via `useWorkGallery`) and text info (`WorkInfo`). `"use client"` — it's the
client boundary for the whole works list, since `/works` itself is a Server Component (see
[architecture.md](architecture.md#server-vs-client-components)).

```tsx
import { WorkCard } from "@/widgets/work-card";
<WorkCard work={work} isReverse={index % 2 === 1} />
```
