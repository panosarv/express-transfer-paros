<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import fleetImg   from '../../assets/Fleet-ETP.png';
import carImg     from '../../assets/CarMoving-ETP.png';
import skodaImg from '../../assets/skodaSkala.png';

const VEHICLES = [
  {
    name: 'Mercedes Vito',
    capacity: 'Up to 8 passengers',
    features: ['Spacious cabin', 'Premium leather', 'Climate control', 'Ample luggage space'],
    ideal: 'Groups & Family Travel',
    badge: 'Most Popular',
    img: carImg,
  },
  {
    name: 'Skoda Scala',
    capacity: 'Up to 4 passengers',
    features: ['Comfortable seating', 'Modern interior', 'Air conditioning', 'Boot storage'],
    ideal: 'Couples & Small Groups',
    badge: 'Economy Option',
    img: skodaImg,
  },
];

// ── FleetDrawIn: SVG displacement + clip-path reveal ──
const drawRef      = ref(null);
const drawProgress = ref(0);
let rafRef = null;
let drawStarted = false;

function easeInOutCubic(p) {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

function startDraw() {
  if (drawStarted) return;
  drawStarted = true;
  let start = null;
  const dur = 2400;
  function run(t) {
    if (!start) start = t;
    const p = Math.min(1, (t - start) / dur);
    drawProgress.value = easeInOutCubic(p);
    if (p < 1) rafRef = requestAnimationFrame(run);
  }
  rafRef = requestAnimationFrame(run);
}

const sectionRef = ref(null);
const inView     = ref(false);
const hovCard    = ref(-1);

onMounted(() => {
  const sectionObs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { inView.value = true; sectionObs.disconnect(); }
  }, { threshold: 0.1 });
  if (sectionRef.value) sectionObs.observe(sectionRef.value);

  // drawRef is available after mount
  const drawObs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { startDraw(); drawObs.disconnect(); }
  }, { threshold: 0.3 });
  if (drawRef.value) drawObs.observe(drawRef.value);
});

onUnmounted(() => { if (rafRef) cancelAnimationFrame(rafRef); });
</script>

<template>
  <section
    id="fleet"
    ref="sectionRef"
    style="
      background: var(--navy);
      padding: clamp(64px,8vw,120px) clamp(20px,5vw,80px) 80px;
      text-align: center;
    "
  >
    <!-- Header -->
    <div style="font-family:'DM Sans',sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);margin-bottom:14px;font-weight:600;">
      Our Fleet
    </div>
    <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(36px,5vw,56px);font-weight:600;color:#fff;line-height:1.15;margin:0 0 16px;">
      Travel in Comfort
    </h2>
    <p style="font-family:'DM Sans',sans-serif;font-size:17px;color:rgba(255,255,255,0.55);line-height:1.7;max-width:560px;margin:0 auto 64px;">
      Every vehicle is maintained to the highest standard — clean, air-conditioned, and driven by a professional local chauffeur.
    </p>

    <!-- FleetDrawIn featured image -->
    <div
      ref="drawRef"
      :style="{
        maxWidth: '640px',
        margin: '0 auto 64px',
        position: 'relative',
        opacity: inView ? 1 : 0,
        transform: inView ? 'scale(1)' : 'scale(0.95)',
        transition: 'all 0.8s ease',
        background: 'rgba(13,33,55,0.95)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
      }"
    >
      <!-- Hidden SVG displacement filter -->
      <svg style="position:absolute;width:0;height:0;overflow:hidden;" aria-hidden="true">
        <defs>
          <filter id="fleet-draw-filter" x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="turbulence" baseFrequency="0.022 0.038" numOctaves="3" seed="7" result="noise" />
            <feDisplacementMap
              in="SourceGraphic" in2="noise"
              :scale="Math.round((1 - drawProgress) * 22)"
              xChannelSelector="R" yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <!-- Clipped + displaced image -->
      <div :style="{
        clipPath: `inset(${(1 - drawProgress) * 50}% round 10px)`,
        filter: drawProgress < 0.98 ? 'url(#fleet-draw-filter)' : 'none',
        willChange: 'clip-path, filter',
      }">
        <img :src="fleetImg" alt="Mercedes Vito — Interior view" style="width:100%;display:block;mix-blend-mode:multiply;" />
      </div>

      <!-- Caption bar -->
      <div style="padding:18px 24px 20px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,0.06);">
        <div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:#fff;">Mercedes Vito — Interior</div>
          <div style="font-family:'DM Sans',sans-serif;font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:0.08em;margin-top:3px;">8-Seat Configuration · Panoramic top view</div>
        </div>
        <div style="display:flex;gap:2px;">
          <span v-for="n in 5" :key="n" style="color:var(--gold);font-size:14px;">★</span>
        </div>
      </div>
    </div>

    <!-- Vehicle cards -->
    <div
      class="vehicle-cards-grid"
      style="display:flex;gap:24px;flex-wrap:wrap;justify-content:center;max-width:900px;margin:0 auto;"
    >
      <div
        v-for="(v, i) in VEHICLES"
        :key="v.name"
        @mouseenter="hovCard = i"
        @mouseleave="hovCard = -1"
        :style="{
          flex: '1 1 360px',
          maxWidth: '420px',
          background: '#0d2137',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          border: hovCard === i ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)',
          boxShadow: hovCard === i ? '0 24px 60px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.2)',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(40px)',
          transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i*150}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i*150}ms, box-shadow 0.3s ease, border 0.3s ease`,
        }"
      >
        <!-- Badge -->
        <div style="position:absolute;top:16px;right:16px;z-index:2;background:var(--sea);color:#fff;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:5px 12px;border-radius:100px;">
          {{ v.badge }}
        </div>

        <!-- Car image -->
        <div style="height:220px;background:#0a1628;position:relative;overflow:hidden;">
          <div style="position:absolute;bottom:12px;left:16px;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);z-index:1;">
            {{ v.name }}
          </div>
          <img :src="v.img" :alt="v.name" style="width:100%;height:100%;object-fit:contain;object-position:center;padding:16px 20px;" />
        </div>

        <!-- Details -->
        <div style="padding:24px 28px 28px;">
          <div style="font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:#fff;margin-bottom:4px;">{{ v.name }}</div>
          <div style="font-family:'DM Sans',sans-serif;font-size:14px;color:rgba(255,255,255,0.45);margin-bottom:8px;">{{ v.capacity }}</div>
          <div style="font-family:'DM Sans',sans-serif;font-size:13px;color:var(--gold);margin-bottom:16px;">
            Ideal for: <strong>{{ v.ideal }}</strong>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div
              v-for="f in v.features"
              :key="f"
              style="display:flex;align-items:center;gap:8px;font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(255,255,255,0.65);"
            >
              <div style="width:6px;height:6px;border-radius:50%;background:var(--sea);flex-shrink:0;" />
              {{ f }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
