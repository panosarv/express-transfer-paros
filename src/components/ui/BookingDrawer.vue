<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { trackBookingSubmission } from '../../utils/analytics';
import vitoImage from '../../assets/etp_vito_modal.png';
import peugeotImage from '../../assets/etp_5008_modal.png';

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:open']);

const currentStep = ref(1);
const finalStep = 6;

const form = reactive({
  type: '',
  tour: '',
  pickupLocation: '',
  dropoffLocation: '',
  date: '',
  time: '',
  people: 1,
  luggage: 0,
  customDescription: '',
  vehicle: '',
  name: '',
  surname: '',
  email: '',
  phone: '',
  idNumber: '',
  price: 0
});

const tours = [
  'History Tour ~4h',
  'Half Day Island Tour ~4h',
  'Full Day Island Tour ~8h',
  'Beaches Exploration ~9h',
  'Custom Tour',
];

const priceTables = {
  Parikia: {
    Naousa: { '1-4': 36, '5-8': 50 },
    Monastiri: { '1-4': 40, '5-8': 55 },
    'Airport - Alyki': { '1-4': 40, '5-8': 55 },
    'Drios - ΧΑ': { '1-4': 50, '5-8': 65 },
    Lefkes: { '1-4': 45, '5-8': 60 },
    'Piso Livadi': { '1-4': 50, '5-8': 65 },
    Pounta: { '1-4': 36, '5-8': 45 },
    'Krios - cabana': { '1-4': 36, '5-8': 40 },
    'SantaMaria - Ampelas': { '1-4': 45, '5-8': 60 },
    Parikia: { '1-4': 36, '5-8': 50 }
  },
  Naousa: {
    Parikia: { '1-4': 36, '5-8': 50 },
    Monastiri: { '1-4': 36, '5-8': 45 },
    'Airport - Alyki': { '1-4': 50, '5-8': 65 },
    'Drios - ΧΑ': { '1-4': 45, '5-8': 60 },
    Lefkes: { '1-4': 40, '5-8': 55 },
    'Piso Livadi': { '1-4': 40, '5-8': 55 },
    Pounta: { '1-4': 50, '5-8': 65 },
    'Krios - cabana': { '1-4': 45, '5-8': 60 },
    'SantaMaria - Ampelas': { '1-4': 36, '5-8': 45 },
    Naousa: { '1-4': 36, '5-8': 50 }
  },
  'SantaMaria - Ampelas': {
    Parikia: { '1-4': 45, '5-8': 60 },
    Naousa: { '1-4': 36, '5-8': 45 },
    Monastiri: { '1-4': 40, '5-8': 55 },
    'Airport - Alyki': { '1-4': 55, '5-8': 70 },
    'Drios - ΧΑ': { '1-4': 45, '5-8': 60 },
    Lefkes: { '1-4': 40, '5-8': 55 },
    'Piso Livadi': { '1-4': 40, '5-8': 55 },
    Pounta: { '1-4': 55, '5-8': 70 },
    'Krios - cabana': { '1-4': 45, '5-8': 60 },
    'SantaMaria - Ampelas': { '1-4': 36, '5-8': 50 }
  },
  'Drios - ΧΑ': {
    Parikia: { '1-4': 50, '5-8': 65 },
    Naousa: { '1-4': 45, '5-8': 60 },
    Monastiri: { '1-4': 50, '5-8': 65 },
    'Airport - Alyki': { '1-4': 45, '5-8': 60 },
    Lefkes: { '1-4': 45, '5-8': 60 },
    'Piso Livadi': { '1-4': 40, '5-8': 55 },
    Pounta: { '1-4': 50, '5-8': 65 },
    'Krios - cabana': { '1-4': 55, '5-8': 70 },
    'SantaMaria - Ampelas': { '1-4': 50, '5-8': 65 },
    'Drios - ΧΑ': { '1-4': 36, '5-8': 50 }
  },
  'Airport - Alyki': {
    Parikia: { '1-4': 40, '5-8': 55 },
    Naousa: { '1-4': 50, '5-8': 65 },
    Monastiri: { '1-4': 50, '5-8': 65 },
    'Drios - ΧΑ': { '1-4': 45, '5-8': 60 },
    Lefkes: { '1-4': 50, '5-8': 65 },
    'Piso Livadi': { '1-4': 50, '5-8': 65 },
    Pounta: { '1-4': 36, '5-8': 50 },
    'Krios - cabana': { '1-4': 45, '5-8': 60 },
    'SantaMaria - Ampelas': { '1-4': 55, '5-8': 70 },
    'Airport - Alyki': { '1-4': 36, '5-8': 50 }
  },
  Lefkes: {
    Parikia: { '1-4': 45, '5-8': 60 },
    Naousa: { '1-4': 40, '5-8': 55 },
    Monastiri: { '1-4': 45, '5-8': 60 },
    'Airport - Alyki': { '1-4': 50, '5-8': 65 },
    'Drios - ΧΑ': { '1-4': 45, '5-8': 60 },
    'Piso Livadi': { '1-4': 45, '5-8': 60 },
    Pounta: { '1-4': 50, '5-8': 65 },
    'Krios - cabana': { '1-4': 50, '5-8': 65 },
    'SantaMaria - Ampelas': { '1-4': 40, '5-8': 55 },
    'Lefkes': { '1-4': 36, '5-8': 50 }
  },
  'Piso Livadi': {
    Parikia: { '1-4': 50, '5-8': 65 },
    Naousa: { '1-4': 40, '5-8': 55 },
    Monastiri: { '1-4': 45, '5-8': 60 },
    'Airport - Alyki': { '1-4': 50, '5-8': 65 },
    'Drios - ΧΑ': { '1-4': 45, '5-8': 60 },
    Lefkes: { '1-4': 45, '5-8': 60 },
    Pounta: { '1-4': 50, '5-8': 65 },
    'Krios - cabana': { '1-4': 55, '5-8': 70 },
    'SantaMaria - Ampelas': { '1-4': 45, '5-8': 60 },
    'Piso Livadi': { '1-4': 36, '5-8': 50 }
  },
  'Krios - cabana': {
    Parikia: { '1-4': 36, '5-8': 50 },
    Naousa: { '1-4': 45, '5-8': 60 },
    Monastiri: { '1-4': 36, '5-8': 50 },
    'Airport - Alyki': { '1-4': 45, '5-8': 60 },
    'Drios - ΧΑ': { '1-4': 55, '5-8': 70 },
    Lefkes: { '1-4': 50, '5-8': 65 },
    'Piso Livadi': { '1-4': 55, '5-8': 70 },
    Pounta: { '1-4': 36, '5-8': 50 },
    'SantaMaria - Ampelas': { '1-4': 45, '5-8': 60 },
    'Krios - cabana': { '1-4': 36, '5-8': 50 }
  },
  Monastiri: {
    Parikia: { '1-4': 40, '5-8': 55 },
    Naousa: { '1-4': 36, '5-8': 45 },
    'Airport - Alyki': { '1-4': 50, '5-8': 65 },
    'Drios - ΧΑ': { '1-4': 50, '5-8': 65 },
    Lefkes: { '1-4': 45, '5-8': 60 },
    'Piso Livadi': { '1-4': 40, '5-8': 55 },
    Pounta: { '1-4': 40, '5-8': 55 },
    'Krios - cabana': { '1-4': 36, '5-8': 50 },
    'SantaMaria - Ampelas': { '1-4': 40, '5-8': 55 },
    Monastiri: { '1-4': 36, '5-8': 50 }
  }
};

