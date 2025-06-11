<template>
  <section class="tour-detail">
    <h1 class="tour-title">{{ tour.title }}</h1>
    <img :src="tour.image" :alt="tour.title" class="tour-image" loading="lazy"/>

    <ul class="tour-features">
      <li v-for="(feature, index) in tour.features" :key="index">✔ {{ feature }}</li>
    </ul>

    <div class="tour-steps">
      <template v-for="(step, idx) in tour.steps" :key="idx">
        <details class="tour-step" :open="idx === 0">
          <summary>{{ step.title }}</summary>
          <div class="step-content">
            <img :src="step.image" :alt="step.title" class="step-image" loading="lazy"/>
            <p>{{ step.description }}</p>
          </div>
        </details>

        <!-- Connector: pulsating dots and arrow -->
        <div v-if="idx < tour.steps.length - 1" class="step-connector">
          <div class="dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="step-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 4v16m0 0l-6-6m6 6l6-6"
                stroke="red"
                stroke-width="3"
                fill="white"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </template>
    </div>

    <router-link to="/booking" class="book-button">Book This Tour</router-link>
  </section>
</template>

<script>
import beachTourImage from '../assets/etp-drios.jpg';
import halfDayTourImage from '../assets/etp-naousa.jpg';
import historyTourImage from '../assets/etp-history-tour.jpg';
import fullDayTourImage from '../assets/etp-fullday-tour.jpeg';
import arcMuseumImage from '../assets/etp-museum.jpg';
import folkloreMuseumImage from '../assets/etp-museum-folk.jpg';
import sculptureMuseumImage from '../assets/etp-museum-scl.jpg';
import lefkesImage from '../assets/etp-lefkes.jpg';
import monasteryImage from '../assets/etp-monastery.png';
import parosParkImage from '../assets/etp-paros-park.jpg';
import alykiImage from '../assets/etp-alyki.jpg';
import naousaImage from '../assets/etp-naousa.jpg';
import pisoLivadiImage from '../assets/etp-piso-livadi.jpg';
import faragasImage from '../assets/etp-faragas.jpg';
import kolymbithresImage from '../assets/etp-kolympithres.jpg';
import kriosImage from '../assets/etp-krios.jpg';
import kalogerosImage from '../assets/etp-kalogeros.jpg';
import santaMariaImage from '../assets/etp-santamaria.jpg';
import monastiriImage from '../assets/etp-monastiri-beach.jpg';
import parikiaImage from '../assets/etp-parikia.jpg';
const tours = {
  'history-tour': {
    title: 'History Tour – 4 Hours',
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
    ],
    steps: [
      {
        title: 'A) Archaeological Museum & Panagia Ekatontapyliani (40 min)',
        description: 'Start your day in Parikia, the island’s capital. Visit the Archaeological Museum to explore important finds from Paros’ ancient past, and then walk to the nearby Ekatontapyliani, one of the oldest and most significant early Christian churches in Greece.',
        image: arcMuseumImage
      },
      {
        title: 'B) Museum of Cycladic Folklore in Alyki (15 min)',
        description: 'Head south to Alyki for a short but fascinating stop. This museum features detailed handmade models of ancient Greek ships, offering a unique glimpse into the maritime history and seafaring tradition of the Aegean.',
        image: folkloreMuseumImage
      },
      {
        title: 'C) Museum of Sculpture in Marpissa (15 min)',
        description: 'Continue to Marpissa and visit this small museum dedicated to sculpture. It showcases the work of local artist Nikos Perantinos and highlights the island’s deep connection with marble and the arts.',
        image: sculptureMuseumImage
      },
      {
        title: 'D) Lefkes Village (40 min)',
        description: 'Drive inland to the picturesque mountain village of Lefkes. Wander through its charming narrow alleys, admire the traditional Cycladic architecture, and enjoy a peaceful atmosphere away from the coast.',
        image: lefkesImage
      },
      {
        title: 'E) Monastery & Paros Park (20 min)',
        description: 'End your day at Paros Park, near the Monastery of Ai Yiannis Detis. This natural reserve offers beautiful coastal trails. If you’re feeling active, you can take the hiking path to the lighthouse at Cape Korakas for spectacular views of the Aegean.',
        image: parosParkImage
      }
    ]
  },
  'beach-tour': {
    title: 'Beach Tour – 9 Hours',
    image: beachTourImage,
    features: [
      'Pick up from your location',
      'Local knowledge',
      'Professional Driver',
      '7 beach stops',
      'Swimming time',
      'Photography stops'
    ],
    steps: [
      { title: 'Faragas Beach', description: 'Start your day at this sheltered southern beach, known for its calm waters, natural setting, and relaxed vibe. Faragas is ideal for a peaceful swim away from the crowds.', image: faragasImage },
      { title: 'Golden Beach', description: 'One of the most famous beaches on the island, Golden Beach features long stretches of fine golden sand and crystal-clear waters — perfect for swimming or watching the windsurfers glide across the bay.', image: beachTourImage },
      { title: 'Kalogeros Beach', description: 'Known for its natural clay cliffs, Kalogeros offers a unique experience — many visitors enjoy applying the clay as a natural skin mask. The beach is also beautiful and unspoiled, great for a refreshing dip.', image: kalogerosImage },
      { title: 'Santa Maria Beach', description: 'Located near Naoussa, Santa Maria is a lively beach with soft sand and great views of Naxos. Ideal for both swimming and people-watching, with options for snacks or a drink nearby.', image: santaMariaImage },
      { title: 'Kolymbithres Beach', description: 'One of Paros’ most iconic beaches, Kolymbithres is famous for its smooth granite rock formations that create small private coves and pools. A fun and scenic spot for a short swim and unique photos.', image: kolymbithresImage },
      { title: 'Monastiri Beach', description: 'Tucked inside the Paros Park nature reserve, Monastiri is a calm and family-friendly beach surrounded by dramatic rocky hills. The water is shallow and perfect for relaxing.', image: monastiriImage },
      { title: 'Krios Beach', description: 'End your beach tour with a swim at Krios, located just across the bay from Parikia. With soft sand, turquoise waters, and a view of the town, it’s the perfect final stop before returning.', image: kriosImage }
    ]
  },
  'half-day-island-tour': {
    title: 'Half-Day Island Tour – 4 Hours',
    image: halfDayTourImage,
    features: [
      'Pick up from your location',
      'Professional Driver',
      'Local Knowledge',
      'Breathtaking scenery',
      'Flexible Duration',
      'Multiple stops',
      'Minimum 4 hours'
    ],
    steps: [
      { title: 'Alyki (10 min)', description: 'Begin your tour in the quaint fishing village of Alyki, located on the southern coast of Paros. Enjoy a quick stroll by the harbor, observe the traditional boats, and take in the relaxed, authentic atmosphere of a Cycladic seaside village.', image: alykiImage },
      { title: 'Golden Beach', description: 'Continue along the eastern coastline to one of Paros’ most famous beaches. Golden Beach is known for its golden sand and clear waters, and it’s a popular spot for windsurfing. A short stop here allows time for photos or a quick beachside walk.', image: beachTourImage },
      { title: 'Piso Livadi & Logaras (15 min)', description: 'Next, head to the charming seaside settlements of Piso Livadi and nearby Logaras. These villages offer a beautiful mix of quiet fishing life and vibrant beach cafés — perfect for a short break by the sea.', image: pisoLivadiImage },
      { title: 'Agios Antonios Monastery (15 min)', description: 'Located on the hill above Marpissa, this 17th-century monastery offers panoramic views over the island and the Aegean Sea. It’s a peaceful and spiritual stop, ideal for photos and a short walk around the site.', image: monasteryImage },
      { title: 'Lefkes Village (45 min)', description: 'Drive up into the mountains to visit Lefkes, one of Paros’ most beautiful and traditional villages. Explore its whitewashed alleyways, admire its neoclassical architecture, and enjoy a taste of authentic island life away from the coast.', image: lefkesImage },
      { title: 'Naoussa or Parikia (45 min)', description: 'Conclude your tour with a visit to either Naoussa — the cosmopolitan fishing town with vibrant nightlife and elegant boutiques — or Parikia, the island’s capital, where you can explore historical alleys, harbor cafés, and traditional shops. The choice depends on your interests and final drop-off preference.', image: parikiaImage }
    ]
  },
  'full-day-island-tour': {
    title: 'Full-Day Island Tour – 8 Hours',
    image: fullDayTourImage,
    features: [
      'Pick up from your location',
      'Professional driver',
      'Local Knowledge',
      'Breathtaking scenery',
      'Sunset view',
      'Multiple stops',
      'Minimum 8 hours'
    ],
    steps: [
      { title: 'Alyki (20 min)', description: 'Start your day in the charming fishing village of Alyki, located on the southern coast of Paros. Enjoy a peaceful stroll along the traditional harbor, admire the fishing boats, and get a glimpse of authentic island life.', image: alykiImage },
      { title: 'Swim Stop – Golden Beach/Faragas (2 hrs)', description: 'Head to one of Paros’s top beaches for a refreshing swim and relaxation. Golden Beach offers long stretches of fine sand and excellent conditions for windsurfing, while	Faragas, a more secluded cove, is perfect for a calmer, scenic swim surrounded by natural beauty.', image: beachTourImage },
      { title: 'Piso Livadi (20 min)', description: 'Continue along the east coast to the picturesque seaside village of Piso Livadi. With its whitewashed buildings, small marina, and laid-back vibe, it’s a great spot for a coffee break or seaside photo stop.', image: pisoLivadiImage },
      { title: 'Agios Antonios Monastery (20 min)', description: 'Visit the hilltop monastery of Agios Antonios above Marpissa. The panoramic views of the island and the sea are stunning, and the serene atmosphere of the old monastery adds a spiritual touch to the tour.', image: monasteryImage },
      { title: 'Lefkes Village (1 hr)', description: 'Travel inland to the traditional mountain village of Lefkes, once the capital of Paros. Walk through its narrow marble-paved alleys, admire the Cycladic architecture, and perhaps enjoy a light lunch or coffee in the peaceful village square.', image: lefkesImage },
      { title: 'Naoussa (1.5 hrs)', description: 'Spend the afternoon in Naoussa, one of the most beautiful and lively towns in the Cyclades. Explore the charming old harbor, boutique shops, art galleries, and perhaps enjoy a drink or ice cream by the sea.', image: naousaImage },
      { title: 'Monastiri (20 min)', description: 'End your day at Monastiri, part of the Paros Park natural reserve. Take a short walk along the coast, relax by the beach, or simply enjoy the landscape before heading back.', image: parosParkImage }
    ]
  }
};

