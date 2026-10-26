# Meridian Drive Hotel visual direction

Status: proposed direction for review. The PRD and supplied mdh-logo.jpg are the brand sources. The original logo is preserved in assets/mdh-logo.jpg. Hotel photographs are still pending. Keep the PRD's exact palette as the UI token authority; the logo's gradient supports this green direction without requiring gradients across the interface.

## Character

An elegant tropical retreat: warm, composed, welcoming, and connected to nature. Use generous whitespace, editorial typography, large photography, and restrained botanical details. Avoid heavy gradients, excessive gold, decorative palm patterns behind text, or crowded promotional panels.

## Color system

| Token | Color | Use |
| --- | --- | --- |
| Brand primary | #5E8E2E | Brand accents, icons, decorative rules; avoid small text on light backgrounds |
| Brand deep | #2F5A2F | Primary buttons, links, dark sections, strong emphasis |
| Brand lime | #B7D33C | Small highlights, selected markers, occasional ink-on-lime badges |
| White | #FFFFFF | Cards, controls, light surfaces |
| Ink | #111111 | Headings and body text |
| Warm ivory | #F7F5EF | Proposed main page background |
| Muted text | #62685D | Secondary text on ivory or white |
| Border | #DADFD2 | Subtle separators; do not rely on this alone for input boundaries |

Calculated WCAG contrast ratios: white/deep green 8.00:1; ink/lime 11.15:1; deep green/ivory 7.34:1; muted/ivory 5.27:1. White/primary green is 3.90:1, so use deep green for ordinary white button labels. Primary green/ivory is 3.58:1, so avoid that pairing for small text. Form controls need stronger visible borders; errors require text and icons as well as color.

## Typography

Proposed fonts: Cormorant Garamond Medium for display headings; Manrope Regular, Medium, and Semibold for body, navigation, forms, and actions. Keep the existing logo typography unchanged.

- Display: fluid 48–88px on desktop, 40–56px on phones; line-height 1.03–1.12. Avoid very thin weights.
- Section headings: 36–56px desktop, 30–40px phones; line-height 1.12.
- Body: 16–18px; line-height 1.65; approximately 60–70 characters per line.
- UI labels: 14–16px, medium or semibold; avoid all caps for long labels.
- Eyebrows: 12px, uppercase with modest letter spacing; only for short section labels.

Self-host optimized font files during implementation and load with Next.js font support. The HTML reference uses an online Google Fonts stylesheet and system fallbacks; offline appearance may differ.

Font references: https://fonts.google.com/specimen/Cormorant+Garamond and https://fonts.google.com/specimen/Manrope

## Logo placement

The supplied mark combines a black palm silhouette, a green-to-black MDH wordmark, small lime details, a handwritten hotel name, and a green baseline on a white background. This supports a slightly stronger use of black in typography and restrained palm decoration. Do not repeat the handwritten treatment in navigation or body copy; preserve it within the logo.

Use a white navigation background or a white logo panel so the JPEG's white rectangle feels intentional. Use a compact mobile version only if an authorized variant exists. Keep clear space around the mark, avoid distortion or recoloring, and ensure the mark is legible at its rendered size. In the footer, use a white panel for the original logo unless a supplied reversed variant works on deep green. The reference now displays the supplied image.

The supplied file is a 200 by 139 pixel JPEG with no transparency. Display near its native size and avoid enlargement; request an original SVG, PDF, or higher-resolution transparent asset before final production branding. Do not trace or recreate the mark without authorization. The preview displays it at 144px wide on white; assess the small handwritten name on real mobile screens before finalizing navigation height.

## Photography direction

Lead with a real wide photograph of the property, ideally showing the entrance, landscaping, or pool in warm natural light. Use a 16:9 desktop crop with space for copy and a separately checked portrait/mobile crop. Keep architectural lines straight and edit greens naturally.

Rooms: consistent daylight, uncluttered styling, accurate room categories and amenities, landscape 4:3 crops. Dining: warm, natural scenes and actual food offered by the hotel. Lifestyle: understated human presence with appropriate usage permission. Details: occasional tropical planting, materials, or interior textures.

Do not imply that stock or generated imagery shows this property. Use such imagery only as clearly labeled concept references. Source licensed assets and confirm usage rights before publication. The board deliberately uses a labeled composition placeholder until real imagery is available.

## UI language

- Solid deep green primary actions with white text; underline text links.
- Outlined deep green secondary actions; an ink-on-lime badge for small accents.
- Subtle 4–8px control corners and 8–12px card corners. Avoid pill shapes everywhere.
- Buttons and controls at least 44px high; visible keyboard focus, using deep green on light surfaces and lime on dark surfaces.
- Room cards use large images, clear titles, concise features, and readable pricing when verified. Avoid unsupported scarcity, ratings, or discounts.
- Forms use persistent visible labels and inline feedback; never rely on placeholder text as a label.
- Limit motion to short, gentle transitions; respect reduced-motion preferences. Default to a still hero image for a simpler, faster first release.

## Composition and responsiveness

Use a content width near 1200px with generous margins: about 24px on phones and 48–80px on large screens. Use an 8px spacing scale, 64–112px section spacing on desktop, and 40–64px on phones. Let imagery establish atmosphere while copy and booking actions remain easy to read. Keep botanical decoration away from navigation and text.

The HTML reference is a visual board, not the homepage implementation. Preview controls demonstrate appearance and have no booking behavior. It includes a responsive layout, palette, typography, UI samples, and an image composition brief.

## Next design step

Review this direction using the supplied logo; obtain a production-quality logo source and available property photography. Then develop the homepage navigation, hero, and first content sections using this system. Booking remains a clearly identified request/demo until a real reservation service is defined.
