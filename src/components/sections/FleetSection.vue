<script setup>
import { ref, onMounted } from 'vue';
import { useGsap } from '../../composables/useGsap';
import fleetImage from '../../assets/Fleet-ETP.png';

const sectionRef = ref(null);
const imageRef = ref(null);

const { gsap, createContext } = useGsap();

const features = [
  { number: '8', label: 'Passenger Seats' },
  { number: '4', label: 'Premium Vehicles' },
  { number: '24/7', label: 'Availability' }
];

onMounted(() => {
  setTimeout(() => {
    createContext(() => {
      // Image scale animation on scroll
      gsap.from(imageRef.value, {
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      // Heading animation
      gsap.from('.fleet-heading', {
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });

      // Features animation
      gsap.from('.fleet-feature', {
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 60%',
          toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out'
      });

      // Description animation
      gsap.from('.fleet-description', {
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });

    }, sectionRef.value);
  }, 100);
});
</script>

<template>
  <section
    ref="sectionRef"
    class="relative py-24 md:py-32 px-4 bg-etp-dark overflow-hidden"
  >
    <div class="max-w-6xl mx-auto">
      <!-- Heading -->
      <div class="fleet-heading text-center mb-12 md:mb-16">
        <span class="text-etp-gold text-sm tracking-widest uppercase mb-4 block">Our Fleet</span>
        <h2 class="font-heading text-3xl md:text-5xl text-white">
          Travel in <span class="text-etp-gold">Style & Comfort</span>
        </h2>
      </div>

      <!-- Fleet Image -->
      <div
        ref="imageRef"
        class="relative mb-12 md:mb-16"
      >
        <div class="relative mx-auto max-w-4xl">
          <img
            :src="fleetImage"
            alt="Mercedes V-Class Fleet"
            class="w-full h-auto object-contain"
          />
          <!-- Subtle glow effect -->
          <div class="absolute inset-0 bg-gradient-radial from-etp-gold/10 to-transparent opacity-50 pointer-events-none"></div>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-16">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="fleet-feature text-center"
        >
          <div class="text-3xl md:text-5xl font-heading text-etp-gold mb-2">
            {{ feature.number }}
          </div>
          <div class="text-white/70 text-sm md:text-base uppercase tracking-wider">
            {{ feature.label }}
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="fleet-description max-w-3xl mx-auto text-center">
        <p class="text-white/80 text-lg md:text-xl leading-relaxed mb-6">
          Our Mercedes V-Class vehicles offer the perfect blend of luxury and practicality.
          With spacious interiors, premium leather seating, and climate control, every journey
          becomes an experience worth remembering.
        </p>
        <ul class="flex flex-wrap justify-center gap-4 md:gap-6 text-white/60 text-sm">
          <li class="flex items-center">
            <svg class="w-4 h-4 text-etp-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            Air Conditioning
          </li>
          <li class="flex items-center">
            <svg class="w-4 h-4 text-etp-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            Leather Seats
          </li>
          <li class="flex items-center">
            <svg class="w-4 h-4 text-etp-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            USB Charging
          </li>
          <li class="flex items-center">
            <svg class="w-4 h-4 text-etp-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            Luggage Space
          </li>
          <li class="flex items-center">
            <svg class="w-4 h-4 text-etp-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            WiFi Available
          </li>
        </ul>
      </div>
    </div>

    <!-- Decorative elements -->
    <div class="absolute top-0 left-0 w-64 h-64 bg-etp-gold/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-etp-gold/5 rounded-full blur-3xl"></div>
  </section>
</template>

<style scoped>
.bg-gradient-radial {
  background: radial-gradient(circle, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 70%);
}
</style>
