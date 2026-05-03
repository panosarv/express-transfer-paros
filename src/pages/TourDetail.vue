<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import BookingDrawer from '../components/ui/BookingDrawer.vue';

import historyImg    from '../assets/etp-history-tour.jpg';
import beachImg      from '../assets/etp-drios.jpg';
import fullDayImg    from '../assets/etp-fullday-tour.jpeg';
import arcMuseumImg  from '../assets/etp-museum.jpg';
import folkloreImg   from '../assets/etp-museum-folk.jpg';
import sculptureImg  from '../assets/etp-museum-scl.jpg';
import lefkesImg     from '../assets/etp-lefkes.jpg';
import parosParkImg  from '../assets/etp-paros-park.jpg';
import faragasImg    from '../assets/etp-faragas.jpg';
import kalogerosImg  from '../assets/etp-kalogeros.jpg';
import santaMariaImg from '../assets/etp-santamaria.jpg';
import kolymImg      from '../assets/etp-kolympithres.jpg';
import monastiriImg  from '../assets/etp-monastiri-beach.jpg';
import kriosImg      from '../assets/etp-krios.jpg';
import alykiImg      from '../assets/etp-alyki.jpg';
import pisoImg       from '../assets/etp-piso-livadi.jpg';
import monasteryImg  from '../assets/etp-monastery.png';
import naousaImg     from '../assets/etp-naousa.jpg';
import kolymbithresImg from '../assets/etp-kolympithres.jpg';

