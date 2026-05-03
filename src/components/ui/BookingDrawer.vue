<script setup>
import { ref, reactive, computed, watch, nextTick, onUnmounted } from 'vue';
import { trackBookingSubmission } from '../../utils/analytics';

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:open']);

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xldbkeed';

/* ─────────────────────────────
   Constants
───────────────────────────── */
const LOCATIONS = [
  'Paros National Airport (PAS)',
  'Parikia Port',
  'Naoussa Port',
  'Piso Livadi Port',
  'Parikia Town Center',
  'Naoussa',
  'Santa Maria Beach',
  'Kolymbithres',
  'Golden Beach (Chryssi Akti)',
  'Alyki Village',
  'Lefkes Village',
  'Drios',
  'Marpissa',
  'Antiparos Ferry Terminal',
  'Custom location (pin on map)',
];

const TOUR_OPTIONS = [
  {
    id: 'history-tour',
    label: 'History Tour',
    desc: 'Museums, ruins & cultural gems',
    icon: '🏛️',
  },
  {
    id: 'beach-tour',
    label: 'Beach Tour',
    desc: '7 stunning beaches across the island',
    icon: '🏖️',
  },
  {
    id: 'half-day-island-tour',
    label: 'Half-Day Island Tour',
    desc: 'The best of Paros in 4 hours',
    icon: '⛵',
  },
  {
    id: 'full-day-island-tour',
    label: 'Full-Day Island Tour',
    desc: 'An unhurried full-day island journey',
    icon: '🗺️',
  },
  {
    id: 'custom-tour',
    label: 'Custom Tour',
    desc: 'Design your own itinerary',
    icon: '✨',
  },
];

const STEP_LABELS_TRANSFER = ['Journey', 'Route', 'Schedule', 'Details'];
const STEP_LABELS_TOUR = ['Journey', 'Tour Details', 'Your Details'];

/* ─────────────────────────────
   State
───────────────────────────── */
const form = reactive({
  type: '',
  tourType: '',

  pickup: '',
  pickupLat: 37.084,
  pickupLng: 25.148,
  pickupInputMode: '',

  dropoff: '',
  dropoffLat: 37.084,
  dropoffLng: 25.148,
  dropoffInputMode: '',

  date: '',
  time: '',
  passengers: 1,
  luggage: 0,
  flightNumber: '',

  name: '',
  surname: '',
  phone: '',
  email: '',
  notes: '',
});

const step = ref(1);
const submitting = ref(false);
const submitError = ref('');

/* ─────────────────────────────
   Custom tour state
───────────────────────────── */
const customBusinessDecide = ref(false);
const customHours = ref('');
const customPlaceInput = ref('');
const customPlaces = ref([]);

function addCustomPlace() {
  const value = customPlaceInput.value.trim();

  if (!value) return;

  customPlaces.value.push(value);
  customPlaceInput.value = '';
}

function removeCustomPlace(index) {
  customPlaces.value.splice(index, 1);
}

/* ─────────────────────────────
   Manual location state
───────────────────────────── */
const pickupManual = ref(false);
const dropoffManual = ref(false);
const pickupManualTxt = ref('');
const dropoffManualTxt = ref('');

/* ─────────────────────────────
   Leaflet map state
───────────────────────────── */
const showMapFor = ref(null);
const mapContainerRef = ref(null);
const tempLat = ref(37.084);
const tempLng = ref(25.148);

let leafletMap = null;
let leafletMarker = null;

/* ─────────────────────────────
   Price tables
───────────────────────────── */
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
    Parikia: { '1-4': 36, '5-8': 50 },
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
    Naousa: { '1-4': 36, '5-8': 50 },
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
    'SantaMaria - Ampelas': { '1-4': 36, '5-8': 50 },
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
    'Drios - ΧΑ': { '1-4': 36, '5-8': 50 },
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
    'Airport - Alyki': { '1-4': 36, '5-8': 50 },
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
    Lefkes: { '1-4': 36, '5-8': 50 },
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
    'Piso Livadi': { '1-4': 36, '5-8': 50 },
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
    'Krios - cabana': { '1-4': 36, '5-8': 50 },
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
    Monastiri: { '1-4': 36, '5-8': 50 },
  },
};

function normalizeLocation(loc) {
  if (!loc) return null;

  const value = loc.toLowerCase();

  if (value.includes('airport')) return 'Airport - Alyki';
  if (value.includes('alyki')) return 'Airport - Alyki';
  if (value.includes('antiparos')) return 'Pounta';
  if (value.includes('piso livadi')) return 'Piso Livadi';
  if (value.includes('santa maria') || value.includes('kolymbithres')) return 'SantaMaria - Ampelas';
  if (value.includes('golden beach') || value.includes('chryssi') || value.includes('drios')) return 'Drios - ΧΑ';
  if (value.includes('lefkes')) return 'Lefkes';
  if (value.includes('marpissa')) return 'Piso Livadi';
  if (value.includes('naousa') || value.includes('naoussa')) return 'Naousa';
  if (value.includes('parikia')) return 'Parikia';

  return null;
}

const indicativePrice = computed(() => {
  if (form.type !== 'transfer') return null;

  const from = normalizeLocation(form.pickup);
  const to = normalizeLocation(form.dropoff);

  if (!from || !to) return null;

  const origin = priceTables[from] || {};
  const rates = origin[to] || (priceTables[to] && priceTables[to][from]);

  if (!rates) return null;

  const bracket = form.passengers <= 4 ? '1-4' : '5-8';
  let price = rates[bracket];

  const hour = Number((form.time || '').split(':')[0]);

  if (form.time && hour < 6) {
    price += 15;
  }

  return price;
});

/* ─────────────────────────────
   Computed
───────────────────────────── */
const totalSteps = computed(() => (form.type === 'transfer' ? 4 : 3));

