---
name: Apex Velocity Light
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#5e3f3a'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#936e68'
  outline-variant: '#e9bcb5'
  surface-tint: '#c00500'
  primary: '#b30400'
  on-primary: '#ffffff'
  primary-container: '#e10600'
  on-primary-container: '#fff2f0'
  inverse-primary: '#ffb4a8'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#006359'
  on-tertiary: '#ffffff'
  tertiary-container: '#007e72'
  on-tertiary-container: '#cdfff5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410100'
  on-primary-fixed-variant: '#930300'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#56fae5'
  tertiary-fixed-dim: '#29dec9'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005048'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: '800'
    lineHeight: 76px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is engineered for high-performance data visualization and rapid user interaction. It captures the adrenaline of Formula 1 through an "Aerodynamic Minimalism" lens—stripping away visual clutter to focus on speed, precision, and clarity. The aesthetic is bright, airy, and clinical, utilizing high-contrast accents to guide the eye toward critical race data and prediction inputs.

The target audience consists of technical enthusiasts and F1 fans who value efficiency and professional-grade tooling. The UI should evoke a sense of "engineered excellence," feeling like a high-end pit-wall telemetry dashboard adapted for a premium consumer experience.

## Colors

The palette is anchored by **F1 Red (#E10600)**, used strategically for primary actions, live status indicators, and critical branding elements. This intense red provides a high-energy contrast against the stark **White (#FFFFFF)** surface.

- **Surface:** Pure white for maximum breathability and a "tech-forward" clean look.
- **Surface-variant:** A cool, light grey (#F5F5F5) used for background sectioning and card containers to provide subtle depth without heavy shadows.
- **On-Surface:** A deep, near-black (#131313) for maximum legibility in typography.
- **Tertiary/Success:** A vibrant teal (#00D2BE) is introduced for secondary performance metrics (e.g., sector times, positive gains), echoing the high-tech lighting of modern racing circuits.

## Typography

This design system utilizes **Inter** to achieve a neutral, systematic look that mirrors the precision of automotive engineering. 

- **Headlines:** Use Bold and ExtraBold weights with tight letter-spacing to create a sense of density and impact. 
- **Italics:** Strategic use of italicized headings can be used to imply motion and speed for "Live" or "Race-in-progress" headers.
- **Labels:** Small caps or all-caps styling with increased letter spacing is used for metadata, race sectors, and technical specs to mimic industrial labeling.
- **Numerical Data:** Prioritize font-variant-numeric: tabular-nums for leaderboards and timing charts to ensure vertical alignment of digits.

## Layout & Spacing

The layout follows a strict **8px grid system**, ensuring that all elements are mathematically aligned, reflecting the precision of a racing machine.

- **Grid:** A 12-column fluid grid for desktop, collapsing to 4 columns on mobile.
- **Rhythm:** Generous white space between major sections to maintain the "airy" feel, while data-heavy components (like driver standings) use compact 8px or 12px internal padding to maximize information density.
- **Alignment:** Consistent left-alignment for text to maintain a fast reading path, with center-aligned "hero" moments for high-impact visual storytelling.

## Elevation & Depth

To maintain a "high-velocity" flat look, this design system avoids heavy, traditional drop shadows. Depth is communicated through **Tonal Layering** and **Hairline Outlines**.

- **Level 0 (Floor):** White (#FFFFFF) background.
- **Level 1 (Cards):** Surface-variant (#F5F5F5) or White with a 1px solid border (#E5E5E5).
- **Interactive States:** When a card is hovered, a subtle, highly diffused "speed shadow" (Primary Red at 5% opacity) can be used to indicate focus.
- **Separators:** Use 1px borders in #F5F5F5 for subtle division of data within lists.

## Shapes

The shape language is "Technical-Soft." A low roundedness level is used to retain a sense of rigidity and structural integrity, avoiding the overly "playful" look of highly rounded corners.

- **Primary Radius:** 4px (Soft) for buttons, input fields, and small UI widgets.
- **Container Radius:** 8px for larger cards and feature blocks.
- **Detailing:** Use 45-degree chamfered corners on specific decorative elements (like the corner of a race-position badge) to subtly reference aerodynamic winglet shapes.

## Components

- **Buttons:** Primary buttons use F1 Red with white bold text. Square-ish corners (4px). Secondary buttons use an outline style with #131313.
- **Chips:** Used for driver status (e.g., "PURPLE SECTOR", "PIT"). These should have 2px rounded corners and use bold, high-contrast typography.
- **Input Fields:** Minimalist design with a 1px bottom border or a light grey stroke. On focus, the border shifts to F1 Red.
- **Cards:** White backgrounds with #F5F5F5 borders. Use for driver profiles, race tracks, and prediction blocks.
- **Data Lists:** High-density rows with hairline separators. Utilize the teal tertiary color for "positive" trends and the primary red for "negative" or "retired" status.
- **Progress Bars:** Thin, high-contrast bars used for lap completion or vote percentages. Avoid rounded caps; use flat ends for a more technical feel.