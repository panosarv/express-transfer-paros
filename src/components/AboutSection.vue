<template>
  <div ref="aboutSection" class="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#232436] to-[#2C2C2C]" id="contact">
    <div class="max-w-7xl mx-auto text-center mb-12">
   
    </div>

    <!-- Contact and Map Section -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Contact Options Column -->
      <div>
        <h2 class="text-xl tracking-widest uppercase text-white font-theme-heading mb-2">Ready to explore Paros with us?</h2>
        <p class="text-white mb-6">Choose any of the methods below to contact Express Transfer Paros:</p>
        <div class="flex flex-col space-y-4">
          <div class="card bg-white">
            <a href="mailto:info@expresstransferparos.com" class="block p-4 text-center text-[#232436] flex flex-col items-center">
              <img src="../assets/icons/email.svg" alt="Email" class="mx-auto mb-2 w-12 h-12" />
              <h3 class="text-lg font-bold">Email</h3>
            </a>
          </div>
          <div class="card bg-white">
            <a href="https://wa.me/306980911843" class="block p-4 text-center text-[#232436] flex flex-col items-center">
              <img src="../assets/icons/whatsapp.svg" alt="WhatsApp" class="mx-auto mb-2 w-12 h-12" />
              <h3 class="text-lg font-bold">WhatsApp</h3>
            </a>
          </div>
          <div class="card bg-white">
            <a href="tel:+306980911843" class="block p-4 text-center text-[#232436] flex flex-col items-center">
              <img src="../assets/icons/phone.svg" alt="Phone" class="mx-auto mb-2 w-12 h-12" />
              <h3 class="text-lg font-bold">Phone</h3>
            </a>
          </div>
        </div>
      </div>

      <!-- Map Column -->
      <div>
        <div class="w-full h-full rounded-lg overflow-hidden shadow-md">
          <iframe
            src="https://maps.google.com/maps?q=Paros,%20Greece&z=12&output=embed"
            frameborder="0"
            class="w-full h-full"
            allowfullscreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Transition } from 'vue';

const aboutSection = ref(null);
let totalSlides = 0;
let index = ref(0);

onMounted(() => {
  // Intersection Observer to toggle background
  const observer = new IntersectionObserver(
    ([entry]) => {
      // No dynamic toggling needed here
    },
    { threshold: 0.3 }
  );

  if (aboutSection.value) {
    observer.observe(aboutSection.value);
  }
});
</script>

<style scoped>
.card {
  width: 100%;
  transition: transform 0.3s ease-in-out;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.card:hover {
  transform: scale(1.05);
  border: 2px solid #cba671;
}
</style>