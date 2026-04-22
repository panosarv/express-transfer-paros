<script setup>
import { ref, onMounted } from 'vue';
import { useGsap } from '../../composables/useGsap';
import steeringWheel from '../../assets/SteeringWheel-ETP-2.png';

const sectionRef = ref(null);
const wheelRef = ref(null);
const mobileWheelRef = ref(null);
const servicesContainerRef = ref(null);
const cardsWrapperRef = ref(null);
const activeIndex = ref(0);

const { gsap, createContext, ScrollTrigger } = useGsap();

const services = [
  {
    id: 'transfers',
    title: 'Private Transfers',
    description: 'Seamless door-to-door transfers from airport, port, or any location. Enjoy punctual, comfortable rides with professional drivers who know Paros inside out.',
    features: ['Airport & Port Pickups', 'Hotel Transfers', 'Any Location on Island']
  },
  {
    id: 'tours',
    title: 'Island Tours',
    description: 'Discover the magic of Paros with our curated tours. From historical sites to hidden beaches, we\'ll show you the island\'s best-kept secrets.',
    features: ['History & Culture Tours', 'Beach Hopping', 'Full Day Explorations']
  },
  {
    id: 'disposal',
    title: 'Disposal Services',
    description: 'Have a vehicle and driver at your disposal for the duration you need. Perfect for events, business meetings, or flexible sightseeing.',
    features: ['Hourly Booking', 'Event Transportation', 'Business Travel']
  },
  {
    id: 'wedding',
    title: 'Wedding Services',
    description: 'Make your special day perfect with our premium wedding transportation. Elegant vehicles and exceptional service for you and your guests.',
    features: ['Bridal Transport', 'Guest Shuttles', 'Decorated Vehicles']
  }
];

onMounted(() => {
  setTimeout(() => {
    createContext(() => {
      const isMobile = window.innerWidth < 1024;
      const numCards = services.length; // 4

      const scrollPerCard = window.innerHeight * 1.2;
      const totalScroll = scrollPerCard * numCards;

      // Main pinned timeline (same on mobile and desktop)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: `+=${totalScroll}`,
          scrub: 0.3,
          pin: true,
          anticipatePin: 1
        }
      });

      if (isMobile) {
        activeIndex.value = 0; // reset on context re-creation
        // Mobile: rotate the mobile wheel only
        tl.to(mobileWheelRef.value, {
          rotation: 360,
          ease: 'none',
          duration: 1
        }, 0);
      } else {
        // Desktop: rotate desktop wheel + animate card stack
        tl.to(wheelRef.value, {
          rotation: 360,
          ease: 'none',
          duration: 1
        }, 0);

        const serviceCards = gsap.utils.toArray('.service-card');
        const viewportCenter = window.innerHeight * 0.4;

        const cardPositions = serviceCards.map((card) => {
          const rect = card.getBoundingClientRect();
          const wrapperRect = cardsWrapperRef.value.getBoundingClientRect();
          return rect.top - wrapperRect.top;
        });

        serviceCards.forEach((card, i) => {
          const content = card.querySelector('.service-content');
          const segmentStart = i / numCards;
          const segmentEnd = (i + 1) / numCards;
          const moveEnd = segmentStart + (segmentEnd - segmentStart) * 0.3;
          const lockStart = moveEnd;

          const targetY = -(cardPositions[i] - viewportCenter);

          if (i === 0) {
            gsap.set(cardsWrapperRef.value, { y: targetY });
            gsap.set(content, { opacity: 1, filter: 'blur(0px)', scale: 1 });
          } else {
            gsap.set(content, { opacity: 0.3, filter: 'blur(4px)', scale: 0.95 });
          }

          if (i > 0) {
            const prevContent = serviceCards[i - 1].querySelector('.service-content');
            tl.to(prevContent, {
              opacity: 0.3,
              filter: 'blur(4px)',
              scale: 0.95,
              duration: (moveEnd - segmentStart) * 0.5,
              ease: 'power2.in'
            }, segmentStart);

            tl.to(cardsWrapperRef.value, {
              y: targetY,
              ease: 'power2.out',
              duration: moveEnd - segmentStart
            }, segmentStart);

            tl.to(content, {
              opacity: 1,
              filter: 'blur(0px)',
              scale: 0.95,
              duration: (moveEnd - segmentStart) * 0.8,
              ease: 'power2.out'
            }, segmentStart);
          }

          tl.to(content, {
            scale: 1.02,
            duration: 0.02,
            ease: 'power2.out'
          }, lockStart);

          tl.to(content, {
            scale: 1,
            duration: 0.03,
            ease: 'elastic.out(1, 0.5)'
          }, lockStart + 0.02);
        });

        // Heading animation (desktop only)
        gsap.from('.services-heading', {
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 40,
          opacity: 0,
          duration: 0.8
        });
      }

      // activeIndex updates — always run on both mobile and desktop
      services.forEach((_, i) => {
        const segmentStart = i / numCards;
        const segmentEnd = (i + 1) / numCards;

        ScrollTrigger.create({
          trigger: sectionRef.value,
          start: `top+=${segmentStart * totalScroll} top`,
          end: `top+=${segmentEnd * totalScroll} top`,
          onEnter: () => { activeIndex.value = i; },
          onEnterBack: () => { activeIndex.value = i; }
        });
      });

    }, sectionRef.value);
  }, 100);
});
</script>