const stepLabels = computed(() =>
  form.type === 'tour' ? STEP_LABELS_TOUR : STEP_LABELS_TRANSFER
);

const minDate = computed(() => new Date().toISOString().split('T')[0]);

const selectedTour = computed(() =>
  TOUR_OPTIONS.find(t => t.id === form.tourType) || null
);

const isAirportPickup = computed(() =>
  form.pickup && form.pickup.toLowerCase().includes('airport')
);

const isPortPickup = computed(() =>
  form.pickup &&
  (
    form.pickup.toLowerCase().includes('port') ||
    form.pickup.toLowerCase().includes('piso livadi') ||
    form.pickup.toLowerCase().includes('antiparos')
  )
);

const customTourDurationIsValid = computed(() => {
  if (form.tourType !== 'custom-tour') return true;
  return customBusinessDecide.value || !!customHours.value;
});

const isPhoneValid = computed(() => {
  if (!form.phone) return true; // empty is caught by required check
  return /^\+[1-9]\d{6,14}$/.test(form.phone.replace(/[\s\-().]/g, ''));
});

const canNext = computed(() => {
  if (step.value === 1) {
    return !!form.type && (form.type !== 'tour' || !!form.tourType);
  }

  if (step.value === 2 && form.type === 'transfer') {
    return !!form.pickup && !!form.dropoff;
  }

  if (step.value === 2 && form.type === 'tour') {
    return (
      customTourDurationIsValid.value &&
      !!form.date &&
      !!form.time &&
      !!form.pickup
    );
  }

  if (step.value === 3 && form.type === 'transfer') {
    return !!form.date && !!form.time;
  }

  if (step.value === 3 && form.type === 'tour') {
    return !!form.name && !!form.surname && !!form.phone && isPhoneValid.value && !!form.email;
  }

  if (step.value === 4) {
    return !!form.name && !!form.surname && !!form.phone && isPhoneValid.value && !!form.email;
  }

  return false;
});

/* ─────────────────────────────
   Navigation
───────────────────────────── */
function close() {
  emit('update:open', false);
  setTimeout(resetForm, 300);
}

function resetForm() {
  step.value = 1;
  submitting.value = false;
  submitError.value = '';

  Object.assign(form, {
    type: '',
    tourType: '',

    pickup: '',
    pickupLat: 37.084,
    pickupLng: 25.148,
    pickupInputMode: '',

    dropoff: '',
    dropoffLat: 37.084,
    dropoffLng: 25.148,
    dropoffInputMode: '',

    date: '',
    time: '',
    passengers: 1,
    luggage: 0,
    flightNumber: '',

    name: '',
    surname: '',
    phone: '',
    email: '',
    notes: '',
  });

  pickupManual.value = false;
  dropoffManual.value = false;
  pickupManualTxt.value = '';
  dropoffManualTxt.value = '';

  customBusinessDecide.value = false;
  customHours.value = '';
  customPlaceInput.value = '';
  customPlaces.value = [];
}

function prevStep() {
  submitError.value = '';
  if (step.value > 1) step.value--;
}

function nextStep() {
  submitError.value = '';

  if (!canNext.value) return;

  if (step.value < totalSteps.value) {
    step.value++;
  }
}

/* ─────────────────────────────
   Native Formspree payload
───────────────────────────── */
function getBookingReference() {
  return `ETP-${Date.now().toString(36).toUpperCase()}`;
}

