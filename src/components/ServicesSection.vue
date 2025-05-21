<template>
  <section class="services-section">
    <h1 class="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-800 text-center">Our popular Services:</h1>
    <div class="carousel-container">
      <div class="carousel">
        <button class="carousel__nav carousel__nav--prev" @click="prev">‹</button>

        <div class="carousel__viewport">
          <div
            v-for="(item, idx) in tabs"
            :key="item.id"
            class="carousel__slide"
            :class="{
              'is-active': idx === activeIndex,
              'is-prev': idx === prevIndex,
              'is-next': idx === nextIndex
            }"
            @click="select(idx)"
          >
            <img :src="images[item.id]" :alt="item.label" class="carousel__image" />
          </div>
        </div>

        <button class="carousel__nav carousel__nav--next" @click="next">›</button>
      </div>

      <div class="carousel__title">
        {{ tabs[activeIndex].label }}
      </div>
      <p class="carousel__description">
        {{ descriptions[tabs[activeIndex].id] }}
      </p>

      <router-link class="learn-more-button" :to="`/tours/${tabs[activeIndex].id}`">
        Learn More
      </router-link>

      <!-- Zoom modal -->
      <div v-if="isModalOpen" class="modal" @click.self="closeModal">
        <div class="modal__content">
          <button class="modal__close" @click="closeModal">&times;</button>
          <img
            :src="images[tabs[activeIndex].id]"
            :alt="tabs[activeIndex].label + ' zoomed'"
            class="modal__img"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import alykiImage from '../assets/etp-alyki.jpg';
import ampelasImage from '../assets/etp-ampelas.jpg';
import beachTourImage from '../assets/etp-drios.jpg';
import halfDayTourImage from '../assets/etp-naousa.jpg';
import historyTourImage from '../assets/etp-history-tour.jpg';
import fullDayTourImage from '../assets/etp-fullday-tour.jpeg';

export default {
  name: 'TourCarousel',
  data() {
    return {
      tabs: [
        { id: 'history-tour', label: 'History Tour – 4 Hours' },
        { id: 'beach-tour', label: 'Beach Tour – 9 Hours' },
        { id: 'half-day-island-tour', label: 'Half-Day Island Tour – 4 Hours' },
        { id: 'full-day-island-tour', label: 'Full-Day Island Tour – 8 Hours' }
      ],
      descriptions: {
        'history-tour': `Begin in Parikia, exploring the Archaeological Museum with its ancient artifacts before visiting the early Christian wonders of Panagia Ekatontapyliani. Next, head to Alyki to see the Cycladic Folklore Museum’s intricate ship models and learn about the island’s maritime heritage. In Marpissa, the Museum of Sculpture showcases local artist Nikos Perantinos and Paros’s rich connection to marble artistry. Then venture inland to Lefkes, wandering its winding alleys and admiring traditional Cycladic architecture in this serene mountain village. Finally, conclude at Paros Park’s monastery, where coastal trails and a hike to Cape Korakas reveal stunning Aegean vistas.`,
        'beach-tour': `Embark on a sun-soaked journey to seven of Paros’s most stunning beaches, starting with the tranquil cove of Faragas Beach for a peaceful morning swim. Continue to lively Golden Beach, where golden sands and windsurfers create a vibrant coastal scene. Next, experience the natural clay cliffs of Kalogeros Beach, perfect for a unique skincare mask and refreshing dip. Then head to Santa Maria near Naoussa to soak up the energetic atmosphere before exploring the granite formations and hidden pools of Kolymbithres Beach. Conclude at the calm shores of Monastiri in Paros Park and Krios Beach near Parikia, capturing the island’s diverse seaside beauty and panoramic views.`,
        'half-day-island-tour': `Begin in the quaint fishing village of Alyki, strolling its harbor and soaking up the authentic Cycladic atmosphere. Continue to Golden Beach to admire its famous golden sands and crystal-clear waters, stopping for photos or a quick shore walk. Then visit the seaside settlements of Piso Livadi and Logaras for a glimpse of local fishing life and a beachside coffee break. Pause at the hilltop Agios Antonios Monastery above Marpissa for panoramic island and sea views and a peaceful wander. Finish your half-day journey exploring the charming mountain village of Lefkes before choosing to conclude in either stylish Naoussa or historic Parikia.`,
        'full-day-island-tour': `Your full-day adventure starts in the charming fishing harbor of Alyki, where you’ll enjoy a leisurely stroll amid traditional boats and coastal scenery. Next, relax on either Golden Beach or the secluded Faragas Beach for a two-hour swim and sunbathe in their pristine waters. The tour continues along the east coast to Piso Livadi for a seaside coffee, followed by a visit to the hilltop Agios Antonios Monastery with its breathtaking island vistas. After lunch in the marble-paved alleys of Lefkes, explore the vibrant harbor town of Naoussa, famed for its boutiques, art galleries, and seaside cafés. Finally, unwind with a coastal walk at Monastiri in Paros Park before your return, taking in serene landscapes and a memorable sunset.`
      },
      images: {
        'history-tour': historyTourImage,
        'beach-tour': beachTourImage,
        'half-day-island-tour': halfDayTourImage,
        'full-day-island-tour': fullDayTourImage
      },
      activeIndex: 0,
      isModalOpen: false
    };
  },
  computed: {
    prevIndex() {
      return (this.activeIndex - 1 + this.tabs.length) % this.tabs.length;
    },
    nextIndex() {
      return (this.activeIndex + 1) % this.tabs.length;
    }
  },
  methods: {
    select(idx) {
      if (idx === this.activeIndex) {
        this.openModal();
      } else {
        this.activeIndex = idx;
      }
    },
    prev() {
      this.activeIndex = this.prevIndex;
    },
    next() {
      this.activeIndex = this.nextIndex;
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    }
  }
};
</script>

