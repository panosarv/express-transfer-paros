<template>
  <section class="services-section">
    <h1 class="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-800 text-center "> Check out our services</h1>
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
import driosImage from '../assets/etp-drios.jpg';
import logarasImage from '../assets/etp-logaras.jpg';
import naousaImage from '../assets/etp-naousa.jpg';
import parikiaImage from '../assets/etp-parikia.jpg';

export default {
  name: 'PricingCarousel',
  data() {
    return {
      tabs: [
        { id: 'alyki', label: 'Alyki' },
        { id: 'ampelas', label: 'Ampelas' },
        { id: 'drios', label: 'Drios – Golden Beach' },
        { id: 'logaras', label: 'Logaras' },
        { id: 'naousa', label: 'Naousa' },
        { id: 'parikia', label: 'Parikia' }
      ],
      descriptions: {
        alyki: 'Alyki is a charming fishing village known for its salt pans and traditional Greek tavernas by the sea.',
        ampelas: 'Ampelas features a sandy bay lined with olive trees and quiet beachfronts ideal for relaxing.',
        drios: 'Drios – Golden Beach is a popular resort area with golden sands and clear blue waters perfect for water sports.',
        logaras: 'Logaras is a seaside village offering sheltered beaches and picturesque coastal views.',
        naousa: 'Naousa is a picturesque fishing port famous for its waterfront restaurants and Venetian harbor.',
        parikia: 'Parikia, the capital of Paros, boasts a historic old town with whitewashed houses and the iconic Panagia Ekatontapiliani church.'
      },
      activeIndex: 0,
      isModalOpen: false,
      images: {
        alyki: alykiImage,
        ampelas: ampelasImage,
        drios: driosImage,
        logaras: logarasImage,
        naousa: naousaImage,
        parikia: parikiaImage
      }
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
</style>