export default {
  name: 'TourDetail',
  computed: {
    tour() {
      return tours[this.$route.params.id] || {};
    }
  }
};
</script>

<style scoped>
.tour-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 5rem 1rem 2rem; /* ensure content sits below navbar */
}
.tour-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
}
.tour-image {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.tour-features {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}
.tour-features li {
  margin: 0.5rem 0;
  font-size: 1rem;
}
.tour-steps {
  position: relative;
  background-image: url('../assets/etp-paros-map.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 2rem 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}
.tour-step summary {
  cursor: pointer;
}
.tour-step {
  background: rgba(255,255,255,0.9);
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem 1rem;
}
.step-content {
  padding: 1rem 0;
}
.step-image {
  width: 100%;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}
.step-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
  position: relative;
}
.dots {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
}
.dot {
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  margin: 4px 0;
  opacity: 0.4;
  animation: dotPulse 1.5s infinite;
}
.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.3s; }
.dot:nth-child(3) { animation-delay: 0.6s; }
@keyframes dotPulse {
  0% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.4); }
  100% { opacity: 0.4; transform: scale(1); }
}
.step-arrow svg {
  width: 24px;
  height: 24px;
  animation: arrowPulsate 1.5s ease-in-out infinite;
}
@keyframes arrowPulsate {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}
.book-button {
  display: block;
  text-align: center;
  margin: 2rem auto;
  padding: 1rem 2rem;
  background: #d9b16b;
  color: #fff;
  font-size: 1.25rem;
  border-radius: 8px;
  text-decoration: none;
}
</style>
