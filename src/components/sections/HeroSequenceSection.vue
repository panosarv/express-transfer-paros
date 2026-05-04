<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const TOTAL_FRAMES = 80;
const ANIMATION_MULTIPLIER = 3; // animation plays over 500dvh (unchanged speed)
const DWELL_MULTIPLIER     = 0.5; // 200dvh hold at the end before scrolling past
const SCROLL_MULTIPLIER    = ANIMATION_MULTIPLIER + DWELL_MULTIPLIER; // total section = 700dvh

const outerRef  = ref(null);
const canvasRef = ref(null);

// Non-reactive — performance critical
let imagesArr   = new Array(TOTAL_FRAMES).fill(null);
let loadedArr   = new Array(TOTAL_FRAMES).fill(false);
let rafId       = null;
let progressVal = 0;
let resizeTimer = null;

// Reactive — drives UI re-renders
const uiProgress   = ref(0);
const mounted      = ref(false);
const framesReady  = ref(false);

// Resolve all frame URLs via Vite asset pipeline
const frameModules = import.meta.glob('../../assets/hero_frames/*.png', { eager: true });
const allFramePaths = Object.keys(frameModules)
  .sort()
  .map(k => frameModules[k].default);

/* ── Draw one frame onto the canvas ── */
function drawFrame(frameIdx, scale = 1) {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const img = imagesArr[frameIdx];
  if (!img) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const isMobilePortrait = window.innerWidth < 768 && window.innerHeight > window.innerWidth;
  const iw = img.naturalWidth  || 1920;
  const ih = img.naturalHeight || 1080;

  let drawW, drawH, drawX, drawY;
  if (isMobilePortrait) {
    // contain width — letterbox (black bars top/bottom)
    drawW = W;
    drawH = W * (ih / iw);
    drawX = 0;
    drawY = (H - drawH) / 2;
  } else {
    // cover — fill, crop surplus; slight zoom with scale
    const s = Math.max(W / iw, H / ih) * scale;
    drawW = iw * s;
    drawH = ih * s;
    drawX = (W - drawW) / 2;
    drawY = (H - drawH) / 2;
  }

  ctx.drawImage(img, drawX, drawY, drawW, drawH);
}

/* ── Resize canvas to match viewport ── */
function resizeCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const frameIdx = Math.min(TOTAL_FRAMES - 1, Math.floor(progressVal * (TOTAL_FRAMES - 1)));
  drawFrame(frameIdx, 1 + progressVal * 0.05);
}

/* ── Scroll handler ── */
function onScroll() {
  if (!outerRef.value) return;
  const rect            = outerRef.value.getBoundingClientRect();
  const scrolled        = Math.max(0, -rect.top);
  // Animation completes over the first ANIMATION_MULTIPLIER × vh of scroll;
  // the remaining DWELL_MULTIPLIER × vh keeps p clamped at 1 (dwell).
  const animScrollable  = (ANIMATION_MULTIPLIER - 1) * window.innerHeight;
  const p               = Math.min(1, scrolled / animScrollable);
  progressVal           = p;

  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    const frameIdx = Math.min(TOTAL_FRAMES - 1, Math.floor(p * (TOTAL_FRAMES - 1)));
    drawFrame(frameIdx, 1 + p * 0.05);
    uiProgress.value = p;
  });
}

/* ── Debounced resize ── */
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resizeCanvas, 100);
}

onMounted(() => {
  mounted.value = true;
  resizeCanvas();

  // Load frame 0 first, then the rest in sequence
  const loadOne = (i) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      imagesArr[i]  = img;
      loadedArr[i]  = true;
      if (i === 0) {
        resizeCanvas();
        framesReady.value = true;
      }
      resolve();
    };
    img.onerror = resolve;
    img.src = allFramePaths[i];
  });

  loadOne(0).then(() => {
    for (let i = 1; i < TOTAL_FRAMES; i++) loadOne(i);
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onResize);
  if (rafId) cancelAnimationFrame(rafId);
  clearTimeout(resizeTimer);
});

// UI derived values (computed inline in template via uiProgress)
</script>

