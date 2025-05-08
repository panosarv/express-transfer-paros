<template>
  <div ref="aboutSection" class="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#232436] to-[#2C2C2C]" id="contact">
    <div class="max-w-7xl mx-auto text-center mb-12">
      <h2 class="text-xl tracking-widest uppercase text-white font-theme-heading mb-2">Ready to explore Paros with us?</h2>
      <p class="text-white mb-6">Choose any of the methods below to contact Express Transfer Paros:</p>
    </div>

    <!-- Contact and Counters Section -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Contact Options Column -->
      <div>
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

      <!-- Counters Column -->
      <div ref="aboutSection" class="flex flex-col items-center justify-center space-y-8 counters">
        <div class="counter text-center">
          <span class="count" data-start="2000" data-target="2500">2000</span><span class="plus">+</span>
          <p class="label text-gray-300 mt-2">Completed rides</p>
        </div>
        <div class="counter text-center">
          <span class="count" data-start="7000" data-target="8000">7000</span><span class="plus">+</span>
          <p class="label text-gray-300 mt-2">Satisfied customers</p>
        </div>
        <div class="counter text-center">
          <span class="count" data-start="1" data-target="5">1</span><span class="plus">+</span>
          <p class="label text-gray-300 mt-2">Years of experience</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const aboutSection = ref(null);

function animateCounters() {
  const counters = aboutSection.value.querySelectorAll('.count');
  const duration = 2000; // total animation time in ms

  counters.forEach(counter => {
    const start = +counter.getAttribute('data-start') || 0;
    const target = +counter.getAttribute('data-target');
    const range = target - start;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      counter.textContent = Math.floor(start + range * progress);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    }

    requestAnimationFrame(update);
  });
}

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry], obs) => {
      if (entry.isIntersecting) {
        animateCounters();
        obs.unobserve(entry.target);
      }
    },
    { threshold: 0.3 }
  );
  if (aboutSection.value) observer.observe(aboutSection.value);
});
</script>


<style scoped>
.counter .count {
  display: inline-block;
  font-size: 2.5rem;
  font-weight: bold;
  color: #cba671;
}
.counter .plus {
  font-size: 1.5rem;
  font-weight: bold;
  color: #cba671;
}
.label {
  font-size: 1rem;
}
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
