<script setup>
import { ref, onMounted } from 'vue';
import { useGsap } from '../../composables/useGsap';
import sceneryBg from '../../assets/Layer2-ETP.jpg';

const sectionRef = ref(null);
const headingRef = ref(null);
const paragraphsRef = ref(null);
const featuresRef = ref(null);
const bgRef = ref(null);

const { gsap, createContext } = useGsap();

const features = [
  {
    title: 'Private Transfers',
    description: 'Door-to-door service from airport, port, or any location on the island.'
  },
  {
    title: 'Island Tours',
    description: 'Discover hidden gems and famous landmarks with our curated tours.'
  },
  {
    title: '24/7 Availability',
    description: 'We\'re here whenever you need us, day or night.'
  },
  {
    title: 'Premium Comfort',
    description: 'Travel in style with our modern, air-conditioned vehicles.'
  }
];

onMounted(() => {
  createContext(() => {
    // Background parallax - continues from hero, shows lower part of image
    gsap.to(bgRef.value, {
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      yPercent: -20,
      ease: 'none'
    });

    // Heading animation
    gsap.from(headingRef.value, {
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      x: -80,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // Paragraphs staggered animation
    gsap.from('.about-paragraph', {
      scrollTrigger: {
        trigger: paragraphsRef.value,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out'
    });

    // Features cards animation
    gsap.from('.feature-card', {
      scrollTrigger: {
        trigger: featuresRef.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out'
    });

  }, sectionRef.value);
});
</script>

<template>
  <section
    ref="sectionRef"
    class="relative py-24 md:py-32 px-4 overflow-hidden min-h-screen"
  >
    <!-- Background Image - lower part of the same scenery from hero (NO overlay) -->
    <div
      ref="bgRef"
      class="absolute inset-0 w-full will-change-transform"
      style="height: 140%; top: -20%;"
    >
      <img
        :src="sceneryBg"
        alt="Paros Scenery"
        class="w-full h-full object-cover object-bottom"
      />
    </div>

    <div class="max-w-6xl mx-auto relative z-10">
      <!-- Heading - with local tint background -->
      <div ref="headingRef" class="mb-12 md:mb-16 inline-block">
        <div class="bg-etp-dark/70 backdrop-blur-sm rounded-2xl p-6 md:p-8">
          <span class="text-etp-gold text-sm tracking-widest uppercase mb-4 block">About Us</span>
          <h2 class="font-heading text-3xl md:text-5xl lg:text-6xl text-white leading-tight">
            Your Journey,<br />
            <span class="gradient-text">Our Passion</span>
          </h2>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <!-- Text Content - with local tint background -->
        <div ref="paragraphsRef" class="bg-etp-dark/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 space-y-6">
          <p class="about-paragraph text-lg md:text-xl text-white/90 leading-relaxed">
            Welcome to Express Transfer Paros, your trusted partner for premium transportation services on the beautiful island of Paros.
          </p>
          <p class="about-paragraph text-lg md:text-xl text-white/90 leading-relaxed">
            With years of experience and deep local knowledge, we pride ourselves on delivering exceptional service that goes beyond just getting you from A to B.
          </p>
          <p class="about-paragraph text-lg md:text-xl text-white/90 leading-relaxed">
            Whether you're arriving at the port or airport, exploring the island's stunning beaches, or discovering its rich history, we ensure every journey is comfortable, safe, and memorable.
          </p>
        </div>

        <!-- Features Grid -->
        <div ref="featuresRef" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="feature-card p-6 rounded-2xl bg-etp-dark/70 backdrop-blur-sm border border-white/10 hover:border-etp-gold/30 transition-colors duration-300"
          >
            <h3 class="text-lg font-semibold text-white mb-2">{{ feature.title }}</h3>
            <p class="text-white/70 text-sm">{{ feature.description }}</p>
          </div>
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

.will-change-transform {
  will-change: transform;
}
</style>
