<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useGsap } from '../../composables/useGsap';

const heroRef = ref(null);
const zoomWrapperRef = ref(null);
const canvasRef = ref(null);
const brandRef = ref(null);
const scrollIndicatorRef = ref(null);
const aboutOverlayRef = ref(null);

const { gsap, createContext } = useGsap();

// Non-reactive state — never use ref() for these (performance critical)
let frames = [];
let ctx = null;
let currentFrameIndex = 0;
let resizeTimer = null;

// Static about content — plain array, not reactive
const aboutFeatures = [
  { title: 'Private Transfers', description: 'Door-to-door service from airport, port, or any location on the island.' },
  { title: 'Island Tours', description: 'Discover hidden gems and famous landmarks with our curated tours.' },
  { title: '24/7 Availability', description: "We're here whenever you need us, day or night." },
  { title: 'Premium Comfort', description: 'Travel in style with our modern, air-conditioned vehicles.' }
];

// Resolve all frame URLs via Vite's asset pipeline (src/assets → hashed output URLs).
// Sorted alphabetically so frame order matches filename order (001, 002, ..., 080).
const frameModules = import.meta.glob('../../assets/hero_frames/*.png', { eager: true });
const allFramePaths = Object.keys(frameModules)
  .sort()
  .map(key => frameModules[key].default);

// Load frames as HTMLImageElement objects.
// isMobile=true loads every other frame (40 frames) to halve bandwidth.
function preloadFrames(isMobile) {
  const paths = isMobile
    ? allFramePaths.filter((_, i) => i % 2 === 0)  // even indices → 40 frames
    : allFramePaths;                                  // all frames

  return Promise.all(
    paths.map(src => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load frame: ${src}`));
      img.src = src;
    }))
  );
}

// Set canvas pixel dimensions to match the section element.
// Scales by devicePixelRatio so the canvas buffer matches physical pixels
// on high-DPI screens — prevents blurry frames on retina/mobile displays.
// No setTransform: drawFrame addresses physical pixels directly via canvas.width/height.
function sizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const w = heroRef.value.offsetWidth;
  const h = heroRef.value.offsetHeight;
  canvasRef.value.width        = w * dpr;
  canvasRef.value.height       = h * dpr;
  canvasRef.value.style.width  = w + 'px';
  canvasRef.value.style.height = h + 'px';
}

// Draw a single frame onto the canvas using object-fit:cover math.
// The image is scaled to fill the canvas, centred, with overflow cropped.
function drawFrame(img) {
  if (!ctx) return;
  const cw = canvasRef.value.width;   // physical pixels
  const ch = canvasRef.value.height;
  ctx.clearRect(0, 0, cw, ch);
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const sw = cw / scale;
  const sh = ch / scale;
  const sx = (img.naturalWidth  - sw) / 2;
  const sy = (img.naturalHeight - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
}

onMounted(async () => {
  const isMobile = window.innerWidth < 768;

  // Pre-calculate frame count from the glob result — same logic as preloadFrames.
  // This lets us set up GSAP (and its pin spacer) immediately, before frames load,
  // so sibling sections' ScrollTriggers calculate correct positions from the start.
  const totalFrames = isMobile
    ? allFramePaths.filter((_, i) => i % 2 === 0).length
    : allFramePaths.length;
  const scrollDistance = totalFrames * 30;

  // Initialise canvas 2D context
  ctx = canvasRef.value.getContext('2d');

  // Size canvas to fill the section
  sizeCanvas();
  window.addEventListener('resize', onResize);

  // Set up GSAP synchronously NOW — before the async frame load below.
  // This inserts the pin spacer into the DOM immediately, so any sibling
  // section that creates its ScrollTrigger shortly after (e.g. StatsSection's
  // setTimeout 100ms) will measure the correct page layout.
  createContext(() => {
    // Main ScrollTrigger timeline — drives all scroll-based effects
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.value,
        start: 'top top',
        end: `+=${scrollDistance}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate(self) {
          // Guard: frames may still be loading when this first fires
          if (!frames.length) return;
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

    // Mobile: start zoomed out to counteract the cover-math zoom on portrait screens.
    // Landscape frames filling 100dvh portrait viewport are inherently ~1.28× zoomed —
    // starting at 0.85 visually offsets that. Desktop starts at 1 (cover looks fine).
    gsap.set(zoomWrapperRef.value, { scale: isMobile ? 0.85 : 1 });

    // Zoom: canvas wrapper scales toward a slightly larger value over full scroll.
    tl.to(zoomWrapperRef.value, {
      scale: isMobile ? 0.88 : 1.05,
      ease: 'none',
      duration: 1
    }, 0);

    // Scroll indicator: fades out immediately on first scroll
    tl.to(scrollIndicatorRef.value, {
      opacity: 0,
      ease: 'none',
      duration: 0.06
    }, 0);

    // Brand name: full opacity at start, fades out by 12% scroll progress.
    // fromTo with explicit from-value prevents any CSS/state conflicts.
    tl.fromTo(brandRef.value,
      { opacity: 1 },
      { opacity: 0, ease: 'power2.in', duration: 0.12 },
    0);

    // About overlay: fades in over the last 25% of animation (progress 0.70 → 0.95).
    // The hero canvas final frame acts as the background for the about content.
    tl.fromTo(aboutOverlayRef.value,
      { opacity: 0 },
      { opacity: 1, ease: 'power2.out', duration: 0.25 },
    0.70);

  }, heroRef.value);

  // Load frames asynchronously — the pin and tweens are already wired up above.
  // Frames become available for onUpdate once this resolves.
  try {
    frames = await preloadFrames(isMobile);
  } catch (error) {
    console.error('Failed to preload hero frames:', error);
    return;
  }

  // Draw frame 0 immediately so there's no blank canvas once frames arrive
  drawFrame(frames[0]);
});

