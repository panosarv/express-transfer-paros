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
  if (!ctx) return;
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

  // Preload all frames — log error and abort GSAP setup if loading fails
  try {
    frames = await preloadFrames(isMobile);
  } catch (error) {
    console.error('Failed to preload hero frames:', error);
    return;
  }

  // Draw frame 0 immediately so there's no blank canvas
  drawFrame(frames[0]);

  const totalFrames = frames.length;           // 80 desktop / 40 mobile
  const scrollDistance = totalFrames * 30;     // 2400px / 1200px

  createContext(() => {
    // Brand name entrance — runs once on mount, not scroll-driven
    gsap.from(brandRef.value, {
      opacity: 0,
      y: 20,
      duration: 1,
      delay: 0.3,
      ease: 'power2.out'
    });

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

    // Zoom: canvas wrapper scales 1 → 1.05 (1.03 on mobile) over full scroll
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

    // Exit: hero fades and scales down over last 15% (progress 0.85 → 1.0)
    tl.to(heroRef.value, {
      opacity: 0,
      scale: 0.97,
      ease: 'power1.in',
      duration: 0.15
    }, 0.85);

  }, heroRef.value);
});
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
