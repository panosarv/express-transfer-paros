# Hero Image Sequence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `HeroWindowSection` with a cinematic canvas-based image-sequence hero where scrolling drives frame-by-frame animation across 80 PNG frames.

**Architecture:** A single Vue 3 component renders a `<canvas>` element inside a zoom wrapper. Image frames are preloaded as `HTMLImageElement` objects (never in the DOM). GSAP ScrollTrigger with `pin: true, scrub: true` drives frame updates via `onUpdate`, plus supplementary tweens for zoom, brand name fade, and exit transition. All frame logic uses plain (non-reactive) variables for performance.

**Tech Stack:** Vue 3 (Composition API), GSAP + ScrollTrigger, Tailwind CSS, Canvas 2D API, existing `useGsap` composable at `src/composables/useGsap.js`

---

## Files

| File | Change |
|---|---|
| `src/components/sections/HeroSequenceSection.vue` | Create — new component, all logic lives here |
| `src/pages/Home.vue` | Modify — swap `HeroWindowSection` for `HeroSequenceSection` |

---

### Task 1: Static template scaffold + Home.vue swap

**Files:**
- Create: `src/components/sections/HeroSequenceSection.vue`
- Modify: `src/pages/Home.vue`

- [ ] **Step 1: Create `HeroSequenceSection.vue` with full template structure and refs, no logic yet**

Create `src/components/sections/HeroSequenceSection.vue` with this exact content:

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useGsap } from '../../composables/useGsap';

const heroRef = ref(null);
const zoomWrapperRef = ref(null);
const canvasRef = ref(null);
const brandRef = ref(null);
const scrollIndicatorRef = ref(null);

const { gsap, createContext, ScrollTrigger } = useGsap();

// Non-reactive state — never use ref() for these (performance critical)
let frames = [];
let ctx = null;
let currentFrameIndex = 0;
let resizeTimer = null;
</script>

<template>
  <section
    ref="heroRef"
    class="relative w-full h-screen overflow-hidden bg-black"
  >
    <!-- Zoom wrapper: receives GSAP scale tween -->
    <div
      ref="zoomWrapperRef"
      class="absolute inset-0"
      style="will-change: transform;"
    >
      <canvas
        ref="canvasRef"
        class="absolute inset-0 w-full h-full"
      />
    </div>

    <!-- Bottom vignette: static CSS, no JS -->
    <div
      class="absolute inset-0 z-10 pointer-events-none"
      style="background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%);"
    />

    <!-- Brand name overlay -->
    <div
      ref="brandRef"
      class="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
    >
      <h1 class="font-heading text-5xl md:text-7xl text-white drop-shadow-lg text-center px-4">
        Express Transfer Paros
      </h1>
    </div>

    <!-- Scroll indicator -->
    <div
      ref="scrollIndicatorRef"
      class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-white/70"
    >
      <span class="text-sm mb-2 tracking-widest uppercase">Scroll</span>
      <svg class="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </section>
</template>
```

- [ ] **Step 2: Update `src/pages/Home.vue` to use the new component**

Replace the import and usage of `HeroWindowSection` with `HeroSequenceSection`. The full updated file:

```vue
<script setup>
import Navbar from '../components/Navbar.vue';
import HeroSequenceSection from '../components/sections/HeroSequenceSection.vue';
import AboutSection from '../components/sections/AboutSection.vue';
import StatsSection from '../components/sections/StatsSection.vue';
import ServicesCarousel from '../components/sections/ServicesCarousel.vue';
import FleetSection from '../components/sections/FleetSection.vue';
import ReviewsSection from '../components/sections/ReviewsSection.vue';
import PersistentCTA from '../components/ui/PersistentCTA.vue';
</script>

<template>
  <div class="min-h-screen bg-etp-dark overflow-x-hidden">
    <Navbar />
    <HeroSequenceSection />
    <AboutSection />
    <StatsSection />
    <ServicesCarousel />
    <FleetSection />
    <ReviewsSection />
    <PersistentCTA />
  </div>
</template>
```

- [ ] **Step 3: Verify the component renders**

Run: `npm run dev`

Open `http://localhost:5173` in browser.

