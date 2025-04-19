<script setup>
import Navbar from './components/Navbar.vue'
import ContactSection from './components/ContactSection.vue';

</script>

<template>
  <div class="bg-[#232436]-50 min-h-screen">
    <Navbar />
    <router-view />
    <ContactSection />
  </div>
</template>