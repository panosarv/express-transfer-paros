<template>
  <div class="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#232436] to-[#2C2C2C] text-white" id="contact">
    <div class="max-w-7xl mx-auto text-center mb-8">
      <h2 class="text-xl tracking-widest uppercase text-[#cba671] font-theme-heading mb-2">
        Last Minute Bookings
      </h2>
      <p class="text-white mb-6">
        Choose any of the methods below to contact Express Transfer Paros:
      </p>
      <button
        class="bg-[#cba671] text-[#232436] px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#B4952E] transition-colors"
        @click="openModal">
        Book Online
      </button>
    </div>

    <div class="max-w-7xl mx-auto space-y-6 text-center">
      <a href="https://wa.me/306980911843" target="_blank" rel="noopener noreferrer"
        class="block text-white hover:underline">
        WhatsApp: +30 698 091 1843
      </a>
      <a href="viber://chat?number=%2B306980911843" class="block text-white hover:underline">
        Viber: +30 698 091 1843
      </a>
      <a href="mailto:info@expresstransferparos.com" class="block text-white hover:underline">
        Email: info@expresstransferparos.com
      </a>
    </div>

    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <form
        ref="bookingForm"
        method="POST"
        action="https://formspree.io/f/xldbkeed"
        class="bg-[#232436] rounded shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative text-white"
        @submit.prevent="submitForm"
        
      >
        <button type="button" class="absolute top-4 right-4 text-gray-300 hover:text-white" @click="closeModal">
          &times;
        </button>

        <div class="flex justify-between mb-4">
          <span
            v-for="n in finalStep"
            :key="n"
            class="w-1/5 h-1 rounded"
            :class="n <= currentStep ? 'bg-[#cba671]' : 'bg-gray-700'"
          ></span>
        </div>

        <!-- FormSubmit hidden fields -->
        <input type="hidden" name ="price" :value="form.price" />
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

        
        
        <!-- ensure vehicle always posts -->
        <input type="hidden" name="vehicle" :value="form.vehicle" />

        <!-- Step 1 -->
        <transition name="fade-up" mode="out-in">
          <div v-if="currentStep === 1" class="space-y-4">
            <h3 class="text-lg font-semibold">What would you like to book?</h3>
            <select
              name="type"
              v-model="form.type"
              class="w-full border rounded p-2 bg-[#2C2C2C]"
              required
            >
              <option disabled value="">Select booking type</option>
              <option value="tour">Private Tour</option>
              <option value="transfer">Private Transfer</option>
            </select>

            <div v-if="form.type === 'tour'">
              <label class="block mb-2">Select Tour</label>
              <select
                name="tour"
                v-model="form.tour"
                class="w-full border rounded p-2 bg-[#2C2C2C]"
                required
              >
                <option disabled value="">Choose a tour</option>
                <option v-for="t in tours" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
          </div>
        </transition>

        <!-- Step 2 -->
        <transition name="fade-up" mode="out-in">
          <div v-if="currentStep === 2" class="space-y-6">
            <h3 class="text-lg font-semibold">Pickup & Dropoff</h3>

            <!-- Pickup -->
            <div>
              <label class="block font-medium mb-1">Pickup location</label>
              <div class="flex gap-4 mb-2">
                <label class="inline-flex items-center">
                  <input type="radio" v-model="pickupMode" value="manual" name="pickupMode" />
                  <span class="ml-2">Manual</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="pickupMode" value="current" name="pickupMode" />
                  <span class="ml-2">Use my location</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="pickupMode" value="list" name="pickupMode" />
                  <span class="ml-2">Select from list</span>
                </label>
              </div>

              <div v-if="pickupMode === 'manual'">
                <input
                  name="pickupLocation"
                  v-model="form.pickupLocation"
                  type="text"
                  required
                  class="w-full border rounded p-2 bg-[#2C2C2C]"
                />
              </div>
              <div v-if="pickupMode === 'current'">
                <input
                  name="pickupLocation"
                  v-model="form.pickupLocation"
                  type="hidden"
                />
                <button
                  type="button"
                  @click="setCurrentLocation(false)"
                  class="px-3 py-1 bg-blue-100 text-blue-700 rounded"
                >
                  Use my location
                </button>
              </div>
              <div v-if="pickupMode === 'list'">
                <select
                  name="pickupLocation"
                  v-model="form.pickupLocation"
                  required
                  class="w-full border rounded p-2 bg-[#2C2C2C]"
                >
                  <option disabled value="">Select location</option>
                  <option v-for="pin in pins" :key="pin.name" :value="pin.name">
                    {{ pin.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Dropoff -->
            <div>
              <label class="block font-medium mb-1">Dropoff location</label>
              <div class="flex gap-4 mb-2">
                <label class="inline-flex items-center">
                  <input type="radio" v-model="dropoffMode" value="manual" name="dropoffMode" />
                  <span class="ml-2">Manual</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="dropoffMode" value="current" name="dropoffMode" />
                  <span class="ml-2">Use my location</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="dropoffMode" value="list" name="dropoffMode" />
                  <span class="ml-2">Select from list</span>
                </label>
              </div>

              <div v-if="dropoffMode === 'manual'">
                <input
                  name="dropoffLocation"
                  v-model="form.dropoffLocation"
                  type="text"
                  required
                  class="w-full border rounded p-2 bg-[#2C2C2C]"
                />
              </div>
              <div v-if="dropoffMode === 'current'">
                <input
                  name="dropoffLocation"
                  v-model="form.dropoffLocation"
                  type="hidden"
                />
                <button
                  type="button"
                  @click="setCurrentLocation(true)"
                  class="px-3 py-1 bg-blue-100 text-blue-700 rounded"
                >
                  Use my location
                </button>
              </div>
              <div v-if="dropoffMode === 'list'">
                <select
                  name="dropoffLocation"
                  v-model="form.dropoffLocation"
                  required
                  class="w-full border rounded p-2 bg-[#2C2C2C]"
                >
                  <option disabled value="">Select location</option>
                  <option v-for="pin in pins" :key="pin.name" :value="pin.name">
                    {{ pin.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </transition>

        <!-- Step 3 -->
        <transition name="fade-up" mode="out-in">
          <div v-if="currentStep === 3" class="space-y-4">
            <h3 class="text-lg font-semibold">Date, Time & Details</h3>

            <input
              name="date"
              type="date"
              v-model="form.date"
              :min="minDate"
              required
              class="w-full border rounded p-2 bg-[#2C2C2C]"
            />
            <input
              name="time"
              type="time"
              v-model="form.time"
              required
              class="w-full border rounded p-2 bg-[#2C2C2C]"
            />
            <input
              name="people"
              type="number"
              v-model.number="form.people"
              min="1"
              max="14"
              required
              placeholder="Number of people (max 14)"
              class="w-full border rounded p-2 bg-[#2C2C2C]"
            />

            <div v-if="form.type === 'transfer'" class="mt-4">
              <label class="block mb-1">Number of Luggages</label>
              <input
                name="luggage"
                type="number"
                v-model.number="form.luggage"
                min="0"
                max="10"
                placeholder="Luggages"
                class="w-full border rounded p-2 bg-[#2C2C2C]"
              />
            </div>

            <div v-if="form.type === 'tour' && form.tour === 'Custom Tour'" class="mt-4">
              <label class="block mb-1">Describe Your Custom Tour</label>
              <textarea
                name="customDescription"
                v-model="form.customDescription"
                rows="4"
                placeholder="Please describe your custom tour..."
                required
                class="w-full border rounded p-2 bg-[#2C2C2C]"
              ></textarea>
            </div>
          </div>
        </transition>

        <!-- Step 4 -->
        <transition name="fade-up" mode="out-in">
          <div v-if="currentStep === 4 && form.people <= 8" class="space-y-4">
            <h3 class="text-lg font-semibold">Select Vehicle</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                v-for="v in vehicleOptions"
                :key="v.name"
                @click="form.vehicle = v.name"
                :class="[
                  'flex items-center p-4 rounded-lg cursor-pointer border',
                  form.vehicle === v.name
                    ? 'border-[#cba671] bg-[#2C2C2C]'
                    : 'border-gray-700 hover:border-[#cba671]'
                ]"
              >
                <img :src="v.image" :alt="v.name" class="w-20 h-20 object-cover rounded mr-4" loading="lazy" />
                <div>
                  <h4 class="text-white font-semibold">{{ v.name }}</h4>
                  <p class="text-gray-300 text-sm">Passenger Seats: {{ v.capacity }}</p>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Step 5 -->
        <transition name="fade-up" mode="out-in">
          <div v-if="currentStep === 5" class="space-y-2" key="step5">
            <h3 class="text-lg font-semibold">Summary & Price</h3>
            <p><strong>Type:</strong> {{ form.type === 'tour' ? 'Private Tour' : 'Private Transfer' }}</p>
            <p v-if="form.type === 'tour'">
              <strong>Tour:</strong> {{ form.tour }}
            </p>
            <p v-else>
              <strong>Route:</strong> {{ form.pickupLocation }} → {{ form.dropoffLocation }}
            </p>
            <p><strong>Date/Time:</strong> {{ form.date }} at {{ form.time }}</p>
            <p><strong>People:</strong> {{ form.people }}</p>
            <p v-if="form.type === 'tour' && form.tour === 'Custom Tour'">
              <strong>Details:</strong> {{ form.customDescription }}
            </p>
            <p v-if="form.type === 'transfer'">
              <strong>Luggages:</strong> {{ form.luggage }}
            </p>
            <p v-if="form.people <= 8">
              <strong>Vehicle:</strong> {{ form.vehicle }}
            </p>
            <p v-else>
              <strong>Vehicles:</strong> Peugeot 5008 + Mercedes Vito
            </p>
            <p v-if="totalPrice !== null" class="mt-4 text-xl font-bold">Total: {{ totalPrice }}€</p>
            <p v-else class="mt-4 text-red-500">We will contact you to confirm the price.</p>
          </div>
        </transition>

        <!-- Step 6 -->
        <transition name="fade-up" mode="out-in">
          <div v-if="currentStep === 6" class="space-y-4">
            <h3 class="text-lg font-semibold">Your Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                v-model="form.name"
                name="name"
                type="text"
                placeholder="Name"
                required
                class="w-full border rounded p-2 bg-[#2C2C2C]"
              />
              <input
                v-model="form.surname"
                name="surname"
                type="text"
                placeholder="Surname"
                required
                class="w-full border rounded p-2 bg-[#2C2C2C]"
              />
              <input
                v-model="form.email"
                name="email"
                type="email"
                placeholder="Email"
                required
                class="w-full border rounded p-2 bg-[#2C2C2C]"
              />
              <vue-tel-input
                name="phone"
                v-model="form.phone"
                mode="international"
                :validCharactersOnly="true"
                invalidMsg="Please enter a valid number"
                class="w-full"
              ></vue-tel-input>
              <input
                v-model="form.idNumber"
                name="idNumber"
                type="text"
                placeholder="ID or Passport"
                required
                class="w-full border rounded p-2 bg-[#2C2C2C] md:col-span-2"
              />
            </div>
          </div>
        </transition>

        <div class="flex justify-between mt-6">
          <button
            type="button"
            class="px-4 py-2 border border-gray-600 rounded hover:border-[#cba671]"
            @click="currentStep === 1 ? closeModal() : prevStep()"
          >
            Back
          </button>
          <button
            v-if="currentStep < finalStep"
            type="button"
            class="px-4 py-2 bg-[#cba671] text-[#232436] rounded hover:bg-[#B4952E] disabled:opacity-50"
            @click="nextStep()"
            :disabled="!canProceed"
          >
            Next
          </button>
          <button v-else type="submit" class="px-4 py-2 bg-green-600 text-white rounded">
            Submit Booking Request
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref, reactive, computed } from 'vue';
import vitoImage from '../assets/etp_vito_modal.png';
import peugeotImage from '../assets/etp_5008_modal.png';

const showModal = ref(false);
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
    'Aerodromio - Alyki': { '1-4': 40, '5-8': 55 },
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
    'Aerodromio - Alyki': { '1-4': 50, '5-8': 65 },
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
    'Aerodromio - Alyki': { '1-4': 55, '5-8': 70 },
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
    'Aerodromio - Alyki': { '1-4': 45, '5-8': 60 },
    Lefkes: { '1-4': 45, '5-8': 60 },
    'Piso Livadi': { '1-4': 40, '5-8': 55 },
    Pounta: { '1-4': 50, '5-8': 65 },
    'Krios - cabana': { '1-4': 55, '5-8': 70 },
    'SantaMaria - Ampelas': { '1-4': 50, '5-8': 65 },
    'Drios - ΧΑ': { '1-4': 36, '5-8': 50 }
  },
  'Aerodromio - Alyki': {
    Parikia: { '1-4': 40, '5-8': 55 },
    Naousa: { '1-4': 50, '5-8': 65 },
    Monastiri: { '1-4': 50, '5-8': 65 },
    'Drios - ΧΑ': { '1-4': 45, '5-8': 60 },
    Lefkes: { '1-4': 50, '5-8': 65 },
    'Piso Livadi': { '1-4': 50, '5-8': 65 },
    Pounta: { '1-4': 36, '5-8': 50 },
    'Krios - cabana': { '1-4': 45, '5-8': 60 },
    'SantaMaria - Ampelas': { '1-4': 55, '5-8': 70 },
    'Aerodromio - Alyki': { '1-4': 36, '5-8': 50 }
  },
  Lefkes: {
    Parikia: { '1-4': 45, '5-8': 60 },
    Naousa: { '1-4': 40, '5-8': 55 },
    Monastiri: { '1-4': 45, '5-8': 60 },
    'Aerodromio - Alyki': { '1-4': 50, '5-8': 65 },
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
    'Aerodromio - Alyki': { '1-4': 50, '5-8': 65 },
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
    'Aerodromio - Alyki': { '1-4': 45, '5-8': 60 },
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
    'Aerodromio - Alyki': { '1-4': 50, '5-8': 65 },
    'Drios - ΧΑ': { '1-4': 50, '5-8': 65 },
    Lefkes: { '1-4': 45, '5-8': 60 },
    'Piso Livadi': { '1-4': 40, '5-8': 55 },
    Pounta: { '1-4': 40, '5-8': 55 },
    'Krios - cabana': { '1-4': 36, '5-8': 50 },
    'SantaMaria - Ampelas': { '1-4': 40, '5-8': 55 },
    Monastiri: { '1-4': 36, '5-8': 50 }
  }
};
const pickupMode = ref('manual');
const dropoffMode = ref('manual');
const pins = [
  { name: 'Parikia', coords: [37.0857, 25.1512] },
  { name: 'Naousa', coords: [37.1236, 25.2387] },
  { name: 'Monastiri', coords: [37.1464, 25.2244] },
  { name: 'Aerodromio - Alyki', coords: [37.0220, 25.1152] },
  { name: 'Drios - ΧΑ', coords: [37.0040, 25.2237] },
  { name: 'Lefkes', coords: [37.0557, 25.2079] },
  { name: 'Piso Livadi', coords: [37.03555, 25.25963] },
  { name: 'Pounta', coords: [37.0377, 25.1014] },
  { name: 'Krios - cabana', coords: [37.0939, 25.1460] },
  { name: 'SantaMaria - Ampelas', coords: [37.1032, 25.2651] }
];
function setCurrentLocation(isDropoff) {
  navigator.geolocation.getCurrentPosition(pos => {
    const coords = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
    isDropoff ? (form.dropoffLocation = coords) : (form.pickupLocation = coords);
  });
}