<template>
  <!-- Outer: full scroll height = 5 × 100dvh -->
  <section
    ref="outerRef"
    class="hero-outer"
    :style="{ height: `${SCROLL_MULTIPLIER * 100}dvh`, position: 'relative' }"
  >
    <!-- Mobile blend — top edge (merges with section above) -->
    <div class="hero-edge-top" />
    <!-- Mobile blend — bottom edge (merges with section below) -->
    <div class="hero-edge-bottom" />
    <!-- Sticky viewport: fixed to top while scrolling through outer -->
    <div :style="{
      position: 'sticky',
      top: 0,
      width: '100%',
      height: '100dvh',
      overflow: 'hidden',
      background: '#000',
    }">

      <!-- Mobile vignette — top arc -->
      <div class="mobile-vignette-top" />
      <!-- Mobile vignette — bottom arc -->
      <div class="mobile-vignette-bottom" />

      <!-- Canvas: scroll-driven frame sequence -->
      <canvas
        ref="canvasRef"
        :style="{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
        }"
      />

      <!-- Brand pill — fades out at 12% scroll -->
      <div :style="{
        position: 'absolute',
        top: 'clamp(80px, 10vh, 120px)',
        left: 0,
        right: 0,
        zIndex: 20,
        display: 'flex',
        justifyContent: 'center',
        opacity: mounted ? Math.max(0, 1 - uiProgress / 0.12) : 0,
        transition: mounted ? 'none' : 'opacity 1s ease 0.6s',
        pointerEvents: 'none',
      }">
        <div :style="{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: '100px',
          padding: '7px 22px',
        }">
          <span :style="{
            width: '7px', height: '7px', borderRadius: '50%',
            background: 'var(--gold)',
            display: 'inline-block',
            boxShadow: '0 0 8px var(--gold)',
          }" />
          <span :style="{
            fontFamily: '\'DM Sans\', sans-serif',
            fontSize: 'clamp(10px, 1.2vw, 12px)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.85)',
          }">Express Transfer Paros</span>
          <span :style="{
            width: '7px', height: '7px', borderRadius: '50%',
            background: 'var(--gold)',
            display: 'inline-block',
            boxShadow: '0 0 8px var(--gold)',
          }" />
        </div>
      </div>

      <!-- Scroll hint — bottom right (desktop) / below brand pill (mobile) -->
      <div
        class="scroll-hint"
        :style="{
          opacity: mounted ? Math.max(0, 1 - uiProgress / 0.75) : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }"
      >
        <span class="scroll-hint-label">Scroll to Discover</span>
        <div style="display:flex;flex-direction:column;align-items:center;gap:0;">
          <svg class="scroll-chevron scroll-chevron-1" width="56" height="30" viewBox="0 0 56 30" fill="none">
            <path d="M2 2l26 26L54 2" stroke="rgba(255,255,255,0.9)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg class="scroll-chevron scroll-chevron-2" width="56" height="30" viewBox="0 0 56 30" fill="none">
            <path d="M2 2l26 26L54 2" stroke="rgba(255,255,255,0.55)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg class="scroll-chevron scroll-chevron-3" width="56" height="30" viewBox="0 0 56 30" fill="none">
            <path d="M2 2l26 26L54 2" stroke="rgba(232,201,126,0.85)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <!-- Title overlay — appears over last 25% (75% → 100%) -->
      <div
        class="title-overlay"
        :style="{
        position: 'absolute',
        inset: 0,
        zIndex: 15,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 'clamp(60px, 10vh, 100px)',
        paddingLeft: 'clamp(20px, 5vw, 60px)',
        paddingRight: 'clamp(20px, 5vw, 60px)',
        opacity: Math.max(0, (uiProgress - 0.75) / 0.25),
        transform: `translateY(${(1 - Math.min(1, (uiProgress - 0.75) / 0.25)) * 40}px)`,
        willChange: 'opacity, transform',
        pointerEvents: Math.max(0, (uiProgress - 0.75) / 0.25) > 0.4 ? 'auto' : 'none',
        background: `rgba(0,0,0,${Math.max(0, (uiProgress - 0.75) / 0.25) * 0.22})`,
      }">
        <h1
          class="hero-title"
          :style="{
          fontFamily: '\'Cormorant Garamond\', serif',
          fontWeight: 300,
          fontSize: 'clamp(48px, 8.5vw, 118px)',
          color: '#fff',
          textAlign: 'center',
          lineHeight: 0.93,
          letterSpacing: '-0.01em',
          margin: '0 0 6px',
          textShadow: '0 4px 60px rgba(0,0,0,0.5)',
        }">
          Express<br />
          <em :style="{ fontStyle: 'italic', fontWeight: 600, color: 'var(--gold)' }">Transfer</em><br />
          Paros
        </h1>

        <p :style="{
          fontFamily: '\'DM Sans\', sans-serif',
          fontSize: 'clamp(11px, 1.4vw, 16px)',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.75)',
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          textShadow: '0 2px 20px rgba(0,0,0,0.6)',
          margin: 'clamp(40px, 40vh, 400px) 0 0',
          textAlign: 'center',
        }">
          Arrive in Style · Explore the Aegean
        </p>
      </div>

      <!-- Stats bar — appears at 82%+ scroll -->
      <div :style="{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        zIndex: 16,
        opacity: Math.max(0, (uiProgress - 0.82) / 0.18),
        transform: `translateY(${(1 - Math.max(0, (uiProgress - 0.82) / 0.18)) * 20}px)`,
        willChange: 'opacity, transform',
        pointerEvents: 'none',
      }">
        <div :style="{
          display: 'flex',
          background: 'rgba(8,10,20,0.6)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }">
          <div
            v-for="(stat, i) in [
              { num: '10,000+', label: 'Happy Clients' },
              { num: '3+',    label: 'Years on Paros' },
              { num: '24 / 7', label: 'Available' },
              { num: '5 ★',   label: 'Google Rating' },
            ]"
            :key="i"
            :style="{
              flex: 1,
              padding: 'clamp(12px, 2vh, 18px) 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none',
            }"
          >
            <span :style="{
              fontFamily: '\'Cormorant Garamond\', serif',
              fontSize: 'clamp(18px, 3vw, 28px)',
              fontWeight: 600,
              color: 'var(--gold)',
              lineHeight: 1,
            }">{{ stat.num }}</span>
            <span :style="{
              fontFamily: '\'DM Sans\', sans-serif',
              fontSize: 'clamp(9px, 1vw, 10px)',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }">{{ stat.label }}</span>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* ── Scroll hint: desktop — bottom left ── */
