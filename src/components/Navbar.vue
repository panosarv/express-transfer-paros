<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const isMenuOpen = ref(false);
const servicesOpen = ref(false);
const route = useRoute();
const isAtTop = ref(true);
const isWhiteBackgroundPage = computed(() => route.path === "/vehicles");

watch(route, () => {
  isMenuOpen.value = false;
  servicesOpen.value = false;
});

const handleScroll = () => {
  isAtTop.value = window.scrollY === 0;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <nav
    class="fixed w-full z-50 transition-all duration-500 backdrop-blur-sm"
    :class="{ 'bg-[#232436]/90 shadow-md text-white': !isAtTop || !isWhiteBackgroundPage,
               'bg-transparent text-black': isAtTop && isWhiteBackgroundPage }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <RouterLink to="/" class="text-xl font-bold text-stone-200"
          :class="{ 'text-black': isAtTop && isWhiteBackgroundPage }"
          style="font-family: 'Poppins', sans-serif;"
        >
          <img src="/src/assets/etp-logo.png" alt="Express Transfer Paros Logo" class="h-20 w-auto transition-all duration-300" />
        </RouterLink>

        <!-- Desktop Menu -->
        <div class="hidden md:flex space-x-8 items-center">
          <RouterLink to="/" class="hover:text-white transition"
            :class="{ 'text-white': !isAtTop || !isWhiteBackgroundPage, 'text-black': isAtTop && isWhiteBackgroundPage }"
          >Home</RouterLink>

          <div class="relative group">
            <button
              class="hover:text-white transition"
              :class="{ 'text-white': !isAtTop || !isWhiteBackgroundPage, 'text-black': isAtTop && isWhiteBackgroundPage }"
            >Our Services</button>
            <div
              class="absolute left-0 mt-2 w-48 bg-white text-black rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
            >
              <RouterLink to="/services/private-transfers" class="block px-4 py-2 hover:bg-gray-100">Private Transfers</RouterLink>
              <RouterLink to="/services/island-tours" class="block px-4 py-2 hover:bg-gray-100">Island Tours</RouterLink>
              <RouterLink to="/services/disposal-services" class="block px-4 py-2 hover:bg-gray-100">Disposal Services</RouterLink>
              <RouterLink to="/services/wedding" class="block px-4 py-2 hover:bg-gray-100">Wedding</RouterLink>
            </div>
          </div>

          <RouterLink to="/book" class="hover:text-white transition"
            :class="{ 'text-white': !isAtTop || !isWhiteBackgroundPage, 'text-black': isAtTop && isWhiteBackgroundPage }"
          >Online Booking</RouterLink>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center">
          <button @click="isMenuOpen = !isMenuOpen" class="text-stone-200 focus:outline-none">
            <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="slide-fade">
      <div v-if="isMenuOpen" class="md:hidden bg-[#232436]/95 backdrop-blur-md">
        <div class="px-4 pt-2 pb-3 space-y-2">
          <RouterLink to="/" class="block text-stone-200 hover:text-white transition py-2">Home</RouterLink>
          <div @click="servicesOpen = !servicesOpen"
               class="block cursor-pointer text-stone-200 hover:text-white transition py-2 flex justify-between items-center">
            <span>Our Services</span>
            <svg :class="{ 'transform rotate-90': servicesOpen }" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
          <div v-if="servicesOpen" class="pl-4 space-y-1">
            <RouterLink to="/services/private-transfers" class="block text-stone-200 hover:text-white transition py-2">Private Transfers</RouterLink>
            <RouterLink to="/services/island-tours" class="block text-stone-200 hover:text-white transition py-2">Island Tours</RouterLink>
            <RouterLink to="/services/disposal-services" class="block text-stone-200 hover:text-white transition py-2">Disposal Services</RouterLink>
            <RouterLink to="/services/wedding" class="block text-stone-200 hover:text-white transition py-2">Wedding</RouterLink>
          </div>
          <RouterLink to="/book" class="block text-stone-200 hover:text-white transition py-2">Online Booking</RouterLink>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style>
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>