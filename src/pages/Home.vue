<script setup>
import Navbar from '../components/Navbar.vue'
import HeroBanner from '../components/HeroBanner.vue'
import AboutSection from '../components/AboutSection.vue'
import ServicesSection from '../components/ServicesSection.vue'
import MeetTheTeam from '../components/MeetTheTeam.vue'
</script>

<template>
  <div class="min-h-screen bg-[#232436]-50">
    <Navbar />
    <HeroBanner />
    <AboutSection />
    <ServicesSection />
    <div class="relative py-16 px-4 sm:px-6 lg:px-8" id="booking">
      <div class="absolute inset-0">
        <img 
          src="../assets/etp-meetteam.jpg"
          class="w-full h-full object-cover"
          alt="Paros background"
        />
        <div class="absolute inset-0 bg-[#232436]/70 backdrop-blur-sm"></div>
      </div>
      <div class="relative max-w-4xl mx-auto">
        <div class="text-center">
          
        </div>
        <MeetTheTeam />
      </div>
    </div>
  </div>
</template>