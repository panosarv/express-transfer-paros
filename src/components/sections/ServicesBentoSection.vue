<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import parikiaPhoto  from '../../assets/etp-parikia.jpg';
import logarasPhoto  from '../../assets/etp-logaras.jpg';
import naousaPhoto   from '../../assets/etp-naousa.jpg';
import parospark     from '../../assets/etp-paros-park.jpg';

const PHOTO_STRIP = [
  { src: logarasPhoto, label: 'Logaras Beach' },
  { src: naousaPhoto,  label: 'Naoussa' },
  { src: parikiaPhoto, label: 'Parikia' },
  { src: parospark,    label: 'Paros Park' },
];

const hovStrip = ref(-1);

const emit = defineEmits(['book']);

const SERVICES = [
  {
    id: 'airport',
    label: 'Airport Transfers',
    desc: 'Door-to-door from Paros Airport. Flight tracking included — we wait if you\'re delayed.',
    price: 'From €40',
    duration: '15–45 min',
    featured: true,
    photo: parikiaPhoto,
  },
  {
    id: 'port',
    label: 'Port Transfers',
    desc: 'Meet & greet at Parikia or Naoussa port. We wait even if the ferry is late.',
    price: 'From €36',
    duration: '10–30 min',
    bg: 'var(--sea)',
  },
  {
    id: 'hotel',
    label: 'Hotel Transfers',
    desc: 'Seamless pickups and drop-offs to any hotel or villa on the island.',
    price: 'From €36',
    duration: 'Any time',
    bg: '#0a1e30',
  },
  {
    id: 'tours',
    label: 'Island Tours',
    desc: 'Custom half-day or full-day drives with a local guide. See the real Paros.',
    price: 'From €200',
    duration: '3–8 hours',
    bg: '#0f2a40',
  },
  {
    id: 'weddings',
    label: 'Weddings & Events',
    desc: 'Elegant transfers for your special day. Decorated vehicles available.',
    price: 'On request',
    duration: 'Full day',
    bg: 'var(--navy)',
  },
  {
    id: 'vip',
    label: 'VIP & Hourly Hire',
    desc: 'A dedicated driver at your disposal. Explore at your own pace.',
    price: 'On request',
    duration: 'Min 2 hours',
    bg: '#081728',
  },
];

const sectionRef = ref(null);
const inView = ref(false);
const hovIndex = ref(-1);

onMounted(() => {
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { inView.value = true; obs.disconnect(); }
  }, { threshold: 0.1 });
  if (sectionRef.value) obs.observe(sectionRef.value);
});
</script>

