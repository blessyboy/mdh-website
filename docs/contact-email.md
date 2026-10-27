# Contact page and email delivery

The contact page and shared footer display the two public email addresses, three telephone numbers, postal address, and GhanaPostGPS code supplied by the user. Public addresses are preserved exactly as supplied in `src/data/contact.ts`; the form's private recipient is configured independently.

## Current delivery settings

- Provider: Resend, selected by the user.
- Form recipient: `blessyarthur@gmail.com`, configurable through `CONTACT_TO_EMAIL`.
- Local sender: `onboarding@resend.dev`, explicitly approved by the user for local testing.
- Intended hotel sender: retained as `CONTACT_PRODUCTION_FROM_EMAIL` in the ignored `.env.local`. This value is a saved setting, not an automatic runtime override. Restore it to `CONTACT_FROM_EMAIL` only after verifying its domain in Resend.
- The hotel sender domain was rejected by Resend as unverified during testing. No send was claimed for those rejected requests.
- Resend's test sender is restricted by this application to loopback site origins (`localhost`, `127.0.0.1`, `[::1]`). Resend also restricts its test sender to the account owner's inbox. It is not a public production sender.

The supplied GhanaPostGPS URL redirects to a location page. It is linked as a GhanaPostGPS map rather than described as an embedded Google Map. The Google share link resolves to the hotel's Tripadvisor listing and is labeled “Read hotel reviews.” No ratings, reviews, coordinates, or testimonials have been fabricated. External links open with `noopener noreferrer` and a new-tab accessibility hint.

## Configuration

Copy `.env.example` to `.env.local` only when no local configuration exists. Never overwrite a populated local file or paste credentials into source code or chat. Set these server-only variables:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend sending key; never use a `NEXT_PUBLIC_` prefix |
| `CONTACT_FROM_EMAIL` | Bare sender email on a verified domain; approved test sender is local-only |
| `CONTACT_TO_EMAIL` | Private destination inbox; defaults to `blessyarthur@gmail.com` |
| `CONTACT_SITE_ORIGIN` | Exact public website origin behind a reverse proxy; leave empty for direct local preview |
| `CONTACT_TRUST_PROXY` | `true` only if the edge strips/replaces client-supplied `x-forwarded-for` |

Restart the app after changing email configuration. For development use `npm.cmd run dev`; Next.js loads `.env.local` itself. Do not pass Node's `--env-file` to the Next.js **development** CLI: its child launcher can propagate that unsupported flag through `NODE_OPTIONS`. Production standalone execution can load environment variables directly or via the hosting platform's secret store. Do not copy local credentials into deployment images; `.dockerignore` excludes `.env*`.

To change the recipient later, update `CONTACT_TO_EMAIL` in the local environment or hosting secrets, then restart/redeploy. No frontend changes are needed. The browser never chooses the recipient or receives the API key. Replies to incoming messages go to the visitor through `reply_to`; the visitor's address is never used as the sender.

## Request and delivery flow

1. The hydrated form validates fields, prevents double submissions, and sends JSON to `POST /api/contact` with a UUID `Idempotency-Key`.
2. The Node route checks same-origin/fetch metadata, JSON content type, a streamed 16 KB body limit, allowed fields/types, honeypot, and validation. Unknown fields such as a caller-supplied `to` are rejected.
3. Bounded per-process counters limit global attempts to 30 per ten minutes and a normalized email to three sends per ten minutes. Trusted-proxy IP limits, when explicitly enabled, are five per ten minutes. Hashes rather than raw IP/email values are held in limiter keys. Entries expire; maps have fixed caps.
4. A stable server-built plain-text payload goes to Resend over HTTPS. Sender/recipient come from environment settings. Subject comes from the validated enumeration. The provider receives a stable idempotency key; the local service also shares in-flight/completed results for matching requests. Reusing a key with different content returns 409.
5. Success is returned only after Resend accepts the message with a provider ID. Failure/missing configuration/timeouts never produce a false success. Rejected/unconfirmed submissions retain the visitor's form text and retry key. The provider call times out after 12 seconds, with an 18-second browser timeout.

No contact-message database or visitor auto-reply is implemented. Messages are delivered to the recipient's mailbox and processed by Resend; retention and access policies for those services must be confirmed for public launch. The site's request path avoids storing message contents and does not log bodies, addresses, API credentials, or provider error text. Provider failures log only a reference, status, and sanitized reason.

