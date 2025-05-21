<template>
  <section class="wedding-services">
    <!-- Hero Image -->
    <div class="relative">
      <img
        src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2669&auto=format&fit=crop"
        alt="Wedding Transfers"
        class="w-full h-96 object-cover"
      />
      <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <h1 class="text-white text-5xl font-bold">Wedding Services</h1>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto py-12 px-4">
      <!-- Description -->
      <p class="text-gray-700 mb-6 text-justify">
        Celebrate your special day with seamless elegance and expert care from start to finish. Our wedding transfer services ensure timely guest shuttles and graceful bridal car arrangements in stunning, well-appointed vehicles. Every chauffeur is a consummate professional, trained in hospitality and local insights to provide a personalized experience. From the ceremony site to the reception and beyond, we handle logistics so you can focus on joyous moments. Trust us to craft a luxurious transportation plan that complements your wedding vision flawlessly.
      </p>

      <!-- Accordion for Additional Info -->
      <details class="border border-gray-200 rounded-md">
        <summary class="cursor-pointer font-semibold px-4 py-2 bg-gray-100">Additional Info</summary>
        <ul class="grid grid-cols-2 gap-2 mt-2 px-4 pb-4">
          <li class="flex items-start">
            <span class="mr-2 text-[#d9b16b]">✔</span>
            <span class="text-gray-700">Guest shuttle services</span>
          </li>
          <li class="flex items-start">
            <span class="mr-2 text-[#d9b16b]">✔</span>
            <span class="text-gray-700">Bridal car arrangements</span>
          </li>
          <li class="flex items-start">
            <span class="mr-2 text-[#d9b16b]">✔</span>
            <span class="text-gray-700">Elegant vehicle fleet</span>
          </li>
          <li class="flex items-start">
            <span class="mr-2 text-[#d9b16b]">✔</span>
            <span class="text-gray-700">Professional chauffeurs</span>
          </li>
          <li class="flex items-start">
            <span class="mr-2 text-[#d9b16b]">✔</span>
            <span class="text-gray-700">Custom transport plans</span>
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
.wedding-services p {
  line-height: 1.75;
}
</style>