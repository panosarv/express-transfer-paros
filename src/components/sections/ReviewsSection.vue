<script setup>
import { ref, onMounted } from 'vue';
import { useGsap } from '../../composables/useGsap';

const sectionRef = ref(null);
const headingRef = ref(null);
const widgetRef = ref(null);

const { gsap, createContext } = useGsap();

onMounted(() => {
  // Load EmbedSocial script dynamically
  const script = document.createElement('script');
  script.src = 'https://embedsocial.com/cdn/ht.js';
  script.async = true;
  document.body.appendChild(script);

  createContext(() => {
    // Heading animation
    gsap.from(headingRef.value, {
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

    // Widget fade in
    gsap.from(widgetRef.value, {
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power2.out'
    });

  }, sectionRef.value);
});
</script>

<template>
  <section
    ref="sectionRef"
    class="relative py-24 md:py-32 px-4 bg-gradient-to-b from-etp-charcoal to-etp-dark overflow-hidden"
  >
    <!-- Decorative elements -->
    <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-etp-gold/30 to-transparent"></div>

    <div class="max-w-6xl mx-auto">
      <!-- Heading -->
      <div ref="headingRef" class="text-center mb-16">
        <span class="text-etp-gold text-sm tracking-widest uppercase mb-4 block">Testimonials</span>
        <h2 class="font-heading text-3xl md:text-5xl text-white mb-6">
          Don't Listen to Us,<br />
          <span class="gradient-text">Listen to Our Clients</span>
        </h2>
        <p class="text-white/60 text-lg max-w-2xl mx-auto">
          Real experiences from real travelers who chose Express Transfer Paros for their island adventures.
        </p>
      </div>

      <!-- Google Reviews Widget (EmbedSocial) -->
      <div ref="widgetRef" class="relative">
        <!-- Reviews widget container -->
        <div class="embedsocial-reviews bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
          <!-- EmbedSocial widget will be loaded here -->
          <div class="embedsocial-hashtag" data-ref="36a6cf2fa09f3a3f33d5c60f1c9b7e86c13c3e5a">
            <a
              class="feed-powered-by-es feed-powered-by-es-slider-new"
              href="https://embedsocial.com/social-media-aggregator/"
              target="_blank"
              title="Widget by EmbedSocial"
            >
            </a>
          </div>
        </div>

        <!-- Fallback/placeholder if widget doesn't load -->
        <noscript>
          <div class="text-center py-12">
            <p class="text-white/60">
              Check out our reviews on
              <a
                href="https://www.google.com/maps/place/Express+Transfer+Paros"
                target="_blank"
                rel="noopener noreferrer"
                class="text-etp-gold hover:text-etp-gold-dark underline"
              >
                Google Maps
              </a>
            </p>
          </div>
        </noscript>
      </div>

      <!-- Trust badges -->
      <div class="flex flex-wrap justify-center items-center gap-8 mt-12 opacity-60">
        <div class="flex items-center gap-2 text-white/80">
          <svg class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>5.0 Rating</span>
        </div>
        <div class="flex items-center gap-2 text-white/80">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
          </svg>
          <span>Verified Reviews</span>
        </div>
        <div class="flex items-center gap-2 text-white/80">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span>Google Maps</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #d9b16b 0%, #B4952E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Style overrides for EmbedSocial widget */
.embedsocial-reviews :deep(.es-widget) {
  background: transparent !important;
}

.embedsocial-reviews :deep(.es-review-card) {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px !important;
}
</style>