<template>
  <section
    id="services"
    style="position:relative; background:var(--navy); padding:clamp(64px,8vw,120px) clamp(20px,5vw,80px); overflow:hidden;"
  >
    <!-- Sea glow -->
    <div style="position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse 80% 60% at 50% 0%, rgba(30,95,140,0.35) 0%, transparent 70%);" />

    <div style="position:relative; z-index:1; max-width:1100px; margin:0 auto;">
      <!-- Header -->
      <div style="text-align:center; margin-bottom:clamp(40px,5vw,64px);">
        <div style="font-family:'DM Sans',sans-serif; font-size:11px; font-weight:600; letter-spacing:0.22em; text-transform:uppercase; color:var(--sky); margin-bottom:14px;">
          What We Offer
        </div>
        <h2 style="font-family:'Cormorant Garamond',serif; font-size:clamp(34px,5vw,60px); font-weight:300; color:#fff; line-height:1.1; margin-bottom:16px;">
          Every <em style="font-style:italic; font-weight:600; color:var(--gold);">Journey</em> Covered
        </h2>
        <p style="font-family:'DM Sans',sans-serif; font-size:16px; color:rgba(255,255,255,0.5); max-width:480px; margin:0 auto; line-height:1.7;">
          From airport arrivals to sunset drives — we handle every transfer with care and local expertise.
        </p>
      </div>

      <!-- Bento grid -->
      <div
        ref="sectionRef"
        class="bento-grid"
        style="display:grid; grid-template-columns:repeat(3,1fr); gap:16px;"
      >
        <div
          v-for="(svc, i) in SERVICES"
          :key="svc.id"
          @mouseenter="hovIndex = i"
          @mouseleave="hovIndex = -1"
          :style="{
            gridColumn: i === 0 ? 'span 2' : 'span 1',
            position: 'relative',
            borderRadius: '18px',
            overflow: 'hidden',
            minHeight: i === 0 ? '280px' : '220px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            cursor: 'pointer',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(32px)',
            transition: `opacity 0.7s ease ${i*80}ms, transform 0.7s ease ${i*80}ms, box-shadow 0.3s ease, border 0.3s ease`,
            boxShadow: hovIndex === i ? '0 20px 60px rgba(13,33,55,0.45)' : '0 4px 20px rgba(13,33,55,0.25)',
            border: hovIndex === i ? '1px solid rgba(232,201,126,0.4)' : '1px solid rgba(255,255,255,0.07)',
          }"
        >
          <!-- Background -->
          <template v-if="svc.photo">
            <div :style="{
              position:'absolute', inset:0,
              backgroundImage: `url(${svc.photo})`,
              backgroundSize:'cover', backgroundPosition:'center',
              transform: hovIndex === i ? 'scale(1.04)' : 'scale(1)',
              transition:'transform 0.6s ease',
            }" />
            <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(13,33,55,0.92) 40%, rgba(13,33,55,0.3) 100%);" />
          </template>
          <template v-else>
            <div :style="{
              position:'absolute', inset:0,
              background: svc.bg,
              backgroundImage:'radial-gradient(ellipse at 80% 20%, rgba(126,200,227,0.1) 0%, transparent 60%)',
            }" />
          </template>

          <!-- Content -->
          <div style="position:relative; z-index:2; padding:clamp(20px,3vw,28px);">
            <div style="display:flex; gap:8px; margin-bottom:14px; flex-wrap:wrap;">
              <span style="font-family:'DM Sans',sans-serif; font-size:10px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:var(--gold); padding:3px 10px; border:1px solid rgba(232,201,126,0.4); border-radius:100px;">
                {{ svc.duration }}
              </span>
              <span style="font-family:'DM Sans',sans-serif; font-size:10px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:rgba(255,255,255,0.6); padding:3px 10px; border:1px solid rgba(255,255,255,0.15); border-radius:100px;">
                {{ svc.price }}
              </span>
            </div>

            <h3 :style="{
              fontFamily: '\'Cormorant Garamond\',serif',
              fontSize: i===0 ? 'clamp(22px,3vw,32px)' : 'clamp(18px,2.5vw,24px)',
              fontWeight: 600,
              color: '#fff',
              marginBottom: '8px',
              lineHeight: 1.15,
            }">{{ svc.label }}</h3>

            <p :style="{
              fontFamily: '\'DM Sans\',sans-serif',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.6,
              marginBottom: '18px',
              maxWidth: i===0 ? '480px' : '260px',
            }">{{ svc.desc }}</p>

            <RouterLink
              v-if="svc.id === 'weddings' || svc.id === 'vip'"
              to="/booking"
              :style="{
                display: 'inline-block',
                padding: '9px 20px',
                background: hovIndex === i ? 'var(--gold)' : 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(232,201,126,0.45)',
                borderRadius: '6px',
                color: hovIndex === i ? 'var(--navy)' : '#fff',
                fontFamily: '\'DM Sans\',sans-serif',
                fontSize: '12px', fontWeight: 600,
                letterSpacing: '0.07em', textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                textDecoration: 'none',
              }"
            >Enquire Now</RouterLink>
            <button
              v-else
              @click.stop="emit('book')"
              :style="{
                padding: '9px 20px',
                background: hovIndex === i ? 'var(--gold)' : 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(232,201,126,0.45)',
                borderRadius: '6px',
                color: hovIndex === i ? 'var(--navy)' : '#fff',
                fontFamily: '\'DM Sans\',sans-serif',
                fontSize: '12px', fontWeight: 600,
                letterSpacing: '0.07em', textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }"
            >Book Now</button>
          </div>
        </div>
      </div>

        <!-- Photo strip -->
        <div
          class="photo-strip-grid"
          style="display:grid;grid-template-columns:repeat(4,1fr);gap:0;overflow:hidden;border-radius:16px;margin-top:40px;"
        >
          <div
            v-for="(p, i) in PHOTO_STRIP"
            :key="i"
            @mouseenter="hovStrip = i"
            @mouseleave="hovStrip = -1"
            style="position:relative;overflow:hidden;height:220px;cursor:pointer;"
          >
            <img
              :src="p.src"
              :alt="p.label"
              :style="{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                transform: hovStrip === i ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.6s ease',
              }"
            />
            <div :style="{
              position: 'absolute', inset: 0,
              background: hovStrip === i ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.25)',
              transition: 'background 0.4s',
            }" />
            <div style="position:absolute;bottom:14px;left:0;right:0;text-align:center;font-family:'DM Sans',sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.85);font-weight:500;">
              {{ p.label }}
            </div>
          </div>
        </div>
      </div>
  </section>
</template>

<style scoped>
@media (max-width: 767px) {
  .bento-grid {
    display: flex !important;
    flex-direction: column !important;
    gap: 14px !important;
  }
  .bento-grid > div {
    min-height: 200px !important;
  }
}
</style>
