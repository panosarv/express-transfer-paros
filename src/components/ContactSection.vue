<template>
  <div class="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#232436] to-[#2C2C2C] text-white" id="contact">
    <div class="max-w-7xl mx-auto text-center mb-8">
      <h2 class="text-xl tracking-widest uppercase text-[#cba671] font-theme-heading mb-2">
        Ready to explore Paros with us?
      </h2>
      <p class="text-white mb-6">
        Choose any of the methods below to contact Express Transfer Paros:
      </p>
      <button
        class="bg-[#cba671] text-[#232436] px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#B4952E] transition-colors"
        @click="openModal"
      >
        Book Online
      </button>
    </div>

    <div class="max-w-7xl mx-auto space-y-6 text-center">
      <a
        href="https://wa.me/306980911843"
        target="_blank"
        rel="noopener noreferrer"
        class="block text-white hover:underline"
      >
        WhatsApp: +30 698 091 1843
      </a>
      <a
        href="viber://chat?number=%2B306980911843"
        class="block text-white hover:underline"
      >
        Viber: +30 698 091 1843
      </a>
      <a
        href="mailto:info@expresstransferparos.com"
        class="block text-white hover:underline"
      >
        Email: info@expresstransferparos.com
      </a>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
    >
      <form
        ref="bookingForm"
        method="POST"
        action="https://formsubmit.co/info@expresstransferparos.com"
        class="bg-[#232436] rounded shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative text-white"
        @submit.prevent="submitForm"
      >
        <button
          type="button"
          class="absolute top-4 right-4 text-gray-300 hover:text-white"
          @click="closeModal"
        >&times;</button>

        <div class="flex justify-between mb-4">
          <span
            v-for="n in finalStep"
            :key="n"
            class="w-1/5 h-1 rounded"
            :class="n <= currentStep ? 'bg-[#cba671]' : 'bg-gray-700'"
          ></span>
        </div>

        <!-- Step 1 -->
        <div v-if="currentStep === 1" class="space-y-4">
          <h3 class="text-lg font-semibold">What would you like to book?</h3>
          <select
            v-model="form.type"
            class="w-full border rounded p-2 bg-[#2C2C2C]"
          >
            <option disabled value="">Select booking type</option>
            <option value="tour">Private Tour</option>
            <option value="transfer">Private Transfer</option>
          </select>
          <div v-if="form.type === 'tour'">
            <label class="block mb-2">Select Tour</label>
            <select
              v-model="form.tour"
              class="w-full border rounded p-2 bg-[#2C2C2C]"
            >
              <option disabled value="">Choose a tour</option>
              <option v-for="t in tours" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
        </div>

        <!-- Step 2 -->
        <div v-if="currentStep === 2" class="space-y-6">
          <h3 class="text-lg font-semibold">Pickup & Dropoff</h3>
          <!-- Pickup -->
          <div>
            <label class="block font-medium mb-1">Pickup location</label>
            <div class="flex gap-4 mb-2">
              <label class="inline-flex items-center">
                <input type="radio" v-model="pickupMode" value="manual" />
                <span class="ml-2">Manual</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="pickupMode" value="current" />
                <span class="ml-2">Use my location</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="pickupMode" value="list" />
                <span class="ml-2">Select from list</span>
              </label>
            </div>
            <div v-if="pickupMode === 'manual'">
              <input
                v-model="form.pickupLocation"
                type="text"
                required
                class="w-full border rounded p-2 bg-[#2C2C2C]"
              />
            </div>
            <div v-if="pickupMode === 'current'">
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
                <input type="radio" v-model="dropoffMode" value="manual" />
                <span class="ml-2">Manual</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="dropoffMode" value="current" />
                <span class="ml-2">Use my location</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="dropoffMode" value="list" />
                <span class="ml-2">Select from list</span>
              </label>
            </div>
            <div v-if="dropoffMode === 'manual'">
              <input
                v-model="form.dropoffLocation"
                type="text"
                required
                class="w-full border rounded p-2 bg-[#2C2C2C]"
              />
            </div>
            <div v-if="dropoffMode === 'current'">
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

        <!-- Step 3 -->
        <div v-if="currentStep === 3" class="space-y-4">
          <h3 class="text-lg font-semibold">Date, Time & Details</h3>
          <input
            type="date"
            v-model="form.date"
            :min="minDate"
            required
            class="w-full border rounded p-2 bg-[#2C2C2C]"
          />
          <input
            type="time"
            v-model="form.time"
            required
            class="w-full border rounded p-2 bg-[#2C2C2C]"
          />
          <input
            type="number"
            v-model.number="form.people"
            min="1"
            max="14"
            required
            class="w-full border rounded p-2 bg-[#2C2C2C]"
            placeholder="Number of people (max 14)"
          />
          <div v-if="form.type === 'transfer'" class="mt-4">
            <label class="block mb-1">Number of Luggages</label>
            <input
              type="number"
              v-model.number="form.luggage"
              min="0"
              max="10"
              class="w-full border rounded p-2 bg-[#2C2C2C]"
              placeholder="Luggages"
            />
          </div>
        </div>

        <!-- Step 4 -->
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
              <img :src="v.image" :alt="v.name" class="w-20 h-20 object-cover rounded mr-4" />
              <div>
                <h4 class="text-white font-semibold">{{ v.name }}</h4>
                <p class="text-gray-300 text-sm">Seats: {{ v.capacity }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 5 -->
        <div v-if="currentStep === 5" class="space-y-2">
          <h3 class="text-lg font-semibold">Summary & Price</h3>
          <p>
            <strong>Type:</strong>
            {{ form.type === 'tour' ? 'Private Tour' : 'Private Transfer' }}
          </p>
          <p
            v-if="form.type === 'tour'"
            class="text-yellow-300"
          >
            Note: Tour price is fixed regardless of people count.
          </p>
          <p v-if="form.type === 'tour'">
            <strong>Tour:</strong> {{ form.tour }}
          </p>
          <p v-else>
            <strong>Transfer:</strong> {{ form.pickupLocation }} → {{ form.dropoffLocation }}
          </p>
          <p>
            <strong>Date/Time:</strong> {{ form.date }} at {{ form.time }}
          </p>
          <p>
            <strong>People:</strong> {{ form.people }}
          </p>
          <p v-if="form.type === 'transfer'">
            <strong>Luggage:</strong> {{ form.luggage }}
          </p>
          <p v-if="form.type === 'transfer' && form.people <= 8">
            <strong>Vehicle:</strong> {{ form.vehicle }}
          </p>
          <p v-if="form.type === 'transfer' && form.people > 8">
            <strong>Vehicles:</strong> Peugeot 5008 + Mercedes Vito
          </p>
          <p class="mt-4 text-xl font-bold">Total: {{ totalPrice }}€</p>
        </div>

        <!-- Step 6 -->
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
            
            <vue-tel-input name="phone" v-model="form.phone" :mode="'international'" :validCharactersOnly=true :invalidMsg="'Please enter a valid number'" class="w-full"></vue-tel-input>
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
          <button
            v-else
            type="submit"
            class="px-4 py-2 bg-green-600 text-white rounded"
          >
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
  vehicle: '',
  name: '',
  surname: '',
  email: '',
  phone: '',
  idNumber: ''
});

