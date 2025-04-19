<template>
  <section class="team-section rounded-lg shadow-lg bg-white relative overflow-hidden">
    <div class="absolute inset-0 flex items-center justify-center">
      <!-- Background overlay if needed -->
    </div>

    <div class="relative text-center md:text-left max-w-4xl mx-auto px-4">
      <!-- Header -->
      <Transition
        appear
        enter-active-class="transition duration-1000"
        enter-from-class="opacity-0 translate-y-6"
        enter-to-class="opacity-100 translate-y-0"
      >
        <h1 class="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-800 ">
          Meet the Team
        </h1>
      </Transition>

      <!-- Instagram embed iframe -->
      <div class="instagram-embed-container">
        <iframe
          class="instagram-iframe w-full h-64 sm:h-80 md:h-96 lg:h-[500px] mx-auto"
          src="https://www.instagram.com/expresstransfer_paros/embed"
          frameborder="0"
          scrolling="yes"
          allowtransparency="true"
        ></iframe>
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
  }
};
</script>

<style scoped>
.team-section {
  background: white;
  padding-top: 4rem;
  padding-bottom: 4rem;
}
.instagram-embed-container {
  /* Center and contain iframe */
}
.instagram-iframe {
  border: none;
  overflow: auto;
  border: none;
}
.team-section h1 {
  color: #1f2937;
}
.team-section p {
  max-width: 36rem;
  margin-top: 1rem;
}
</style>
