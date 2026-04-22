# Mobile Responsiveness Design

**Date:** 2026-04-22
**Scope:** `HeroWindowSection.vue`, `ServicesCarousel.vue`
**Breakpoint boundary:** `lg` (1024px) — all mobile changes apply below this breakpoint; desktop layout is untouched

---

## 1. Hero Banner — `HeroWindowSection.vue`

### Problem
`Layer1-ETP.png` (car window frame) is landscape-oriented. On mobile portrait viewports it is rendered with `object-cover`, which crops the frame edges unpredictably and prevents the car interior from filling the screen as intended.

### Fix
Pure CSS — no JS or GSAP changes.

- **Window frame image** (`Layer1-ETP.png`): keep `object-cover`; add `object-position: center top` on mobile (default `object-center` on `lg+`). This anchors the top of the frame (car roof/header) to the top of the viewport so the full interior is visible.
- **Scenery image** (`Layer2-ETP.jpg`): keep `object-cover`; add `object-position: 60% center` on mobile (default `object-center` on `lg+`) to keep the horizon visible through the window.

### No-change list
- GSAP ScrollTrigger pin and parallax logic — unchanged
- Section dimensions (`h-screen`, `w-full`) — unchanged
- Text overlays and scroll indicator — unchanged

---

## 2. Services Carousel — `ServicesCarousel.vue`

### Problem
The current mobile path puts a tiny static steering wheel (`w-48 h-48`, opacity 0.7) inside `cardsWrapperRef` — the element GSAP translates vertically to cycle cards. This means the wheel moves with the wrapper and looks broken. The large card spacing (`space-y-[60vh]`, `pt/pb-[40vh]`) creates excessive whitespace on mobile.

### Mobile Layout (< lg)

Two-row flex column filling `h-screen` (inside the pinned section):

```
┌─────────────────────────┐
│                         │
│    [Steering Wheel]     │  ~50vh, full steering wheel centered, max-width 80vw
│                         │
├─────────────────────────┤
│   Service Title         │
│   Description text      │  ~50vh, active service content panel
│   • Feature 1           │
│   • Feature 2           │
│   Learn More →          │
└─────────────────────────┘
```

### Template Changes

Separate mobile and desktop markup using the `hidden lg:` / `lg:hidden` pattern already used in the file:

- **Desktop block** (unchanged): `<div class="hidden lg:grid grid-cols-2 h-screen">` — left = half-wheel, right = card stack with GSAP wrapper
- **Mobile block** (new): `<div class="flex lg:hidden flex-col h-screen">` containing:
  1. Wheel row: `<div ref="mobileWheelRef">` — full-size wheel, centered, `w-[80vw] max-w-[400px]` square
  2. Content panel: reactive render of `services[activeIndex]` — title, description, features list, CTA link; wrapped in `<Transition name="fade">` keyed on `activeIndex`

The `wheelRef` used by the existing GSAP rotation (`tl.to(wheelRef.value, { rotation: 360 })`) is reassigned to point at `mobileWheelRef` on mobile. Implementation detail: use a single `wheelRef` that targets whichever element is rendered, or use a computed ref that resolves to the visible element.

### GSAP Changes

| Behaviour | Desktop | Mobile |
|---|---|---|
| ScrollTrigger pin | unchanged | same config |
| Scroll duration (`totalScroll`) | unchanged | same |
| Wheel rotation (360°) | `wheelRef` | same ref, mobile element |
| `cardsWrapperRef` translateY | active | **disabled** — not rendered on mobile |
| Card blur/focus animations | active | **disabled** — not rendered on mobile |
| `activeIndex` updates via `ScrollTrigger.create` | active | same — drives reactive content panel |

The GSAP `createContext` callback needs a guard: if `cardsWrapperRef.value` is null (mobile), skip the wrapper translate and card blur animations. The rotation and `activeIndex` ScrollTriggers run on both.

### Content Panel Transition

```css
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
```

Keyed on `activeIndex` so Vue swaps the panel content with a crossfade when the active service changes.

### No-change list
- Desktop grid layout, wheel-container CSS, dots indicator — unchanged
- Service data array — unchanged
- CTA link hrefs — unchanged
- Section heading (already responsive) — unchanged
- `HeroBanner.vue` (video banner) — not touched

---

## Files to Modify

| File | Change |
|---|---|
| `src/components/sections/HeroWindowSection.vue` | Add mobile `object-position` classes to window frame and scenery images |
| `src/components/sections/ServicesCarousel.vue` | Add mobile layout block; refactor GSAP to skip wrapper animations on mobile; add fade transition on content panel |