The form remains disabled until its JavaScript handler is ready, preventing personal information from falling back to a native GET URL. Sending disables all controls, presents an accessible loading state, and blocks duplicate clicks. Error/success states are announced and receive appropriate focus.

## API behavior

`POST /api/contact` accepts `name`, `email`, `phone`, `subject`, `message`, and the optional `website` honeypot. Responses are `no-store`.

| Status | Meaning |
| --- | --- |
| 200 | Provider accepted the enquiry; returns `ok` and a reference |
| 400 / 413 / 415 / 422 | Invalid request, size, content type, or field validation |
| 403 | Wrong origin/cross-site request |
| 409 | Reused idempotency key with different content |
| 429 | Rate limit; `Retry-After: 600` |
| 502 | Provider rejection or unconfirmed send; safe retry supported |
| 503 | Missing/invalid settings or test sender on a non-loopback site |
| 405 | Unsupported method, including GET |

When no public origin is configured, the direct request Host is compared with browser Origin. This accounts for Next.js standalone's internal `localhost` alias, which was verified to differ from a browser request to `127.0.0.1`. A configured public origin remains authoritative behind a proxy. Host spoofing is not an abuse-control substitute: configure the real origin and trusted edge before public deployment.

## Verification

- Production build, TypeScript, and 23 unit tests pass, including payload construction, validation, missing configuration, injection attempts, origin/body guards, replay/concurrency, provider failures, limiter expiry, standalone host aliases, and local-only test sender enforcement.
- Browser checks pass at 1440px, 390px, and 320px with zero axe violations and no horizontal overflow. Checks cover displayed contact details/links, validation, retained inputs after a simulated failure, disabled sending state, retry-key reuse, and simulated success.
- Real HTTP checks verify invalid input, foreign-origin and unsupported-method rejection without sending mail.
- A real enquiry was sent through the actual page and Resend test sender to `blessyarthur@gmail.com`. Arrival in the connected Gmail Inbox was verified on 26 October 2026. Replaying the same accepted payload/key through the main port-3000 preview returned success without a second mailbox message, confirming provider idempotency across the two local server processes.
- Evidence lives in ignored `qa/contact-page-check.json`, responsive screenshots, and `qa/contact-live-result.json`. Browser simulation tests intercept the mail endpoint and never send real email. The separate live verification was explicitly authorized; it is not part of CI.

## Public release requirements

Verify the intended hotel sender domain in Resend and restore its address, set the final recipient/public origin, and configure DNS authentication according to Resend's domain instructions. Keep credentials in hosting secrets and check delivery/bounces using appropriate provider monitoring. Verify the exact public email spellings and all external links with hotel management.

The in-memory limiter and replay cache are appropriate only for the current single-process setup. Before horizontal/serverless scaling, enforce a shared edge/Redis rate limit, align trusted-proxy headers, and consider a queue for provider bursts and retry/backoff. These process-local controls alone are not distributed abuse protection. Public hosting, privacy/retention policy, provider webhook/bounce monitoring, and production-domain delivery remain separate release checks.

References: [Resend sending API](https://resend.com/docs/api-reference/emails/send-email), [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys), and [Resend domain setup](https://resend.com/docs/dashboard/domains/introduction).

## Contact experience update - 27 October 2026

The redesigned contact page uses local Playfair Display/Inter fonts, shared social icon components, responsive emerald contact cards, and an ivory inquiry panel. The form now requires explicit Privacy Policy agreement and includes optional preferred check-in/check-out dates. Both dates are validated as calendar dates today or later in Ghana time; check-out requires check-in and must be later. These details appear in the plain-text Resend email and participate in idempotency hashing. The subject list is Room Reservation, Event Booking, Corporate Stay, General Inquiry, Feedback, Other. Existing scripts and fixtures use these values.

Google Maps is opt-in: no Google iframe is requested until Load Google Maps is selected. CSP permits frames only from https://www.google.com. The embedded preview searches the hotel name in Prampram; the supplied GhanaPostGPS link remains the exact digital-address destination. No coordinates have been invented. Reception hours, 24-hour response promises, and best-rate guarantees remain unconfirmed, so the UI uses factual assistance wording. Social icons remain disabled pending official profile URLs.

Validation: 24 unit/service tests, production build, type checking, and contact browser checks at 1440/390/320 pixels passed. Browser tests intercept outbound form submissions and cover dates, consent, loading, error retention, idempotent retry, and success; they do not send real email. The prior live delivery check remains the most recent real email evidence.
