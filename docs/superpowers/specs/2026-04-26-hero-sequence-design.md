# Hero Image Sequence Design

**Date:** 2026-04-26
**Replaces:** `src/components/sections/HeroWindowSection.vue`
**Rendering approach:** Canvas (Approach A)

---

## Goal

Replace the existing GSAP parallax hero with a cinematic image-sequence hero. Scrolling drives a frame-by-frame canvas animation (80 PNG frames) giving the illusion of a video controlled by scroll — luxury / high-end feel matching the Jesko Jets benchmark.

---

## Files

| File | Change |
|---|---|
| `src/components/sections/HeroSequenceSection.vue` | Create — new hero component |
| `src/pages/Home.vue` | Modify — swap `HeroWindowSection` import/usage for `HeroSequenceSection` |

`HeroWindowSection.vue` is not deleted (kept for reference), just no longer imported.

---

## DOM Layer Stack

Inside `<section ref="heroRef" class="relative w-full h-screen overflow-hidden">`:

| Layer | Element | Purpose |
|---|---|---|
| 1 (bottom) | `<div ref="zoomWrapperRef">` containing `<canvas ref="canvasRef">` | Frame rendering; zoom wrapper receives GSAP scale tween |
| 2 | `<div class="overlay-gradient">` | Static dark vignette at bottom edge (CSS only, no JS) |
| 3 | `<div ref="brandRef">` | "Express Transfer Paros" text overlay |
| 4 (top) | `<div ref="scrollIndicatorRef">` | "Scroll ↓" indicator |

All layers are `absolute inset-0` or absolutely positioned. No Vue reactive state is used for frame drawing — raw refs + direct DOM manipulation only.

---

## Image Assets

- **Path:** `/public/assets/hero_frames/ezgif-frame-001.png` → `ezgif-frame-080.png`
- **Naming:** zero-padded 3-digit index, starting at `001`
- **Total:** 80 frames (desktop), 40 frames (mobile — every other frame)
- **Format:** PNG

---

## Image Preloading

```js
function preloadFrames(isMobile) {
  const indices = isMobile
    ? Array.from({ length: 40 }, (_, i) => i * 2 + 1)   // 1,3,5,...,79
    : Array.from({ length: 80 }, (_, i) => i + 1);        // 1,2,3,...,80

  return Promise.all(
    indices.map(n => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = `/assets/hero_frames/ezgif-frame-${String(n).padStart(3, '0')}.png`;
    }))
  );
}
```

- Returns a `Promise<HTMLImageElement[]>` — resolved array stored in plain (non-reactive) `let frames = []`
- GSAP setup does not run until this promise resolves
- Frame 0 drawn to canvas immediately on resolve (no blank viewport)
- Mobile breakpoint: `window.innerWidth < 768`

---

## Canvas Sizing

On mount and on `window.resize` (debounced 100ms):

```js
canvas.width  = heroRef.value.offsetWidth;
canvas.height = heroRef.value.offsetHeight;
```

After resize, redraw the current frame.

---

## drawFrame — object-fit: cover math

```js
function drawFrame(img) {
  const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
  const sw = canvas.width  / scale;
  const sh = canvas.height / scale;
  const sx = (img.naturalWidth  - sw) / 2;
  const sy = (img.naturalHeight - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
}
```

Called from the GSAP `onUpdate` callback and from the resize handler.

---

## GSAP Setup

Uses the existing `useGsap` composable (`createContext`, `gsap`, `ScrollTrigger`).

```js
const totalFrames = frames.length;         // 80 desktop, 40 mobile
const scrollDistance = totalFrames * 30;   // 2400px desktop, 1200px mobile

const st = ScrollTrigger.create({
  trigger: heroRef.value,
  start: 'top top',
  end: `+=${scrollDistance}`,
  pin: true,
  scrub: true,
  anticipatePin: 1,
  onUpdate(self) {
    // Frame update
    const index = Math.min(Math.floor(self.progress * totalFrames), totalFrames - 1);
    if (index !== currentFrameIndex) {
      currentFrameIndex = index;
      drawFrame(frames[index]);
    }
  }
});
```

`currentFrameIndex` is a plain `let` (not reactive) initialised to `0`.

---

## Supplementary GSAP Tweens

All tied to the same ScrollTrigger via `scrollTrigger: { trigger, start, end, scrub: true }`.

| Element | Tween | Timing (progress) |
|---|---|---|
| `zoomWrapperRef` | `scale: 1 → 1.05` | 0 → 1.0 |
| `brandRef` | `opacity: 1 → 0` | 0 → 0.25 |
| `scrollIndicatorRef` | `opacity: 1 → 0` | 0 → 0.10 |
| `heroRef` | `opacity: 1 → 0, scale: 1 → 0.97` | 0.85 → 1.0 |

These are set up as a GSAP timeline with `scrollTrigger` attached, using `duration` values proportional to the above progress ranges.

---

## Brand Name Overlay

- Text: **"Express Transfer Paros"**
- Position: absolute, centered horizontally and vertically (`inset-0 flex items-center justify-center`)
- Typography: `font-heading text-5xl md:text-7xl text-white` with `drop-shadow-lg`
- **Entrance animation** (not scroll-driven): `gsap.from(brandRef, { opacity: 0, y: 20, duration: 1, delay: 0.3 })` — runs once on mount after preload completes
- **Exit animation** (scroll-driven): opacity fades from 1→0 over the first 25% of scroll progress (see table above)

---

## Scroll Indicator

- Text: "Scroll" + downward chevron SVG
- Position: absolute bottom centre (`bottom-8 left-1/2 -translate-x-1/2`)
- Typography: `text-sm text-white/70 tracking-widest uppercase`
- Chevron: `animate-bounce` (Tailwind)
- **Exit animation** (scroll-driven): opacity 1→0 over first 10% of scroll progress

---

## Overlay Gradient

Static CSS only — no JS. A `<div>` with:

```css
background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%);
```

Positioned `absolute inset-0 z-10 pointer-events-none`. Creates depth at the bottom edge where the brand text sits, consistent with the rest of the site's dark-overlay style.

---

## Exit Transition

Over progress 0.85 → 1.0:
- `heroRef` fades to `opacity: 0` and `scale: 0.97`
- Pin releases naturally after progress = 1.0
- `AboutSection` scrolls in underneath with no special treatment needed

---

## Mobile

| Property | Desktop | Mobile (< 768px) |
|---|---|---|
| Frame count | 80 | 40 (odd indices only) |
| Scroll distance | 2400px | 1200px |
| Zoom scale end | 1.05 | 1.03 |
| Brand text size | `text-7xl` | `text-5xl` |

The canvas approach works identically on mobile — no separate code path needed for rendering, only for frame count and scroll distance.

---

## Cleanup

`useGsap` composable's `onUnmounted` hook kills all ScrollTriggers and reverts GSAP contexts automatically. The resize listener is removed in a separate `onUnmounted` call.
