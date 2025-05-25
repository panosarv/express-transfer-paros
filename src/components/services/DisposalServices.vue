<template>
  <section class="disposal-services">
    <!-- Hero Image -->
    <div class="relative">
      <img
        src="https://images.unsplash.com/photo-1608340173100-5e36d2a76e91?q=80&w=2400&auto=format&fit=crop"
        alt="Disposal Services"
        class="w-full h-96 object-cover"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <h1 class="text-white text-5xl font-bold">Disposal Services</h1>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto py-12 px-4">
      <!-- Description -->
      <p class="text-gray-700 mb-6 text-justify">
        Our disposal services provide comprehensive luggage handling, ensuring your bags are transported safely and efficiently to any destination on the island. We offer prompt waste removal with eco-friendly practices, keeping venues and accommodations spotless throughout your stay. Our team handles equipment transport of all sizes, from event gear to camping supplies, with care and professionalism. Ideal for large groups, special events, or any time you need extra logistical support, we adapt to your schedule and requirements. Trust our dedicated crew to handle the heavy lifting so you can focus on enjoying Paros without worry.
      </p>

      <!-- Accordion for Additional Info -->
      <details class="border border-gray-200 rounded-md">
        <summary class="cursor-pointer font-semibold px-4 py-2 bg-gray-100">Additional Info</summary>
        <ul class="grid grid-cols-2 gap-2 mt-2 px-4 pb-4">
          <li class="flex items-start">
            <span class="mr-2 text-[#d9b16b]">✔</span>
            <span class="text-gray-700">Luggage handling</span>
          </li>
          <li class="flex items-start">
            <span class="mr-2 text-[#d9b16b]">✔</span>
            <span class="text-gray-700">Waste removal</span>
          </li>
          <li class="flex items-start">
            <span class="mr-2 text-[#d9b16b]">✔</span>
            <span class="text-gray-700">Equipment transport</span>
          </li>
          <li class="flex items-start">
            <span class="mr-2 text-[#d9b16b]">✔</span>
            <span class="text-gray-700">Event support</span>
          </li>
          <li class="flex items-start">
            <span class="mr-2 text-[#d9b16b]">✔</span>
            <span class="text-gray-700">Large group logistics</span>
          </li>
          <li class="flex items-start">
            <span class="mr-2 text-[#d9b16b]">✔</span>
            <span class="text-gray-700">Flexible scheduling</span>
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
// No additional logic required at this time
</script>

<style scoped>
.disposal-services p {
  line-height: 1.75;
}
</style>