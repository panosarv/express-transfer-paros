<script setup>
import { ref, onMounted } from 'vue';
import { useGsap } from '../../composables/useGsap';
import AnimatedCounter from '../ui/AnimatedCounter.vue';
import carImage from '../../assets/CarMoving-ETP.png';

const sectionRef = ref(null);
const carRef = ref(null);
const statsRef = ref(null);

const { gsap, createContext } = useGsap();

const stats = [
  { target: 3, suffix: '+', label: 'Years of Experience' },
  { target: 2000, suffix: '+', label: 'Trips Completed' },
  { target: 10000, suffix: '+', label: 'Happy Clients' }
];

onMounted(() => {
  setTimeout(() => {
    createContext(() => {
      // Pin the section while car travels across
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      // Set initial position off-screen right
      gsap.set(carRef.value, { left: '100%', x: '100%' });

      // Heading and stats fade in immediately at the start
      tl.from('.stats-heading', {
        opacity: 0,
        y: 30,
        ease: 'power2.out',
        duration: 0.1
      }, 0);

      tl.from(statsRef.value, {
        opacity: 0,
        y: 40,
        ease: 'power2.out',
        duration: 0.1
      }, 0.02);

      // Car enters from right, crosses screen (0.05 to 0.6)
      // Car passes in front of the numbers
      tl.to(carRef.value, {
        left: '0%',
        x: '-100%',
        ease: 'none',
        duration: 0.55
      }, 0.05);

      // Hold at the end for counters to finish (0.6 to 1.0)

    }, sectionRef.value);
  }, 100);
});
</script>

<template>
  <section
    ref="sectionRef"
    class="relative py-24 md:py-32 px-4 bg-etp-cream"
  >
    <!-- Moving Car - starts off-screen right, passes in front of content -->
    <div
      ref="carRef"
      class="absolute top-1/2 -translate-y-1/2 z-30 will-change-transform pointer-events-none"
    >
      <img
        :src="carImage"
        alt="Express Transfer Car"
        class="h-32 md:h-48 lg:h-64 w-auto object-contain"
      />
    </div>

    <!-- Decorative road line -->
    <div class="absolute top-1/2 left-0 right-0 h-1 bg-etp-dark/10 -translate-y-1/2 z-0"></div>

    <!-- Content -->
    <div class="max-w-6xl mx-auto relative z-20">
      <!-- Heading -->
      <div class="stats-heading text-center mb-16 md:mb-20">
        <span class="text-etp-gold-dark text-sm tracking-widest uppercase mb-4 block">Our Journey</span>
        <h2 class="font-heading text-3xl md:text-5xl text-etp-dark">
          Numbers That <span class="text-etp-gold-dark">Speak</span>
        </h2>
      </div>

      <!-- Stats Grid -->
      <div
        ref="statsRef"
        class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
      >
        <AnimatedCounter
          v-for="(stat, index) in stats"
          :key="index"
          :target="stat.target"
          :suffix="stat.suffix"
          :label="stat.label"
          :duration="2 + index * 0.3"
        />
      </div>

      <!-- Tagline -->
      <p class="text-center mt-16 text-etp-dark/60 text-lg md:text-xl max-w-2xl mx-auto">
        Every number represents a story of trust, comfort, and unforgettable journeys across Paros.
      </p>
    </div>

    <!-- Subtle pattern overlay -->
    <div class="absolute inset-0 opacity-5 pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23232436\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
  </section>
</template>

<style scoped>
.will-change-transform {
  will-change: transform;
}
</style>
