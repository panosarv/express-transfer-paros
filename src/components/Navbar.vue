<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const isMenuOpen = ref(false);
const route = useRoute();
const scrolled = ref(false);

watch(route, () => {
  isMenuOpen.value = false;
});

const handleScroll = () => {
  scrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services/private-transfers', label: 'Transfers' },
  { to: '/services/island-tours', label: 'Tours' },
  { to: '/booking', label: 'Book Now', isButton: true }
];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  // Prevent body scroll when menu is open
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : '';
};
</script>

<template>
  <nav
    class="fixed w-full z-50 transition-all duration-300"
    :class="[
      scrolled
        ? 'py-2 bg-etp-dark/90 backdrop-blur-lg shadow-lg'
        : 'py-4 bg-transparent'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <RouterLink to="/" class="relative z-10">
          <img
            src="/src/assets/etp-logo.png"
            alt="Express Transfer Paros"
            class="h-12 md:h-14 w-auto transition-all duration-300"
            :class="scrolled ? 'brightness-100' : 'brightness-110'"
          />
        </RouterLink>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-8">
          <template v-for="link in navLinks" :key="link.to">
            <RouterLink
              v-if="!link.isButton"
              :to="link.to"
              class="text-sm font-medium tracking-wide text-white/80 hover:text-white transition-colors duration-200 relative group"
            >
              {{ link.label }}
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-etp-gold group-hover:w-full transition-all duration-300"></span>
            </RouterLink>
            <RouterLink
              v-else
              :to="link.to"
              class="px-5 py-2 text-sm font-medium bg-etp-gold text-etp-dark rounded-full hover:bg-etp-gold-dark transition-all duration-200 hover:shadow-lg hover:shadow-etp-gold/20"
            >
              {{ link.label }}
            </RouterLink>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMenu"
          class="md:hidden relative z-10 w-10 h-10 flex items-center justify-center"
          aria-label="Toggle menu"
        >
          <div class="w-6 flex flex-col gap-1.5">
            <span
              class="block h-0.5 bg-white transition-all duration-300 origin-center"
              :class="isMenuOpen ? 'rotate-45 translate-y-2' : ''"
            ></span>
            <span
              class="block h-0.5 bg-white transition-all duration-300"
              :class="isMenuOpen ? 'opacity-0 scale-0' : ''"
            ></span>
            <span
              class="block h-0.5 bg-white transition-all duration-300 origin-center"
              :class="isMenuOpen ? '-rotate-45 -translate-y-2' : ''"
            ></span>
          </div>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition name="fade">
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden"
        @click="toggleMenu"
      ></div>
    </Transition>

    <!-- Mobile Menu Drawer -->
    <Transition name="slide">
      <div
        v-if="isMenuOpen"
        class="fixed top-0 right-0 h-full w-72 bg-etp-dark shadow-2xl md:hidden"
      >
        <div class="flex flex-col h-full pt-20 pb-8 px-6">
          <!-- Mobile Nav Links -->
          <div class="flex flex-col gap-2">
            <RouterLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              @click="toggleMenu"
              class="py-3 text-lg font-medium transition-colors duration-200"
              :class="link.isButton
                ? 'mt-4 text-center bg-etp-gold text-etp-dark rounded-full hover:bg-etp-gold-dark'
                : 'text-white/80 hover:text-white border-b border-white/10'"
            >
              {{ link.label }}
            </RouterLink>
          </div>

          <!-- Services Submenu -->
          <div class="mt-6 pt-6 border-t border-white/10">
            <p class="text-xs text-white/40 uppercase tracking-wider mb-3">Services</p>
            <div class="flex flex-col gap-2">
              <RouterLink
                to="/services/private-transfers"
                @click="toggleMenu"
                class="text-sm text-white/60 hover:text-white transition-colors"
              >Private Transfers</RouterLink>
              <RouterLink
                to="/services/island-tours"
                @click="toggleMenu"
                class="text-sm text-white/60 hover:text-white transition-colors"
              >Island Tours</RouterLink>
              <RouterLink
                to="/services/disposal-services"
                @click="toggleMenu"
                class="text-sm text-white/60 hover:text-white transition-colors"
              >Disposal Services</RouterLink>
              <RouterLink
                to="/services/wedding"
                @click="toggleMenu"
                class="text-sm text-white/60 hover:text-white transition-colors"
              >Wedding</RouterLink>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="mt-auto">
            <a
              href="tel:+306944760712"
              class="flex items-center gap-3 text-white/60 hover:text-white transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <span class="text-sm">+30 694 476 0712</span>
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