<style scoped>
.services-section {
  background: linear-gradient(to bottom, white 0%, white 90%, #d9b16b 100%);
  padding: 4rem 0;
}
.services-header {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333;
}
.carousel-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}
.carousel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}
.carousel__nav {
  background: none;
  border: none;
  font-size: 3rem;
  cursor: pointer;
  z-index: 2;
  color: #333;
  padding: 0 1rem;
}
.carousel__viewport {
  overflow: visible;
  width: 80%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.carousel__slide {
  position: absolute;
  transition: all 0.5s ease;
  opacity: 0;
  transform: scale(0.7);
  filter: blur(4px);
}
.carousel__slide.is-prev {
  opacity: 1;
  transform: scale(0.85) translateX(-140%);
}
.carousel__slide.is-next {
  opacity: 1;
  transform: scale(0.85) translateX(140%);
}
.carousel__slide.is-active {
  opacity: 1;
  transform: scale(1) translateX(0);
  filter: none;
  z-index: 1;
}
.carousel__image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
}
.carousel__slide.is-active .carousel__image {
  width: 350px;
  height: 350px;
}
.carousel__title {
  margin-top: 1.5rem;
  font-size: 1.75rem;
  font-weight: bold;
}
.carousel__description {
  margin-top: 0.5rem;
  font-size: 2rem;
  color: #555;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal__content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
}
.modal__img {
  display: block;
}
.modal__close {
  position: absolute;
  top: -20px;
  right: -20px;
  background: #fff;
  border: none;
  font-size: 2.5rem;
  line-height: 1;
  cursor: pointer;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive */
@media (max-width: 768px) {
  .services-section {
    padding: 3rem 0;
  }
  .services-header {
    font-size: 2rem;
  }
  .carousel__nav {
    font-size: 2.5rem;
    padding: 0 0.5rem;
  }
  .carousel {
    overflow-x: hidden;
  }
  .carousel__viewport {
    width: 100%;
    height: 300px;
    overflow: hidden;
  }
  .carousel__image {
    width: 150px;
    height: 150px;
  }
  .carousel__slide.is-active .carousel__image {
    width: 250px;
    height: 250px;
  }
  .carousel__description {
    max-width: 90%;
    font-size: 0.9rem;
  }
}
.learn-more-button {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #d9b16b;
  color: white;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: bold;
}
</style>
