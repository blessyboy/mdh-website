# Meridian Drive Hotel

Responsive seven-page hotel website preview built with Next.js App Router, React, TypeScript, Tailwind CSS, and Lucide icons. Local fonts and photographs keep the runtime independent of third-party image and font servers.

## Start locally

Requires Node.js 20.9 or newer and npm. On Windows PowerShell:

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

The form tests use Node's TypeScript stripping; use Node.js 22.18+ or newer for `npm.cmd test`. With the server running, run `npm.cmd run check:routes` to check every page, internal link, rendered image variant, booking prefill, malformed booking query, and the 404 response. Override `PREVIEW_URL` to check a different server.

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
- `src/lib/stay.ts` and `contact.ts`: pure validation functions, date calculations, and query normalization covered by tests.
- Room cards, gallery, and newsletter isolate their interactive behavior. Native modal dialogs provide keyboard containment and Escape dismissal; focus is restored to the opening control.
- `src/data/hotel.ts`: typed navigation, four room concepts and sample capacities/features, gallery categories and content. `Gallery` accepts `items` and `filterable` props so the same lightbox serves the homepage, About, and full Gallery page.
- `design/`: the earlier visual board and its design rationale.

The page remains server-rendered; only interactive components use client-side React. Local `next/image` assets support responsive image optimization. The hero is prioritized; supporting images load lazily. Motion is limited to small CSS transitions with reduced-motion overrides. Fonts load through `next/font/local` with system fallbacks.

## Architecture boundary

This phase needs no database, authentication, or backend API. When real booking is introduced, place availability and reservation writes behind a separate service, with authoritative server validation and inventory controls. Do not turn the preview summary into a reservation confirmation. The frontend can deploy separately from that future service.

Before public launch: confirm hotel content and image rights; replace the low-resolution logo if a better original is available; add verified contact details, privacy information, and booking policies; connect newsletter/booking services; configure the real canonical domain, social image, and verified Hotel structured data; remove preview noindex directives; perform production build, accessibility, mobile-browser, and performance checks. No Lighthouse score or completed production deployment is claimed.

## Verification for this preview

TypeScript checks, five form/date validation tests, and the production build passed. HTTP checks passed against development and production servers for all seven pages, 27 internal links, seven image variants, room/date/guest booking prefills, malformed/repeated query parameters, and the 404 response. These checks validate server-rendered responses, not browser interaction. Automated browser inspection could not run because the browser tool failed to initialize in this environment. Visual, keyboard, and interactive browser verification remain pending.
