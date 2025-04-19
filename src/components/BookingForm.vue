<script setup>
import { ref, computed } from 'vue';
import emailjs from '@emailjs/browser';

// Contact info
const companyPhone = '+306980911843';
const companyEmail = 'info@expresstransferparos.com';

// Form state
const name = ref('');
const surname = ref('');
const email = ref('');
const phone = ref('');
const guests = ref(1);

// Pickup location logic
const manualLocation = ref('');
const useCurrentLocation = ref(false);
const coords = ref({ lat: null, lng: null });
const locationValue = computed(() =>
  useCurrentLocation.value
    ? `lat:${coords.value.lat},lng:${coords.value.lng}`
    : manualLocation.value
);

// Destination
const destination = ref('');

const isFormValid = computed(() => {
  return (
    name.value &&
    surname.value &&
    email.value &&
    phone.value &&
    guests.value > 0 &&
    locationValue.value &&
    destination.value
  );
});

function toggleLocation() {
  if (useCurrentLocation.value) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        coords.value.lat = pos.coords.latitude;
        coords.value.lng = pos.coords.longitude;
      },
      err => {
        alert('Unable to retrieve location: ' + err.message);
        useCurrentLocation.value = false;
      }
    );
  }
}

async function submitBooking(e) {
  e.preventDefault();
  const params = {
    to_email: companyEmail,
    from_name: `${name.value} ${surname.value}`,
    guest_email: email.value,
    guest_phone: phone.value,
    guests: guests.value,
    pickup: locationValue.value,
    destination: destination.value
  };
  try {
    await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', params, 'YOUR_PUBLIC_KEY');
    alert('Booking request sent! We will be in touch.');
    // reset form fields if needed
  } catch (err) {
    console.error(err);
    alert('Failed to send booking. Please try again.');
  }
}

function openWhatsApp() {
  const msg = `Hello, I am ${name.value} ${surname.value}. Number of passengers: ${guests.value}. Pickup: ${locationValue.value}. Destination: ${destination.value}. My email is ${email.value}, phone: ${phone.value}.`;
  window.open(`https://wa.me/${companyPhone}?text=${encodeURIComponent(msg)}`, '_blank');
}

function callNow() {
  window.location.href = `tel:${companyPhone}`;
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-10 bg-white rounded-lg shadow-xl border border-gray-200">
    <form @submit="submitBooking" class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Book a Service</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- First Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700">First Name</label>
          <input v-model="name" type="text" required class="mt-2 block w-full p-3 rounded-md border-gray-300 focus:border-blue-500" />
        </div>
        <!-- Surname -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Surname</label>
          <input v-model="surname" type="text" required class="mt-2 block w-full p-3 rounded-md border-gray-300 focus:border-blue-500" />
        </div>
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" required class="mt-2 block w-full p-3 rounded-md border-gray-300 focus:border-blue-500" />
        </div>
        <!-- Phone (WhatsApp) -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Phone (WhatsApp)</label>
          <input v-model="phone" type="tel" required class="mt-2 block w-full p-3 rounded-md border-gray-300 focus:border-blue-500" />
        </div>
        <!-- Number of Passengers -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Number of Passengers</label>
          <input v-model.number="guests" type="number" min="1" required class="mt-2 block w-full p-3 rounded-md border-gray-300 focus:border-blue-500" />
        </div>
                <!-- Pickup Location -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Pickup Location</label>
          <input v-model="manualLocation" :disabled="useCurrentLocation" type="text" required class="mt-2 block w-full p-3 rounded-md border-gray-300 focus:border-blue-500" />
          <label class="inline-flex items-center mt-2">
            <input type="checkbox" v-model="useCurrentLocation" @change="toggleLocation" class="form-checkbox" />
            <span class="ml-2 text-gray-600">Send my current location</span>
          </label>
        </div>
        <!-- Destination -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Destination</label>
          <input v-model="destination" type="text" required class="mt-2 block w-full p-3 rounded-md border-gray-300 focus:border-blue-500" />
        </div>
      </div>

      <div class="mt-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <button type="submit" :disabled="!isFormValid" class="w-full md:w-1/3 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
          Send Email
        </button>
        <button type="button" @click="openWhatsApp" class="w-full md:w-1/3 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700">
          Message on WhatsApp
        </button>
        <button type="button" @click="callNow" class="w-full md:w-1/3 bg-yellow-500 text-white py-3 px-4 rounded-md hover:bg-yellow-600">
          Call Now
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* No additional styles */
</style>
