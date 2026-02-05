<template>
  <div class="relative h-screen bg-[#232436] overflow-hidden">
    <!-- Video background container -->
    <div class="absolute inset-0 z-0">
      <transition name="fade" mode="out-in">
        <video
          :key="videos[currentIndex]"
          ref="heroVideo"
          :src="videos[currentIndex]"
          class="w-full h-full object-cover"
          autoplay
          muted
          playsinline
          @ended="nextVideo"
        ></video>
      </transition>
      <!-- Dark overlay over video -->
      <div class="absolute inset-0 bg-black opacity-50"></div>
    </div>

    <!-- Hero content above video -->
    <div class="relative z-10 max-w-7xl mx-auto h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center md:text-left">
      <div class="w-full md:w-2/3 mt-12 md:mt-0">
        <Transition
          appear
          enter-active-class="transition duration-1000"
          enter-from-class="opacity-0 translate-y-6"
          enter-to-class="opacity-100 translate-y-0"
        >
          <h1 class="text-3xl sm:text-4xl md:text-6xl font-bold text-[#E5E5E5] mb-6">
            Express Transfer Paros
          </h1>
        </Transition>

        <Transition
          appear
          enter-active-class="transition duration-1000 delay-300"
          enter-from-class="opacity-0 translate-y-6"
          enter-to-class="opacity-100 translate-y-0"
        >
          <p class="text-lg sm:text-xl md:text-2xl text-[#E5E5E5] mb-8 text-justify md:text-justify">
            We provide a seamless and reliable experience from the moment you arrive. From airport and port pickups to full-day private drivers, island tours, weddings, bachelor parties and more, every ride is tailored to your needs, with professional service that reflects the warmth and hospitality of Paros.
          </p>
        </Transition>

        <Transition
          appear
          enter-active-class="transition duration-1000 delay-500"
          enter-from-class="opacity-0 translate-y-6"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div class="mt-6 flex justify-center md:justify-start">
            <button
              @click="callNow"
              class="bg-[#d9b16b] text-[#232436] px-8 py-4 rounded-lg text-2xl font-semibold hover:bg-[#B4952E] transition-colors w-full sm:w-auto"
            >
              Call us
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { trackCallButtonClick } from '../utils/analytics';

import videoBanner1 from '../assets/etp-hero-banner-1.mp4';
import videoBanner2 from '../assets/etp-hero-banner-2.mp4';
// Video sources
const videos = [
  videoBanner1,
  videoBanner2,
  // Add more video sources as needed
];

const currentIndex = ref(0);
const heroVideo = ref(null);

// Advance to next video on end
function nextVideo() {
  currentIndex.value = (currentIndex.value + 1) % videos.length;
  nextTick(() => {
    heroVideo.value?.play();
  });
}

function callNow() {
  // Track the call button click for Google Analytics & Ads conversion
  // Navigation is deferred to the callback so the event is sent before the browser navigates away
  trackCallButtonClick(() => {
    window.location.href = 'tel:+306980911843';
  });
}
</script>

<style scoped>
/* Fade transition for videos */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