const tours = [
  'Paros Highlights Tour',
  'Antiparos Full Day Tour',
  'Sunset Cruise',
  'Beaches Exploration'
];
const tourPrices = {
  'Paros Highlights Tour': 50,
  'Antiparos Full Day Tour': 80,
  'Sunset Cruise': 60,
  'Beaches Exploration': 45
};

const pickupMode = ref('manual');
const dropoffMode = ref('manual');
const pins = [
  { name: 'Parikia', coords: [37.0857, 25.1512] },
  { name: 'Naousa', coords: [37.1236, 25.2387] }
];
function setCurrentLocation(isDropoff) {
  navigator.geolocation.getCurrentPosition(pos => {
    const coords = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
    isDropoff ? (form.dropoffLocation = coords) : (form.pickupLocation = coords);
  });
}

const minDate = computed(() => new Date().toISOString().split('T')[0]);

const vehicleOptions = computed(() => {
  const opts = [];
  if (form.people <= 6) opts.push({ name: 'Peugeot 5008', capacity: 6, image: peugeotImage });
  if (form.people <= 8) opts.push({ name: 'Mercedes Vito', capacity: 8, image: vitoImage });
  return opts;
});

const totalPrice = computed(() => {
  if (form.type === 'tour') return tourPrices[form.tour];
  // implement transfer pricing logic...
  return 0;
});

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return form.type === 'tour' ? !!form.tour : form.type === 'transfer';
    case 2:
      return form.pickupLocation && form.dropoffLocation;
    case 3:
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
    if(form.people>8 && currentStep.value === 3){
      form.vehicle = 'Peugeot 5008 + Mercedes Vito';
      currentStep.value=5;
    }else{
      currentStep.value++;
    } 
    };
}
function prevStep() {
  if (currentStep.value > 1){
    if(form.people>8 && currentStep.value === 5){
      form.vehicle = '';
      currentStep.value=3;
    }else{
      currentStep.value--;
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
  bookingForm.value.submit();
}
</script>

<style scoped>
/* Any additional styles */
</style>
