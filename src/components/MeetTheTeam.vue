<template>
  <section class="team-section rounded-lg shadow-lg bg-white relative overflow-hidden">
    <!-- Optional background overlay -->
    <div class="absolute inset-0 flex items-center justify-center">
      <!-- add an overlay or background image here if needed -->
    </div>

    <div class="relative text-center md:text-left max-w-4xl mx-auto px-4 py-8">
      <!-- Header (you can put an <h1> or similar inside this Transition) -->
      <Transition
        appear
        enter-active-class="transition duration-1000"
        enter-from-class="opacity-0 translate-y-6"
        enter-to-class="opacity-100 translate-y-0"
      >
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900">
          Meet Our Team
        </h1>
      </Transition>

      <!-- Elfsight Google Reviews widget -->
      <Transition
        appear
        enter-active-class="transition duration-1000 delay-200"
        enter-from-class="opacity-0 translate-y-6"
        enter-to-class="opacity-100 translate-y-0"
      >
      </Transition>

      <!-- EmbedSocial Google Reviews widget -->
      <Transition
        appear
        enter-active-class="transition duration-1000 delay-400"
        enter-from-class="opacity-0 translate-y-6"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div
          class="embedsocial-widget mx-auto my-6"
          data-ref="c58de9ef6f283396b182b10e41915b84"
        >
          <a
            href="https://embedsocial.com/google-reviews-widget/"
            title="Add Google reviews on a website"
            target="_blank"
            class="powered-by-es es-slider"
          >
            <img
              src="https://embedsocial.com/cdn/icon/embedsocial-logo.webp"
              alt="EmbedSocial"
            />
            <span> Google reviews widget </span>
          </a>
        </div>
      </Transition>

      <!-- Team description -->
      <Transition
        appear
        enter-active-class="transition duration-1000 delay-600"
        enter-from-class="opacity-0 translate-y-6"
        enter-to-class="opacity-100 translate-y-0"
      >
        <p
          class="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed text-justify mt-6 w-full md:w-2/3 mx-auto"
        >
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
    // Load Elfsight script once
  
    // Load EmbedSocial script once
    const esId = 'EmbedSocialWidgetScript';
    if (!document.getElementById(esId)) {
      const esScript = document.createElement('script');
      esScript.id = esId;
      esScript.src = 'https://embedsocial.com/cdn/aht.js';
      esScript.async = true;
      document.head.appendChild(esScript);
    }
  }
};
</script>

<style scoped>
.team-section {
  background: white;
}

/* Make both widgets full width */

.embedsocial-widget {
  width: 100%;
}

.team-section h1 {
  color: #232436;
}

.team-section p {
  max-width: 36rem;
}
</style>
