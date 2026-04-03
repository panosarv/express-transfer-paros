<script setup>
import { ref, onMounted } from 'vue';
import { useGsap } from '../../composables/useGsap';
import windowFrame from '../../assets/Layer1-ETP.png';
import sceneryBg from '../../assets/Layer2-ETP.jpg';

const heroRef = ref(null);
const windowFrameRef = ref(null);
const tintRef = ref(null);
const sceneryRef = ref(null);

const { gsap, createContext } = useGsap();

onMounted(() => {
  setTimeout(() => {
    createContext(() => {
      // Main timeline for hero section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.value,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });

      // Layer 1 (Window Frame) - zooms in and disappears from focus
      tl.to(windowFrameRef.value, {
        scale: 2.5,
        yPercent: 60,
        opacity: 0,
        ease: 'power1.in',
        duration: 1
      }, 0);

      // Tint - rolls down (moves down off screen)
      tl.to(tintRef.value, {
        yPercent: 100,
        ease: 'power1.inOut',
        duration: 1
      }, 0);

      // Scenery zooms in and pans to show lower parts
      tl.to(sceneryRef.value, {
        scale: 1.3,
        yPercent: -15,
        ease: 'power1.out',
        duration: 1
      }, 0);

    }, heroRef.value);
  }, 100);
});
</script>

<template>
  <section
    ref="heroRef"
    class="relative w-full h-screen overflow-hidden bg-etp-dark"
  >
    <!-- Scenery Background Layer - starts showing MIDDLE of tall image -->
    <div
      ref="sceneryRef"
      class="absolute w-full h-[200%] -top-1/2 left-0 right-0 will-change-transform"
    >
      <img
        :src="sceneryBg"
        alt="Paros Scenery"
        class="w-full h-full object-cover object-center"
      />
    </div>

    <!-- Tint Overlay - rolls DOWN separately -->
    <div
      ref="tintRef"
      class="absolute inset-0 z-10 will-change-transform pointer-events-none"
    >
      <div class="w-full h-full bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
    </div>

    <!-- Window Frame (Layer 1) - zooms in and fades out -->
    <div
      ref="windowFrameRef"
      class="absolute inset-0 w-full h-full z-20 will-change-transform"
      style="transform-origin: center center;"
    >
      <div class="relative w-full h-full animate-jiggle">
        <img
          :src="windowFrame"
          alt="Car Window Frame"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <!-- Initial Text - visible before scrolling -->
    <div class="absolute inset-x-0 top-0 z-30 pointer-events-none">
      <div class="flex justify-between items-start p-6 md:p-10">
        <!-- Top Left - Premium Transfer -->
        <div class="text-white">
          <span class="text-xs md:text-sm tracking-[0.3em] uppercase text-white/70">Premium</span>
          <h2 class="font-heading text-2xl md:text-4xl lg:text-5xl text-white drop-shadow-lg">
            Transfer
          </h2>
        </div>

        <!-- Top Right - Express Transfer Paros -->
        <div class="text-white text-right">
          <span class="text-xs md:text-sm tracking-[0.3em] uppercase text-white/70">Express Transfer</span>
          <h2 class="font-heading text-2xl md:text-4xl lg:text-5xl gradient-text drop-shadow-lg">
            Paros
          </h2>
        </div>
      </div>
    </div>

    <!-- Center tagline -->
    <div class="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
      <div class="text-center px-4">
        <p class="text-white/90 text-lg md:text-2xl lg:text-3xl font-light tracking-wide drop-shadow-lg">
          Discover the Island in Style
        </p>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 animate-float">
      <div class="flex flex-col items-center text-white/70">
        <span class="text-sm mb-2 tracking-widest uppercase">Scroll</span>
        <svg
          class="w-6 h-6 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #d9b16b 0%, #B4952E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.will-change-transform {
  will-change: transform, opacity;
}

/* Subtle jiggle for the window frame */
@keyframes subtleJiggle {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  20% {
    transform: translate(0.3px, 0.5px) rotate(0.05deg);
  }
  40% {
    transform: translate(-0.2px, 0.3px) rotate(-0.03deg);
  }
  60% {
    transform: translate(0.2px, -0.2px) rotate(0.02deg);
  }
  80% {
    transform: translate(-0.15px, 0.25px) rotate(-0.02deg);
  }
}

.animate-jiggle {
  animation: subtleJiggle 0.15s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-jiggle {
    animation: none;
  }
}
</style>
