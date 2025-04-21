<template>
  <div class="flex flex-col lg:flex-row gap-8">
    <!-- Left Column: Booking Form -->
    <section class="w-full lg:w-1/2 bg-white p-6 rounded shadow">
      <h2 class="text-2xl font-semibold mb-4">Submit booking request</h2>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <!-- Personal Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block font-medium">Name</label>
            <input v-model="form.name" type="text" required class="mt-1 w-full" />
          </div>
          <div>
            <label class="block font-medium">Surname</label>
            <input v-model="form.surname" type="text" required class="mt-1 w-full" />
          </div>
        </div>
        <!-- Contact -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block font-medium">Email</label>
            <input v-model="form.email" type="email" required class="mt-1 w-full" />
          </div>
          <div>
            <label class="block font-medium">Phone</label>
            <input v-model="form.phone" type="tel" required class="mt-1 w-full" />
          </div>
        </div>
        <!-- Party & Date/Time -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block font-medium">Number of people</label>
            <input v-model.number="form.people" type="number" min="1" required class="mt-1 w-full" />
          </div>
          <div>
            <label class="block font-medium">Date</label>
            <input v-model="form.date" type="date" required class="mt-1 w-full" />
            <p v-if="dateError" class="text-red-600 text-sm">Select a different date</p>
          </div>
        </div>
        <div>
          <label class="block font-medium">Time</label>
          <input v-model="form.time" type="time" required class="mt-1 w-full" />
        </div>

        <!-- Pickup Location -->
        <div>
          <label class="block font-medium">Pickup location</label>
          <input
            v-model="form.pickupLocation"
            :disabled="pickupMode !== 'manual'"
            type="text"
            required
            class="mt-1 w-full" />
          <!-- Show button below input when map mode closed -->
          <button
            v-if="pickupMode === 'map' && !pickupMapOpen"
            type="button"
            @click="pickupMapOpen = true"
            class="mt-2 bg-blue-100 text-blue-700 border border-blue-300 rounded px-3 py-1 text-sm"
          >
            Choose different location
          </button>
          <p v-if="pickupError" class="text-red-600 text-sm mt-1">Pickup and drop‑off cannot be the same</p>
          <div class="flex gap-4 mt-2">
            <label class="inline-flex items-center">
              <input type="radio" value="manual" v-model="pickupMode" @change="pickupMapOpen = false" />
              <span class="ml-2">Manually add location</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" value="current" v-model="pickupMode" @change="setCurrentLocation()" />
              <span class="ml-2">Send current location</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" value="map" v-model="pickupMode" @change="pickupMapOpen = true" />
              <span class="ml-2">Pick on Map</span>
            </label>
          </div>
          <div v-if="pickupMode === 'map' && pickupMapOpen" class="mt-4">
            <LMap
              :zoom="11"
              :center="pickupCenter"
              :options="mapOptions"
              style="height: 250px; width: 100%">
              <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
              <LMarker
                v-for="pin in pins"
                :key="pin.name"
                :lat-lng="pin.coords"
                @click="selectPickup(pin.name)">
                <LPopup>{{ pin.name }}</LPopup>
              </LMarker>
            </LMap>
          </div>
        </div>

        <!-- Dropoff Location -->
        <div>
          <label class="block font-medium">Drop Off location</label>
          <input
            v-model="form.dropoffLocation"
            :disabled="dropoffMode !== 'manual'"
            type="text"
            required
            class="mt-1 w-full" />
          <!-- Show button below input when map mode closed -->
          <button
            v-if="dropoffMode === 'map' && !dropoffMapOpen"
            type="button"
            @click="dropoffMapOpen = true"
            class="mt-2 bg-blue-100 text-blue-700 border border-blue-300 rounded px-3 py-1 text-sm"
          >
            Choose different location
          </button>
          <p v-if="dropoffError" class="text-red-600 text-sm mt-1">Drop-off must differ from pickup</p>
          <div class="flex gap-4 mt-2">
            <label class="inline-flex items-center">
              <input type="radio" value="manual" v-model="dropoffMode" @change="dropoffMapOpen = false" />
              <span class="ml-2">Manually add location</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" value="map" v-model="dropoffMode" @change="dropoffMapOpen = true" />
              <span class="ml-2">Pick on Map</span>
            </label>
          </div>
          <div v-if="dropoffMode === 'map' && dropoffMapOpen" class="mt-4">
            <LMap
              :zoom="11"
              :center="pickupCenter"
              :options="mapOptions"
              style="height: 250px; width: 100%">
              <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
              <LMarker
                v-for="pin in pins"
                :key="pin.name"
                :lat-lng="pin.coords"
                @click="selectDropoff(pin.name)">
                <LPopup>{{ pin.name }}</LPopup>
              </LMarker>
            </LMap>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="!formValid"
          class="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">
          Request Booking
        </button>
      </form>
    </section>

    <!-- Right Column: Alternative Contact -->
    <section class="w-full lg:w-1/2 bg-gray-50 p-6 rounded shadow">
      <h2 class="text-2xl font-semibold mb-4">Alternative contact us via:</h2>
      <div class="space-y-4">
        <button class="w-full py-2 bg-stone-700 text-white rounded">Call Us</button>
        <button class="w-full py-2 bg-stone-700 text-white rounded">WhatsApp</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import 'leaflet/dist/leaflet.css';
import { reactive, ref, computed, watch } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import { Icon } from 'leaflet';

// Fix default icon paths
Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href
});

// Form state
const form = reactive({
  name: '', surname: '', email: '', phone: '', people: 1,
  date: '', time: '', pickupLocation: '', dropoffLocation: ''
});
const pickupMode = ref('manual');
const dropoffMode = ref('manual');
const pickupMapOpen = ref(false);
const dropoffMapOpen = ref(false);

// Validation flags
const dateError = ref(false);
const dropoffError = ref(false);
const pickupError = computed(() => form.pickupLocation === form.dropoffLocation && form.pickupLocation);

// Form valid
const formValid = computed(() =>
  form.name && form.surname && form.email && form.phone &&
  form.people >= 1 && form.date && form.time &&
  form.pickupLocation && form.dropoffLocation &&
  !dateError.value && !dropoffError.value && !pickupError.value
);

// Validate date
watch(() => form.date, val => { const today = new Date().toISOString().split('T')[0]; dateError.value = val < today; });
// Watch dropoff to set error when equal
watch(() => form.dropoffLocation, val => { dropoffError.value = val === form.pickupLocation && val; });

// Map config & pins
const mapOptions = { scrollWheelZoom: false, dragging: true };
const pickupCenter = [37.0857, 25.2387];
const pins = [
  { name: 'Parikia', coords: [37.0857, 25.1512] },
  { name: 'Naousa', coords: [37.1236, 25.2387] },
  { name: 'Logaras', coords: [37.0322, 25.2545] },
  { name: 'Drios', coords: [37.0040, 25.2237] },
  { name: 'Alyki', coords: [36.9985, 25.1367] },
  { name: 'Ampelas', coords: [37.1032, 25.2651] }
];

// Handlers
function setCurrentLocation() {
  pickupMapOpen.value = false;
  navigator.geolocation.getCurrentPosition(pos => {
    form.pickupLocation = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
  });
}
function selectPickup(name) { form.pickupLocation = name; pickupMapOpen.value = false; }
function selectDropoff(name) { form.dropoffLocation = name; dropoffMapOpen.value = false; dropoffError.value = name === form.pickupLocation; }
function onSubmit() { alert('Booking requested!'); }
</script>

<style scoped>
/* no additional styles */
</style>
