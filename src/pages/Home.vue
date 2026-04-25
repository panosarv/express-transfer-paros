<script setup>
import Navbar from '../components/Navbar.vue';
import HeroSequenceSection from '../components/sections/HeroSequenceSection.vue';
import AboutSection from '../components/sections/AboutSection.vue';
import StatsSection from '../components/sections/StatsSection.vue';
import ServicesCarousel from '../components/sections/ServicesCarousel.vue';
import FleetSection from '../components/sections/FleetSection.vue';
import ReviewsSection from '../components/sections/ReviewsSection.vue';
import PersistentCTA from '../components/ui/PersistentCTA.vue';
</script>

<template>
  <div class="min-h-screen bg-etp-dark overflow-x-hidden">
    <Navbar />
    <HeroSequenceSection />
    <AboutSection />
    <StatsSection />
    <ServicesCarousel />
    <FleetSection />
    <ReviewsSection />
    <PersistentCTA />
  </div>
</template>