const TOURS_DATA = {
  'history-tour': {
    title: 'History Tour',
    tag: 'Culture & History',
    duration: 'Minimum 4 hours',
    accent: '#0d2137',
    heroImg: historyImg,
    description: "Begin in Parikia, exploring the Archaeological Museum with its ancient artifacts before visiting the early Christian wonders of Panagia Ekatontapyliani. Next, head to Alyki to see the Cycladic Folklore Museum's intricate ship models and learn about the island's maritime heritage. In Marpissa, the Museum of Sculpture showcases local artist Nikos Perantinos and Paros's rich connection to marble artistry. Then venture inland to Lefkes, wandering its winding alleys and admiring traditional Cycladic architecture in this serene mountain village. Finally, conclude at Paros Park's monastery, where coastal trails and a hike to Cape Korakas reveal stunning Aegean vistas.",
    features: [
      'Pick up from your location', 'Local knowledge', 'Professional Driver',
      'Museum trip', 'Sculpture Museum', 'Ancient ruins', 'Ancient Park', 'Multiple stops', 'Minimum 4 hours',
    ],
    stops: [
      { label: 'A', name: 'Archaeological Museum & Panagia Ekatontapyliani', duration: '40 min', img: arcMuseumImg,
        desc: "Start your day in Parikia, the island's capital. Visit the Archaeological Museum to explore important finds from Paros' ancient past, then walk to the nearby Ekatontapyliani, one of the oldest and most significant early Christian churches in Greece." },
      { label: 'B', name: 'Museum of Cycladic Folklore, Alyki', duration: '15 min', img: folkloreImg,
        desc: "Head south to Alyki for a short but fascinating stop. This museum features detailed handmade models of ancient Greek ships, offering a unique glimpse into the maritime history and seafaring tradition of the Aegean." },
      { label: 'C', name: 'Museum of Sculpture, Marpissa', duration: '15 min', img: sculptureImg,
        desc: "Continue to Marpissa and visit this small museum dedicated to sculpture. It showcases the work of local artist Nikos Perantinos and highlights the island's deep connection with marble and the arts." },
      { label: 'D', name: 'Lefkes Village', duration: '40 min', img: lefkesImg,
        desc: "Drive inland to the picturesque mountain village of Lefkes. Wander through its charming narrow alleys, admire the traditional Cycladic architecture, and enjoy a peaceful atmosphere away from the coast." },
      { label: 'E', name: 'Monastery & Paros Park', duration: '20 min', img: parosParkImg,
        desc: "End your day at Paros Park, near the Monastery of Ai Yiannis Detis. This natural reserve offers beautiful coastal trails. If you're feeling active, take the hiking path to the lighthouse at Cape Korakas for spectacular views of the Aegean." },
    ],
  },
  'beach-tour': {
    title: 'Beach Tour',
    tag: 'Beach Day',
    duration: '9 hours',
    accent: '#1e5f8c',
    heroImg: beachImg,
    description: "Embark on a sun-soaked journey to seven of Paros's most stunning beaches, starting with the tranquil cove of Faragas Beach for a peaceful morning swim. Continue to lively Golden Beach, where golden sands and windsurfers create a vibrant coastal scene. Next, experience the natural clay cliffs of Kalogeros Beach, perfect for a unique skincare mask and refreshing dip. Then head to Santa Maria near Naoussa to soak up the energetic atmosphere before exploring the granite formations and hidden pools of Kolymbithres Beach. Conclude at the calm shores of Monastiri in Paros Park and Krios Beach near Parikia, capturing the island's diverse seaside beauty and panoramic views.",
    features: [
      'Pick up from your location', 'Local knowledge', 'Professional Driver',
      '7 beach stops', 'Swimming time', 'Photography stops',
    ],
    stops: [
      { label: '1', name: 'Faragas Beach', duration: null, img: faragasImg,
        desc: 'Start your day at this sheltered southern beach, known for its calm waters, natural setting, and relaxed vibe. Faragas is ideal for a peaceful swim away from the crowds.' },
      { label: '2', name: 'Golden Beach', duration: null, img: beachImg,
        desc: 'One of the most famous beaches on the island, featuring long stretches of fine golden sand and crystal-clear waters — perfect for swimming or watching the windsurfers glide across the bay.' },
      { label: '3', name: 'Kalogeros Beach', duration: null, img: kalogerosImg,
        desc: 'Known for its natural clay cliffs, Kalogeros offers a unique experience — many visitors enjoy applying the clay as a natural skin mask. The beach is also beautiful and unspoiled, great for a refreshing dip.' },
      { label: '4', name: 'Santa Maria Beach', duration: null, img: santaMariaImg,
        desc: 'Located near Naoussa, Santa Maria is a lively beach with soft sand and great views of Naxos. Ideal for both swimming and people-watching, with options for snacks or a drink nearby.' },
      { label: '5', name: 'Kolymbithres Beach', duration: null, img: kolymImg,
        desc: "One of Paros' most iconic beaches, famous for its smooth granite rock formations that create small private coves and pools. A fun and scenic spot for a short swim and unique photos." },
      { label: '6', name: 'Monastiri Beach', duration: null, img: monastiriImg,
        desc: 'Tucked inside the Paros Park nature reserve, Monastiri is a calm and family-friendly beach surrounded by dramatic rocky hills. The water is shallow and perfect for relaxing.' },
      { label: '7', name: 'Krios Beach', duration: null, img: kriosImg,
        desc: "End your beach tour with a swim at Krios, located just across the bay from Parikia. With soft sand, turquoise waters, and a view of the town, it's the perfect final stop before returning." },
    ],
  },
  'half-day-island-tour': {
    title: 'Half-Day Island Tour',
    tag: 'Half Day',
    duration: 'Minimum 4 hours',
    accent: '#2a7a4e',
    heroImg: alykiImg,
    description: "Begin in the quaint fishing village of Alyki, strolling its harbor and soaking up the authentic Cycladic atmosphere. Continue to Golden Beach to admire its famous golden sands and crystal-clear waters, stopping for photos or a quick shore walk. Then visit the seaside settlements of Piso Livadi and Logaras for a glimpse of local fishing life and a beachside coffee break. Pause at the hilltop Agios Antonios Monastery above Marpissa for panoramic island and sea views and a peaceful wander. Finish your half-day journey exploring the charming mountain village of Lefkes before choosing to conclude in either stylish Naoussa or historic Parikia.",
    features: [
      'Pick up from your location', 'Professional Driver', 'Local Knowledge',
      'Breathtaking scenery', 'Flexible Duration', 'Multiple stops', 'Minimum 4 hours',
    ],
    stops: [
      { label: 'A', name: 'Alyki', duration: '10 min', img: alykiImg,
        desc: 'Begin your tour in the quaint fishing village of Alyki, located on the southern coast of Paros. Enjoy a quick stroll by the harbor, observe the traditional boats, and take in the relaxed, authentic atmosphere of a Cycladic seaside village.' },
      { label: 'B', name: 'Golden Beach', duration: null, img: beachImg,
        desc: "Continue along the eastern coastline to one of Paros' most famous beaches. Golden Beach is known for its golden sand and clear waters, and it's a popular spot for windsurfing. A short stop allows time for photos or a quick beachside walk." },
      { label: 'C', name: 'Piso Livadi & Logaras', duration: '15 min', img: pisoImg,
        desc: 'Next, head to the charming seaside settlements of Piso Livadi and nearby Logaras. These villages offer a beautiful mix of quiet fishing life and vibrant beach cafés — perfect for a short break by the sea.' },
      { label: 'D', name: 'Agios Antonios Monastery', duration: '15 min', img: monasteryImg,
        desc: "Located on the hill above Marpissa, this 17th-century monastery offers panoramic views over the island and the Aegean Sea. It's a peaceful and spiritual stop, ideal for photos and a short walk around the site." },
      { label: 'E', name: 'Lefkes Village', duration: '45 min', img: lefkesImg,
        desc: "Drive up into the mountains to visit Lefkes, one of Paros' most beautiful and traditional villages. Explore its whitewashed alleyways, admire its neoclassical architecture, and enjoy a taste of authentic island life away from the coast." },
      { label: 'F', name: 'Naoussa or Parikia', duration: '45 min', img: naousaImg,
        desc: 'Conclude your tour with a visit to either Naoussa — the cosmopolitan fishing town with vibrant boutiques — or Parikia, the island\'s capital. The choice depends on your interests and final drop-off preference.' },
    ],
  },
  'full-day-island-tour': {
    title: 'Full-Day Island Tour',
    tag: 'Full Day',
    duration: '8 hours',
    accent: '#c47d2e',
    heroImg: fullDayImg,
    description: "Your full-day adventure starts in the charming fishing harbor of Alyki, where you'll enjoy a leisurely stroll amid traditional boats and coastal scenery. Next, relax on either Golden Beach or the secluded Faragas Beach for a two-hour swim and sunbathe in their pristine waters. The tour continues along the east coast to Piso Livadi for a seaside coffee, followed by a visit to the hilltop Agios Antonios Monastery with its breathtaking island vistas. After lunch in the marble-paved alleys of Lefkes, explore the vibrant harbour town of Naoussa, famed for its boutiques, art galleries, and seaside cafés. Finally, unwind with a coastal walk at Monastiri in Paros Park before your return, taking in serene landscapes and a memorable sunset.",
    features: [
      'Pick up from your location', 'Professional Driver', 'Local Knowledge',
      'Breathtaking scenery', 'Sunset view', 'Multiple stops', 'Minimum 8 hours',
    ],
    stops: [
      { label: 'A', name: 'Alyki', duration: '20 min', img: alykiImg,
        desc: 'Start your day in the charming fishing village of Alyki on the southern coast of Paros. Enjoy a peaceful stroll along the traditional harbor, admire the fishing boats, and get a glimpse of authentic island life.' },
      { label: 'B', name: 'Swim Stop — Golden Beach or Faragas', duration: '2 hrs', img: faragasImg,
        desc: "Head to one of Paros's top beaches for a refreshing swim and relaxation. Golden Beach offers long stretches of fine sand and excellent conditions for windsurfing, while Faragas, a more secluded cove, is perfect for a calmer, scenic swim." },
      { label: 'C', name: 'Piso Livadi', duration: '20 min', img: pisoImg,
        desc: "Continue along the east coast to the picturesque seaside village of Piso Livadi. With its whitewashed buildings, small marina, and laid-back vibe, it's a great spot for a coffee break or seaside photo stop." },
      { label: 'D', name: 'Agios Antonios Monastery', duration: '20 min', img: monasteryImg,
        desc: 'Visit the hilltop monastery of Agios Antonios above Marpissa. The panoramic views of the island and the sea are stunning, and the serene atmosphere of the old monastery adds a spiritual touch to the tour.' },
      { label: 'E', name: 'Lefkes Village', duration: '1 hr', img: lefkesImg,
        desc: "Travel inland to the traditional mountain village of Lefkes, once the capital of Paros. Walk through its narrow marble-paved alleys, admire the Cycladic architecture, and perhaps enjoy a light lunch or coffee in the peaceful village square." },
      { label: 'F', name: 'Naoussa', duration: '1.5 hrs', img: naousaImg,
        desc: 'Spend the afternoon in Naoussa, one of the most beautiful and lively towns in the Cyclades. Explore the charming old harbor, boutique shops, art galleries, and perhaps enjoy a drink or ice cream by the sea.' },
      { label: 'G', name: 'Monastiri', duration: '20 min', img: monastiriImg,
        desc: 'End your day at Monastiri, part of the Paros Park natural reserve. Take a short walk along the coast, relax by the beach, or simply enjoy the landscape before heading back.' },
    ],
  },
  'custom-tour': {
    title: 'Custom Tour',
    tag: 'Bespoke',
    duration: 'Flexible',
    accent: '#7b5ea7',
    heroImg: kalogerosImg,
    description: "Design your own Paros experience with a fully customisable itinerary. Choose from historical landmarks, scenic villages, secret beaches, and local culinary stops. Enjoy the flexibility to set your pace and personalise each stop with insights from our knowledgeable guides. Travel comfortably with a professional driver who knows the island's hidden gems. Create lasting memories on a tour that's uniquely yours.",
    features: [
      'Fully customisable itinerary', 'Local recommendations', 'Flexible schedule',
      'Professional Driver', 'Multiple stops',
    ],
    stops: [],
  },
};

