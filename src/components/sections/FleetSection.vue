<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useGsap } from '../../composables/useGsap';

const sectionRef         = ref(null);
const canvasContainerRef = ref(null);
const canvasRef          = ref(null);

const { gsap, ScrollTrigger, createContext } = useGsap();

// Non-reactive — performance critical
let frames            = [];
let ctx               = null;
let currentFrameIndex = 0;
let resizeTimer       = null;

const features = [
  { number: '8',    label: 'Passenger Seats' },
  { number: '4',    label: 'Premium Vehicles' },
  { number: '24/7', label: 'Availability' }
];

const amenities = [
  'Air Conditioning',
  'Leather Seats',
  'USB Charging',
  'Luggage Space',
  'WiFi Available'
];

// Resolve frame URLs via Vite asset pipeline
const frameModules = import.meta.glob('../../assets/carwire_frames/*.png', { eager: true });
const allFramePaths = Object.keys(frameModules)
  .sort()
  .map(key => frameModules[key].default);

// Mobile: every other frame (60 frames) to halve bandwidth
function preloadFrames(isMobile) {
  const paths = isMobile
    ? allFramePaths.filter((_, i) => i % 2 === 0)
    : allFramePaths;

  return Promise.all(
    paths.map(src => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload  = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load frame: ${src}`));
      img.src = src;
    }))
  );
}

// Size canvas to match its container at physical (DPR) resolution
function sizeCanvas() {
  if (!canvasContainerRef.value) return;
  const dpr = window.devicePixelRatio || 1;
  const w   = canvasContainerRef.value.offsetWidth;
  const h   = canvasContainerRef.value.offsetHeight;
  canvasRef.value.width        = w * dpr;
  canvasRef.value.height       = h * dpr;
  canvasRef.value.style.width  = w + 'px';
  canvasRef.value.style.height = h + 'px';
}

// object-fit: contain — shows the full car, dark background fills the rest
function drawFrame(img) {
  if (!ctx) return;
  const cw = canvasRef.value.width;   // physical pixels
  const ch = canvasRef.value.height;
  ctx.clearRect(0, 0, cw, ch);
  const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
  const dw = img.naturalWidth  * scale;
  const dh = img.naturalHeight * scale;
  const dx = (cw - dw) / 2;
  const dy = (ch - dh) / 2;
  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, dx, dy, dw, dh);
}

onMounted(async () => {
  const isMobile    = window.innerWidth < 768;
  const totalFrames = isMobile
    ? allFramePaths.filter((_, i) => i % 2 === 0).length
    : allFramePaths.length;

  ctx = canvasRef.value.getContext('2d');
  sizeCanvas();
  window.addEventListener('resize', onResize);

  // Pin the section and drive the animation with a scroll distance proportional
  // to frame count — guarantees all frames play before the user can scroll past.
  const scrollDistance = totalFrames * 15; // ~1800px desktop, ~900px mobile

  createContext(() => {
    ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top top',
      end: `+=${scrollDistance}`,
      pin: true,
      anticipatePin: 1,
      scrub: true,
      onUpdate(self) {
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
    });
  }, sectionRef.value);

  // Load frames — ScrollTrigger is already wired; onUpdate guard handles loading window
  try {
    frames = await preloadFrames(isMobile);
  } catch (error) {
    console.error('Failed to preload fleet frames:', error);
    return;
  }

  drawFrame(frames[0]);

  // By the time frames finish loading, all sibling sections (StatsSection etc.)
  // have completed their deferred GSAP setup and added their pin spacers.
  // Refresh so this trigger recalculates against the final page layout.
  ScrollTrigger.refresh();
});

function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    sizeCanvas();
    ScrollTrigger.refresh();
    if (frames[currentFrameIndex]) drawFrame(frames[currentFrameIndex]);
  }, 100);
}

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
  clearTimeout(resizeTimer);
});
</script>

<template>
  <section
    ref="sectionRef"
    class="relative py-24 md:py-32 px-4 bg-etp-dark overflow-hidden"
  >
    <div class="max-w-6xl mx-auto">

      <!-- Heading -->
      <div class="fleet-heading text-center mb-12 md:mb-16">
        <span class="text-etp-gold text-sm tracking-widest uppercase mb-4 block">Our Fleet</span>
        <h2 class="font-heading text-3xl md:text-5xl text-white">
          Travel in <span class="text-etp-gold">Style & Comfort</span>
        </h2>
      </div>

      <!-- Canvas — replaces the static car image, same container dimensions -->
      <div
        ref="canvasContainerRef"
        class="relative mx-auto max-w-4xl mb-12 md:mb-16"
        style="aspect-ratio: 16/9;"
      >
        <canvas
          ref="canvasRef"
          class="absolute inset-0"
          style="background: transparent;"
        />
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-16">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="fleet-feature text-center"
        >
          <div class="text-3xl md:text-5xl font-heading text-etp-gold mb-2">
            {{ feature.number }}
          </div>
          <div class="text-white/70 text-sm md:text-base uppercase tracking-wider">
            {{ feature.label }}
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="fleet-description max-w-3xl mx-auto text-center">
        <p class="text-white/80 text-lg md:text-xl leading-relaxed mb-6">
          Our Mercedes V-Class vehicles offer the perfect blend of luxury and practicality.
          With spacious interiors, premium leather seating, and climate control, every journey
          becomes an experience worth remembering.
        </p>
        <ul class="flex flex-wrap justify-center gap-4 md:gap-6 text-white/60 text-sm">
          <li
            v-for="amenity in amenities"
            :key="amenity"
            class="flex items-center"
          >
            <svg class="w-4 h-4 text-etp-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            {{ amenity }}
          </li>
        </ul>
      </div>

    </div>

    <!-- Decorative glows -->
    <div class="absolute top-0 left-0 w-64 h-64 bg-etp-gold/5 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-etp-gold/5 rounded-full blur-3xl pointer-events-none"></div>
  </section>
</template>
