<script setup>
import { ref } from 'vue';
import BookingDrawer from './BookingDrawer.vue';

const isDrawerOpen = ref(false);

function openDrawer() {
  isDrawerOpen.value = true;
}
</script>

<template>
  <!-- Persistent Bottom CTA Bar -->
  <div class="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-safe">
    <!-- Gradient fade for visual polish -->
    <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>

    <!-- Buttons Container -->
    <div class="relative flex justify-center items-center gap-4 pb-6 px-4 pointer-events-auto">
      <!-- Call Button -->
      <a
        href="tel:+306980911843"
        class="flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg hover:scale-105 transition-transform"
        aria-label="Call us"
      >
        <svg class="w-6 h-6 text-etp-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </a>

      <!-- Book Now Button -->
      <button
        @click="openDrawer"
        class="flex items-center justify-center px-8 py-4 bg-etp-gold text-etp-dark rounded-full font-semibold text-lg shadow-lg hover:bg-etp-gold-dark hover:scale-105 transition-all pulse-cta"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Book Now
      </button>
    </div>
  </div>

  <!-- WhatsApp Widget (Right Side) -->
  <a
    href="https://wa.me/306980911843"
    target="_blank"
    rel="noopener noreferrer"
    class="fixed bottom-24 right-4 z-50 flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg hover:bg-green-600 hover:scale-105 transition-all"
    aria-label="Chat on WhatsApp"
  >
    <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </a>

  <!-- Booking Drawer -->
  <BookingDrawer v-model:open="isDrawerOpen" />
</template>

<style scoped>
/* Pulse animation for Book Now button */
@keyframes pulse-cta {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(217, 177, 107, 0.4);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(217, 177, 107, 0);
  }
}

.pulse-cta {
  animation: pulse-cta 2.5s ease-in-out infinite;
}

/* Safe area padding for mobile devices */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0);
}
</style>
