<template>
  <div class="relative h-screen bg-[#232436]">
    <div class="absolute inset-0">
      <img 
        src="../assets/etp-hero-4.jpg" 
        class="w-full h-full object-cover"
        alt="Paros Transfer"
      />
      <div class="absolute inset-0 bg-black opacity-50"></div>
    </div>
    
    <div class="relative max-w-7xl mx-auto h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center md:text-left">
      <div class="w-full md:w-2/3 mt-12 md:mt-0">
        <Transition
          appear
          enter-active-class="transition duration-1000"
          enter-from-class="opacity-0 translate-y-6"
          enter-to-class="opacity-100 translate-y-0"
        >
          <h1 class="text-3xl sm:text-4xl md:text-6xl font-bold text-[#E5E5E5] mb-6 flex items-center justify-center">
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
            Express Transfer Paros is dedicated to providing a seamless and comfortable travel experience across Paros. With a focus on security, reliability, and customer satisfaction, our professional drivers ensure a stress-free journey. Whether you're heading to the airport, a hotel, or a scenic destination, you can trust us for a premium transfer service tailored to your needs.
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
import { RouterLink } from 'vue-router';
const scrollToBooking = () => {
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
};
function callNow() {
  window.location.href = `tel:+306980911843`;
}
</script>
