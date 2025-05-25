<template>
  <section class="private-transfers">
    <!-- Hero Image -->
    <div class="relative">
      <img
        src="../../assets/etp-private.jpg"
        alt="Private Transfers"
        class="w-full h-96 object-cover"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <h1 class="text-white text-5xl font-bold">Private Transfers</h1>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto py-12 px-4">
      <!-- Description -->
      <p class="text-gray-700 mb-6 text-justify">
        Travel across Paros in comfort and style with our dedicated private transfer services. Whether you’re arriving at the port, stepping off a flight at the airport, or staying in a secluded villa, we provide seamless door-to-door journeys. Our fleet features well-appointed vehicles, ensuring relaxation and privacy throughout your ride. Every chauffeur is a local expert, offering personalized recommendations and attentive service. Rely on us for punctual, stress-free transportation tailored to your schedule and preferences.
      </p>

      <!-- Accordion for Additional Info -->
      <details class="border border-gray-200 rounded-md">
        <summary class="cursor-pointer font-semibold px-4 py-2 bg-gray-100">Additional Info</summary>
        <ul class="grid grid-cols-2 gap-2 mt-2 px-4 pb-4">
          <li class="flex items-start">
            <span class="mr-2 text-[#d9b16b]">✔</span>
            <span class="text-gray-700">Port pickup & drop-off</span>
          </li>
          <li class="flex items-start">
            <span class="mr-2 text-[#d9b16b]">✔</span>
            <span class="text-gray-700">Airport transfers</span>
          </li>
          <li class="flex items-start">
            <span class="mr-2 text-[#d9b16b]">✔</span>
            <span class="text-gray-700">Villa & hotel service</span>
          </li>
          <li class="flex items-start">
            <span class="mr-2 text-[#d9b16b]">✔</span>
            <span class="text-gray-700">Professional chauffeurs</span>
          </li>
          <li class="flex items-start">
            <span class="mr-2 text-[#d9b16b]">✔</span>
            <span class="text-gray-700">Comfortable vehicles</span>
          </li>
          <li class="flex items-start">
            <span class="mr-2 text-[#d9b16b]">✔</span>
            <span class="text-gray-700">Door-to-door convenience</span>
          </li>
        </ul>
      </details>

      <!-- Contact Button -->
      <div class="mt-8 text-center">
        <router-link
          to="/booking"
          class="inline-block bg-[#d9b16b] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#b4952e] transition-colors"
        >
          Contact Us
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
// No additional logic needed at this time
</script>

<style scoped>
.private-transfers p {
  line-height: 1.75;
}
</style>