// Debounced resize: re-sizes canvas and redraws the current frame.
// Debounce prevents excessive redraws during a continuous resize drag.
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
</script>

<template>
  <section
    ref="heroRef"
    class="relative w-full overflow-hidden bg-black"
    style="height: 100dvh;"
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
      style="background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%);"
    />

    <!-- Brand name overlay — opacity fully controlled by GSAP scrub timeline -->
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

    <!-- About overlay — fades in during the last 25% of the hero animation.
         The final canvas frame serves as the background. -->
    <div
      ref="aboutOverlayRef"
      class="absolute inset-0 z-30 flex flex-col justify-center px-6 md:px-16 lg:px-24 pointer-events-none overflow-y-auto"
    >
      <div class="max-w-6xl mx-auto w-full">

        <!-- Heading -->
        <div class="mb-6 md:mb-10">
          <div class="bg-etp-dark/70 backdrop-blur-sm rounded-2xl p-5 md:p-8 inline-block">
            <span class="text-etp-gold text-xs tracking-widest uppercase mb-3 block">About Us</span>
            <h2 class="font-heading text-3xl md:text-5xl lg:text-6xl text-white leading-tight">
              Your Journey,<br />
              <span class="gradient-text">Our Passion</span>
            </h2>
          </div>
        </div>

        <!-- Content grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">

          <!-- Description -->
          <div class="bg-etp-dark/70 backdrop-blur-sm rounded-2xl p-5 md:p-8 space-y-4">
            <p class="text-base md:text-lg text-white/90 leading-relaxed">
              Welcome to Express Transfer Paros, your trusted partner for premium
              transportation services on the beautiful island of Paros.
            </p>
            <p class="text-base md:text-lg text-white/90 leading-relaxed">
              With years of experience and deep local knowledge, we deliver
              exceptional service that goes beyond just getting you from A to B.
            </p>
          </div>

          <!-- Feature cards -->
          <div class="grid grid-cols-2 gap-3 md:gap-4">
            <div
              v-for="feature in aboutFeatures"
              :key="feature.title"
              class="p-4 md:p-5 rounded-2xl bg-etp-dark/70 backdrop-blur-sm border border-white/10"
            >
              <h3 class="text-sm md:text-base font-semibold text-white mb-1">{{ feature.title }}</h3>
              <p class="text-white/70 text-xs md:text-sm leading-relaxed">{{ feature.description }}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #d9b16b 0%, #B4952E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