.scroll-hint {
  position: absolute;
  bottom: clamp(36px, 5vh, 60px);
  left: clamp(36px, 4vw, 64px);
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}
.scroll-hint-label {
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(16px, 1.8vw, 22px);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 700;
}

/* ── Chevron cascade animation ── */
@keyframes chevronCascade {
  0%   { transform: translateY(-4px); opacity: 0; }
  30%  { opacity: 1; }
  60%  { transform: translateY(4px); opacity: 1; }
  100% { transform: translateY(8px); opacity: 0; }
}
.scroll-chevron {
  display: block;
  margin-top: -8px;
}
.scroll-chevron-1 {
  animation: chevronCascade 1.6s ease-in-out infinite;
  animation-delay: 0s;
}
.scroll-chevron-2 {
  animation: chevronCascade 1.6s ease-in-out infinite;
  animation-delay: 0.2s;
}
.scroll-chevron-3 {
  animation: chevronCascade 1.6s ease-in-out infinite;
  animation-delay: 0.4s;
}

/* Mobile-only vignettes — hidden on desktop */
.mobile-vignette-top,
.mobile-vignette-bottom,
.hero-edge-top,
.hero-edge-bottom {
  display: none;
}

@media (max-width: 768px) {
  /* Absolutely position h1 on mobile so it moves independently of the subtext */
  .hero-title {
    position: absolute !important;
    top: 38vh;
    left: 0;
    right: 0;
    margin: 0 !important;
  }

  /* Scroll hint: move below the brand pill (~120px top + ~40px pill height + gap) */
  .scroll-hint {
    bottom: auto;
    right: auto;
    top: clamp(170px, 20vh, 210px);
    left: 50%;
    transform: translateX(-50%);
    align-items: center;
    gap: 12px;
  }
  .scroll-hint-label {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.18em;
    color: rgba(255, 255, 255, 0.85);
  }
  .scroll-chevron {
    width: 44px;
    height: 24px;
    margin-top: -6px;
  }

  /* Top: wide elliptical arc darkening the upper corners,
     brightest at the very top edges, fading toward centre */
  .mobile-vignette-top {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 42%;
    z-index: 5;
    pointer-events: none;
    background: radial-gradient(
      ellipse 120% 80% at 50% -10%,
      rgba(18, 18, 18, 0.82) 0%,
      rgba(18, 18, 18, 0.55) 30%,
      rgba(18, 18, 18, 0.18) 60%,
      transparent 100%
    );
  }

  /* Bottom: matching arc rising from below */
  .mobile-vignette-bottom {
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 42%;
    z-index: 5;
    pointer-events: none;
    background: radial-gradient(
      ellipse 120% 80% at 50% 110%,
      rgba(18, 18, 18, 0.82) 0%,
      rgba(18, 18, 18, 0.55) 30%,
      rgba(18, 18, 18, 0.18) 60%,
      transparent 100%
    );
  }

  /* Edge blends — sit in the document flow outside the sticky viewport,
     so they're visible exactly when scrolling into / out of the hero */
  .hero-edge-top {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 120px;
    z-index: 10;
    pointer-events: none;
    background: linear-gradient(
      to bottom,
      rgba(18, 18, 18, 0.92) 0%,
      rgba(18, 18, 18, 0.5) 50%,
      transparent 100%
    );
  }

  .hero-edge-bottom {
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 120px;
    z-index: 10;
    pointer-events: none;
    background: linear-gradient(
      to top,
      rgba(18, 18, 18, 0.92) 0%,
      rgba(18, 18, 18, 0.5) 50%,
      transparent 100%
    );
  }
}
</style>