const pickupMode = ref('list');
const dropoffMode = ref('list');

const pins = [
  { name: 'Parikia', coords: [37.0857, 25.1512] },
  { name: 'Naousa', coords: [37.1236, 25.2387] },
  { name: 'Monastiri', coords: [37.1464, 25.2244] },
  { name: 'Airport - Alyki', coords: [37.0220, 25.1152] },
  { name: 'Drios - ΧΑ', coords: [37.0040, 25.2237] },
  { name: 'Lefkes', coords: [37.0557, 25.2079] },
  { name: 'Piso Livadi', coords: [37.03555, 25.25963] },
  { name: 'Pounta', coords: [37.0377, 25.1014] },
  { name: 'Krios - cabana', coords: [37.0939, 25.1460] },
  { name: 'SantaMaria - Ampelas', coords: [37.1032, 25.2651] }
];

const minDate = computed(() => new Date().toISOString().split('T')[0]);

const vehicleOptions = computed(() => {
  const opts = [];
  if (form.people <= 6) opts.push({ name: 'Peugeot 5008', capacity: 6, image: peugeotImage });
  if (form.people <= 8) opts.push({ name: 'Mercedes Vito', capacity: 8, image: vitoImage });
  return opts;
});

const transferPrice = computed(() => {
  const pu = form.pickupLocation;
  const doff = form.dropoffLocation;
  const origin = priceTables[pu] || {};
  let rates = origin[doff] || (priceTables[doff] && priceTables[doff][pu]);
  if (!rates) return null;
  const bracket = form.vehicle === 'Peugeot 5008' ? form.people <= 4 ? '1-4' : '5-8' : '5-8';
  let p = rates[bracket];
  const h = +form.time?.split(':')[0] || 0;
  if (h < 6) p += 15;
  return p;
});

