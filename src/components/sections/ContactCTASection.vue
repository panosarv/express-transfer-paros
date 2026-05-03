<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['book']);

const sectionEl = ref(null);
const inView    = ref(false);

onMounted(() => {
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { inView.value = true; obs.disconnect(); }
  }, { threshold: 0.15 });
  if (sectionEl.value) obs.observe(sectionEl.value);
});

const hovBook = ref(false);
const hovWa   = ref(false);
</script>

<template>
  <section style="background:var(--sea);padding:100px 40px;">
    <div
      ref="sectionEl"
      style="text-align:center;max-width:600px;margin:0 auto;"
    >
      <h2 :style="{
        fontFamily: '\'Cormorant Garamond\',serif',
        fontSize: 'clamp(36px,5vw,60px)',
        fontWeight: 600,
        color: '#fff',
        lineHeight: 1.15,
        marginBottom: '20px',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.7s ease',
      }">
        Ready to Explore Paros?
      </h2>

      <p :style="{
        fontFamily: '\'DM Sans\',sans-serif',
        fontSize: '17px',
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 1.7,
        marginBottom: '40px',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.7s ease 0.15s',
      }">
        Book your transfer in minutes — or reach us directly via WhatsApp for instant confirmation.
      </p>

      <div :style="{
        display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.7s ease 0.3s',
      }">
        <!-- Book a Transfer -->
        <button
          @click="emit('book')"
          @mouseenter="hovBook = true"
          @mouseleave="hovBook = false"
          :style="{
            padding: '16px 36px',
            background: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontFamily: '\'DM Sans\',sans-serif',
            fontSize: '15px', fontWeight: 600,
            color: 'var(--sea)',
            cursor: 'pointer',
            letterSpacing: '0.04em',
            transform: hovBook ? 'translateY(-2px)' : 'none',
            boxShadow: hovBook ? '0 12px 32px rgba(0,0,0,0.2)' : 'none',
            transition: 'all 0.25s ease',
          }"
        >Book a Transfer</button>

        <!-- WhatsApp -->
        <a
          href="https://wa.me/306980911843"
          target="_blank"
          rel="noopener noreferrer"
          @mouseenter="hovWa = true"
          @mouseleave="hovWa = false"
          :style="{
            padding: '16px 32px',
            background: '#25D366',
            borderRadius: '6px',
            color: '#fff',
            fontFamily: '\'DM Sans\',sans-serif',
            fontWeight: 600,
            fontSize: '15px',
            textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '10px',
            transform: hovWa ? 'translateY(-2px)' : 'none',
            boxShadow: hovWa ? '0 12px 32px rgba(37,211,102,0.35)' : 'none',
            transition: 'all 0.25s ease',
          }"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.28 7.041L.787 23.426l4.516-1.433A11.936 11.936 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.784 9.784 0 01-5.053-1.405l-.362-.215-3.757 1.192 1.205-3.667-.234-.376A9.787 9.787 0 012.182 12c0-5.422 4.396-9.818 9.818-9.818 5.422 0 9.818 4.396 9.818 9.818 0 5.422-4.396 9.818-9.818 9.818z"/>
          </svg>
          WhatsApp Us
        </a>
      </div>
    </div>
  </section>
</template>