<template>
  <section
    ref="sectionRef"
    class="relative bg-etp-cream"
  >
    <!-- Section Header -->
    <div class="services-heading text-center pt-24 pb-12 px-4">
      <span class="text-etp-gold-dark text-sm tracking-widest uppercase mb-4 block">What We Offer</span>
      <h2 class="font-heading text-3xl md:text-5xl text-etp-dark">
        Our <span class="gradient-text">Services</span>
      </h2>
    </div>

    <!-- Mobile Layout (< lg) -->
    <div class="flex lg:hidden flex-col" style="height: calc(100dvh - 10rem);">
      <!-- Steering wheel row: top half -->
      <div class="flex items-center justify-center" style="height: 50%;">
        <div
          ref="mobileWheelRef"
          class="w-[80vw] max-w-[400px] aspect-square"
        >
          <img
            :src="steeringWheel"
            alt="Steering Wheel"
            class="w-full h-full object-contain"
            style="filter: drop-shadow(0 25px 50px rgba(0,0,0,0.3));"
          />
        </div>
      </div>

      <!-- Active service content panel: bottom half -->
      <div class="overflow-hidden px-6 pt-4" style="height: 50%;">
        <Transition name="service-fade" mode="out-in">
          <div :key="activeIndex" class="w-full max-w-lg mx-auto">
            <!-- Title -->
            <h3 class="font-heading text-2xl text-etp-dark mb-3">
              {{ services[activeIndex]?.title }}
            </h3>

            <!-- Description -->
            <p class="text-etp-dark/70 text-base mb-4 leading-relaxed">
              {{ services[activeIndex]?.description }}
            </p>

            <!-- Features -->
            <ul class="space-y-2 mb-5">
              <li
                v-for="feature in services[activeIndex]?.features"
                :key="feature"
                class="flex items-center text-etp-dark/60"
              >
                <svg class="w-5 h-5 text-etp-gold-dark mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                {{ feature }}
              </li>
            </ul>

            <!-- CTA -->
            <a
              :href="`/services/${services[activeIndex]?.id === 'transfers' ? 'private-transfers' : services[activeIndex]?.id === 'tours' ? 'island-tours' : services[activeIndex]?.id === 'wedding' ? 'wedding' : 'disposal-services'}`"
              class="inline-flex items-center text-etp-gold-dark hover:text-etp-dark transition-colors group"
            >
              <span class="mr-2">Learn More</span>
              <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Desktop Layout (lg+) -->
    <div class="hidden lg:grid grid-cols-2 h-screen">
      <!-- Left: Steering Wheel - Half visible -->
      <div class="flex items-center justify-start h-full overflow-hidden">
        <div
          ref="wheelRef"
          class="wheel-container"
        >
          <img
            :src="steeringWheel"
            alt="Steering Wheel"
            class="w-full h-full object-contain"
            style="filter: drop-shadow(0 25px 50px rgba(0,0,0,0.3));"
          />
        </div>

        <!-- Active service indicator -->
        <div class="absolute bottom-24 left-1/3 text-center whitespace-nowrap">
          <span class="text-etp-dark/60 text-lg tracking-wider uppercase font-heading transition-all duration-300">
            {{ services[activeIndex]?.title || 'Our Services' }}
          </span>
        </div>
      </div>

      <!-- Right: Services Carousel -->
      <div
        ref="servicesContainerRef"
        class="h-full overflow-hidden"
      >
        <div
          ref="cardsWrapperRef"
          class="px-4 md:px-8 lg:px-12"
        >
          <!-- Service Cards -->
          <div class="space-y-[60vh] pt-[40vh] pb-[40vh]">
            <div
              v-for="(service, index) in services"
              :key="service.id"
              class="service-card min-h-[40vh] flex items-center"
            >
              <div class="service-content w-full max-w-lg mx-auto lg:mx-0">
                <!-- Title -->
                <h3 class="font-heading text-2xl md:text-4xl text-etp-dark mb-4">
                  {{ service.title }}
                </h3>

                <!-- Description -->
                <p class="text-etp-dark/70 text-lg mb-8 leading-relaxed">
                  {{ service.description }}
                </p>

                <!-- Features -->
                <ul class="space-y-3 mb-8">
                  <li
                    v-for="feature in service.features"
                    :key="feature"
                    class="flex items-center text-etp-dark/60"
                  >
                    <svg class="w-5 h-5 text-etp-gold-dark mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    {{ feature }}
                  </li>
                </ul>

                <!-- CTA -->
                <a
                  :href="`/services/${service.id === 'transfers' ? 'private-transfers' : service.id === 'tours' ? 'island-tours' : service.id === 'wedding' ? 'wedding' : 'disposal-services'}`"
                  class="inline-flex items-center text-etp-gold-dark hover:text-etp-dark transition-colors group"
                >
                  <span class="mr-2">Learn More</span>
                  <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Service dots indicator (desktop) -->
    <div class="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col space-y-3 z-50">
      <div
        v-for="(service, index) in services"
        :key="service.id"
        class="w-3 h-3 rounded-full transition-all duration-300 cursor-pointer"
        :class="activeIndex === index ? 'bg-etp-gold-dark scale-125' : 'bg-etp-dark/30 hover:bg-etp-dark/50'"
      ></div>
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

.service-content {
  will-change: opacity, filter, transform;
}

/* Large steering wheel - positioned to show only right half */
.wheel-container {
  width: 90vh;
  height: 90vh;
  transform: translateX(-45%);
  will-change: transform;
}

/* Mobile content panel crossfade */
.service-fade-enter-active,
.service-fade-leave-active {
  transition: opacity 0.2s ease;
}
.service-fade-enter-from,
.service-fade-leave-to {
  opacity: 0;
}
</style>
