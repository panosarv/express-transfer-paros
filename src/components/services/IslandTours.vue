<template>
  <section class="island-tours">
    <!-- Hero Image -->
    <div class="relative">
      <img
        src="https://images.unsplash.com/photo-1666376466806-f4bcedffe0d6?q=80&w=2670&auto=format&fit=crop"
        alt="Island Tours"
        class="w-full h-96 object-cover"
      />
      <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <h1 class="text-white text-5xl font-bold">Island Tours</h1>
      </div>
    </div>

    <div class="max-w-4xl mx-auto py-12 px-4">
      <p class="text-gray-700 leading-relaxed mb-6 text-justify">
        Explore the highlights of Paros with our guided island tours. Choose from half-day, full-day, or custom itineraries that include historical sites, scenic villages, and hidden beaches.
      </p>

      <!-- Tabs Navigation -->
      <div class="flex space-x-4 overflow-x-auto mt-8">
        <button
          v-for="(tab, idx) in tabs"
          :key="tab.id"
          @click="activeIndex = idx"
          :class="[
            'pb-2 whitespace-nowrap',
            activeIndex === idx
              ? 'text-[#d9b16b] border-b-2 border-[#d9b16b]'
              : 'text-gray-600'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Active Tab Card -->
      <div class="mt-6 bg-white rounded-lg shadow-lg overflow-hidden">
        <router-link :to="`/tours/${current.id}`" class="block">
          <img
            :src="current.image"
            :alt="current.label"
            class="w-full h-64 object-cover"
          />
        </router-link>
        <div class="p-6">
          <!-- Description -->
          <p class="text-gray-700 mb-4 text-justify">
            {{ descriptions[current.id] }}
          </p>
          <!-- Accordion -->
          <details class="border border-gray-200 rounded-md">
            <summary class="cursor-pointer font-semibold px-4 py-2 bg-gray-100">Additional Info</summary>
            <ul class="grid grid-cols-2 gap-2 mt-2 px-4 pb-4">
              <li
                v-for="(feat, i) in current.features"
                :key="i"
                class="flex items-start"
              >
                <span class="mr-2 text-[#d9b16b]">✔</span>
                <span class="text-gray-700">{{ feat }}</span>
              </li>
            </ul>
          </details>
        </div>
      </div>

      <!-- Book This Tour Button -->
      <div class="mt-6 text-center">
        <router-link
          to="/booking"
          class="inline-block bg-[#d9b16b] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#b4952e] transition-colors"
        >
          Book This Tour
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import historyTourImage from '../../assets/etp-history-tour.jpg';
import beachTourImage from '../../assets/etp-drios.jpg';
import halfDayTourImage from '../../assets/etp-alyki.jpg';
import fullDayTourImage from '../../assets/etp-fullday-tour.jpeg';
import customImage from '../../assets/etp-meetteam.jpg';

const tabs = [
  {
    id: 'history-tour',
    label: 'History Tour',
    image: historyTourImage,
    features: [
      'Pick up from your location',
      'Local knowledge',
      'Professional Driver',
      'Museum trip',
      'Sculpture Museum',
      'Ancient ruins',
      'Ancient Park',
      'Multiple stops',
      'Minimum 4 hours'
    ]
  },
  {
    id: 'beach-tour',
    label: 'Beach Tour',
    image: beachTourImage,
    features: [
      'Pick up from your location',
      'Local knowledge',
      'Professional Driver',
      '7 beach stops',
      'Swimming time',
      'Photography stops'
    ]
  },
  {
    id: 'half-day-island-tour',
    label: 'Half-Day Island Tour',
    image: halfDayTourImage,
    features: [
      'Pick up from your location',
      'Professional Driver',
      'Local Knowledge',
      'Breathtaking scenery',
      'Flexible Duration',
      'Multiple stops',
      'Minimum 4 hours'
    ]
  },
  {
    id: 'full-day-island-tour',
    label: 'Full-Day Island Tour',
    image: fullDayTourImage,
    features: [
      'Pick up from your location',
      'Professional Driver',
      'Local Knowledge',
      'Breathtaking scenery',
      'Sunset view',
      'Multiple stops',
      'Minimum 8 hours'
    ]
  },
  {
    id: 'custom-tour',
    label: 'Custom Tour',
    image: customImage,
    features: [
      'Fully customizable itinerary',
      'Local recommendations',
      'Flexible schedule',
      'Professional Driver',
      'Multiple stops'
    ]
  }
];

