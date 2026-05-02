<script setup>
import { onMounted } from 'vue';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar.vue';
import HeroSequenceSection from '../components/sections/HeroSequenceSection.vue';
import StatsSection from '../components/sections/StatsSection.vue';
import ServicesCarousel from '../components/sections/ServicesCarousel.vue';
import FleetSection from '../components/sections/FleetSection.vue';
import ReviewsSection from '../components/sections/ReviewsSection.vue';
import PersistentCTA from '../components/ui/PersistentCTA.vue';

onMounted(() => {
  // All children have mounted and inserted their pin spacers synchronously.
  // One rAF defers to after the browser's first layout pass, which lets
  // dynamic viewport units (dvh) resolve — critical for mobile accuracy.
  requestAnimationFrame(() => ScrollTrigger.refresh());
});
</script>

<template>
  <div class="min-h-screen bg-etp-dark">
    <Navbar />
    <HeroSequenceSection />
    <StatsSection />
    <ServicesCarousel />
    <FleetSection />
    <ReviewsSection />
    <PersistentCTA />
  </div>
</template>
