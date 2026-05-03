<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['book']);

const visible = ref(false);
const hovBook = ref(false);
const hovWa   = ref(false);
const hovCall = ref(false);

function onScroll() {
  visible.value = window.scrollY > window.innerHeight * 0.2;
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <!-- Floating sticky bar — slides up after 20vh scroll -->
  <div
    class="fixed bottom-7 left-1/2 z-[300] flex gap-2.5 pointer-events-none"
    :style="{
      transform: `translateX(-50%) translateY(${visible ? 0 : 80}px)`,
      transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
      pointerEvents: visible ? 'auto' : 'none',
    }"
  >
    <!-- Book Now pill -->
    <button
      @click="emit('book')"
      @mouseenter="hovBook = true"
      @mouseleave="hovBook = false"
      class="flex items-center gap-2.5 py-3 pl-4 pr-4 rounded-full cursor-pointer border transition-all duration-300"
      :style="{
        background: hovBook
          ? 'linear-gradient(135deg,#1e5f8c,#0d2137)'
          : 'linear-gradient(135deg,#0d2137,#1e5f8c)',
        borderColor: 'rgba(232,201,126,0.6)',
        boxShadow: hovBook
          ? '0 8px 32px rgba(13,33,55,0.5),0 0 0 3px rgba(232,201,126,0.25)'
          : '0 4px 24px rgba(13,33,55,0.4)',
        animation: 'ctaPulse 3s ease-in-out infinite',
      }"
    >
      <!-- Animated car SVG -->
      <svg
        viewBox="0 0 48 24"
        class="block flex-shrink-0"
        :style="{
          width: '36px', height: '18px',
          animation: hovBook ? 'carWiggle 0.5s ease-in-out infinite' : 'none',
          transformOrigin: 'center',
        }"
        fill="none"
      >
        <path d="M4 15 L4 10 Q5 7 9 5 L22 4 Q30 4 34 6 L43 9 Q45 10 45 13 L45 15 Z"
          fill="#0d2137" stroke="#e8c97e" stroke-width="1"/>
        <path d="M9 5 Q14 1 22 1 L30 1 Q36 1 38 5"
          fill="none" stroke="#7ec8e3" stroke-width="1"/>
        <path d="M10 5 L12 2 L21 2 L21 5 Z" fill="#7ec8e3" opacity="0.7"/>
        <path d="M22 2 L29 2 L32 5 L22 5 Z" fill="#7ec8e3" opacity="0.7"/>
        <line x1="22" y1="5" x2="22" y2="14" stroke="#e8c97e" stroke-width="0.7" opacity="0.5"/>
        <line x1="5" y1="12" x2="43" y2="12" stroke="#1e5f8c" stroke-width="0.6" opacity="0.6"/>
        <path d="M43 13 L47 14 L47 16 L43 16 Z" fill="#1e5f8c"/>
        <path d="M4 13 L1 14 L1 16 L4 16 Z" fill="#1e5f8c"/>
        <ellipse cx="44" cy="11" rx="2" ry="1.2" fill="#e8c97e" :opacity="hovBook ? 1 : 0.5"/>
        <rect x="1.5" y="9" width="2.5" height="4" rx="1" fill="#ff6b6b" opacity="0.8"/>
        <!-- Rear wheel -->
        <circle cx="12" cy="17" r="4.5" fill="#0a1628" stroke="#7ec8e3" stroke-width="1"/>
        <circle cx="12" cy="17" r="2" fill="#1e5f8c" stroke="#e8c97e" stroke-width="0.7"
          :style="{ transformOrigin:'12px 17px', animation: hovBook ? 'wheelSpin 0.4s linear infinite' : 'none' }"/>
        <!-- Front wheel -->
        <circle cx="36" cy="17" r="4.5" fill="#0a1628" stroke="#7ec8e3" stroke-width="1"/>
        <circle cx="36" cy="17" r="2" fill="#1e5f8c" stroke="#e8c97e" stroke-width="0.7"
          :style="{ transformOrigin:'36px 17px', animation: hovBook ? 'wheelSpin 0.4s linear infinite' : 'none' }"/>
      </svg>

     
    </button>

    <!-- WhatsApp circle -->
    <a
      href="https://wa.me/306980911843"
      target="_blank"
      rel="noopener noreferrer"
      @mouseenter="hovWa = true"
      @mouseleave="hovWa = false"
      class="flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0 transition-all duration-300 no-underline"
      :style="{
        background: hovWa ? '#25D366' : 'rgba(13,33,55,0.75)',
        border: '1.5px solid rgba(37,211,102,0.5)',
        backdropFilter: 'blur(20px)',
        boxShadow: hovWa ? '0 4px 24px rgba(37,211,102,0.4)' : '0 4px 24px rgba(13,33,55,0.35)',
      }"
      aria-label="Chat on WhatsApp"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" :fill="hovWa ? '#fff' : '#25D366'">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.28 7.041L.787 23.426l4.516-1.433A11.936 11.936 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.784 9.784 0 01-5.053-1.405l-.362-.215-3.757 1.192 1.205-3.667-.234-.376A9.787 9.787 0 012.182 12c0-5.422 4.396-9.818 9.818-9.818 5.422 0 9.818 4.396 9.818 9.818 0 5.422-4.396 9.818-9.818 9.818z"/>
      </svg>
    </a>

    <!-- Call Now pill -->
    <a
      href="tel:+306980911843"
      @mouseenter="hovCall = true"
      @mouseleave="hovCall = false"
      class="flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0 transition-all duration-300 no-underline"      :style="{
        background: hovCall ? 'rgba(232,201,126,0.18)' : 'rgba(13,33,55,0.75)',
        border: '1.5px solid rgba(232,201,126,0.4)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 24px rgba(13,33,55,0.35)',
      }"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" class="flex-shrink-0">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
          :fill="hovCall ? '#e8c97e' : 'rgba(255,255,255,0.85)'"/>
      </svg>
     
    </a>
  </div>
</template>
