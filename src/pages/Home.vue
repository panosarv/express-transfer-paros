<script setup>
import Navbar from '../components/Navbar.vue';
import HeroWindowSection from '../components/sections/HeroWindowSection.vue';
import AboutSection from '../components/sections/AboutSection.vue';
import StatsSection from '../components/sections/StatsSection.vue';
import ServicesCarousel from '../components/sections/ServicesCarousel.vue';
import FleetSection from '../components/sections/FleetSection.vue';
import ReviewsSection from '../components/sections/ReviewsSection.vue';
import PersistentCTA from '../components/ui/PersistentCTA.vue';
</script>

<template>
  <div class="min-h-screen bg-etp-dark overflow-x-hidden">
    <!-- Navigation -->
    <Navbar />

    <!-- Hero Section with Car Window Effect -->
    <HeroWindowSection />

    <!-- About Section with Fade-in Animations -->
    <AboutSection />

    <!-- Stats Section with Counter Animations -->
    <StatsSection />

    <!-- Services Section with Steering Wheel Carousel -->
    <ServicesCarousel />

    <!-- Fleet Section -->
    <FleetSection />

    <!-- Reviews Section -->
    <ReviewsSection />

    <!-- Persistent CTA (Book Now, Call, WhatsApp) -->
    <PersistentCTA />
  </div>
</template>
