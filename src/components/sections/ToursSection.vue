<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import tourHistory  from '../../assets/etp-history-tour.jpg';
import tourBeach    from '../../assets/etp-drios.jpg';
import tourHalfDay  from '../../assets/etp-alyki.jpg';
import tourFullDay  from '../../assets/etp-fullday-tour.jpeg';

const emit = defineEmits(['book']);

const TOURS = [
  {
    id: 'history-tour',
    title: 'History Tour',
    subtitle: 'Museums, ruins & hidden cultural gems',
    duration: 'Min. 4 hours',
    price: 'From €200 / €300',
    highlights: ['Archaeological Museum', 'Panagia Ekatontapyliani', 'Museum of Cycladic Folklore', 'Lefkes Village'],
    photo: tourHistory,
    accent: '#0d2137',
    tag: 'Culture & History',
  },
  {
    id: 'beach-tour',
    title: 'Beach Tour',
    subtitle: '7 of the finest beaches on the island',
    duration: '9 hours',
    price: 'From €350 / €500',
    highlights: ['Faragas Beach', 'Golden Beach', 'Kalogeros clay cliffs', 'Kolymbithres granite pools'],
    photo: tourBeach,
    accent: '#1e5f8c',
    tag: 'Beach Day',
  },
  {
    id: 'half-day-island-tour',
    title: 'Half-Day Island Tour',
    subtitle: 'The best of Paros in four hours',
    duration: 'Min. 4 hours',
    price: 'From €200 / €300',
    highlights: ['Alyki fishing village', 'Piso Livadi & Logaras', 'Agios Antonios Monastery', 'Lefkes Village'],
    photo: tourHalfDay,
    accent: '#2a7a4e',
    tag: 'Half Day',
  },
  {
    id: 'full-day-island-tour',
    title: 'Full-Day Island Tour',
    subtitle: 'An unhurried journey across the whole island',
    duration: '8 hours',
    price: 'From €350 / €500',
    highlights: ['Alyki & Golden Beach swim', 'Lefkes mountain village', 'Naoussa harbour town', 'Monastiri sunset walk'],
    photo: tourFullDay,
    accent: '#c47d2e',
    tag: 'Full Day',
  },
  {
    id: 'custom-tour',
    title: 'Custom Tour',
    subtitle: 'Your itinerary, your pace, your Paros',
    duration: 'Flexible',
    price: 'Price on request',
    highlights: ['Fully customisable route', 'Local recommendations', 'Flexible schedule', 'Professional driver'],
    photo: null,
    accent: '#7b5ea7',
    tag: 'Bespoke',
  },
];

// Per-card scroll progress for parallax
const cardRefs = ref([]);
const parallaxOffsets = ref(TOURS.map(() => 0));
const cardVisible = ref(TOURS.map(() => false));

function updateParallax() {
  cardRefs.value.forEach((el, i) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
    parallaxOffsets.value[i] = (p - 0.5) * -40;
    if (p > 0.15 && !cardVisible.value[i]) cardVisible.value[i] = true;
  });
}

onMounted(() => {
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
});
onUnmounted(() => {
  window.removeEventListener('scroll', updateParallax);
});

function pillStyle(gold = false) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '4px 12px',
    borderRadius: '100px',
    background: gold ? 'rgba(232,201,126,0.18)' : 'rgba(13,33,55,0.07)',
    border: gold ? '1px solid rgba(232,201,126,0.5)' : '1px solid rgba(13,33,55,0.1)',
    fontFamily: "'DM Sans',sans-serif",
    fontSize: '11px',
    fontWeight: 600,
    color: gold ? '#b8922a' : 'var(--muted)',
    letterSpacing: '0.04em',
  };
}

// Title reveal
const titleRef = ref(null);
const titleVisible = ref(false);

onMounted(() => {
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { titleVisible.value = true; obs.disconnect(); }
  }, { threshold: 0.2 });
  if (titleRef.value) obs.observe(titleRef.value);
});
</script>