const totalPrice = computed(() => {
  if (form.type === 'tour' && form.tour !== 'Custom Tour') {
    const hours = form.tour.includes('4h') ? 4 : form.tour.includes('8h') ? 8 : 9;
    if (form.people > 8 || form.vehicle.includes('+')) {
      const p1 = hours === 4 ? 200 : hours === 8 ? 350 : 400;
      const p2 = hours === 4 ? 300 : hours === 8 ? 500 : 550;
      return p1 + p2;
    } else if (form.vehicle === 'Peugeot 5008') {
      return hours === 4 ? 200 : hours === 8 ? 350 : 400;
    } else if (form.vehicle === 'Mercedes Vito') {
      return hours === 4 ? 300 : hours === 8 ? 500 : 550;
    }
    return null;
  } else if (form.type === 'transfer') {
    return (pickupMode.value === 'list' && dropoffMode.value === 'list') ? transferPrice.value : null;
  }
  return null;
});

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return form.type === 'tour' ? !!form.tour : form.type === 'transfer';
    case 2:
      return form.pickupLocation && form.dropoffLocation;
    case 3:
      if (form.type === 'tour' && form.tour === 'Custom Tour') {
        return form.date && form.time && form.people >= 1 && form.customDescription;
      }
      return form.date && form.time && form.people >= 1;
    case 4:
      return form.people > 8 || !!form.vehicle;
    case 5:
      return true;
    default:
      return true;
  }
});

function close() {
  emit('update:open', false);
  setTimeout(() => {
    currentStep.value = 1;
  }, 300);
}

function nextStep() {
  if (canProceed.value && currentStep.value < finalStep) {
    if (form.people > 8 && currentStep.value === 3) {
      form.vehicle = 'Peugeot 5008 + Mercedes Vito';
      currentStep.value = 5;
    } else {
      currentStep.value++;
    }
    if (currentStep.value === 5) {
      form.price = totalPrice.value;
    }
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    if (form.people > 8 && currentStep.value === 5) {
      form.vehicle = '';
      currentStep.value = 3;
    } else {
      currentStep.value--;
    }
    if (currentStep.value === 5) {
      form.price = totalPrice.value;
    }
  }
}

function setCurrentLocation(isDropoff) {
  navigator.geolocation.getCurrentPosition(pos => {
    const coords = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
    isDropoff ? (form.dropoffLocation = coords) : (form.pickupLocation = coords);
  });
}

const bookingForm = ref(null);

function submitForm() {
  trackBookingSubmission(form);
  let f = document.querySelector('#booking-drawer-form');
  Array.from(f.children).forEach(child => {
    if (child.tagName.toLowerCase() !== 'input') {
      f.removeChild(child);
    }
  });
  f.submit();
}

