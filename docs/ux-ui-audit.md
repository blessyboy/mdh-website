# Meridian Drive Hotel: readability and layout audit

Audit date: 27 October 2026. Scope: the seven main routes, three policy pages, shared header/footer, room and gallery viewers, amenity dialogs, booking previews, contact-form states, mobile navigation, and the independent global-error fallback.

## Findings and changes

| Priority | Finding | Resolution |
| --- | --- | --- |
| High | Reading text was frequently 8–15px. The desktop homepage alone contained 106 undersized text fragments. | Replaced 288 undersized CSS declarations with shared tokens. Body copy is 18px; secondary information, labels, navigation, controls, and footer text have a 16px floor. |
| High | Simply enlarging navigation would crowd the desktop header. | The desktop menu now switches to the accessible mobile menu below 1280px; the resize handler uses the same threshold. |
| High | Contact labels and controls lacked prominence; an older mobile `!important` rule prevented larger input text. | Removed the forced override. Contact inputs/selects are at least 56px tall with 18px text; the textarea is at least 200px tall. Labels, errors, consent, and helper text are at least 16px. |
| Medium | Fixed hero heights, large inter-column gaps, artificial card-description heights, and large section padding created disconnected groups. | Hero height follows its content. Removed description minimum heights and reduced content gaps. Standard sections use 80px desktop, 64px tablet, and 48px mobile vertical padding. Cards generally use 24–28px padding; grids use 24/20/16px gaps. |
| Medium | Small room rates, action labels, amenity descriptions, and dialog content weakened the booking path. | Enlarged rate and action treatment, used 18px descriptions, increased amenity icons to 30px inside 64px medallions, and kept card actions grouped at the bottom. |
| Medium | The long mobile contact panel put the form far below initial content. | Added a Send an Inquiry jump link that moves focus to the form panel. Contact-card columns are used only when enough width is available. |
| Medium | Footer columns were separated by generous gaps while important details were small. | Used compact 24px desktop gaps, readable 16px contact/legal/action text, clear 24px column headings, and responsive grouping. |
| Medium | Larger mobile headlines need deliberate breaks and flexible controls. | Preserved readable headline breaks, wrapped CTAs, stacked constrained grids and forms, and allowed email addresses to wrap. |
| Low | The About page described the shared, now hotel-supplied gallery photographs as illustrative. | Updated that description and image-viewer label to match the displayed collection. |

## Typography and layout contract

The shared scale is defined in `src/app/readability.css`; existing component font rules in `globals.css` now reference it. The new stylesheet is imported after the component styles in the root layout.

| Role | Desktop | Mobile |
| --- | --- | --- |
| Page/display H1 | 56–72px | 40px |
| Section H2 | 40–48px | 34px |
| Card/subsection title | 28–32px | 28px |
| Compact heading / footer group | 24px | 24px |
| Body descriptions | 18px, 1.6 line height | 18px, 1.6 line height |
| Labels, captions, helper/legal text | Minimum 16px | Minimum 16px |
| Buttons | 16–18px, weight 600 | 16–18px, weight 600 |
| Navigation / footer reading text | Minimum 16px | Minimum 16px |

Heading size follows visual role: semantic H2 headings inside cards and footer groups use the compact title scale rather than the larger page-section scale. This keeps both document structure and visual grouping meaningful. Mobile display sizes are reduced to fit narrow viewports without shrinking body text.

The maximum content width is 1280px. Tablet grids use 20px gaps, approximately 17% below desktop; mobile grids use 16px gaps, approximately 33% below desktop. Standard cards use 24–28px padding. Navigation, controls, and primary actions retain comfortable touch targets. Modals scroll internally instead of clipping long content.

Larger readable text can make a page longer despite reduced padding. Total page height is not a useful density target on its own: the changes reduce decorative space while allowing content to wrap naturally. Images, emerald/gold surfaces, serif headings, and existing hotel branding remain the visual foundation.

## Verification

- `npm run check:readability`: all 10 routes at 1440, 1024, 768, 390, and 320 CSS pixels. All 50 combinations passed with zero visible text/control sizes below 16px and no horizontal page overflow.
- `npm run audit:browser`: all 10 routes at 1440, 390, and 320 pixels. All 30 page checks passed automated axe accessibility rules; no page errors or detected accessibility violations. Typography checks also cover the tested open/error/success states.
- Nine interaction scenarios passed: menu Escape/focus, skip-link focus, room filtering/reset, room dialog containment/focus, gallery filtering/navigation/focus, contact validation and simulated acceptance, booking prefill/rates/completion, newsletter consent, and no-JavaScript form safety.
- Focused contact measurements passed at 1440/1024/390/320: 56px controls, 18px input text, 200px textarea, and working mobile jump-link focus.
- Contact browser checks cover retained values on failure, loading, retry idempotency, simulated success, and real API rejection guards without sending email.
- The amenities check covers responsive equal-height rows, image loading, all eight detail dialogs, focus trapping/restoration, scroll reveal, and reduced-motion layout.
- Production build, TypeScript, and all 24 existing unit/service tests passed.
- Screenshots were inspected for homepage, contact, amenities, and narrow-screen layout. Raw measurements and screenshots are in ignored `qa/`; summary evidence is in `qa/readability-summary.json` and `qa/browser-readability.json`.
- CI now runs the readability guard after the browser audit. The updated workflow has not been executed on GitHub during this work.

## Remaining product decisions

The changes improve legibility and access to actions; no conversion-rate increase is claimed without real traffic measurements or user testing. Automated checks and keyboard testing do not constitute a complete WCAG certification.

The existing product boundaries remain: booking and newsletter flows are previews, social destinations await official URLs, some photos are illustrative, and facilities/rate inclusions need hotel confirmation. Public deployment still requires verified email-domain configuration, production abuse protection, approved policy content, and a decision about enabling search indexing. Confirm the differing address presentation and public email spelling with hotel management before launch. Text embedded within photographs and third-party Google Maps content is outside the site's typography controls.