<template>
  <section
    id="tours"
    style="background:var(--sand); padding: clamp(64px,8vw,120px) clamp(20px,5vw,80px);"
  >
    <!-- Header -->
    <div
      ref="titleRef"
      class="text-center mb-16"
      :style="{
        opacity: titleVisible ? 1 : 0,
        transform: titleVisible ? 'none' : 'translateY(24px)',
        transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
      }"
    >
      <div style="font-family:'DM Sans',sans-serif; font-size:11px; font-weight:600; letter-spacing:0.22em; text-transform:uppercase; color:var(--sea); margin-bottom:14px;">
        Explore the Island
      </div>
      <h2 style="font-family:'Cormorant Garamond',serif; font-size:clamp(36px,5.5vw,64px); font-weight:300; color:var(--navy); line-height:1.1; margin-bottom:16px;">
        Curated <em style="font-style:italic; font-weight:600; color:var(--sea);">Island Tours</em>
      </h2>
      <p style="font-family:'DM Sans',sans-serif; font-size:16px; color:var(--muted); max-width:520px; margin:0 auto; line-height:1.7;">
        Hand-crafted routes led by a local driver who knows every hidden cove, hilltop village, and sunlit shore.
      </p>
    </div>

    <!-- Tour cards -->
    <div style="display:grid; grid-template-columns:1fr; gap:clamp(24px,3vw,40px); max-width:1100px; margin:0 auto;">
      <div
        v-for="(tour, i) in TOURS"
        :key="tour.id"
        :ref="el => cardRefs[i] = el"
        :style="{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: 0,
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(13,33,55,0.18)',
          opacity: cardVisible[i] ? 1 : 0,
          transform: cardVisible[i] ? 'translateY(0)' : 'translateY(48px)',
          transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${i*80}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${i*80}ms`,
          background: '#fff',
        }"
      >
        <!-- Photo side -->
        <div :style="{
          order: i%2===0 ? 0 : 1,
          position: 'relative',
          overflow: 'hidden',
          minHeight: '280px',
          background: tour.photo ? 'transparent' : `linear-gradient(135deg, #0d2137 0%, ${tour.accent} 100%)`,
        }">
          <div v-if="tour.photo" :style="{
            position: 'absolute',
            inset: '-12% 0',
            backgroundImage: `url(${tour.photo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${parallaxOffsets[i]}px)`,
            willChange: 'transform',
            transition: 'transform 0.1s linear',
          }" />
          <!-- Gradient overlay -->
          <div :style="{
            position:'absolute', inset:0,
            background: i%2===0
              ? 'linear-gradient(to right, transparent 60%, rgba(245,237,224,0.15))'
              : 'linear-gradient(to left, transparent 60%, rgba(245,237,224,0.15))',
          }" />
          <!-- Tag -->
          <div :style="{
            position:'absolute', top:'20px',
            left: i%2===0 ? '20px' : 'auto',
            right: i%2===0 ? 'auto' : '20px',
            background: tour.accent,
            color: '#fff',
            fontFamily: '\'DM Sans\',sans-serif',
            fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '5px 14px',
            borderRadius: '100px',
          }">{{ tour.tag }}</div>
        </div>

        <!-- Text side -->
        <div :style="{
          order: i%2===0 ? 1 : 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(32px,5vw,56px)',
          background: 'var(--sand)',
        }">
          <!-- Meta pills -->
          <div style="display:flex; gap:16px; margin-bottom:18px; flex-wrap:wrap;">
            <span :style="pillStyle()">⏱ {{ tour.duration }}</span>
            <span :style="pillStyle(true)">{{ tour.price }}</span>
          </div>

          <h3 style="font-family:'Cormorant Garamond',serif; font-size:clamp(26px,3.5vw,38px); font-weight:600; color:var(--navy); line-height:1.1; margin-bottom:10px;">
            {{ tour.title }}
          </h3>
          <p style="font-family:'DM Sans',sans-serif; font-size:14px; color:var(--muted); line-height:1.6; margin-bottom:24px; font-style:italic;">
            {{ tour.subtitle }}
          </p>

          <!-- Highlights -->
          <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:28px;">
            <div v-for="h in tour.highlights" :key="h" style="display:flex; align-items:center; gap:10px; font-family:'DM Sans',sans-serif; font-size:13px; color:var(--navy);">
              <div :style="{ width:'5px', height:'5px', borderRadius:'50%', background:tour.accent, flexShrink:0 }" />
              {{ h }}
            </div>
          </div>

          <router-link
            :to="`/tours/${tour.id}`"
            :style="{
              display: 'inline-block',
              alignSelf: 'flex-start',
              padding: '12px 28px',
              background: tour.accent,
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontFamily: '\'DM Sans\',sans-serif',
              fontSize: '13px', fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'opacity 0.2s, transform 0.2s',
            }"
            @mouseenter="e => { e.currentTarget.style.opacity='0.85'; e.currentTarget.style.transform='translateY(-2px)'; }"
            @mouseleave="e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='none'; }"
          >Explore Tour →</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