// Reset form when drawer closes
watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    setTimeout(() => {
      currentStep.value = 1;
    }, 300);
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="fixed inset-0 z-[100]">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/70 backdrop-blur-sm"
          @click="close"
        ></div>

        <!-- Drawer Panel -->
        <div class="absolute bottom-0 left-0 right-0 bg-etp-dark rounded-t-3xl max-h-[90vh] overflow-y-auto">
          <!-- Handle bar -->
          <div class="sticky top-0 bg-etp-dark pt-4 pb-2 flex justify-center z-10">
            <div class="w-12 h-1.5 bg-white/30 rounded-full"></div>
          </div>

          <!-- Close button -->
          <button
            @click="close"
            class="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-20"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Form Content -->
          <form
            id="booking-drawer-form"
            ref="bookingForm"
            method="POST"
            action="https://formspree.io/f/xldbkeed"
            class="px-6 pb-8"
            @submit.prevent="submitForm"
          >
            <!-- Hidden fields -->
            <input type="hidden" name="price" :value="form.price" />
            <input type="hidden" name="type" :value="form.type" />
            <input type="hidden" name="tour" :value="form.tour" />
            <input type="hidden" name="pickupLocation" :value="form.pickupLocation" />
            <input type="hidden" name="dropoffLocation" :value="form.dropoffLocation" />
            <input type="hidden" name="date" :value="form.date" />
            <input type="hidden" name="time" :value="form.time" />
            <input type="hidden" name="people" :value="form.people" />
            <input type="hidden" name="luggage" :value="form.luggage" />
            <input type="hidden" name="customDescription" :value="form.customDescription" />
            <input type="hidden" name="name" :value="form.name" />
            <input type="hidden" name="surname" :value="form.surname" />
            <input type="hidden" name="email" :value="form.email" />
            <input type="hidden" name="phone" :value="form.phone" />
            <input type="hidden" name="idNumber" :value="form.idNumber" />
            <input type="hidden" name="vehicle" :value="form.vehicle" />

            <h2 class="text-2xl font-heading text-white mb-6 text-center">Book Your Transfer</h2>

            <!-- Progress Bar -->
            <div class="flex justify-between mb-8 gap-1">
              <span
                v-for="n in finalStep"
                :key="n"
                class="flex-1 h-1 rounded-full transition-colors duration-300"
                :class="n <= currentStep ? 'bg-etp-gold' : 'bg-white/20'"
              ></span>
            </div>

            <!-- Step 1: Booking Type -->
            <Transition name="fade-up" mode="out-in">
              <div v-if="currentStep === 1" class="space-y-4">
                <h3 class="text-lg font-semibold text-white">What would you like to book?</h3>
                <select
                  v-model="form.type"
                  class="w-full border border-white/20 rounded-lg p-3 bg-etp-gray text-white"
                  required
                >
                  <option disabled value="">Select booking type</option>
                  <option value="tour">Private Tour</option>
                  <option value="transfer">Private Transfer</option>
                </select>

                <div v-if="form.type === 'tour'">
                  <label class="block mb-2 text-white/80">Select Tour</label>
                  <select
                    v-model="form.tour"
                    class="w-full border border-white/20 rounded-lg p-3 bg-etp-gray text-white"
                    required
                  >
                    <option disabled value="">Choose a tour</option>
                    <option v-for="t in tours" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>
              </div>
            </Transition>

            <!-- Step 2: Pickup & Dropoff -->
            <Transition name="fade-up" mode="out-in">
              <div v-if="currentStep === 2" class="space-y-6">
                <h3 class="text-lg font-semibold text-white">Pickup & Dropoff</h3>

                <!-- Pickup -->
                <div>
                  <label class="block font-medium mb-2 text-white/80">Pickup location</label>
                  <div class="flex flex-wrap gap-3 mb-3">
                    <label class="inline-flex items-center text-white/70 text-sm">
                      <input type="radio" v-model="pickupMode" value="list" class="mr-2" />
                      <span>Select from list</span>
                    </label>
                    <label class="inline-flex items-center text-white/70 text-sm">
                      <input type="radio" v-model="pickupMode" value="manual" class="mr-2" />
                      <span>Manual</span>
                    </label>
                    <label class="inline-flex items-center text-white/70 text-sm">
                      <input type="radio" v-model="pickupMode" value="current" class="mr-2" />
                      <span>Use my location</span>
                    </label>
                  </div>

                  <select
                    v-if="pickupMode === 'list'"
                    v-model="form.pickupLocation"
                    required
                    class="w-full border border-white/20 rounded-lg p-3 bg-etp-gray text-white"
                  >
                    <option disabled value="">Select location</option>
                    <option v-for="pin in pins" :key="pin.name" :value="pin.name">{{ pin.name }}</option>
                  </select>

                  <input
                    v-if="pickupMode === 'manual'"
                    v-model="form.pickupLocation"
                    type="text"
                    required
                    placeholder="Enter pickup location"
                    class="w-full border border-white/20 rounded-lg p-3 bg-etp-gray text-white"
                  />

                  <button
                    v-if="pickupMode === 'current'"
                    type="button"
                    @click="setCurrentLocation(false)"
                    class="px-4 py-2 bg-etp-gold/20 text-etp-gold rounded-lg hover:bg-etp-gold/30 transition-colors"
                  >
                    {{ form.pickupLocation || 'Get My Location' }}
                  </button>
                </div>

                <!-- Dropoff -->
                <div>
                  <label class="block font-medium mb-2 text-white/80">Dropoff location</label>
                  <div class="flex flex-wrap gap-3 mb-3">
                    <label class="inline-flex items-center text-white/70 text-sm">
                      <input type="radio" v-model="dropoffMode" value="list" class="mr-2" />
                      <span>Select from list</span>
                    </label>
                    <label class="inline-flex items-center text-white/70 text-sm">
                      <input type="radio" v-model="dropoffMode" value="manual" class="mr-2" />
                      <span>Manual</span>
                    </label>
                    <label class="inline-flex items-center text-white/70 text-sm">
                      <input type="radio" v-model="dropoffMode" value="current" class="mr-2" />
                      <span>Use my location</span>
                    </label>
                  </div>

                  <select
                    v-if="dropoffMode === 'list'"
                    v-model="form.dropoffLocation"
                    required
                    class="w-full border border-white/20 rounded-lg p-3 bg-etp-gray text-white"
                  >
                    <option disabled value="">Select location</option>
                    <option v-for="pin in pins" :key="pin.name" :value="pin.name">{{ pin.name }}</option>
                  </select>

                  <input
                    v-if="dropoffMode === 'manual'"
                    v-model="form.dropoffLocation"
                    type="text"
                    required
                    placeholder="Enter dropoff location"
                    class="w-full border border-white/20 rounded-lg p-3 bg-etp-gray text-white"
                  />

                  <button
                    v-if="dropoffMode === 'current'"
                    type="button"
                    @click="setCurrentLocation(true)"
                    class="px-4 py-2 bg-etp-gold/20 text-etp-gold rounded-lg hover:bg-etp-gold/30 transition-colors"
                  >
                    {{ form.dropoffLocation || 'Get My Location' }}
                  </button>
                </div>
              </div>
            </Transition>

            <!-- Step 3: Date, Time, Passengers -->
            <Transition name="fade-up" mode="out-in">
              <div v-if="currentStep === 3" class="space-y-4">
                <h3 class="text-lg font-semibold text-white">Date, Time & Passengers</h3>

                <input
                  type="date"
                  v-model="form.date"
                  :min="minDate"
                  required
                  class="w-full border border-white/20 rounded-lg p-3 bg-etp-gray text-white"
                />
                <input
                  type="time"
                  v-model="form.time"
                  required
                  class="w-full border border-white/20 rounded-lg p-3 bg-etp-gray text-white"
                />
                <input
                  type="number"
                  v-model.number="form.people"
                  min="1"
                  max="14"
                  required
                  placeholder="Number of people (max 14)"
                  class="w-full border border-white/20 rounded-lg p-3 bg-etp-gray text-white"
                />

                <div v-if="form.type === 'transfer'" class="mt-4">
                  <label class="block mb-2 text-white/80">Number of Luggages</label>
                  <input
                    type="number"
                    v-model.number="form.luggage"
                    min="0"
                    max="10"
                    placeholder="Luggages"
                    class="w-full border border-white/20 rounded-lg p-3 bg-etp-gray text-white"
                  />
                </div>

                <div v-if="form.type === 'tour' && form.tour === 'Custom Tour'" class="mt-4">
                  <label class="block mb-2 text-white/80">Describe Your Custom Tour</label>
                  <textarea
                    v-model="form.customDescription"
                    rows="4"
                    placeholder="Please describe your custom tour..."
                    required
                    class="w-full border border-white/20 rounded-lg p-3 bg-etp-gray text-white"
                  ></textarea>
                </div>
              </div>
            </Transition>

            <!-- Step 4: Vehicle Selection -->
            <Transition name="fade-up" mode="out-in">
              <div v-if="currentStep === 4 && form.people <= 8" class="space-y-4">
                <h3 class="text-lg font-semibold text-white">Select Vehicle</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    v-for="v in vehicleOptions"
                    :key="v.name"
                    @click="form.vehicle = v.name"
                    :class="[
                      'flex items-center p-4 rounded-lg cursor-pointer border transition-all',
                      form.vehicle === v.name
                        ? 'border-etp-gold bg-etp-gold/10'
                        : 'border-white/20 hover:border-etp-gold/50'
                    ]"
                  >
                    <img :src="v.image" :alt="v.name" class="w-20 h-20 object-cover rounded mr-4" loading="lazy" />
                    <div>
                      <h4 class="text-white font-semibold">{{ v.name }}</h4>
                      <p class="text-white/60 text-sm">Seats: {{ v.capacity }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Step 5: Summary -->
            <Transition name="fade-up" mode="out-in">
              <div v-if="currentStep === 5" class="space-y-3 text-white">
                <h3 class="text-lg font-semibold">Summary & Price</h3>
                <p><strong>Type:</strong> {{ form.type === 'tour' ? 'Private Tour' : 'Private Transfer' }}</p>
                <p v-if="form.type === 'tour'"><strong>Tour:</strong> {{ form.tour }}</p>
                <p v-else><strong>Route:</strong> {{ form.pickupLocation }} → {{ form.dropoffLocation }}</p>
                <p><strong>Date/Time:</strong> {{ form.date }} at {{ form.time }}</p>
                <p><strong>People:</strong> {{ form.people }}</p>
                <p v-if="form.type === 'tour' && form.tour === 'Custom Tour'"><strong>Details:</strong> {{ form.customDescription }}</p>
                <p v-if="form.type === 'transfer'"><strong>Luggages:</strong> {{ form.luggage }}</p>
                <p v-if="form.people <= 8"><strong>Vehicle:</strong> {{ form.vehicle }}</p>
                <p v-else><strong>Vehicles:</strong> Peugeot 5008 + Mercedes Vito</p>
                <p v-if="totalPrice !== null" class="mt-4 text-2xl font-bold text-etp-gold">Total: {{ totalPrice }}€</p>
                <p v-else class="mt-4 text-etp-gold/80">We will contact you to confirm the price.</p>
              </div>
            </Transition>

            <!-- Step 6: User Information -->
            <Transition name="fade-up" mode="out-in">
              <div v-if="currentStep === 6" class="space-y-4">
                <h3 class="text-lg font-semibold text-white">Your Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="Name"
                    required
                    class="w-full border border-white/20 rounded-lg p-3 bg-etp-gray text-white"
                  />
                  <input
                    v-model="form.surname"
                    type="text"
                    placeholder="Surname"
                    required
                    class="w-full border border-white/20 rounded-lg p-3 bg-etp-gray text-white"
                  />
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="Email"
                    required
                    class="w-full border border-white/20 rounded-lg p-3 bg-etp-gray text-white"
                  />
                  <input
                    v-model="form.phone"
                    type="tel"
                    placeholder="Phone"
                    required
                    class="w-full border border-white/20 rounded-lg p-3 bg-etp-gray text-white"
                  />
                  <input
                    v-model="form.idNumber"
                    type="text"
                    placeholder="ID or Passport"
                    required
                    class="w-full border border-white/20 rounded-lg p-3 bg-etp-gray text-white md:col-span-2"
                  />
                </div>
              </div>
            </Transition>

            <!-- Navigation Buttons -->
            <div class="flex justify-between mt-8">
              <button
                type="button"
                class="px-6 py-3 border border-white/30 rounded-lg text-white hover:border-etp-gold hover:text-etp-gold transition-colors"
                @click="currentStep === 1 ? close() : prevStep()"
              >
                {{ currentStep === 1 ? 'Cancel' : 'Back' }}
              </button>
              <button
                v-if="currentStep < finalStep"
                type="button"
                class="px-6 py-3 bg-etp-gold text-etp-dark rounded-lg font-semibold hover:bg-etp-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                @click="nextStep()"
                :disabled="!canProceed"
              >
                Next
              </button>
              <button
                v-else
                type="submit"
                class="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Submit Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Drawer slide animation */
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from > div:last-child,
.drawer-leave-to > div:last-child {
  transform: translateY(100%);
}

/* Fade up transition for steps */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