const descriptions = {
  'history-tour': 'Begin in Parikia, exploring the Archaeological Museum with its ancient artifacts before visiting the early Christian wonders of Panagia Ekatontapyliani. Next, head to Alyki to see the Cycladic Folklore Museum’s intricate ship models and learn about the island’s maritime heritage. In Marpissa, the Museum of Sculpture showcases local artist Nikos Perantinos and Paros’s rich connection to marble artistry. Then venture inland to Lefkes, wandering its winding alleys and admiring traditional Cycladic architecture in this serene mountain village. Finally, conclude at Paros Park’s monastery, where coastal trails and a hike to Cape Korakas reveal stunning Aegean vistas.',
  'beach-tour': 'Embark on a sun-soaked journey to seven of Paros’s most stunning beaches, starting with the tranquil cove of Faragas Beach for a peaceful morning swim. Continue to lively Golden Beach, where golden sands and windsurfers create a vibrant coastal scene. Next, experience the natural clay cliffs of Kalogeros Beach, perfect for a unique skincare mask and refreshing dip. Then head to Santa Maria near Naoussa to soak up the energetic atmosphere before exploring the granite formations and hidden pools of Kolymbithres Beach. Conclude at the calm shores of Monastiri in Paros Park and Krios Beach near Parikia, capturing the island’s diverse seaside beauty and panoramic views.',
  'half-day-island-tour': 'Begin in the quaint fishing village of Alyki, strolling its harbor and soaking up the authentic Cycladic atmosphere. Continue to Golden Beach to admire its famous golden sands and crystal-clear waters, stopping for photos or a quick shore walk. Then visit the seaside settlements of Piso Livadi and Logaras for a glimpse of local fishing life and a beachside coffee break. Pause at the hilltop Agios Antonios Monastery above Marpissa for panoramic island and sea views and a peaceful wander. Finish your half-day journey exploring the charming mountain village of Lefkes before choosing to conclude in either stylish Naoussa or historic Parikia.',
  'full-day-island-tour': 'Your full-day adventure starts in the charming fishing harbor of Alyki, where you’ll enjoy a leisurely stroll amid traditional boats and coastal scenery. Next, relax on either Golden Beach or the secluded Faragas Beach for a two-hour swim and sunbathe in their pristine waters. The tour continues along the east coast to Piso Livadi for a seaside coffee, followed by a visit to the hilltop Agios Antonios Monastery with its breathtaking island vistas. After lunch in the marble-paved alleys of Lefkes, explore the vibrant harbor town of Naoussa, famed for its boutiques, art galleries, and seaside cafés. Finally, unwind with a coastal walk at Monastiri in Paros Park before your return, taking in serene landscapes and a memorable sunset.',
  'custom-tour': 'Design your own Paros experience with a fully customizable itinerary. Choose from historical landmarks, scenic villages, secret beaches, and local culinary stops. Enjoy the flexibility to set your pace and personalize each stop with insights from our knowledgeable guides. Travel comfortably with a professional driver who knows the island’s hidden gems. Create lasting memories on a tour that’s uniquely yours.'
};

const activeIndex = ref(0);
const current = computed(() => tabs[activeIndex.value]);
</script>

<style scoped>
.island-tours p {
  line-height: 1.75;
}
.island-tours .flex::-webkit-scrollbar {
  height: 4px;
}
.island-tours .flex::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.2);
  border-radius: 2px;
}
</style>
