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
