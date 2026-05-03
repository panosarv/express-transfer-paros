<script setup>
import { ref, onMounted } from 'vue';
import layer2          from '../../assets/Layer2-ETP.jpg';
import steeringWheel   from '../../assets/SteeringWheel-ETP-2.png';
import privatePhoto    from '../../assets/etp-private.jpg';
import vitoPhoto       from '../../assets/etp-hero-vito.jpg';

function useInView(threshold = 0.15) {
  const el  = ref(null);
  const vis = ref(false);
  onMounted(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { vis.value = true; obs.disconnect(); }
    }, { threshold });
    if (el.value) obs.observe(el.value);
  });
  return { el, vis };
}

const { el: sectionEl, vis: inView }   = useInView(0.15);
const { el: wheelEl,   vis: wheelVis } = useInView(0.1);
</script>

<template>
  <section
    id="about"
    style="position:relative;overflow:hidden;padding:0;"
  >
    <!-- Layer2 parallax background -->
    <div :style="{
      position: 'absolute', inset: 0, zIndex: 0,
      backgroundImage: `url(${layer2})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center 60%',
      backgroundAttachment: 'fixed',
    }" />

    <!-- Dark overlay -->
    <div style="position:absolute;inset:0;z-index:1;background:linear-gradient(105deg,rgba(12,14,22,0.88) 0%,rgba(12,14,22,0.75) 55%,rgba(12,14,22,0.6) 100%);" />

    <!-- Steering wheel decorative accent -->
    <div
      ref="wheelEl"
      :style="{
        position: 'absolute',
        right: '-60px', bottom: '-60px',
        width: '420px', height: '420px',
        zIndex: 2,
        opacity: wheelVis ? 0.07 : 0,
        transform: wheelVis ? 'rotate(15deg) scale(1)' : 'rotate(25deg) scale(0.85)',
        transition: 'all 1.4s cubic-bezier(0.16,1,0.3,1)',
        pointerEvents: 'none',
        userSelect: 'none',
      }"
    >
      <img :src="steeringWheel" alt="" style="width:100%;height:100%;object-fit:contain;filter:invert(1);" />
    </div>

    <!-- Main content -->
    <div
      ref="sectionEl"
      class="about-inner"
      :style="{
        position: 'relative', zIndex: 3,
        display: 'flex', gap: '72px',
        maxWidth: '1000px', margin: '0 auto',
        alignItems: 'center', flexWrap: 'wrap',
        padding: '110px 60px',
      }"
    >
      <!-- Photo cards -->
      <div
        class="about-photo-col"
        :style="{
          flex: '0 0 320px',
          position: 'relative',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateX(0)' : 'translateX(-40px)',
          transition: 'all 0.85s cubic-bezier(0.16,1,0.3,1)',
        }"
      >
        <!-- Back card -->
        <div style="position:absolute;top:40px;right:-24px;width:80%;border-radius:12px;overflow:hidden;border:1px solid rgba(232,201,126,0.2);box-shadow:0 16px 48px rgba(0,0,0,0.5);z-index:1;">
          <img :src="privatePhoto" alt="Private chauffeur service" style="width:100%;height:220px;object-fit:cover;object-position:center;display:block;" />
        </div>
        <!-- Front card -->
        <div style="position:relative;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.12);box-shadow:0 32px 80px rgba(0,0,0,0.6);z-index:2;margin-right:40px;">
          <img :src="vitoPhoto" alt="Mercedes Vito" style="width:100%;height:300px;object-fit:cover;object-position:center;display:block;background:#0a1628;" />
          <div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(13,33,55,0.95),transparent);padding:24px 18px 14px;">
            <div style="font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:var(--gold);margin-bottom:3px;">Fleet</div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:16px;font-style:italic;color:rgba(255,255,255,0.9);">Mercedes Vito</div>
          </div>
        </div>
        <!-- Gold accent border -->
        <div style="position:absolute;width:120px;height:120px;bottom:-16px;left:-16px;border:1.5px solid rgba(232,201,126,0.35);border-radius:10px;z-index:0;pointer-events:none;" />
      </div>

      <!-- Text content -->
      <div :style="{
        flex: 1, minWidth: '280px',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateX(0)' : 'translateX(40px)',
        transition: 'all 0.85s cubic-bezier(0.16,1,0.3,1) 0.15s',
      }">
        <div style="font-family:'DM Sans',sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);margin-bottom:14px;font-weight:600;">
          About Us
        </div>
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(34px,4vw,52px);font-weight:600;color:#fff;line-height:1.12;margin-bottom:22px;">
          Your Trusted Partner<br />on the Island
        </h2>
        <p style="font-family:'DM Sans',sans-serif;font-size:16px;line-height:1.8;color:rgba(255,255,255,0.72);margin-bottom:16px;">
          We provide a seamless and reliable experience from the moment you arrive. From airport and port pickups to full-day private drivers, island tours, weddings, bachelor parties and more — every ride is tailored to your needs.
        </p>
        <p style="font-family:'DM Sans',sans-serif;font-size:16px;line-height:1.8;color:rgba(255,255,255,0.72);margin-bottom:32px;">
          Our service reflects the warmth and hospitality of Paros itself. Professional, punctual, and personal.
        </p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          <div
            v-for="v in ['Local Expertise','Always On Time','Transparent Pricing','Fluent in English']"
            :key="v"
            style="display:flex;align-items:center;gap:10px;"
          >
            <div style="width:7px;height:7px;border-radius:50%;background:var(--sea);flex-shrink:0;" />
            <span style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;color:rgba(255,255,255,0.85);">{{ v }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
