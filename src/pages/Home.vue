<script setup>
import { ref } from 'vue';
import Navbar               from '../components/Navbar.vue';
import HeroSequenceSection  from '../components/sections/HeroSequenceSection.vue';
import ToursSection         from '../components/sections/ToursSection.vue';
import ServicesBentoSection from '../components/sections/ServicesBentoSection.vue';
import FleetSection         from '../components/sections/FleetSection.vue';
import StatsSection         from '../components/sections/StatsSection.vue';
import AboutSection         from '../components/sections/AboutSection.vue';
import ReviewsSection       from '../components/sections/ReviewsSection.vue';
import ContactCTASection    from '../components/sections/ContactCTASection.vue';
import Footer               from '../components/Footer.vue';
import StickyBar            from '../components/ui/StickyBar.vue';
import BookingDrawer        from '../components/ui/BookingDrawer.vue';

const showBooking = ref(false);

const PLACES        = ['Naoussa','Parikia','Golden Beach','Lefkes','Logaras','Antiparos','Santa Maria','Paros Park','Alyki'];
const SERVICES_LIST = ['Airport Transfer','Port Pickup','Island Tours','VIP Service','Weddings','Hotel Transfer','Hourly Hire','Group Transfer'];
</script>

<template>
  <div style="background:var(--sand);">
    <Navbar @book="showBooking = true" />

    <!-- Places marquee — mobile only -->
    <div class="marquee-strip" style="border-top:1px solid rgba(232,201,126,0.25);background:rgba(13,33,55,0.97);">
      <div class="marquee-track">
        <div v-for="(item, i) in [...PLACES,...PLACES]" :key="`p${i}`" class="marquee-item">
          <div class="marquee-dot" />{{ item }}
        </div>
      </div>
    </div>

    <HeroSequenceSection />

    <!-- Services marquee — mobile only -->
    <div class="marquee-strip" style="border-bottom:1px solid rgba(126,200,227,0.15);background:rgba(13,33,55,0.92);">
      <div class="marquee-track slow" style="animation-direction:reverse;">
        <div v-for="(item, i) in [...SERVICES_LIST,...SERVICES_LIST]" :key="`s${i}`" class="marquee-item">
          <div class="marquee-dot" style="background:var(--sky);" />{{ item }}
        </div>
      </div>
    </div>

    <div id="tours">
      <ToursSection @book="showBooking = true" />
    </div>

    <div id="services">
      <ServicesBentoSection @book="showBooking = true" />
    </div>

    <div id="fleet">
      <FleetSection />
    </div>

    <StatsSection />

    <div id="about">
      <AboutSection />
    </div>

    <div id="reviews">
      <ReviewsSection />
    </div>

    <div id="contact">
      <ContactCTASection @book="showBooking = true" />
    </div>

    <Footer />

    <StickyBar @book="showBooking = true" />
    <BookingDrawer v-model:open="showBooking" />
  </div>
</template>
