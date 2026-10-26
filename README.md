# Meridian Drive Hotel

Responsive seven-page hotel website preview built with Next.js App Router, React, TypeScript, Tailwind CSS, and Lucide icons. Local fonts and photographs keep the runtime independent of third-party image and font servers.

## Start locally

Use Node.js 24 LTS and npm (`.nvmrc` selects 24). The installed audit tooling requires at least Node.js 22.19. On Windows PowerShell:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open http://127.0.0.1:3000. Use the URL printed by Next.js if port 3000 is already occupied.

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd start
```

The form tests use Node's TypeScript stripping. With the server running, run `npm.cmd run check:routes` to check every page, internal link, rendered image variant, booking prefill, malformed booking query, and the 404 response. Override `PREVIEW_URL` to check a different server.

## Current scope

| Route | Features |
| --- | --- |
| `/` | Hero, booking bar, introduction, featured rooms, amenities, gallery, review empty state, newsletter preview |
| `/about` | Brand story, proposed mission/vision, approach, team/history pending states, image gallery |
| `/rooms` | All four room categories, room/suite filters, guest-capacity filter, name search, empty state, detail dialogs, room-specific booking links |
| `/amenities` | All eight PRD amenity categories, service-detail pending states, dining feature |
| `/gallery` | Category filters, six illustrative photographs, keyboard-controlled lightbox, Events empty state |
| `/contact` | Name/email/optional phone/subject/message form, inline validation, error summary, local completion status, pending contact/social/map details |
| `/booking` | Dates, guest and room selection, room prefill, date/capacity validation, night count, stay summary, preview completion state, FAQs |

Shared navigation and footer connect to dedicated routes with an active-page indicator. Interior pages include breadcrumbs, page-specific titles, descriptions, and Open Graph text. Homepage section anchors remain available for in-page scrolling.

All photographs are illustrative stock imagery and do not depict Meridian Drive Hotel. Download source URLs are recorded in `public/images/sources.json`. Replace these with licensed, approved property images before release. The hotel has not supplied verified room specifications, rates, reviews, address, phone number, email, or social channels; the UI uses explicit pending states. The logo PNG supplied in the project is preserved without alteration.

Booking dates are validated locally, including check-out after check-in. Night counts use UTC calendar dates to avoid daylight-saving errors. Sample room capacities are 2, 2, 4, and 6 guests and are labeled as demo data; they are not confirmed hotel specifications. Room-card and homepage links preserve selected room/dates/guests on the booking page. Repeated or invalid query values are normalized. The summary does not reserve a room, check inventory, calculate rates, or transmit information. Contact and newsletter submissions only demonstrate local form validation; no message or email is sent, persisted, or subscribed. The site is marked noindex during review.

## Component architecture

- `src/app`: layout, homepage composition, global design tokens/styles, loading/error/not-found states.
- `src/components/site-header.tsx` and `site-footer.tsx`: shared site shell. Navigation labels and targets come from `src/data/hotel.ts`.
- `src/components/ui.tsx`: `Button` accepts native button props and `variant` (`primary`, `outline`, `light`); `SectionHeading` accepts `eyebrow`, `title`, optional `description`, and optional trailing content; `TextLink` accepts `href`, children, and optional `light`.
- `src/components/booking.tsx`: booking links and homepage booking bar; `BookButton` accepts an optional room preference, label, variant, and className. Example: `<BookButton room="Deluxe Room" variant="outline">Plan your stay</BookButton>`. Navigation now leads to `/booking` rather than the former booking modal.
- `src/components/page-intro.tsx`: shared image banner, page heading and breadcrumb; `PageCTA` provides a reusable room-exploration prompt.
- `src/components/room-filters.tsx`, `booking-form.tsx`, and `contact-form.tsx`: isolated client-side collection and form behavior.
- `src/components/preview-form.tsx`: shared hydration gate that prevents native form submission before the local demo handler is ready, including when JavaScript is unavailable.
- `src/components/modal.tsx`: native dialog wrapper with explicit forward/backward Tab containment; callers retain ownership of open/close state and focus restoration.
- `src/lib/stay.ts` and `contact.ts`: pure validation functions, date calculations, and query normalization covered by tests.
- Room cards, gallery, and newsletter isolate their interactive behavior. Native modal dialogs provide keyboard containment and Escape dismissal; focus is restored to the opening control.
- `src/data/hotel.ts`: typed navigation, four room concepts and sample capacities/features, gallery categories and content. `Gallery` accepts `items` and `filterable` props so the same lightbox serves the homepage, About, and full Gallery page.
- `design/`: the earlier visual board and its design rationale.

The page remains server-rendered; only interactive components use client-side React. Local `next/image` assets support responsive image optimization. The hero is prioritized; supporting images load lazily. Motion is limited to small CSS transitions with reduced-motion overrides. Fonts load through `next/font/local` with system fallbacks.

## Architecture boundary

This phase needs no database, authentication, or backend API. When real booking is introduced, place availability and reservation writes behind a separate service, with authoritative server validation and inventory controls. Do not turn the preview summary into a reservation confirmation. The frontend can deploy separately from that future service.

Before public launch: confirm hotel content and image rights; replace the low-resolution logo if a better original is available; add verified contact details, privacy information, and booking policies; connect newsletter/booking services; configure the real canonical domain, social image, and verified Hotel structured data; complete hosted/cross-browser and manual assistive-technology checks, then deliberately remove preview noindex directives. See [the production-readiness report](docs/production-readiness.md) for findings and unresolved release gates. No public deployment is claimed.

## Verification for this preview

TypeScript, five validation tests, production build, standalone-server execution, HTTP route/link checks, and security-header/optimizer tests passed. Chrome browser audits passed on all seven pages at 320px, 390px, and 1440px widths with zero axe violations, no detected overflow/broken images/JavaScript errors, and nine passing interaction scenarios. Desktop and mobile screenshots were inspected. These automated results do not establish full WCAG compliance, Safari/Firefox/mobile-device compatibility, field performance, or hosted infrastructure readiness. The final Lighthouse results are recorded in [the audit summary](docs/audit-summary.json).

To repeat the browser and performance audits, start a **production** server in another terminal, then run:

```powershell
$env:PREVIEW_URL = 'http://127.0.0.1:3000'
# Optional when Chrome is installed elsewhere:
# $env:CHROME_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npm.cmd run check:routes
npm.cmd run audit:http
npm.cmd run audit:browser
npm.cmd run audit:performance
```

The scripts use the locally installed Chrome without downloading another browser. Browser screenshots and machine-readable/Lighthouse HTML reports are written to `qa/`, which is ignored by Git. Run performance audits sequentially, without another heavy build/audit running, and confirm results again on hosted staging. Preview noindex deliberately lowers SEO scores.

## Deployment preparation

The frontend uses Next.js standalone output with a process health endpoint at `/api/health`. The non-root multi-stage `Dockerfile` copies only traced runtime files, static chunks, and public assets. Build/run commands, when Docker is available:

```powershell
docker build -t mdh-website .
docker run --rm --init -p 127.0.0.1:3000:3000 mdh-website
```

Docker is not installed in the audit environment, so those commands and container execution are not verified. The standalone Node runtime was tested directly. `.github/workflows/verify.yml` defines installation, tests, production build, HTTP/browser/security/performance checks, and retained evidence. GitHub-hosted execution and deployment remain unverified. Node 24 LTS is selected for deployment; local checks used Node 26.10.0.

Production headers include a baseline CSP, anti-framing, nosniff, referrer/permissions policy, and HSTS configuration. The CSP intentionally permits inline bootstrap scripts/styles to retain static rendering; it is not a strict XSS prevention policy. HTTPS enforcement, monitoring, rollback, and the future separate backend remain release tasks described in the readiness report.