const route       = useRoute();
const router      = useRouter();
const showBooking = ref(false);
const tour        = computed(() => TOURS_DATA[route.params.id] || null);

function goBack() { router.push('/#tours'); }
</script>

<template>
  <div :style="{ background: 'var(--sand)', minHeight: '100vh' }">
    <Navbar @book="showBooking = true" />
    <BookingDrawer v-model:open="showBooking" />

    <template v-if="tour">
      <!-- Hero -->
      <div :style="{
        position: 'relative', height: 'clamp(340px, 55vh, 600px)',
        overflow: 'hidden',
        background: tour.heroImg ? '#000' : `linear-gradient(135deg, #0d2137 0%, ${tour.accent} 100%)`,
      }">
        <div v-if="tour.heroImg" :style="{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${tour.heroImg})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.55,
        }" />
        <div :style="{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(13,33,55,0.85) 0%, rgba(13,33,55,0.2) 60%, transparent 100%)',
        }" />
        <!-- Back link -->
        <button
          @click="goBack"
          :style="{
            position: 'absolute', top: '90px', left: 'clamp(20px,5vw,60px)',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '100px', padding: '7px 18px',
            fontFamily: '\'DM Sans\',sans-serif', fontSize: '12px',
            color: 'rgba(255,255,255,0.8)', cursor: 'pointer', letterSpacing: '0.08em',
          }"
        >← All Tours</button>
        <!-- Hero text -->
        <div :style="{
          position: 'absolute', bottom: 'clamp(32px,5vh,60px)',
          left: 'clamp(20px,5vw,60px)', right: 'clamp(20px,5vw,60px)',
        }">
          <div :style="{
            display: 'inline-block',
            background: tour.accent, color: '#fff',
            fontFamily: '\'DM Sans\',sans-serif', fontSize: '10px',
            fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
            padding: '5px 14px', borderRadius: '100px', marginBottom: '14px',
          }">{{ tour.tag }}</div>
          <h1 :style="{
            fontFamily: '\'Cormorant Garamond\',serif',
            fontSize: 'clamp(36px,6vw,72px)', fontWeight: 600,
            color: '#fff', lineHeight: 1.05, margin: '0 0 10px',
          }">{{ tour.title }}</h1>
          <div :style="{
            fontFamily: '\'DM Sans\',sans-serif', fontSize: '14px',
            color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em',
          }">⏱ {{ tour.duration }}</div>
        </div>
      </div>

      <!-- Description -->
      <div :style="{ background: 'var(--sand)', padding: 'clamp(48px,7vw,96px) clamp(20px,5vw,80px)' }">
        <p :style="{
          fontFamily: '\'DM Sans\',sans-serif', fontSize: 'clamp(15px,1.6vw,17px)',
          color: 'var(--muted)', lineHeight: 1.8,
          maxWidth: '720px', margin: '0 auto', textAlign: 'center',
        }">{{ tour.description }}</p>
      </div>

      <!-- Features -->
      <div :style="{
        background: '#fff',
        padding: 'clamp(40px,6vw,80px) clamp(20px,5vw,80px)',
        borderTop: '1px solid rgba(13,33,55,0.07)',
        borderBottom: '1px solid rgba(13,33,55,0.07)',
      }">
        <div :style="{
          fontFamily: '\'DM Sans\',sans-serif', fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--sea)', textAlign: 'center', marginBottom: '28px',
        }">What's Included</div>
        <div :style="{
          display: 'flex', flexWrap: 'wrap', gap: '12px',
          justifyContent: 'center', maxWidth: '780px', margin: '0 auto',
        }">
          <div
            v-for="f in tour.features" :key="f"
            :style="{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 18px', borderRadius: '100px',
              border: `1px solid ${tour.accent}30`,
              background: `${tour.accent}08`,
              fontFamily: '\'DM Sans\',sans-serif', fontSize: '13px',
              color: 'var(--navy)',
            }"
          >
            <span :style="{ width:'6px', height:'6px', borderRadius:'50%', background: tour.accent, flexShrink:0 }" />
            {{ f }}
          </div>
        </div>
      </div>

      <!-- Itinerary (skipped for custom tour which has stops: []) -->
      <div v-if="tour.stops.length > 0" :style="{
        background: 'var(--navy)',
        padding: 'clamp(56px,8vw,112px) clamp(20px,5vw,80px)',
      }">
        <div :style="{
          fontFamily: '\'DM Sans\',sans-serif', fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--gold)', textAlign: 'center', marginBottom: '12px',
        }">Itinerary</div>
        <h2 :style="{
          fontFamily: '\'Cormorant Garamond\',serif',
          fontSize: 'clamp(30px,4vw,48px)', fontWeight: 300,
          color: '#fff', textAlign: 'center', marginBottom: 'clamp(40px,6vh,72px)',
          lineHeight: 1.1,
        }">Your Journey at a Glance</h2>

        <div :style="{ maxWidth: '760px', margin: '0 auto' }">
          <div
            v-for="(stop, idx) in tour.stops" :key="stop.name"
            :style="{ display: 'flex', gap: 'clamp(16px,3vw,32px)' }"
          >
            <!-- Timeline spine -->
            <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }">
              <div :style="{
                width: '40px', height: '40px', borderRadius: '50%',
                background: tour.accent, color: '#fff',
                fontFamily: '\'DM Sans\',sans-serif', fontWeight: 700, fontSize: '13px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, zIndex: 1,
              }">{{ stop.label }}</div>
              <div v-if="idx < tour.stops.length - 1" :style="{
                width: '2px', flex: 1, minHeight: '32px',
                borderLeft: `2px dashed ${tour.accent}60`,
                margin: '6px 0',
              }" />
            </div>
            <!-- Stop card -->
            <div :style="{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '14px', overflow: 'hidden',
              marginBottom: idx < tour.stops.length - 1 ? 'clamp(12px,2vw,20px)' : '0',
            }">
              <img
                v-if="stop.img"
                :src="stop.img" :alt="stop.name"
                :style="{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }"
              />
              <div :style="{ padding: 'clamp(16px,2.5vw,24px)' }">
                <div :style="{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px',
                }">
                  <div :style="{
                    fontFamily: '\'Cormorant Garamond\',serif',
                    fontSize: 'clamp(18px,2.5vw,22px)', fontWeight: 600,
                    color: '#fff', lineHeight: 1.2,
                  }">{{ stop.name }}</div>
                  <div v-if="stop.duration" :style="{
                    fontFamily: '\'DM Sans\',sans-serif', fontSize: '11px', fontWeight: 600,
                    color: tour.accent, background: `${tour.accent}20`,
                    border: `1px solid ${tour.accent}40`,
                    padding: '3px 12px', borderRadius: '100px', letterSpacing: '0.08em',
                    whiteSpace: 'nowrap',
                  }">⏱ {{ stop.duration }}</div>
                </div>
                <p :style="{
                  fontFamily: '\'DM Sans\',sans-serif', fontSize: '14px',
                  color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0,
                }">{{ stop.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Footer -->
      <div :style="{
        background: 'var(--sand)',
        padding: 'clamp(64px,9vw,120px) clamp(20px,5vw,80px)',
        textAlign: 'center',
        borderTop: '1px solid rgba(13,33,55,0.08)',
      }">
        <div :style="{
          fontFamily: '\'DM Sans\',sans-serif', fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--sea)', marginBottom: '14px',
        }">Reserve Your Spot</div>
        <h2 :style="{
          fontFamily: '\'Cormorant Garamond\',serif',
          fontSize: 'clamp(32px,5vw,56px)', fontWeight: 300,
          color: 'var(--navy)', marginBottom: '32px', lineHeight: 1.1,
        }">
          Ready to <em :style="{ fontStyle:'italic', fontWeight:600, color: tour.accent }">explore?</em>
        </h2>
        <button
          @click="showBooking = true"
          :style="{
            padding: '15px 48px',
            background: `linear-gradient(135deg, ${tour.accent}, ${tour.accent}cc)`,
            border: 'none', borderRadius: '8px',
            fontFamily: '\'DM Sans\',sans-serif', fontSize: '14px', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#fff', cursor: 'pointer',
            boxShadow: `0 8px 32px ${tour.accent}40`,
            transition: 'transform 0.2s, box-shadow 0.2s',
          }"
          @mouseenter="e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 14px 40px ${tour.accent}55`; }"
          @mouseleave="e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow=`0 8px 32px ${tour.accent}40`; }"
        >Book This Tour →</button>
      </div>
    </template>

    <!-- 404 fallback -->
    <div v-else :style="{
      minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '\'DM Sans\',sans-serif', color: 'var(--muted)',
    }">Tour not found.</div>

    <Footer />
  </div>
</template>
