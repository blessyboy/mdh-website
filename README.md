# Meridian Drive Hotel

Responsive homepage design preview built with Next.js App Router, React, TypeScript, Tailwind CSS, and Lucide icons. Local fonts and photographs keep the runtime independent of third-party image and font servers.

## Start locally

Requires Node.js 20.9 or newer and npm. On Windows PowerShell:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open http://127.0.0.1:3000. Use the URL printed by Next.js if port 3000 is already occupied.

```powershell
npm.cmd run typecheck
npm.cmd run build
npm.cmd start
```

## Current scope

The homepage includes the supplied logo, responsive shared header and footer, hero, booking preview, introduction, three featured rooms, amenities, gallery lightbox, a guest-review empty state, and newsletter preview. Header/footer links currently target real homepage sections. Dedicated pages are the next design stage.

All photographs are illustrative stock imagery and do not depict Meridian Drive Hotel. Download source URLs are recorded in `public/images/sources.json`. Replace these with licensed, approved property images before release. The hotel has not supplied verified room specifications, rates, reviews, address, phone number, email, or social channels; the UI uses explicit pending states. The logo PNG supplied in the project is preserved without alteration.

Booking dates are validated locally, including check-out after check-in. The summary does not reserve a room, check inventory, calculate rates, or transmit information. Newsletter submission only demonstrates local form validation; no email is sent, persisted, or subscribed. The site is marked noindex during review.

## Component architecture

- `src/app`: layout, homepage composition, global design tokens/styles, loading/error/not-found states.
- `src/components/site-header.tsx` and `site-footer.tsx`: shared site shell. Navigation labels and targets come from `src/data/hotel.ts`.
- `src/components/ui.tsx`: `Button` accepts native button props and `variant` (`primary`, `outline`, `light`); `SectionHeading` accepts `eyebrow`, `title`, optional `description`, and optional trailing content; `TextLink` accepts `href`, children, and optional `light`.
- `src/components/booking.tsx`: shared booking dialog provider; `BookButton` accepts an optional room preference, label, variant, and className. Example: `<BookButton room="Deluxe Room" variant="outline">Plan your stay</BookButton>`.
- Room cards, gallery, and newsletter isolate their interactive behavior. Native modal dialogs provide keyboard containment and Escape dismissal; focus is restored to the opening control.
- `src/data/hotel.ts`: typed navigation, room concepts, and gallery content.
- `design/`: the earlier visual board and its design rationale.

The page remains server-rendered; only interactive components use client-side React. Local `next/image` assets support responsive image optimization. The hero is prioritized; supporting images load lazily. Motion is limited to small CSS transitions with reduced-motion overrides. Fonts load through `next/font/local` with system fallbacks.

## Architecture boundary

This phase needs no database, authentication, or backend API. When real booking is introduced, place availability and reservation writes behind a separate service, with authoritative server validation and inventory controls. Do not turn the preview summary into a reservation confirmation. The frontend can deploy separately from that future service.

Before public launch: confirm hotel content and image rights; replace the low-resolution logo if a better original is available; add verified contact details, privacy information, and booking policies; connect newsletter/booking services; configure the real canonical domain, social image, and verified Hotel structured data; remove preview noindex directives; perform production build, accessibility, mobile-browser, and performance checks. No Lighthouse score or completed production deployment is claimed.

## Verification for this preview

TypeScript checks pass and the homepage responds with HTTP 200. Automated browser inspection could not run because the browser tool failed to initialize in this environment. Visual, keyboard, and interactive browser verification remain pending.