function getCoordinates(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') return '';
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

function getCustomTourDuration() {
  if (form.type !== 'tour' || form.tourType !== 'custom-tour') return '';

  if (customBusinessDecide.value) {
    return 'Let the team suggest the duration';
  }

  return customHours.value ? `${customHours.value} hours` : '';
}

function getPickupLocationForPayload() {
  if (form.pickup) return form.pickup;
  return form.type === 'tour' ? 'To be arranged for tour booking' : '';
}

function getDropoffLocationForPayload() {
  if (form.dropoff) return form.dropoff;

  if (form.type === 'tour') {
    return selectedTour.value?.label
      ? `${selectedTour.value.label} route / to be arranged`
      : 'N/A - Tour booking';
  }

  return '';
}

function getBookingSummary() {
  if (form.type === 'transfer') {
    return `${getPickupLocationForPayload()} → ${getDropoffLocationForPayload()} on ${form.date || 'date not provided'} at ${form.time || 'time not provided'}`;
  }

  if (form.tourType === 'custom-tour') {
    const places = customPlaces.value.length
      ? ` | Places: ${customPlaces.value.join(', ')}`
      : '';

    return `Custom Tour — ${getCustomTourDuration()} on ${form.date || 'date not provided'} at ${form.time || 'time not provided'}${places}`;
  }

  return `${selectedTour.value?.label || form.tourType || 'Tour'} on ${form.date || 'date not provided'} at ${form.time || 'time not provided'}`;
}

function buildNativePayload() {
  const bookingReference = getBookingReference();
  const submittedAt = new Date().toISOString();

  const pickupLocation = getPickupLocationForPayload();
  const dropoffLocation = getDropoffLocationForPayload();

  return {
    /*
      Required by your Formspree endpoint.
      These names must stay exactly as they are.
    */
    name: form.name,
    surname: form.surname,
    email: form.email,
    phone: form.phone,
    pickupLocation,
    dropoffLocation,

    /*
      Formspree helpers
    */
    _subject: `New ${form.type === 'tour' ? 'Tour' : 'Transfer'} Booking — ${form.name} ${form.surname}`,
    _replyto: form.email,

    /*
      Metadata
    */
    bookingReference,
    submittedAt,
    source: 'Express Transfer Paros website',
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    pageTitle: typeof document !== 'undefined' ? document.title : '',

    /*
      Summary
    */
    bookingSummary: getBookingSummary(),

    /*
      Customer details
    */
    fullName: `${form.name} ${form.surname}`.trim(),
    firstName: form.name,
    lastName: form.surname,
    customerName: form.name,
    customerSurname: form.surname,
    customerPhone: form.phone,
    customerEmail: form.email,
    notes: form.notes || '',
    specialRequests: form.notes || '',

    /*
      Booking type
    */
    bookingType: form.type,
    bookingTypeLabel: form.type === 'tour' ? 'Island Tour' : 'Private Transfer',

    /*
      Tour fields
    */
    tourType: form.tourType || '',
    tourLabel: selectedTour.value?.label || '',
    tourDescription: selectedTour.value?.desc || '',

    /*
      Pickup fields
    */
    pickup_location: form.pickup || '',
    pickupInputMode: form.pickupInputMode || '',
    pickupLatitude: form.pickupLat,
    pickupLongitude: form.pickupLng,
    pickupCoordinates: getCoordinates(form.pickupLat, form.pickupLng),

    /*
      Drop-off fields
    */
    dropoff_location: form.dropoff || '',
    dropoffInputMode: form.dropoffInputMode || '',
    dropoffLatitude: form.dropoffLat,
    dropoffLongitude: form.dropoffLng,
    dropoffCoordinates: getCoordinates(form.dropoffLat, form.dropoffLng),

    /*
      Schedule
    */
    bookingDate: form.date || '',
    bookingTime: form.time || '',

    /*
      Passengers / luggage
    */
    passengers: form.passengers,
    luggage: form.luggage,

    /*
      Arrival tracking
    */
    flightNumber: form.flightNumber || '',
    ferryNumber: form.flightNumber || '',
    flightOrFerryNumber: form.flightNumber || '',
    arrivalTrackingType: isAirportPickup.value
      ? 'Flight'
      : isPortPickup.value
        ? 'Ferry / Boat'
        : '',

    /*
      Price
    */
    indicativePrice: indicativePrice.value || '',
    indicativePriceEur: indicativePrice.value || '',
    indicativePriceLabel: form.type === 'transfer'
      ? indicativePrice.value
        ? `€${indicativePrice.value}`
        : 'On request'
      : '',
    nightSurchargeApplied: form.type === 'transfer' && form.time
      ? Number(form.time.split(':')[0]) < 6
      : false,

    /*
      Custom tour
    */
    customTourDuration: getCustomTourDuration(),
    customTourBusinessToDecide: form.tourType === 'custom-tour'
      ? customBusinessDecide.value
      : '',
    customTourHours: form.tourType === 'custom-tour' && !customBusinessDecide.value
      ? customHours.value
      : '',
    customTourPlaces: form.tourType === 'custom-tour'
      ? customPlaces.value.join(', ')
      : '',
    customTourPlacesCount: form.tourType === 'custom-tour'
      ? customPlaces.value.length
      : '',
  };
}

const nativePayload = computed(() => buildNativePayload());

function handleNativeSubmit(event) {
  submitError.value = '';

  if (!canNext.value) {
    event.preventDefault();
    submitError.value = 'Please complete all required fields before submitting.';
    return;
  }

  submitting.value = true;

  if (typeof trackBookingSubmission === 'function') {
    trackBookingSubmission({
      ...form,
      selectedTourLabel: selectedTour.value?.label || '',
      indicativePrice: indicativePrice.value,
      customTourDuration: getCustomTourDuration(),
      customPlaces: [...customPlaces.value],
    });
  }

  /*
    Do not prevent default here.
    Native form submission must continue to Formspree.
  */
}

/* ─────────────────────────────
   Counters
───────────────────────────── */
function changePassengers(delta) {
  form.passengers = Math.max(1, Math.min(8, form.passengers + delta));
}

function changeLuggage(delta) {
  form.luggage = Math.max(0, Math.min(20, form.luggage + delta));
}

/* ─────────────────────────────
   Locations
───────────────────────────── */
function confirmManual(which) {
  const text = which === 'pickup'
    ? pickupManualTxt.value.trim()
    : dropoffManualTxt.value.trim();

  if (!text) return;

  if (which === 'pickup') {
    form.pickup = text;
    form.pickupInputMode = 'manual';
    pickupManual.value = false;
  } else {
    form.dropoff = text;
    form.dropoffInputMode = 'manual';
    dropoffManual.value = false;
  }
}

function handleLocationSelect(which) {
  if (which === 'pickup') {
    form.pickupInputMode = form.pickup === 'Custom location (pin on map)' ? 'map' : 'select';
  } else {
    form.dropoffInputMode = form.dropoff === 'Custom location (pin on map)' ? 'map' : 'select';
  }
}

/* ─────────────────────────────
   Leaflet map
───────────────────────────── */
function openMap(which) {
  showMapFor.value = which;

  tempLat.value = which === 'pickup' ? form.pickupLat : form.dropoffLat;
  tempLng.value = which === 'pickup' ? form.pickupLng : form.dropoffLng;

  if (!window.L) {
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!document.querySelector('script[src*="leaflet"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => nextTick(initMap);
      document.head.appendChild(script);
    }
  } else {
    nextTick(initMap);
  }
}

function initMap() {
  if (!mapContainerRef.value || leafletMap || !window.L) return;

  const L = window.L;

  leafletMap = L.map(mapContainerRef.value).setView([tempLat.value, tempLng.value], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
  }).addTo(leafletMap);

  leafletMarker = L.marker([tempLat.value, tempLng.value], {
    draggable: true,
  }).addTo(leafletMap);

  leafletMarker.on('dragend', event => {
    const latLng = event.target.getLatLng();
    tempLat.value = latLng.lat;
    tempLng.value = latLng.lng;
  });

  leafletMap.on('click', event => {
    leafletMarker.setLatLng(event.latlng);
    tempLat.value = event.latlng.lat;
    tempLng.value = event.latlng.lng;
  });
}

