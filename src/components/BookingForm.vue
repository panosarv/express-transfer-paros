<template>
  <div class="flex flex-col lg:flex-row gap-8">
    <!-- Left Column: Booking Form -->
    <section class="w-full lg:w-1/2 bg-white p-6 rounded shadow">
      <h2 class="text-2xl font-semibold mb-4">Submit booking request</h2>
      <form ref="bookingForm" method="POST" action="https://formsubmit.co/info@expresstransferparos.com"
        class="space-y-4" @submit.prevent="openModal">
        <input
          type="hidden"
          name="price"
          v-model="price"
        />
        <!-- Personal Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block font-medium">Name</label>
            <input name="name" v-model="form.name" type="text" required class="mt-1 w-full" />
          </div>
          <div>
            <label class="block font-medium">Surname</label>
            <input name="surname" v-model="form.surname" type="text" required class="mt-1 w-full" />
          </div>
          <div>
            <label class="block font-medium">Email</label>
            <input name="email" v-model="form.email" type="email" required class="mt-1 w-full" />
          </div>
          <div>
            <label class="block font-medium">Phone</label>
            <input name="phone" v-model="form.phone" type="tel" required class="mt-1 w-full" />
          </div>
        </div>

        <!-- Date and Time -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block font-medium">Date</label>
            <input name="date" v-model="form.date" type="date" required class="mt-1 w-full" />
            <p v-if="dateError" class="text-red-600 text-sm">Select a different date</p>
          </div>
          <div>
            <label class="block font-medium">Time</label>
            <input name="time" v-model="form.time" type="time" required class="mt-1 w-full" />
          </div>
        </div>

        <!-- Number of People -->
        <div>
          <label class="block font-medium">People</label>
          <input name="people" v-model.number="form.people" type="number" min="1"  required class="mt-1 w-24" />
        </div>

        <!-- Pickup Location -->
        <div>
          <label class="block font-medium">Pickup location</label>
          <div class="flex mt-2">
            <label class="inline-flex items-center">
              <input type="radio" value="manual" v-model="pickupMode" />
              <span class="ml-2">Manually add location</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" value="current" v-model="pickupMode" />
              <span class="ml-2">Use current location</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" value="list" v-model="pickupMode" />
              <span class="ml-2">Select from list</span>
            </label>
          </div>

          <!-- Manual Input -->
          <div v-if="pickupMode === 'manual'" class="mt-4">
            <input name="pickupLocation" v-model="form.pickupLocation" type="text" required class="mt-1 w-full border rounded" />
          </div>

          <!-- Current Location -->
          <div v-if="pickupMode === 'current'" class="mt-4">
            <button type="button" @click="setCurrentLocation(false)"
              class="bg-blue-100 text-blue-700 border border-blue-300 rounded px-3 py-1 text-sm">
              Use my location
            </button>
            <p v-if="pickupError" class="text-red-600 text-sm">Unable to retrieve location</p>
          </div>

          <!-- Select From List -->
          <div v-if="pickupMode === 'list'" class="mt-4">
            <select v-model="form.pickupLocation" required class="mt-1 w-full border rounded p-2">
              <option disabled value="">Select location</option>
              <option v-for="pin in pins" :key="pin.name" :value="pin.name">
                {{ pin.name }}
              </option>
            </select>

            <!-- only render the map once user has picked and modal is closed -->
            <div v-if="form.pickupLocation && !showModal" class="mt-4">
              <LMap :zoom="11" :center="currentPickupCoords" :options="mapOptions" style="height:250px;width:100%">
                <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors" />
                <LMarker :lat-lng="currentPickupCoords">
                  <LPopup>{{ form.pickupLocation }}</LPopup>
                </LMarker>
              </LMap>
            </div>
          </div>
        </div>

        <!-- Dropoff Location -->
        <div>
          <label class="block font-medium">Dropoff location</label>
          <div class="flex gap-2">
            <label class="inline-flex items-center">
              <input type="radio" value="manual" v-model="dropoffMode" />
              <span class="ml-2">Manually add location</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" value="current" v-model="dropoffMode" />
              <span class="ml-2">Use current location</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" value="list" v-model="dropoffMode" />
              <span class="ml-2">Select from list</span>
            </label>
          </div>

          <!-- Manual Input -->
          <div v-if="dropoffMode === 'manual'" class="mt-4">
            <input name="dropoffLocation" v-model="form.dropoffLocation" type="text" required class="mt-1 w-full border rounded" />
          </div>

          <!-- Current Location -->
          <div v-if="dropoffMode === 'current'" class="mt-4">
            <button type="button" @click="setCurrentLocation(true)"
              class="bg-blue-100 text-blue-700 border border-blue-300 rounded px-3 py-1 text-sm">
              Use my location
            </button>
            <p v-if="dropoffError" class="text-red-600 text-sm">Unable to retrieve location or same as pickup</p>
          </div>

          <!-- Select From List -->
          <div v-if="dropoffMode === 'list'" class="mt-4">
            <select v-model="form.dropoffLocation" required class="mt-1 w-full border rounded p-2">
              <option disabled value="">Select location</option>
              <option v-for="pin in pins" :key="pin.name" :value="pin.name">
                {{ pin.name }}
              </option>
            </select>

            <!-- only render the map once user has picked and modal is closed -->
            <div v-if="form.dropoffLocation && !showModal" class="mt-4">
              <LMap :zoom="11" :center="currentDropoffCoords" :options="mapOptions" style="height:250px;width:100%">
                <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors" />
                <LMarker :lat-lng="currentDropoffCoords">
                  <LPopup>{{ form.dropoffLocation }}</LPopup>
                </LMarker>
              </LMap>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button :disabled="!formValid" type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">
          Request Booking
        </button>

        <!-- Confirmation Modal -->
        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div class="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/3">
            <h3 class="text-xl font-semibold mb-4">Confirm your booking</h3>
            <p><strong>Name:</strong> {{ form.name }} {{ form.surname }}</p>
            <p><strong>Email:</strong> {{ form.email }}</p>
            <p><strong>Phone:</strong> {{ form.phone }}</p>
            <p><strong>Date:</strong> {{ form.date }}</p>
            <p><strong>Time:</strong> {{ form.time }}</p>
            <p><strong>People:</strong> {{ form.people }}</p>
            <p><strong>Pickup:</strong> {{ form.pickupLocation }}</p>
            <p><strong>Drop Off:</strong> {{ form.dropoffLocation }}</p>
            <p v-if="pickupMode === 'list' && dropoffMode === 'list'">
              <strong>Price (Prices may differ depending on):</strong> {{ price }}€
            </p>
            <div class="flex justify-end gap-4 mt-6">
              <button type="button" @click="closeModal" class="px-4 py-2 border rounded">Cancel</button>
              <button type="button" @click="submitForm"  class="px-4 py-2 bg-blue-600 text-white rounded">Confirm</button>
            </div>
          </div>
        </div>
      </form>
    </section>

    <!-- Right Column: Alternative Contact -->
    <section class="w-full lg:w-1/2 bg-gray-50 p-6 rounded shadow">
      <h2 class="text-2xl font-semibold mb-4">Other ways to get in touch</h2>
      <div class="space-y-4">
        <p>Call or WhatsApp:</p>
        <a href="tel:+302284082379" class="block text-blue-600">+30 698 091 1843</a>
        <p>Email:</p>
        <a href="mailto:info@expresstransferparos.com" class="block text-blue-600">info@expresstransferparos.com</a>
      </div>
    </section>
  </div>