Expected:
- Black fullscreen section visible at top of page
- "Express Transfer Paros" centered in white text
- "Scroll ↓" indicator at bottom centre with bouncing arrow
- No console errors
- Rest of page (AboutSection, etc.) appears below when you scroll past the black section

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/HeroSequenceSection.vue src/pages/Home.vue
git commit -m "feat: scaffold HeroSequenceSection and wire into Home.vue"
```

---

### Task 2: Image preloading and canvas rendering

**Files:**
- Modify: `src/components/sections/HeroSequenceSection.vue`

- [ ] **Step 1: Add helper functions and `onMounted` to the script block**

Replace the entire `<script setup>` block with:

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useGsap } from '../../composables/useGsap';

const heroRef = ref(null);
const zoomWrapperRef = ref(null);
const canvasRef = ref(null);
const brandRef = ref(null);
const scrollIndicatorRef = ref(null);

const { gsap, createContext, ScrollTrigger } = useGsap();

// Non-reactive state — never use ref() for these (performance critical)
let frames = [];
let ctx = null;
let currentFrameIndex = 0;
let resizeTimer = null;

// Zero-pad a number to 3 digits: 1 → "001", 42 → "042"
function padIndex(n) {
  return String(n).padStart(3, '0');
}

// Load all frames as HTMLImageElement objects.
// isMobile=true loads every other frame (40 frames) to halve bandwidth.
function preloadFrames(isMobile) {
  const indices = isMobile
    ? Array.from({ length: 40 }, (_, i) => i * 2 + 1)  // 1,3,5,...,79
    : Array.from({ length: 80 }, (_, i) => i + 1);       // 1,2,3,...,80

  return Promise.all(
    indices.map(n => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load frame ${n}`));
      img.src = `/assets/hero_frames/ezgif-frame-${padIndex(n)}.png`;
    }))
  );
}

// Set canvas pixel dimensions to match the section element.
// Must be called before any drawFrame call and again on resize.
function sizeCanvas() {
  canvasRef.value.width  = heroRef.value.offsetWidth;
  canvasRef.value.height = heroRef.value.offsetHeight;
}

// Draw a single frame onto the canvas using object-fit:cover math.
// The image is scaled to fill the canvas, centred, with overflow cropped.
function drawFrame(img) {
  const cw = canvasRef.value.width;
  const ch = canvasRef.value.height;
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const sw = cw / scale;
  const sh = ch / scale;
  const sx = (img.naturalWidth  - sw) / 2;
  const sy = (img.naturalHeight - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
}

onMounted(async () => {
  const isMobile = window.innerWidth < 768;

  // Initialise canvas 2D context
  ctx = canvasRef.value.getContext('2d');

  // Size canvas to fill the section
  sizeCanvas();

  // Preload all frames before starting animation
  frames = await preloadFrames(isMobile);

  // Draw frame 0 immediately so there's no blank canvas
  drawFrame(frames[0]);
});
</script>
```

- [ ] **Step 2: Verify frame 0 loads in browser**

With dev server running, open `http://localhost:5173`.

Expected:
- The first frame of the image sequence is visible fullscreen
- "Express Transfer Paros" text overlaid on top
- No console errors (if frames are not yet in `/public/assets/hero_frames/`, you will see 80 404 errors — that is expected until the actual image files are placed there; the canvas will remain black)
- Scroll down — no animation yet, section scrolls away normally

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/HeroSequenceSection.vue
git commit -m "feat: add image preloading and canvas drawFrame to HeroSequenceSection"
```

---

### Task 3: GSAP scroll animation — frames, zoom, brand fade, exit

**Files:**
- Modify: `src/components/sections/HeroSequenceSection.vue`

- [ ] **Step 1: Replace `onMounted` with the full GSAP-wired version**

Replace only the `onMounted` block (keep all other functions from Task 2 unchanged):

```js
onMounted(async () => {
  const isMobile = window.innerWidth < 768;

  // Initialise canvas 2D context
  ctx = canvasRef.value.getContext('2d');

  // Size canvas to fill the section
  sizeCanvas();

  // Preload all frames before starting animation
  frames = await preloadFrames(isMobile);

  // Draw frame 0 immediately so there's no blank canvas
  drawFrame(frames[0]);

  const totalFrames = frames.length;                // 80 desktop / 40 mobile
  const scrollDistance = totalFrames * 30;          // 2400px / 1200px

  createContext(() => {
    // Brand name entrance — runs once, not scroll-driven
    gsap.from(brandRef.value, {
      opacity: 0,
      y: 20,
      duration: 1,
      delay: 0.3,
      ease: 'power2.out'
    });

    // Main ScrollTrigger timeline — drives everything else
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.value,
        start: 'top top',
        end: `+=${scrollDistance}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate(self) {
          const index = Math.min(
            Math.floor(self.progress * totalFrames),
            totalFrames - 1
          );
          if (index !== currentFrameIndex) {
            currentFrameIndex = index;
            drawFrame(frames[index]);
          }
        }
      }
    });

    // Zoom: canvas wrapper scales 1 → 1.05 (1.03 on mobile) over full duration
    tl.to(zoomWrapperRef.value, {
      scale: isMobile ? 1.03 : 1.05,
      ease: 'none',
      duration: 1
    }, 0);

    // Scroll indicator: fades out over first 10% of scroll progress
    tl.to(scrollIndicatorRef.value, {
      opacity: 0,
      ease: 'none',
      duration: 0.10
    }, 0);

    // Brand name: fades out over first 25% of scroll progress
    tl.to(brandRef.value, {
      opacity: 0,
      ease: 'none',
      duration: 0.25
    }, 0);

    // Exit: hero fades and scales down over last 15% of scroll (0.85 → 1.0)
    tl.to(heroRef.value, {
      opacity: 0,
      scale: 0.97,
      ease: 'power1.in',
      duration: 0.15
    }, 0.85);

  }, heroRef.value);
});
```

- [ ] **Step 2: Verify scroll animation in browser**

Open `http://localhost:5173`. Scroll down slowly.

Expected:
- Section is pinned — page stops scrolling at the hero section
- As you scroll, frames advance (if actual image files are present) or canvas stays black (if files are absent — that is OK for now)
- "Express Transfer Paros" fades out in the first quarter of the scroll distance
- "Scroll ↓" indicator disappears almost immediately on first scroll
- Canvas/wrapper subtly zooms in over the full scroll range
- Near the end of the scroll range: entire hero section fades to opacity 0 and scales slightly
- After pin releases: AboutSection scrolls in naturally
- On desktop (≥ 768px): 80 frames × 30px = 2400px pin distance
- On mobile (< 768px): 40 frames × 30px = 1200px pin distance

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/HeroSequenceSection.vue
git commit -m "feat: add GSAP scroll animation to HeroSequenceSection"
```

---

### Task 4: Resize handling and cleanup

**Files:**
- Modify: `src/components/sections/HeroSequenceSection.vue`

- [ ] **Step 1: Add debounced resize handler and `onUnmounted` cleanup**

After the `onMounted` block, add:

```js
// Debounced resize: re-sizes canvas and redraws the current frame.
// debounce prevents excessive redraws during a continuous resize drag.
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    sizeCanvas();
    if (frames[currentFrameIndex]) {
      drawFrame(frames[currentFrameIndex]);
    }
  }, 100);
}

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
  clearTimeout(resizeTimer);
  // useGsap composable handles ScrollTrigger.kill() and context.revert() automatically
});
```

- [ ] **Step 2: Register the resize listener inside `onMounted`, after `sizeCanvas()`**

In the `onMounted` block, add one line immediately after `sizeCanvas()`:

```js
window.addEventListener('resize', onResize);
```

So that section of `onMounted` reads:

```js
ctx = canvasRef.value.getContext('2d');
sizeCanvas();
window.addEventListener('resize', onResize);  // ← add this line
frames = await preloadFrames(isMobile);
```

- [ ] **Step 3: Verify resize behaviour in browser**

Open `http://localhost:5173`. With DevTools open, drag the browser window to a narrower width.

