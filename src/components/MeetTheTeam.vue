<template>
  <section class="team-section rounded-lg shadow-lg bg-white relative overflow-hidden">
    <div class="absolute inset-0 flex items-center justify-center">
      <!-- Background overlay if needed -->
    </div>

    <div class="relative text-center md:text-left max-w-4xl mx-auto px-4 py-8">
      <!-- Header -->
      <Transition
        appear
        enter-active-class="transition duration-1000"
        enter-from-class="opacity-0 translate-y-6"
        enter-to-class="opacity-100 translate-y-0"
      >
      </Transition>

      <!-- Elfsight widget -->
      <div class="elfsight-container mx-auto mb-6">
        <div
          class="elfsight-app-f8fb4e1a-a49a-40b4-a49e-302c15ad3184"
          data-elfsight-app-lazy
        ></div>
      </div>

      <!-- Team description -->
      <Transition
        appear
        enter-active-class="transition duration-1000 delay-300"
        enter-from-class="opacity-0 translate-y-6"
        enter-to-class="opacity-100 translate-y-0"
      >
        <p class="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed text-justify mt-6 w-full md:w-2/3 mx-auto">
          {{ teamDescription }}
        </p>
      </Transition>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TeamSection',
  data() {
    return {
      teamDescription:
        'At Express Transfer Paros, our team of professional drivers combines local expertise with warm hospitality, ensuring every journey on the island is safe, reliable, and memorable.'
    };
  },
  mounted() {
    // Dynamically load Elfsight platform script
    const script = document.createElement('script');
    script.src = 'https://static.elfsight.com/platform/platform.js';
    script.async = true;
    document.body.appendChild(script);
  }
};
</script>

<style scoped>
.team-section {
  background: white;
}

.instagram-embed-container,
.elfsight-container {
  width: 100%;
}
.team-section h1 {
  color: #232436;
}
.team-section p {
  max-width: 36rem;
}
</style>