</template>

<script setup>
import 'leaflet/dist/leaflet.css';
import { ref, computed, watch } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';

// Form state
const form = ref({
  name: '', surname: '', email: '', phone: '', date: '', time: '', people: 1,
  pickupLocation: '', dropoffLocation: '', price: 0
});
const pickupMode = ref('manual');
const dropoffMode = ref('manual');
const showModal = ref(false);
const dateError = ref(false);
const pickupError = ref(false);
const dropoffError = ref(false);
const bookingForm = ref(null);



// Price tables for Naousa pickup
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

// Map pins
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

const mapOptions = { scrollWheelZoom: false, dragging: true };
const defaultCenter = [37.1236, 25.2387];

const submitForm = () => {
  if (formValid.value) {
    bookingForm.value.submit();
  } else {
    alert('Please fill in all required fields correctly.');
  }
};
// Computed coords for previews
const currentPickupCoords = computed(() => {
  const pin = pins.find(p => p.name === form.value.pickupLocation);
  return pin ? pin.coords : defaultCenter;
});
const currentDropoffCoords = computed(() => {
  const pin = pins.find(p => p.name === form.value.dropoffLocation);
  return pin ? pin.coords : defaultCenter;
});

// Price calculation
const price = computed(() => {
  // normalize Ampelas to SantaMaria - Ampelas
  let puRaw = form.value.pickupLocation;
  let doffRaw = form.value.dropoffLocation;
  const pu = puRaw === 'Ampelas' ? 'SantaMaria - Ampelas' : puRaw;
  const doff = doffRaw === 'Ampelas' ? 'SantaMaria - Ampelas' : doffRaw;

  // attempt direct lookup
  const originRates = priceTables[pu] || {};
  let destRates = originRates[doff];
  // fallback to reverse if missing
  if (!destRates && priceTables[doff]) {
    destRates = priceTables[doff][pu];
  }
  if (!destRates) return null;

  const bracket = form.value.people <= 4 ? '1-4' : '5-8';
  let p = destRates[bracket];
  // surcharge for early hours
  const hour = form.value.time ? +form.value.time.split(':')[0] : 0;
  if (hour >= 0 && hour < 6) p += 15;
  return p;
});
// Watch date for past selection
watch(() => form.value.date, val => {
  const today = new Date().toISOString().split('T')[0];
  dateError.value = val < today;
});

// Form validity
const formValid = computed(() =>
  form.value.name && form.value.surname && form.value.email && form.value.phone &&
  form.value.date && form.value.time && form.value.people >= 1 &&
  form.value.pickupLocation && form.value.dropoffLocation && !dateError.value
);

function openModal() {
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}

// Geolocation helper
function setCurrentLocation(isDropoff) {
  navigator.geolocation.getCurrentPosition(
    pos => {
      const coords = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
      if (isDropoff) {
        form.value.dropoffLocation = coords;
        dropoffError.value = false;
      } else {
        form.value.pickupLocation = coords;
        pickupError.value = false;
      }
    },
    () => {
      if (isDropoff) dropoffError.value = true;
      else pickupError.value = true;
    }
  );
}
</script>

<style scoped>
/* No additional styles */
</style>