const minDate = computed(() => new Date().toISOString().split('T')[0]);
const formValid  = computed(() => Object.values(form).every((v) => v));
const vehicleOptions = computed(() => {
  const opts = [];
  if (form.people <= 6) opts.push({ name: 'Peugeot 5008', capacity: 6, image: peugeotImage });
  if (form.people <= 8) opts.push({ name: 'Mercedes Vito', capacity: 8, image: vitoImage });
  return opts;
});
const transferPrice = computed(() => {
  // normalize names if you need to
  const pu = form.pickupLocation;
  const doff = form.dropoffLocation;
  const origin = priceTables[pu] || {};
  let rates = origin[doff] || (priceTables[doff] && priceTables[doff][pu]);
  if (!rates) return null;
  const bracket = form.people <= 4 ? '1-4' : '5-8';
  let p = rates[bracket];
  // early-morning surcharge
  const h = +form.time?.split(':')[0] || 0;
  if (h < 6) p += 15;
  return p;
});
const totalPrice = computed(() => {
  if (form.type === 'tour' && form.tour !== 'Custom Tour') {
    const hours = form.tour.includes('4h') ? 4 : form.tour.includes('8h') ? 8 : 9;
    // combine for >9 people or both vehicles
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
    return (pickupMode.value === 'list' && dropoffMode.value === 'list')
      ? transferPrice.value
      : null;
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
function nextStep() {
  if (canProceed.value && currentStep.value < finalStep) {
    if (form.people > 8 && currentStep.value === 3) {
      form.vehicle = 'Peugeot 5008 + Mercedes Vito';
      currentStep.value = 5;
    } else {
      currentStep.value++;
    }
    if(currentStep.value === 5){
      form.price = totalPrice.value;
    }
  };
}
function prevStep() {
  if (currentStep.value > 1) {
    if (form.people > 8 && currentStep.value === 5) {
      form.vehicle = '';
      currentStep.value = 3;
    } else {
      currentStep.value--;
    }
    if(currentStep.value === 5) {
      form.price = totalPrice.value;
    }
  }
}
function openModal() {
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
  currentStep.value = 1;
}

const bookingForm = ref(null);
function submitForm() {
  let f = document.querySelector('form')
  Array.from(f.children).forEach(child => {
    if (child.tagName.toLowerCase() !== 'input') {
      f.removeChild(child);
    }
  });
  f.submit();
}
</script>

<style scoped>
/* fade-up transition */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-up-enter-to,
.fade-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