function confirmPin() {
  if (showMapFor.value === 'pickup') {
    form.pickupLat = tempLat.value;
    form.pickupLng = tempLng.value;
    form.pickup = 'Custom location (pin on map)';
    form.pickupInputMode = 'map';
  } else {
    form.dropoffLat = tempLat.value;
    form.dropoffLng = tempLng.value;
    form.dropoff = 'Custom location (pin on map)';
    form.dropoffInputMode = 'map';
  }

  closeMap();
}

function closeMap() {
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
    leafletMarker = null;
  }

  showMapFor.value = null;
}

watch(showMapFor, value => {
  if (value && window.L) nextTick(initMap);
});

watch(() => props.open, isOpen => {
  if (!isOpen) {
    setTimeout(resetForm, 300);
  }
});

onUnmounted(() => {
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="open"
        class="booking-overlay"
        @click.self="close"
      >
        <Transition name="modal-scale" mode="out-in">
          <form
            class="booking-modal"
            method="POST"
            :action="FORMSPREE_ENDPOINT"
            @submit="handleNativeSubmit"
          >
            <!-- Hidden native Formspree fields -->
            <template v-for="(value, key) in nativePayload" :key="key">
              <input
                type="hidden"
                :name="key"
                :value="value"
              />
            </template>

            <!-- Header -->
            <div class="modal-header">
              <div class="brand-row">
                <div class="brand-icon">
                  <svg width="22" height="12" viewBox="0 0 48 24" fill="none">
                    <path
                      d="M4 15 L4 10 Q5 7 9 5 L22 4 Q30 4 34 6 L43 9 Q45 10 45 13 L45 15 Z"
                      fill="none"
                      stroke="#e8c97e"
                      stroke-width="1.5"
                    />
                    <path
                      d="M9 5 Q14 1 22 1 L30 1 Q36 1 38 5"
                      stroke="#7ec8e3"
                      stroke-width="1.2"
                      fill="none"
                    />
                    <circle cx="12" cy="17" r="3.5" stroke="#e8c97e" stroke-width="1.2" fill="none" />
                    <circle cx="36" cy="17" r="3.5" stroke="#e8c97e" stroke-width="1.2" fill="none" />
                  </svg>
                </div>

                <div>
                  <div class="eyebrow">Reserve Your Journey</div>
                  <div class="brand-title">Express Transfer Paros</div>
                </div>
              </div>

              <button type="button" class="close-button" @click="close">
                ✕
              </button>
            </div>

            <!-- Progress -->
            <div class="progress-row">
              <template v-for="(label, index) in stepLabels" :key="label">
                <div class="progress-item">
                  <div
                    class="progress-circle"
                    :class="{
                      active: step === index + 1,
                      done: step > index + 1,
                    }"
                  >
                    {{ step > index + 1 ? '✓' : index + 1 }}
                  </div>

                  <div
                    class="progress-label"
                    :class="{
                      active: step === index + 1,
                      done: step > index + 1,
                    }"
                  >
                    {{ label }}
                  </div>
                </div>

                <div
                  v-if="index < stepLabels.length - 1"
                  class="progress-line"
                  :class="{ done: step > index + 1 }"
                />
              </template>
            </div>

            <!-- Body -->
            <div class="modal-body">
              <Transition name="step-fade" mode="out-in">
                <!-- Step 1 -->
                <div v-if="step === 1" key="step-1">
                  <h3 class="step-title">What type of journey?</h3>

                  <div class="type-grid">
                    <button
                      type="button"
                      class="type-card"
                      :class="{ selected: form.type === 'transfer' }"
                      @click="form.type = 'transfer'"
                    >
                      <span class="type-icon">🚗</span>
                      <span class="type-title">Private Transfer</span>
                      <span class="type-desc">Airport, port, hotel & point-to-point</span>
                    </button>

                    <button
                      type="button"
                      class="type-card"
                      :class="{ selected: form.type === 'tour' }"
                      @click="form.type = 'tour'"
                    >
                      <span class="type-icon">🏝</span>
                      <span class="type-title">Island Tour</span>
                      <span class="type-desc">Half-day or full-day guided experiences</span>
                    </button>
                  </div>

                  <div v-if="form.type === 'tour'">
                    <label class="field-label">Select Tour Type</label>

                    <div class="tour-list">
                      <button
                        v-for="tour in TOUR_OPTIONS"
                        :key="tour.id"
                        type="button"
                        class="tour-option"
                        :class="{ selected: form.tourType === tour.id }"
                        @click="form.tourType = tour.id"
                      >
                        <span class="tour-icon">{{ tour.icon }}</span>

                        <span class="tour-content">
                          <span class="tour-title">{{ tour.label }}</span>
                          <span class="tour-desc">{{ tour.desc }}</span>
                        </span>

                        <span v-if="form.tourType === tour.id" class="selected-check">
                          ✓
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Step 2 Transfer -->
                <div v-else-if="step === 2 && form.type === 'transfer'" key="step-2-transfer">
                  <h3 class="step-title">Pickup & Drop-off</h3>

                  <!-- Pickup -->
                  <div class="field-group">
                    <div class="field-row">
                      <label class="field-label">📍 Pickup Location</label>

                      <button
                        type="button"
                        class="link-button"
                        :class="{ active: pickupManual }"
                        @click="pickupManual = !pickupManual; pickupManualTxt = ''"
                      >
                        {{ pickupManual ? '← Pick from list' : 'Type manually' }}
                      </button>
                    </div>

                    <div v-if="pickupManual" class="inline-row">
                      <input
                        v-model="pickupManualTxt"
                        class="text-input"
                        placeholder="Type address or landmark…"
                        @keydown.enter="confirmManual('pickup')"
                      />

                      <button type="button" class="set-button" @click="confirmManual('pickup')">
                        Set
                      </button>
                    </div>

                    <div v-else class="select-with-pin">
                      <select
                        v-model="form.pickup"
                        class="select-input"
                        :class="{ empty: !form.pickup }"
                        @change="handleLocationSelect('pickup')"
                      >
                        <option value="">— Select or pin location —</option>
                        <option v-for="location in LOCATIONS" :key="location" :value="location">
                          {{ location }}
                        </option>
                      </select>

                      <button
                        type="button"
                        class="pin-button"
                        :class="{ active: form.pickup === 'Custom location (pin on map)' }"
                        title="Pin on map"
                        @click="openMap('pickup')"
                      >
                        📍
                      </button>
                    </div>

                    <div
                      v-if="form.pickup && !pickupManual"
                      class="location-preview"
                      :class="{ pin: form.pickup === 'Custom location (pin on map)' }"
                    >
                      <template v-if="form.pickup === 'Custom location (pin on map)'">
                        📍 {{ form.pickupLat.toFixed(5) }}, {{ form.pickupLng.toFixed(5) }}
                        <button type="button" class="edit-pin" @click="openMap('pickup')">
                          Edit pin
                        </button>
                      </template>

                      <template v-else>
                        ✓ {{ form.pickup }}
                      </template>
                    </div>
                  </div>

                  <!-- Flight / ferry -->
                  <div v-if="isAirportPickup || isPortPickup" class="info-box">
                    <label class="field-label gold">
                      {{ isAirportPickup ? '✈ Flight Number' : '⛴ Ferry / Boat Number' }}
                      <span class="optional">(for tracking)</span>
                    </label>

                    <input
                      v-model="form.flightNumber"
                      class="text-input no-margin"
                      :placeholder="isAirportPickup ? 'e.g. A3 622, FR 1234…' : 'e.g. Blue Star Paros, Express Skopelitis…'"
                    />

                    <p class="helper-text">
                      We use this to track your arrival and adjust pickup time if delayed.
                    </p>
                  </div>

                  <!-- Dropoff -->
                  <div class="field-group">
                    <div class="field-row">
                      <label class="field-label">🏁 Drop-off Location</label>

                      <button
                        type="button"
                        class="link-button"
                        :class="{ active: dropoffManual }"
                        @click="dropoffManual = !dropoffManual; dropoffManualTxt = ''"
                      >
                        {{ dropoffManual ? '← Pick from list' : 'Type manually' }}
                      </button>
                    </div>

                    <div v-if="dropoffManual" class="inline-row">
                      <input
                        v-model="dropoffManualTxt"
                        class="text-input"
                        placeholder="Type address or landmark…"
                        @keydown.enter="confirmManual('dropoff')"
                      />

                      <button type="button" class="set-button" @click="confirmManual('dropoff')">
                        Set
                      </button>
                    </div>

                    <div v-else class="select-with-pin">
                      <select
                        v-model="form.dropoff"
                        class="select-input"
                        :class="{ empty: !form.dropoff }"
                        @change="handleLocationSelect('dropoff')"
                      >
                        <option value="">— Select or pin location —</option>
                        <option v-for="location in LOCATIONS" :key="location" :value="location">
                          {{ location }}
                        </option>
                      </select>

                      <button
                        type="button"
                        class="pin-button"
                        :class="{ active: form.dropoff === 'Custom location (pin on map)' }"
                        title="Pin on map"
                        @click="openMap('dropoff')"
                      >
                        📍
                      </button>
                    </div>

                    <div
                      v-if="form.dropoff && !dropoffManual"
                      class="location-preview"
                      :class="{ pin: form.dropoff === 'Custom location (pin on map)' }"
                    >
                      <template v-if="form.dropoff === 'Custom location (pin on map)'">
                        📍 {{ form.dropoffLat.toFixed(5) }}, {{ form.dropoffLng.toFixed(5) }}
                        <button type="button" class="edit-pin" @click="openMap('dropoff')">
                          Edit pin
                        </button>
                      </template>

                      <template v-else>
                        ✓ {{ form.dropoff }}
                      </template>
                    </div>
                  </div>
                </div>

                <!-- Step 2 Tour -->
                <div v-else-if="step === 2 && form.type === 'tour'" key="step-2-tour">
                  <h3 class="step-title">Tour Details</h3>

                  <!-- Custom tour section -->
                  <template v-if="form.tourType === 'custom-tour'">
                    <div class="field-group">
                      <label class="field-label">How long would you like the tour?</label>

                      <button
                        type="button"
                        class="toggle-row"
                        @click="customBusinessDecide = !customBusinessDecide"
                      >
                        <span class="toggle" :class="{ active: customBusinessDecide }">
                          <span />
                        </span>

                        <span>Let the team suggest the duration</span>
                      </button>

                      <div v-if="!customBusinessDecide" class="hour-grid">
                        <button
                          v-for="hour in [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
                          :key="hour"
                          type="button"
                          class="hour-button"
                          :class="{ selected: customHours === String(hour) }"
                          @click="customHours = String(hour)"
                        >
                          {{ hour }}h
                        </button>
                      </div>
                    </div>

                    <div class="field-group">
                      <label class="field-label">Places you'd like to visit</label>

                      <div class="inline-row">
                        <input
                          v-model="customPlaceInput"
                          class="text-input"
                          placeholder="e.g. Naoussa, Lefkes, Golden Beach…"
                          @keydown.enter.prevent="addCustomPlace"
                        />

                        <button type="button" class="set-button" @click="addCustomPlace">
                          Add
                        </button>
                      </div>

                      <div v-if="customPlaces.length" class="place-list">
                        <template v-for="(place, index) in customPlaces" :key="`${place}-${index}`">
                          <span class="place-pill">
                            {{ place }}
                            <button type="button" @click="removeCustomPlace(index)">
                              ×
                            </button>
                          </span>

                          <span v-if="index < customPlaces.length - 1" class="place-line" />
                        </template>
                      </div>
                    </div>
                  </template>

                  <!-- Shared tour schedule fields, including custom tour -->
                  <div class="two-col">
                    <div class="field-group">
                      <label class="field-label">Date</label>
                      <input v-model="form.date" class="text-input" type="date" :min="minDate" />
                    </div>

                    <div class="field-group">
                      <label class="field-label">Start Time</label>
                      <input v-model="form.time" class="text-input" type="time" />
                    </div>
                  </div>

                  <div class="two-col">
                    <div class="field-group">
                      <label class="field-label">Passengers</label>

                      <div class="counter-row">
                        <button type="button" class="counter-button" @click="changePassengers(-1)">
                          −
                        </button>

                        <span class="counter-number">{{ form.passengers }}</span>

                        <button type="button" class="counter-button" @click="changePassengers(1)">
                          +
                        </button>
                      </div>
                    </div>

                    <div class="field-group">
                      <label class="field-label">Luggage</label>

                      <div class="counter-row">
                        <button type="button" class="counter-button" @click="changeLuggage(-1)">
                          −
                        </button>

                        <span class="counter-number">{{ form.luggage }}</span>

                        <button type="button" class="counter-button" @click="changeLuggage(1)">
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Tour pickup -->
                  <div class="field-group">
                    <div class="field-row">
                      <label class="field-label">📍 Pickup Location</label>

                      <button
                        type="button"
                        class="link-button"
                        :class="{ active: pickupManual }"
                        @click="pickupManual = !pickupManual; pickupManualTxt = ''"
                      >
                        {{ pickupManual ? '← Pick from list' : 'Type manually' }}
                      </button>
                    </div>

                    <div v-if="pickupManual" class="inline-row">
                      <input
                        v-model="pickupManualTxt"
                        class="text-input"
                        placeholder="Type address or landmark…"
                        @keydown.enter="confirmManual('pickup')"
                      />

                      <button type="button" class="set-button" @click="confirmManual('pickup')">
                        Set
                      </button>
                    </div>

                    <div v-else class="select-with-pin">
                      <select
                        v-model="form.pickup"
                        class="select-input"
                        :class="{ empty: !form.pickup }"
                        @change="handleLocationSelect('pickup')"
                      >
                        <option value="">— Select or pin location —</option>
                        <option v-for="location in LOCATIONS" :key="location" :value="location">
                          {{ location }}
                        </option>
                      </select>

                      <button
                        type="button"
                        class="pin-button"
                        :class="{ active: form.pickup === 'Custom location (pin on map)' }"
                        title="Pin on map"
                        @click="openMap('pickup')"
                      >
                        📍
                      </button>
                    </div>

                    <div
                      v-if="form.pickup && !pickupManual"
                      class="location-preview"
                      :class="{ pin: form.pickup === 'Custom location (pin on map)' }"
                    >
                      <template v-if="form.pickup === 'Custom location (pin on map)'">
                        📍 {{ form.pickupLat.toFixed(5) }}, {{ form.pickupLng.toFixed(5) }}
                        <button type="button" class="edit-pin" @click="openMap('pickup')">
                          Edit pin
                        </button>
                      </template>

                      <template v-else>
                        ✓ {{ form.pickup }}
                      </template>
                    </div>
                  </div>

                  <div class="field-group">
                    <label class="field-label">
                      Special tour wishes
                      <span class="optional">(optional)</span>
                    </label>

                    <textarea
                      v-model="form.notes"
                      class="text-input textarea"
                      rows="3"
                      placeholder="Sunset stop, restaurant request, accessibility needs, child seat…"
                    />
                  </div>
                </div>

                <!-- Step 3 Transfer -->
                <div v-else-if="step === 3 && form.type === 'transfer'" key="step-3-transfer">
                  <h3 class="step-title">Date, Time & Details</h3>

                  <div class="two-col">
                    <div class="field-group">
                      <label class="field-label">Date</label>
                      <input v-model="form.date" class="text-input" type="date" :min="minDate" />
                    </div>

                    <div class="field-group">
                      <label class="field-label">Time</label>
                      <input v-model="form.time" class="text-input" type="time" />
                    </div>
                  </div>

                  <div class="two-col">
                    <div class="field-group">
                      <label class="field-label">Passengers</label>

                      <div class="counter-row">
                        <button type="button" class="counter-button" @click="changePassengers(-1)">
                          −
                        </button>

                        <span class="counter-number">{{ form.passengers }}</span>

                        <button type="button" class="counter-button" @click="changePassengers(1)">
                          +
                        </button>
                      </div>
                    </div>

                    <div class="field-group">
                      <label class="field-label">Luggage</label>

                      <div class="counter-row">
                        <button type="button" class="counter-button" @click="changeLuggage(-1)">
                          −
                        </button>

                        <span class="counter-number">{{ form.luggage }}</span>

                        <button type="button" class="counter-button" @click="changeLuggage(1)">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Contact -->
                <div v-else key="contact">
                  <h3 class="step-title">Your Details</h3>

                  <div v-if="form.type === 'transfer'" class="price-box">
                    <div>
                      <div class="price-label">Indicative Price</div>

                      <div class="price-meta">
                        {{ form.passengers }} passenger{{ form.passengers !== 1 ? 's' : '' }}
                        <template v-if="form.time && Number(form.time.split(':')[0]) < 6">
                          · night surcharge +€15
                        </template>
                      </div>
                    </div>

                    <div v-if="indicativePrice" class="price-value">
                      €{{ indicativePrice }}
                    </div>

                    <div v-else class="price-request">
                      On request
                    </div>
                  </div>

                  <div class="two-col">
                    <div class="field-group">
                      <label class="field-label">First Name</label>
                      <input v-model="form.name" class="text-input" placeholder="Your first name" />
                    </div>

                    <div class="field-group">
                      <label class="field-label">Surname</label>
                      <input v-model="form.surname" class="text-input" placeholder="Your surname" />
                    </div>
                  </div>

                  <div class="field-group">
                    <label class="field-label">Phone / WhatsApp</label>
                    <input
                      v-model="form.phone"
                      class="text-input"
                      :class="{ 'input-error': form.phone && !isPhoneValid }"
                      placeholder="+30 694 000 0000"
                      type="tel"
                    />
                    <p v-if="form.phone && !isPhoneValid" class="field-error">
                      Please use international format — start with + and country code (e.g. +30 694 000 0000)
                    </p>
                  </div>

                  <div class="field-group">
                    <label class="field-label">Email</label>
                    <input v-model="form.email" class="text-input" type="email" placeholder="email@example.com" />
                  </div>

                  <div class="field-group">
                    <label class="field-label">
                      Special Requests
                      <span class="optional">(optional)</span>
                    </label>

                    <textarea
                      v-model="form.notes"
                      class="text-input textarea"
                      rows="3"
                      placeholder="Child seat, accessibility, extra luggage…"
                    />
                  </div>

                  <div v-if="submitError" class="error-box">
                    {{ submitError }}
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Footer -->
            <div class="modal-footer">
              <button
                v-if="step > 1"
                type="button"
                class="back-button"
                @click="prevStep"
              >
                ← Back
              </button>

              <div class="footer-spacer" />

              <button
                v-if="step < totalSteps"
                type="button"
                class="continue-button"
                :disabled="!canNext"
                @click="nextStep"
              >
                Continue →
              </button>

              <button
                v-else
                type="submit"
                class="continue-button final"
                :disabled="!canNext || submitting"
              >
                {{ submitting ? 'Sending…' : 'Confirm Booking ✓' }}
              </button>
            </div>
          </form>
        </Transition>
      </div>
    </Transition>

    <!-- Map modal -->
    <Transition name="map-fade">
      <div
        v-if="showMapFor"
        class="map-overlay"
        @click.self="closeMap"
      >
        <div class="map-card">
          <div class="map-header">
            <div>
              <div class="eyebrow">Pin Your Location</div>
              <div class="map-title">Drop a pin on the map</div>
            </div>

            <button type="button" class="close-button" @click="closeMap">
              ✕
            </button>
          </div>

          <div ref="mapContainerRef" class="map-container" />

          <div class="map-footer">
            <div class="map-coords">
              📍 {{ tempLat.toFixed(5) }}, {{ tempLng.toFixed(5) }} — Drag the pin or tap to reposition
            </div>

            <button type="button" class="confirm-pin-button" @click="confirmPin">
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.booking-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(5, 12, 24, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.booking-modal {
  width: 100%;
  max-width: 560px;
  background: #0d2137;
  border-radius: 20px;
  border: 1px solid rgba(232, 201, 126, 0.15);
  box-shadow:
    0 40px 100px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(232, 201, 126, 0.1);
  border: 1px solid rgba(232, 201, 126, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.eyebrow {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold, #e8c97e);
  margin-bottom: 3px;
}

.brand-title,
.map-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.close-button {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.55);
  width: 34px;
  height: 34px;
  border-radius: 50%;
  cursor: pointer;
}

.progress-row {
  display: flex;
  align-items: center;
  padding: 18px 28px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.progress-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.progress-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.3);
}

.progress-circle.active {
  background: rgba(232, 201, 126, 0.2);
  border-color: var(--gold, #e8c97e);
  color: var(--gold, #e8c97e);
}

.progress-circle.done {
  background: var(--gold, #e8c97e);
  border-color: var(--gold, #e8c97e);
  color: #0d2137;
}

.progress-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.2);
}

.progress-label.active {
  color: var(--gold, #e8c97e);
}

.progress-label.done {
  color: rgba(232, 201, 126, 0.5);
}

.progress-line {
  flex: 1;
  height: 1px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.08);
}

.progress-line.done {
  background: rgba(232, 201, 126, 0.4);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 28px 28px 8px;
}

.step-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 26px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 24px;
}

.type-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 24px;
}

.type-card,
.tour-option {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-card.selected,
.tour-option.selected {
  background: rgba(232, 201, 126, 0.08);
  border-color: var(--gold, #e8c97e);
}

.type-card {
  border-radius: 12px;
  padding: 22px 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.type-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.type-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
}

.type-card.selected .type-title {
  color: var(--gold, #e8c97e);
}

.type-desc,
.tour-desc {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.5;
}

.tour-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tour-option {
  width: 100%;
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;
}

.tour-icon {
  font-size: 22px;
}

.tour-content {
  flex: 1;
}

.tour-title {
  display: block;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
}

.tour-option.selected .tour-title,
.selected-check {
  color: var(--gold, #e8c97e);
}

.field-group {
  margin-bottom: 18px;
}

.field-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.field-label {
  display: block;
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.field-label.gold {
  color: var(--gold, #e8c97e);
}

.optional {
  color: rgba(255, 255, 255, 0.3);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
}

.text-input,
.select-input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: #fff;
  outline: none;
  box-sizing: border-box;
  margin-bottom: 0;
}

.text-input::placeholder {
  color: rgba(255, 255, 255, 0.28);
}

.select-input {
  padding-right: 48px;
  appearance: none;
  color-scheme: dark;
  cursor: pointer;
}

.select-input.empty {
  color: rgba(255, 255, 255, 0.35);
}

.select-input option {
  background: #0d2137;
  color: #fff;
}

.textarea {
  resize: vertical;
  min-height: 88px;
}

.no-margin {
  margin-bottom: 0;
}

.inline-row {
  display: flex;
  gap: 8px;
}

.select-with-pin {
  position: relative;
}

.pin-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(232, 201, 126, 0.12);
  border: 1px solid rgba(232, 201, 126, 0.35);
  border-radius: 7px;
  width: 32px;
  height: 32px;
  cursor: pointer;
}

.pin-button.active {
  background: var(--gold, #e8c97e);
}

.set-button {
  height: 44px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(232, 201, 126, 0.4);
  background: rgba(232, 201, 126, 0.1);
  color: var(--gold, #e8c97e);
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  cursor: pointer;
  flex-shrink: 0;
}

.link-button {
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.link-button.active {
  color: var(--gold, #e8c97e);
  text-decoration: underline;
}

.location-preview {
  margin-top: 7px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: rgba(126, 200, 227, 0.8);
  letter-spacing: 0.04em;
}

.location-preview.pin {
  color: var(--gold, #e8c97e);
}

.edit-pin {
  margin-left: 8px;
  background: none;
  border: none;
  color: var(--sky, #7ec8e3);
  font-size: 11px;
  cursor: pointer;
  text-decoration: underline;
}

.info-box,
.error-box,
.price-box {
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 20px;
}

.info-box {
  background: rgba(232, 201, 126, 0.06);
  border: 1px solid rgba(232, 201, 126, 0.2);
}

.helper-text {
  margin: 7px 0 0;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.3);
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.counter-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.counter-button {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  font-size: 20px;
  cursor: pointer;
  color: #fff;
}

.counter-number {
  font-family: 'Cormorant Garamond', serif;
  font-size: 32px;
  font-weight: 600;
  color: var(--gold, #e8c97e);
  min-width: 32px;
  text-align: center;
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  padding: 0;
  margin-bottom: 14px;
}

.toggle {
  width: 36px;
  height: 20px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.15);
  position: relative;
  transition: background 0.2s;
}

.toggle span {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  transition: left 0.2s;
}

.toggle.active {
  background: var(--gold, #e8c97e);
}

.toggle.active span {
  left: 19px;
}

.hour-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hour-button {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
}

.hour-button.selected {
  border-color: var(--gold, #e8c97e);
  background: rgba(232, 201, 126, 0.12);
  color: var(--gold, #e8c97e);
}

.place-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.place-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  background: rgba(232, 201, 126, 0.1);
  border: 1px solid rgba(232, 201, 126, 0.3);
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: var(--gold, #e8c97e);
}

.place-pill button {
  background: none;
  border: none;
  color: rgba(232, 201, 126, 0.6);
  cursor: pointer;
  font-size: 14px;
}

.place-line {
  width: 20px;
  border-top: 1.5px dashed rgba(232, 201, 126, 0.35);
}

.price-box {
  background: rgba(232, 201, 126, 0.07);
  border: 1px solid rgba(232, 201, 126, 0.25);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.price-meta {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
}

.price-value {
  font-family: 'Cormorant Garamond', serif;
  font-size: 36px;
  font-weight: 600;
  color: var(--gold, #e8c97e);
}

.price-request {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.05em;
}

.error-box {
  background: rgba(255, 80, 80, 0.08);
  border: 1px solid rgba(255, 80, 80, 0.25);
  color: rgba(255, 220, 220, 0.9);
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  line-height: 1.5;
}

.input-error {
  border-color: rgba(255, 80, 80, 0.5) !important;
}

.field-error {
  margin: 6px 0 0;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: rgba(255, 140, 140, 0.9);
  line-height: 1.5;
}

.modal-footer {
  padding: 16px 24px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.footer-spacer {
  flex: 1;
}

.back-button {
  padding: 11px 20px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
}

.continue-button {
  padding: 12px 28px;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: linear-gradient(135deg, var(--sea, #1e5f8c), #0a4a6e);
  border: 1px solid rgba(126, 200, 227, 0.2);
  color: #fff;
  box-shadow: 0 4px 20px rgba(30, 95, 140, 0.4);
}

.continue-button.final {
  background: linear-gradient(135deg, #e8c97e, #c8a240);
  border: none;
  color: #0d2137;
  box-shadow: 0 4px 20px rgba(232, 201, 126, 0.3);
}

.continue-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.map-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(13, 33, 55, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.map-card {
  background: #0d2137;
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  max-width: 540px;
  border: 1px solid rgba(232, 201, 126, 0.2);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6);
}

.map-header {
  padding: 18px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.map-container {
  width: 100%;
  height: 320px;
}

.map-footer {
  padding: 14px 22px 18px;
  background: rgba(13, 33, 55, 0.8);
}

.map-coords {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 12px;
}

.confirm-pin-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, var(--sea, #1e5f8c), var(--navy, #0d2137));
  border: 1px solid rgba(232, 201, 126, 0.3);
  border-radius: 8px;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.35s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

.step-fade-enter-active,
.step-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.step-fade-enter-from,
.step-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.map-fade-enter-active,
.map-fade-leave-active {
  transition: opacity 0.25s ease;
}

.map-fade-enter-from,
.map-fade-leave-to {
  opacity: 0;
}

/* Scrollbar */
.modal-body::-webkit-scrollbar {
  width: 4px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background: rgba(232, 201, 126, 0.3);
  border-radius: 2px;
}

@media (max-width: 640px) {
  .booking-overlay {
    padding: 12px;
  }

  .modal-header,
  .modal-footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .modal-body {
    padding: 24px 18px 8px;
  }

  .type-grid,
  .two-col {
    grid-template-columns: 1fr;
  }

  .progress-label {
    display: none;
  }

  .continue-button,
  .back-button {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>