Expected:
- Canvas resizes with the window — no stretching or blank strips
- Current frame is redrawn at the new dimensions with correct object-fit-cover crop
- No console errors on resize

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/HeroSequenceSection.vue
git commit -m "feat: add resize handling and cleanup to HeroSequenceSection"
```

---

## Self-Review

**Spec coverage:**

| Spec requirement | Task |
|---|---|
| `HeroSequenceSection.vue` created | Task 1 |
| `Home.vue` swaps `HeroWindowSection` | Task 1 |
| DOM layer stack (zoomWrapper, canvas, gradient, brand, indicator) | Task 1 |
| `preloadFrames` — Promise.all, 80/40 frames, zero-padded paths | Task 2 |
| `sizeCanvas` — matches section dimensions | Task 2 |
| `drawFrame` — object-fit-cover math | Task 2 |
| Frame 0 drawn on mount before GSAP | Task 2 |
| Brand entrance animation (opacity 0→1, y 20→0) | Task 3 |
| ScrollTrigger pin + scrub + anticipatePin | Task 3 |
| `end: +=scrollDistance` (totalFrames × 30) | Task 3 |
| `onUpdate` frame index logic (Math.floor, clamped) | Task 3 |
| Zoom tween 1→1.05 (1.03 mobile) | Task 3 |
| Scroll indicator fade 0→0.10 progress | Task 3 |
| Brand fade 0→0.25 progress | Task 3 |
| Exit: opacity 0 + scale 0.97 at 0.85→1.0 | Task 3 |
| Debounced resize handler | Task 4 |
| `onUnmounted` cleanup | Task 4 |
| Mobile: 40 frames, 1200px scroll, zoom 1.03 | Tasks 2–3 |

**Placeholder scan:** No TBDs, no "handle edge cases", no vague steps. All code blocks are complete.

**Type/name consistency:**
- `frames[]` — declared Task 1, populated Task 2, read Task 3, used in resize handler Task 4 ✓
- `currentFrameIndex` — declared Task 1, read/written in Task 3 `onUpdate`, read in Task 4 resize ✓
- `drawFrame(img)` — defined Task 2, called Task 2 (frame 0), called Task 3 (onUpdate), called Task 4 (resize) ✓
- `sizeCanvas()` — defined Task 2, called Task 2 (mount), called Task 4 (resize) ✓
- `onResize` — defined and registered Task 4, removed in `onUnmounted` Task 4 ✓
