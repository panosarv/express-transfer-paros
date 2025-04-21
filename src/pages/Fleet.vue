<template>
  <section class="fleet-section rounded-xl shadow-xl bg-white py-12  flex flex-col justify-between pt-16">
    <div class="max-w-5xl mx-auto px-4">
      <!-- Header -->
      <Transition
        appear
        enter-active-class="transition duration-1000"
        enter-from-class="opacity-0 translate-y-6"
        enter-to-class="opacity-100 translate-y-0"
      >
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 text-center mb-8">
          Our Fleet
        </h2>
      </Transition>

      <!-- Vehicles grid -->
      <div class="grid gap-8 grid-cols-1 sm:grid-cols-2 justify-items-center">
        <div
          v-for="(vehicle, idx) in vehicles"
          :key="idx"
          class="vehicle-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <img
            :src="vehicle.image"
            :alt="vehicle.name"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              {{ vehicle.name }}
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ vehicle.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { Transition } from 'vue';
import peugeotImage from '../assets/features-car-1.png';
import c3Image from '../assets/features-car-2.png';
import vclassImage from '../assets/features-car-3.png';
import vitoImage from '../assets/hero-car-3.png';

export default {
  name: 'FleetSection',
  components: { Transition },
  data() {
    return {
      vehicles: [
        {
          name: 'Peugeot 3008',
          image: peugeotImage,
          description: 'Compact SUV seating up to 5 passengers, featuring spacious trunk, comfortable ride, and modern safety features.'
        },
        {
          name: 'Citroën C3',
          image: c3Image,
          description: 'Efficient hatchback ideal for city drives, offering nimble handling, fuel economy, and comfy interior.'
        },
        {
          name: 'Mercedes Vito',
          image: vitoImage,
          description: 'Luxury 7-seater MPV with premium leather seating, climate control, and VIP comfort for your journey.'
        },
        {
          name: 'Mercedes V-Class',
          image: vclassImage,
          description: 'Versatile 8-seater van, perfect for group transfers, with generous legroom and ample luggage capacity.'
        },
        
      ]
    };
  }
};
</script>

<style scoped>
.fleet-section {
  background: white;
}
.vehicle-card {
  transform: translateY(0);
}
.vehicle-card:hover {
  transform: translateY(-5px);
}
</style>
