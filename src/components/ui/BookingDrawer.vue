<script setup>
import { ref, reactive, computed, watch, nextTick, onUnmounted } from 'vue';
import { trackBookingSubmission } from '../../utils/analytics';

const props = defineProps({ open: { type: Boolean, default: false } });
const emit = defineEmits(['update:open']);

/* ── Constants ── */
const LOCATIONS = [
  "Paros National Airport (PAS)",
  "Parikia Port",
  "Naoussa Port",
  "Piso Livadi Port",
  "Parikia Town Center",
  "Naoussa",
  "Santa Maria Beach",
  "Kolymbithres",
  "Golden Beach (Chryssi Akti)",
  "Alyki Village",
  "Lefkes Village",
  "Drios",
  "Marpissa",
  "Antiparos Ferry Terminal",
  "Custom location (pin on map)",
];

const TOUR_OPTIONS = [
  { id: 'history-tour',         label: 'History Tour',         desc: 'Museums, ruins & cultural gems',       icon: '🏛' },
  { id: 'beach-tour',           label: 'Beach Tour',           desc: '7 stunning beaches across the island',  icon: '🏖' },
  { id: 'half-day-island-tour', label: 'Half-Day Island Tour', desc: 'The best of Paros in 4 hours',          icon: '⛵' },
  { id: 'full-day-island-tour', label: 'Full-Day Island Tour', desc: 'An unhurried full-day island journey',   icon: '🗺' },
  { id: 'custom-tour',          label: 'Custom Tour',          desc: 'Design your own itinerary',             icon: '✨' },
];

const STEP_LABELS_TRANSFER = ['Journey', 'Route', 'Schedule', 'Details'];
const STEP_LABELS_TOUR      = ['Journey', 'Tour Details', 'Your Details'];

/* ── Form state ── */
const form = reactive({
  type: '',
  tourType: '',
  pickup: '', pickupLat: 37.084, pickupLng: 25.148,
  dropoff: '', dropoffLat: 37.084, dropoffLng: 25.148,
  date: '', time: '',
  passengers: 1,
  luggage: 0,
  flightNumber: '',
  name: '', phone: '', email: '', notes: '',
});

const step        = ref(1);
const submitted   = ref(false);
const submitting  = ref(false);

/* ── Custom tour state ── */
const customBusinessDecide = ref(false);
const customHours          = ref('');
const customPlaceInput     = ref('');
const customPlaces         = ref([]);

function addCustomPlace() {
  const val = customPlaceInput.value.trim();
  if (!val) return;
  customPlaces.value.push(val);
  customPlaceInput.value = '';
}

function removeCustomPlace(i) {
  customPlaces.value.splice(i, 1);
}

/* ── Location input modes ── */
const pickupManual     = ref(false);
const dropoffManual    = ref(false);
const pickupManualTxt  = ref('');
const dropoffManualTxt = ref('');

/* ── Leaflet map modal ── */
const showMapFor      = ref(null); // 'pickup' | 'dropoff'
const mapContainerRef = ref(null);
const tempLat         = ref(37.084);
const tempLng         = ref(25.148);
let leafletMap    = null;
let leafletMarker = null;

/* ── Price tables ── */
const priceTables = {
  Parikia: {
    Naousa: { '1-4': 36, '5-8': 50 }, Monastiri: { '1-4': 40, '5-8': 55 },
    'Airport - Alyki': { '1-4': 40, '5-8': 55 }, 'Drios - ΧΑ': { '1-4': 50, '5-8': 65 },
    Lefkes: { '1-4': 45, '5-8': 60 }, 'Piso Livadi': { '1-4': 50, '5-8': 65 },
    Pounta: { '1-4': 36, '5-8': 45 }, 'Krios - cabana': { '1-4': 36, '5-8': 40 },
    'SantaMaria - Ampelas': { '1-4': 45, '5-8': 60 }, Parikia: { '1-4': 36, '5-8': 50 },
  },
  Naousa: {
    Parikia: { '1-4': 36, '5-8': 50 }, Monastiri: { '1-4': 36, '5-8': 45 },
    'Airport - Alyki': { '1-4': 50, '5-8': 65 }, 'Drios - ΧΑ': { '1-4': 45, '5-8': 60 },
    Lefkes: { '1-4': 40, '5-8': 55 }, 'Piso Livadi': { '1-4': 40, '5-8': 55 },
    Pounta: { '1-4': 50, '5-8': 65 }, 'Krios - cabana': { '1-4': 45, '5-8': 60 },
    'SantaMaria - Ampelas': { '1-4': 36, '5-8': 45 }, Naousa: { '1-4': 36, '5-8': 50 },
  },
  'SantaMaria - Ampelas': {
    Parikia: { '1-4': 45, '5-8': 60 }, Naousa: { '1-4': 36, '5-8': 45 },
    Monastiri: { '1-4': 40, '5-8': 55 }, 'Airport - Alyki': { '1-4': 55, '5-8': 70 },
    'Drios - ΧΑ': { '1-4': 45, '5-8': 60 }, Lefkes: { '1-4': 40, '5-8': 55 },
    'Piso Livadi': { '1-4': 40, '5-8': 55 }, Pounta: { '1-4': 55, '5-8': 70 },
    'Krios - cabana': { '1-4': 45, '5-8': 60 }, 'SantaMaria - Ampelas': { '1-4': 36, '5-8': 50 },
  },
  'Drios - ΧΑ': {
    Parikia: { '1-4': 50, '5-8': 65 }, Naousa: { '1-4': 45, '5-8': 60 },
    Monastiri: { '1-4': 50, '5-8': 65 }, 'Airport - Alyki': { '1-4': 45, '5-8': 60 },
    Lefkes: { '1-4': 45, '5-8': 60 }, 'Piso Livadi': { '1-4': 40, '5-8': 55 },
    Pounta: { '1-4': 50, '5-8': 65 }, 'Krios - cabana': { '1-4': 55, '5-8': 70 },
    'SantaMaria - Ampelas': { '1-4': 50, '5-8': 65 }, 'Drios - ΧΑ': { '1-4': 36, '5-8': 50 },
  },
  'Airport - Alyki': {
    Parikia: { '1-4': 40, '5-8': 55 }, Naousa: { '1-4': 50, '5-8': 65 },
    Monastiri: { '1-4': 50, '5-8': 65 }, 'Drios - ΧΑ': { '1-4': 45, '5-8': 60 },
    Lefkes: { '1-4': 50, '5-8': 65 }, 'Piso Livadi': { '1-4': 50, '5-8': 65 },
    Pounta: { '1-4': 36, '5-8': 50 }, 'Krios - cabana': { '1-4': 45, '5-8': 60 },
    'SantaMaria - Ampelas': { '1-4': 55, '5-8': 70 }, 'Airport - Alyki': { '1-4': 36, '5-8': 50 },
  },
  Lefkes: {
    Parikia: { '1-4': 45, '5-8': 60 }, Naousa: { '1-4': 40, '5-8': 55 },
    Monastiri: { '1-4': 45, '5-8': 60 }, 'Airport - Alyki': { '1-4': 50, '5-8': 65 },
    'Drios - ΧΑ': { '1-4': 45, '5-8': 60 }, 'Piso Livadi': { '1-4': 45, '5-8': 60 },
    Pounta: { '1-4': 50, '5-8': 65 }, 'Krios - cabana': { '1-4': 50, '5-8': 65 },
    'SantaMaria - Ampelas': { '1-4': 40, '5-8': 55 }, Lefkes: { '1-4': 36, '5-8': 50 },
  },
  'Piso Livadi': {
    Parikia: { '1-4': 50, '5-8': 65 }, Naousa: { '1-4': 40, '5-8': 55 },
    Monastiri: { '1-4': 45, '5-8': 60 }, 'Airport - Alyki': { '1-4': 50, '5-8': 65 },
    'Drios - ΧΑ': { '1-4': 45, '5-8': 60 }, Lefkes: { '1-4': 45, '5-8': 60 },
    Pounta: { '1-4': 50, '5-8': 65 }, 'Krios - cabana': { '1-4': 55, '5-8': 70 },
    'SantaMaria - Ampelas': { '1-4': 45, '5-8': 60 }, 'Piso Livadi': { '1-4': 36, '5-8': 50 },
  },
  'Krios - cabana': {
    Parikia: { '1-4': 36, '5-8': 50 }, Naousa: { '1-4': 45, '5-8': 60 },
    Monastiri: { '1-4': 36, '5-8': 50 }, 'Airport - Alyki': { '1-4': 45, '5-8': 60 },
    'Drios - ΧΑ': { '1-4': 55, '5-8': 70 }, Lefkes: { '1-4': 50, '5-8': 65 },
    'Piso Livadi': { '1-4': 55, '5-8': 70 }, Pounta: { '1-4': 36, '5-8': 50 },
    'SantaMaria - Ampelas': { '1-4': 45, '5-8': 60 }, 'Krios - cabana': { '1-4': 36, '5-8': 50 },
  },
  Monastiri: {
    Parikia: { '1-4': 40, '5-8': 55 }, Naousa: { '1-4': 36, '5-8': 45 },
    'Airport - Alyki': { '1-4': 50, '5-8': 65 }, 'Drios - ΧΑ': { '1-4': 50, '5-8': 65 },
    Lefkes: { '1-4': 45, '5-8': 60 }, 'Piso Livadi': { '1-4': 40, '5-8': 55 },
    Pounta: { '1-4': 40, '5-8': 55 }, 'Krios - cabana': { '1-4': 36, '5-8': 50 },
    'SantaMaria - Ampelas': { '1-4': 40, '5-8': 55 }, Monastiri: { '1-4': 36, '5-8': 50 },
  },
};

function normalizeLocation(loc) {
  if (!loc) return null;
  const l = loc.toLowerCase();
  if (l.includes('airport')) return 'Airport - Alyki';
  if (l.includes('alyki')) return 'Airport - Alyki';
  if (l.includes('antiparos')) return 'Pounta';
  if (l.includes('piso livadi')) return 'Piso Livadi';
  if (l.includes('santa maria') || l.includes('kolymbithres')) return 'SantaMaria - Ampelas';
  if (l.includes('golden beach') || l.includes('chryssi') || l.includes('drios')) return 'Drios - ΧΑ';
  if (l.includes('lefkes')) return 'Lefkes';
  if (l.includes('marpissa')) return 'Piso Livadi';
  if (l.includes('naousa') || l.includes('naoussa')) return 'Naousa';
  if (l.includes('parikia')) return 'Parikia';
  return null;
}

const indicativePrice = computed(() => {
  if (form.type === 'transfer') {
    const from = normalizeLocation(form.pickup);
    const to   = normalizeLocation(form.dropoff);
    if (!from || !to) return null;
    const origin  = priceTables[from] || {};
    const rates   = origin[to] || (priceTables[to] && priceTables[to][from]);
    if (!rates) return null;
    const bracket = form.passengers <= 4 ? '1-4' : '5-8';
    let price = rates[bracket];
    const h = +((form.time || '').split(':')[0]) || 0;
    if (h < 6 && form.time) price += 15;
    return price;
  }
  return null;
});

/* ── Computed ── */
const totalSteps = computed(() => form.type === 'transfer' ? 4 : 3);
const stepLabels = computed(() =>
  form.type === 'tour' ? STEP_LABELS_TOUR : STEP_LABELS_TRANSFER
);
const minDate = computed(() => new Date().toISOString().split('T')[0]);

const isAirportPickup = computed(() =>
  form.pickup && form.pickup.toLowerCase().includes('airport')
);
const isPortPickup = computed(() =>
  form.pickup && (
    form.pickup.toLowerCase().includes('port') ||
    form.pickup.toLowerCase().includes('piso livadi') ||
    form.pickup.toLowerCase().includes('antiparos')
  )
);

const canNext = computed(() => {
  if (step.value === 1) return !!form.type && (form.type !== 'tour' || !!form.tourType);
  if (step.value === 2 && form.type === 'transfer') return !!form.pickup && !!form.dropoff;
  if (step.value === 2 && form.type === 'tour' && form.tourType === 'custom-tour')
    return customBusinessDecide.value || !!customHours.value;
  if (step.value === 2 && form.type === 'tour') return !!form.date && !!form.time;
  if (step.value === 3 && form.type === 'transfer') return !!form.date && !!form.time;
  if (step.value === 3 && form.type === 'tour')     return !!form.name && !!form.phone;
  if (step.value === 4)                              return !!form.name && !!form.phone;
  return false;
});

/* ── Navigation ── */
function close() {
  emit('update:open', false);
  setTimeout(resetForm, 300);
}

function resetForm() {
  step.value      = 1;
  submitted.value = false;
  Object.assign(form, {
    type: '', tourType: '',
    pickup: '', pickupLat: 37.084, pickupLng: 25.148,
    dropoff: '', dropoffLat: 37.084, dropoffLng: 25.148,
    date: '', time: '', passengers: 1, luggage: 0,
    flightNumber: '', name: '', phone: '', email: '', notes: '',
  });
  pickupManual.value = false;
  dropoffManual.value = false;
  pickupManualTxt.value = '';
  dropoffManualTxt.value = '';
  customBusinessDecide.value = false;
  customHours.value          = '';
  customPlaceInput.value     = '';
  customPlaces.value         = [];
}

function prevStep() {
  if (step.value > 1) step.value--;
}

async function nextOrSubmit() {
  if (!canNext.value) return;
  if (step.value < totalSteps.value) {
    step.value++;
  } else {
    await submitForm();
  }
}

async function submitForm() {
  submitting.value = true;
  try {
    if (typeof trackBookingSubmission === 'function') {
      trackBookingSubmission({ ...form });
    }
    await fetch('https://formspree.io/f/xldbkeed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        type: form.type,
        tourType: form.tourType,
        pickup: form.pickup,
        pickupCoords: form.pickup === 'Custom location (pin on map)'
          ? `${form.pickupLat.toFixed(5)}, ${form.pickupLng.toFixed(5)}` : '',
        dropoff: form.dropoff,
        dropoffCoords: form.dropoff === 'Custom location (pin on map)'
          ? `${form.dropoffLat.toFixed(5)}, ${form.dropoffLng.toFixed(5)}` : '',
        date: form.date,
        time: form.time,
        passengers: form.passengers,
        luggage: form.luggage,
        flightNumber: form.flightNumber,
        name: form.name,
        phone: form.phone,
        email: form.email,
        notes: form.notes,
        customHours:  form.tourType === 'custom-tour'
          ? (customBusinessDecide.value ? 'Business to decide' : customHours.value + ' hours')
          : undefined,
        customPlaces: form.tourType === 'custom-tour' ? customPlaces.value.join(', ') : undefined,
      }),
    });
    submitted.value = true;
  } catch (e) {
    console.error(e);
  } finally {
    submitting.value = false;
  }
}

/* ── Passenger counter ── */
function changePassengers(delta) {
  form.passengers = Math.max(1, Math.min(8, form.passengers + delta));
}

/* ── Manual location confirm ── */
function confirmManual(which) {
  const txt = which === 'pickup' ? pickupManualTxt.value : dropoffManualTxt.value;
  if (!txt.trim()) return;
  if (which === 'pickup') {
    form.pickup = txt.trim();
    pickupManual.value = false;
  } else {
    form.dropoff = txt.trim();
    dropoffManual.value = false;
  }
}

/* ── Leaflet map ── */
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
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => nextTick(initMap);
    document.head.appendChild(script);
  } else {
    nextTick(initMap);
  }
}

function initMap() {
  if (!mapContainerRef.value || leafletMap) return;
  const L = window.L;
  leafletMap = L.map(mapContainerRef.value).setView([tempLat.value, tempLng.value], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
  }).addTo(leafletMap);
  leafletMarker = L.marker([tempLat.value, tempLng.value], { draggable: true }).addTo(leafletMap);
  leafletMarker.on('dragend', e => {
    const ll = e.target.getLatLng();
    tempLat.value = ll.lat;
    tempLng.value = ll.lng;
  });
  leafletMap.on('click', e => {
    leafletMarker.setLatLng(e.latlng);
    tempLat.value = e.latlng.lat;
    tempLng.value = e.latlng.lng;
  });
}

function confirmPin() {
  if (showMapFor.value === 'pickup') {
    form.pickupLat = tempLat.value;
    form.pickupLng = tempLng.value;
    form.pickup = 'Custom location (pin on map)';
  } else {
    form.dropoffLat = tempLat.value;
    form.dropoffLng = tempLng.value;
    form.dropoff = 'Custom location (pin on map)';
  }
  closeMap();
}

function closeMap() {
  if (leafletMap) { leafletMap.remove(); leafletMap = null; leafletMarker = null; }
  showMapFor.value = null;
}

watch(showMapFor, val => {
  if (val && window.L) nextTick(initMap);
});

watch(() => props.open, isOpen => {
  if (!isOpen) setTimeout(resetForm, 300);
});

onUnmounted(() => {
  if (leafletMap) { leafletMap.remove(); leafletMap = null; }
});

/* ── Style constants used in template ── */
const stepTitle = {
  fontFamily: "'Cormorant Garamond',serif",
  fontSize: '26px', fontWeight: 600,
  color: '#fff', marginBottom: '24px',
  letterSpacing: '-0.01em',
};

const fieldLabel = {
  fontFamily: "'DM Sans',sans-serif",
  fontSize: '10px', fontWeight: 600,
  color: 'rgba(255,255,255,0.45)',
  marginBottom: '8px',
  textTransform: 'uppercase', letterSpacing: '0.14em',
  display: 'block',
};

const inputStyle = {
  width: '100%', padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)',
  fontFamily: "'DM Sans',sans-serif", fontSize: '14px',
  color: '#fff', outline: 'none',
  boxSizing: 'border-box', marginBottom: '16px',
  transition: 'border-color 0.2s',
};

const selectStyle = {
  width: '100%', padding: '12px 44px 12px 14px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)',
  fontFamily: "'DM Sans',sans-serif", fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  cursor: 'pointer', appearance: 'none',
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='rgba(255,255,255,0.3)'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 42px center',
  marginBottom: '0',
};

const counterWrapper = {
  display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px',
};

const counterBtn = {
  width: '38px', height: '38px', borderRadius: '50%',
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.05)',
  fontSize: '20px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#fff', fontWeight: 300,
  transition: 'all 0.2s',
};

const counterNum = {
  fontFamily: "'Cormorant Garamond',serif",
  fontSize: '32px', fontWeight: 600,
  color: 'var(--gold)', minWidth: '36px',
  textAlign: 'center', lineHeight: '1',
};

const backBtnStyle = {
  padding: '11px 20px',
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '10px',
  fontFamily: "'DM Sans',sans-serif", fontSize: '13px',
  color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
  transition: 'all 0.2s',
};

const setButtonStyle = {
  padding: '0 14px', borderRadius: '10px',
  border: '1px solid rgba(232,201,126,0.4)',
  background: 'rgba(232,201,126,0.1)', color: 'var(--gold)',
  fontFamily: "'DM Sans',sans-serif", fontSize: '12px',
  cursor: 'pointer', flexShrink: '0',
  height: '46px',
};

const editPinStyle = {
  marginLeft: '8px', background: 'none', border: 'none',
  color: 'var(--sky)', fontSize: '11px',
  cursor: 'pointer', textDecoration: 'underline',
};

function manualToggleStyle(active) {
  return {
    background: 'none', border: 'none', cursor: 'pointer',
    fontFamily: "'DM Sans',sans-serif", fontSize: '10px',
    color: active ? 'var(--gold)' : 'rgba(255,255,255,0.35)',
    letterSpacing: '0.1em', textTransform: 'uppercase',
    textDecoration: active ? 'underline' : 'none',
  };
}

function mapPinButtonStyle(active) {
  return {
    position: 'absolute', right: '8px', top: '50%',
    transform: 'translateY(-50%)',
    background: active ? 'var(--gold)' : 'rgba(232,201,126,0.12)',
    border: '1px solid rgba(232,201,126,0.35)',
    borderRadius: '7px', width: '32px', height: '32px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.2s', flexShrink: '0',
  };
}

function previewStyle(isPin) {
  return {
    marginTop: '6px',
    fontFamily: "'DM Sans',sans-serif", fontSize: '11px',
    color: isPin ? 'var(--gold)' : 'rgba(126,200,227,0.7)',
    letterSpacing: '0.04em',
  };
}
</script>

<template>
  <Teleport to="body">
    <!-- ── Main modal overlay ── -->
    <Transition name="modal-fade">
      <div
        v-if="open"
        :style="{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(5,12,24,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }"
        @click.self="close"
      >
        <!-- ── Success screen ── -->
        <Transition name="modal-scale" mode="out-in">
          <div v-if="submitted" :style="{
            background: '#0d2137',
            borderRadius: '20px',
            width: '100%', maxWidth: '560px',
            padding: '60px 40px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', textAlign: 'center',
            border: '1px solid rgba(232,201,126,0.15)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
          }">
            <!-- Checkmark circle -->
            <div :style="{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'rgba(232,201,126,0.1)',
              border: '1px solid var(--gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '24px', fontSize: '32px',
            }">✓</div>
            <div :style="{
              fontFamily: '\'DM Sans\',sans-serif', fontSize: '10px',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--gold)', marginBottom: '12px',
            }">Booking Received</div>
            <div :style="{
              fontFamily: '\'Cormorant Garamond\',serif',
              fontSize: '36px', fontWeight: 600,
              color: '#fff', marginBottom: '14px',
            }">
              Thank you{{ form.name ? `, ${form.name}` : '' }}!
            </div>
            <p :style="{
              fontFamily: '\'DM Sans\',sans-serif', fontSize: '15px',
              color: 'rgba(255,255,255,0.6)', lineHeight: 1.7,
              maxWidth: '340px', margin: '0 auto 32px',
            }">
              We'll confirm your booking via WhatsApp or phone within the hour. See you on Paros.
            </p>
            <button
              @click="close"
              :style="{
                padding: '13px 40px',
                background: 'linear-gradient(135deg, #e8c97e, #c8a240)',
                border: 'none', borderRadius: '10px',
                fontFamily: '\'DM Sans\',sans-serif', fontSize: '13px',
                fontWeight: 700, color: '#0d2137', cursor: 'pointer',
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }"
            >Back to Home</button>
          </div>

          <!-- ── Form modal ── -->
          <div v-else :style="{
            background: '#0d2137',
            borderRadius: '20px',
            width: '100%', maxWidth: '560px',
            maxHeight: '90vh',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid rgba(232,201,126,0.15)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
          }">

            <!-- Header -->
            <div :style="{
              padding: '20px 24px',
              background: 'rgba(255,255,255,0.02)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexShrink: 0,
            }">
              <div style="display:flex; align-items:center; gap:14px;">
                <!-- Car monogram -->
                <div :style="{
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: 'rgba(232,201,126,0.1)',
                  border: '1px solid rgba(232,201,126,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }">
                  <svg width="22" height="12" viewBox="0 0 48 24" fill="none">
                    <path d="M4 15 L4 10 Q5 7 9 5 L22 4 Q30 4 34 6 L43 9 Q45 10 45 13 L45 15 Z"
                      fill="none" stroke="#e8c97e" stroke-width="1.5"/>
                    <path d="M9 5 Q14 1 22 1 L30 1 Q36 1 38 5" stroke="#7ec8e3" stroke-width="1.2" fill="none"/>
                    <circle cx="12" cy="17" r="3.5" stroke="#e8c97e" stroke-width="1.2" fill="none"/>
                    <circle cx="36" cy="17" r="3.5" stroke="#e8c97e" stroke-width="1.2" fill="none"/>
                  </svg>
                </div>
                <div>
                  <div :style="{
                    fontFamily: '\'DM Sans\',sans-serif', fontSize: '10px',
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'var(--gold)', marginBottom: '2px',
                  }">Reserve Your Journey</div>
                  <div :style="{
                    fontFamily: '\'Cormorant Garamond\',serif',
                    fontSize: '20px', fontWeight: 600,
                    color: '#fff', letterSpacing: '-0.01em',
                  }">Express Transfer Paros</div>
                </div>
              </div>
              <button
                @click="close"
                :style="{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.5)',
                  width: '34px', height: '34px', borderRadius: '50%',
                  fontSize: '14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }"
              >✕</button>
            </div>

            <!-- Progress circles -->
            <div :style="{
              display: 'flex', alignItems: 'center',
              padding: '18px 28px 14px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(0,0,0,0.15)',
              flexShrink: 0,
            }">
              <template v-for="(label, i) in stepLabels" :key="i">
                <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                  <!-- Circle -->
                  <div :style="{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: step > i+1 ? 'var(--gold)' : step === i+1 ? 'rgba(232,201,126,0.2)' : 'rgba(255,255,255,0.07)',
                    border: step > i+1 ? 'none' : step === i+1 ? '1.5px solid var(--gold)' : '1px solid rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: '\'DM Sans\',sans-serif', fontSize: '11px', fontWeight: 700,
                    color: step > i+1 ? '#0d2137' : step === i+1 ? 'var(--gold)' : 'rgba(255,255,255,0.3)',
                    transition: 'all 0.4s ease',
                  }">
                    {{ step > i+1 ? '✓' : i+1 }}
                  </div>
                  <!-- Label -->
                  <div :style="{
                    fontFamily: '\'DM Sans\',sans-serif', fontSize: '9px',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: step === i+1 ? 'var(--gold)' : step > i+1 ? 'rgba(232,201,126,0.5)' : 'rgba(255,255,255,0.2)',
                    transition: 'color 0.4s',
                  }">{{ label }}</div>
                </div>
                <!-- Connecting line -->
                <div
                  v-if="i < stepLabels.length - 1"
                  :style="{
                    flex: 1, height: '1px', marginBottom: '20px',
                    background: step > i+1 ? 'rgba(232,201,126,0.4)' : 'rgba(255,255,255,0.08)',
                    transition: 'background 0.4s',
                  }"
                />
              </template>
            </div>

            <!-- Scrollable body -->
            <div :style="{
              flex: 1, overflowY: 'auto',
              padding: '28px 28px 8px',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(232,201,126,0.3) transparent',
            }">
              <Transition name="step-fade" mode="out-in">

                <!-- ── Step 1: Journey type ── -->
                <div v-if="step === 1" key="s1">
                  <div :style="stepTitle">What type of journey?</div>

                  <!-- Type cards -->
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:24px;">
                    <div
                      v-for="t in [{id:'transfer',icon:'🚗',label:'Private Transfer',desc:'Airport, port, hotel & point-to-point'},{id:'tour',icon:'🏝',label:'Island Tour',desc:'Half-day or full-day guided experiences'}]"
                      :key="t.id"
                      @click="form.type = t.id"
                      :style="{
                        padding: '22px 16px', borderRadius: '12px', cursor: 'pointer',
                        textAlign: 'center',
                        background: form.type === t.id ? 'rgba(232,201,126,0.08)' : 'rgba(255,255,255,0.03)',
                        border: form.type === t.id ? '1.5px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)',
                        transition: 'all 0.25s ease',
                      }"
                    >
                      <div style="font-size:32px; margin-bottom:10px;">{{ t.icon }}</div>
                      <div :style="{
                        fontFamily: '\'Cormorant Garamond\',serif', fontSize: '18px',
                        fontWeight: 600, marginBottom: '5px',
                        color: form.type === t.id ? 'var(--gold)' : '#fff',
                      }">{{ t.label }}</div>
                      <div :style="{
                        fontFamily: '\'DM Sans\',sans-serif', fontSize: '12px',
                        color: 'rgba(255,255,255,0.45)', lineHeight: 1.5,
                      }">{{ t.desc }}</div>
                    </div>
                  </div>

                  <!-- Tour options (if tour selected) -->
                  <div v-if="form.type === 'tour'">
                    <div :style="fieldLabel">Select Tour Type</div>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                      <div
                        v-for="t in TOUR_OPTIONS"
                        :key="t.id"
                        @click="form.tourType = t.id"
                        :style="{
                          padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                          display: 'flex', gap: '14px', alignItems: 'center',
                          background: form.tourType === t.id ? 'rgba(232,201,126,0.08)' : 'rgba(255,255,255,0.03)',
                          border: form.tourType === t.id ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.08)',
                          transition: 'all 0.2s',
                        }"
                      >
                        <span style="font-size:22px;">{{ t.icon }}</span>
                        <div>
                          <div :style="{
                            fontFamily: '\'DM Sans\',sans-serif', fontWeight: 600,
                            fontSize: '14px',
                            color: form.tourType === t.id ? 'var(--gold)' : '#fff',
                          }">{{ t.label }}</div>
                          <div style="font-size:12px; color:rgba(255,255,255,0.4); margin-top:2px;">{{ t.desc }}</div>
                        </div>
                        <div v-if="form.tourType === t.id" style="margin-left:auto; color:var(--gold); font-size:16px;">✓</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ── Step 2 Transfer: Pickup & Drop-off ── -->
                <div v-else-if="step === 2 && form.type === 'transfer'" key="s2t">
                  <div :style="stepTitle">Pickup & Drop-off</div>

                  <!-- Pickup input -->
                  <div style="margin-bottom:20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                      <div :style="fieldLabel">📍 Pickup Location</div>
                      <button
                        @click="pickupManual = !pickupManual; pickupManualTxt = ''"
                        :style="manualToggleStyle(pickupManual)"
                      >{{ pickupManual ? '← Pick from list' : 'Type manually' }}</button>
                    </div>
                    <!-- Manual text -->
                    <div v-if="pickupManual" style="display:flex; gap:8px;">
                      <input
                        v-model="pickupManualTxt"
                        placeholder="Type address or landmark…"
                        @keydown.enter="confirmManual('pickup')"
                        :style="{ ...inputStyle, marginBottom: 0, flex: 1 }"
                      />
                      <button @click="confirmManual('pickup')" :style="setButtonStyle">Set</button>
                    </div>
                    <!-- List select + map pin -->
                    <div v-else style="position:relative;">
                      <select
                        v-model="form.pickup"
                        :style="{
                          ...selectStyle,
                          color: form.pickup ? '#fff' : 'rgba(255,255,255,0.35)',
                          colorScheme: 'dark',
                        }"
                      >
                        <option value="" style="background:#0d2137; color:rgba(255,255,255,0.4);">— Select or pin location —</option>
                        <option v-for="loc in LOCATIONS" :key="loc" :value="loc" style="background:#0d2137; color:#fff;">{{ loc }}</option>
                      </select>
                      <button
                        @click="openMap('pickup')"
                        title="Pin on map"
                        :style="mapPinButtonStyle(form.pickup === 'Custom location (pin on map)')"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                            :fill="form.pickup === 'Custom location (pin on map)' ? '#0d2137' : '#e8c97e'"/>
                        </svg>
                      </button>
                    </div>
                    <!-- Value preview -->
                    <div v-if="form.pickup && !pickupManual" :style="previewStyle(form.pickup === 'Custom location (pin on map)')">
                      <span v-if="form.pickup === 'Custom location (pin on map)'">
                        📍 {{ form.pickupLat.toFixed(5) }}, {{ form.pickupLng.toFixed(5) }}
                        <button @click="openMap('pickup')" :style="editPinStyle">Edit pin</button>
                      </span>
                      <span v-else>✓ {{ form.pickup }}</span>
                    </div>
                  </div>

                  <!-- Flight/Ferry number when airport/port -->
                  <div v-if="isAirportPickup || isPortPickup" :style="{
                    marginBottom: '20px', padding: '14px 16px', borderRadius: '10px',
                    background: 'rgba(232,201,126,0.06)', border: '1px solid rgba(232,201,126,0.2)',
                  }">
                    <div :style="{ ...fieldLabel, color: 'var(--gold)', marginBottom: '8px' }">
                      {{ isAirportPickup ? '✈ Flight Number' : '⛴ Ferry / Boat Number' }}
                      <span style="color:rgba(255,255,255,0.25); font-weight:400; margin-left:6px;">(for tracking)</span>
                    </div>
                    <input
                      v-model="form.flightNumber"
                      :placeholder="isAirportPickup ? 'e.g. A3 622, FR 1234…' : 'e.g. Blue Star Paros, Express Skopelitis…'"
                      :style="{ ...inputStyle, marginBottom: 0, background: 'rgba(255,255,255,0.06)' }"
                    />
                    <div style="font-family:'DM Sans',sans-serif; font-size:11px; color:rgba(255,255,255,0.3); margin-top:6px;">
                      We use this to track your arrival and adjust pickup time if delayed.
                    </div>
                  </div>

                  <!-- Dropoff input -->
                  <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                      <div :style="fieldLabel">🏁 Drop-off Location</div>
                      <button
                        @click="dropoffManual = !dropoffManual; dropoffManualTxt = ''"
                        :style="manualToggleStyle(dropoffManual)"
                      >{{ dropoffManual ? '← Pick from list' : 'Type manually' }}</button>
                    </div>
                    <div v-if="dropoffManual" style="display:flex; gap:8px;">
                      <input
                        v-model="dropoffManualTxt"
                        placeholder="Type address or landmark…"
                        @keydown.enter="confirmManual('dropoff')"
                        :style="{ ...inputStyle, marginBottom: 0, flex: 1 }"
                      />
                      <button @click="confirmManual('dropoff')" :style="setButtonStyle">Set</button>
                    </div>
                    <div v-else style="position:relative;">
                      <select
                        v-model="form.dropoff"
                        :style="{
                          ...selectStyle,
                          color: form.dropoff ? '#fff' : 'rgba(255,255,255,0.35)',
                          colorScheme: 'dark',
                        }"
                      >
                        <option value="" style="background:#0d2137; color:rgba(255,255,255,0.4);">— Select or pin location —</option>
                        <option v-for="loc in LOCATIONS" :key="loc" :value="loc" style="background:#0d2137; color:#fff;">{{ loc }}</option>
                      </select>
                      <button
                        @click="openMap('dropoff')"
                        title="Pin on map"
                        :style="mapPinButtonStyle(form.dropoff === 'Custom location (pin on map)')"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                            :fill="form.dropoff === 'Custom location (pin on map)' ? '#0d2137' : '#e8c97e'"/>
                        </svg>
                      </button>
                    </div>
                    <div v-if="form.dropoff && !dropoffManual" :style="previewStyle(form.dropoff === 'Custom location (pin on map)')">
                      <span v-if="form.dropoff === 'Custom location (pin on map)'">
                        📍 {{ form.dropoffLat.toFixed(5) }}, {{ form.dropoffLng.toFixed(5) }}
                        <button @click="openMap('dropoff')" :style="editPinStyle">Edit pin</button>
                      </span>
                      <span v-else>✓ {{ form.dropoff }}</span>
                    </div>
                  </div>
                </div>

                <!-- ── Step 2 Tour: Tour Details ── -->
                <div v-else-if="step === 2 && form.type === 'tour'" key="s2tour">
                  <div :style="stepTitle">Tour Details</div>

                  <!-- ══ Custom Tour sub-form ══ -->
                  <template v-if="form.tourType === 'custom-tour'">

                    <!-- Duration -->
                    <div :style="fieldLabel">How long would you like the tour?</div>
                    <div :style="{ marginBottom: '20px' }">
                      <label :style="{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        marginBottom: '14px', cursor: 'pointer',
                        fontFamily: '\'DM Sans\',sans-serif', fontSize: '13px',
                        color: 'rgba(255,255,255,0.7)',
                      }">
                        <div
                          @click="customBusinessDecide = !customBusinessDecide"
                          :style="{
                            width: '36px', height: '20px', borderRadius: '100px',
                            background: customBusinessDecide ? 'var(--gold)' : 'rgba(255,255,255,0.15)',
                            position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
                          }"
                        >
                          <div :style="{
                            position: 'absolute', top: '3px',
                            left: customBusinessDecide ? '19px' : '3px',
                            width: '14px', height: '14px', borderRadius: '50%',
                            background: '#fff', transition: 'left 0.2s',
                          }" />
                        </div>
                        Let the team suggest the duration
                      </label>
                      <div v-if="!customBusinessDecide" :style="{ display: 'flex', gap: '10px', flexWrap: 'wrap' }">
                        <button
                          v-for="h in [2,3,4,5,6,7,8,9,10,11,12]" :key="h"
                          @click="customHours = String(h)"
                          :style="{
                            padding: '8px 16px', borderRadius: '8px',
                            border: customHours === String(h)
                              ? '1.5px solid var(--gold)'
                              : '1px solid rgba(255,255,255,0.12)',
                            background: customHours === String(h)
                              ? 'rgba(232,201,126,0.12)'
                              : 'rgba(255,255,255,0.04)',
                            fontFamily: '\'DM Sans\',sans-serif', fontSize: '13px',
                            color: customHours === String(h) ? 'var(--gold)' : 'rgba(255,255,255,0.6)',
                            cursor: 'pointer', transition: 'all 0.18s',
                          }"
                        >{{ h }}h</button>
                      </div>
                    </div>

                    <!-- Places to visit -->
                    <div :style="fieldLabel">Places you'd like to visit</div>
                    <div :style="{ display: 'flex', gap: '8px', marginBottom: '12px' }">
                      <input
                        v-model="customPlaceInput"
                        placeholder="e.g. Naoussa, Lefkes, Golden Beach…"
                        @keydown.enter.prevent="addCustomPlace"
                        :style="{ ...inputStyle, marginBottom: 0, flex: 1 }"
                      />
                      <button @click="addCustomPlace" :style="setButtonStyle">Add</button>
                    </div>
                    <!-- Breadcrumb route -->
                    <div v-if="customPlaces.length > 0" :style="{
                      display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                      gap: '6px', marginBottom: '20px',
                      padding: '14px 16px', borderRadius: '10px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }">
                      <template v-for="(place, i) in customPlaces" :key="i">
                        <div :style="{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '5px 12px', borderRadius: '100px',
                          background: 'rgba(232,201,126,0.1)',
                          border: '1px solid rgba(232,201,126,0.3)',
                          fontFamily: '\'DM Sans\',sans-serif', fontSize: '12px',
                          color: 'var(--gold)',
                        }">
                          <span style="width:6px;height:6px;border-radius:50%;background:var(--gold);flex-shrink:0;" />
                          {{ place }}
                          <button
                            @click="removeCustomPlace(i)"
                            :style="{
                              background: 'none', border: 'none', color: 'rgba(232,201,126,0.5)',
                              cursor: 'pointer', fontSize: '14px', padding: '0 0 0 2px', lineHeight: 1,
                            }"
                          >×</button>
                        </div>
                        <div v-if="i < customPlaces.length - 1" :style="{
                          flex: '0 0 auto',
                          borderTop: '1.5px dashed rgba(232,201,126,0.35)',
                          width: '20px',
                        }" />
                      </template>
                    </div>

                    <!-- Extra desires -->
                    <div :style="fieldLabel">
                      Any extra wishes?
                      <span style="color:rgba(255,255,255,0.3); font-size:11px;">(optional)</span>
                    </div>
                    <textarea
                      v-model="form.notes"
                      placeholder="Sunset stop, specific restaurant, accessibility needs…"
                      rows="3"
                      :style="{ ...inputStyle, resize: 'vertical', fontFamily: '\'DM Sans\',sans-serif' }"
                    />
                  </template>

                  <!-- ══ Standard tours: date / time / passengers / pickup ══ -->
                  <template v-else>
                    <div style="display:flex; gap:14px; margin-bottom:4px;">
                      <div style="flex:1;">
                        <div :style="fieldLabel">Date</div>
                        <input type="date" v-model="form.date" :min="minDate" :style="inputStyle" />
                      </div>
                      <div style="flex:1;">
                        <div :style="fieldLabel">Start Time</div>
                        <input type="time" v-model="form.time" :style="inputStyle" />
                      </div>
                    </div>
                    <div :style="fieldLabel">Number of Passengers</div>
                    <div :style="counterWrapper">
                      <button @click="changePassengers(-1)" :style="counterBtn">−</button>
                      <span :style="counterNum">{{ form.passengers }}</span>
                      <button @click="changePassengers(1)" :style="counterBtn">+</button>
                      <span style="font-size:13px; color:rgba(255,255,255,0.45); letter-spacing:0.05em;">
                        passenger{{ form.passengers !== 1 ? 's' : '' }}
                      </span>
                    </div>
                    <div>
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <div :style="fieldLabel">📍 Pickup Location</div>
                        <button @click="pickupManual = !pickupManual; pickupManualTxt = ''" :style="manualToggleStyle(pickupManual)">
                          {{ pickupManual ? '← Pick from list' : 'Type manually' }}
                        </button>
                      </div>
                      <div v-if="pickupManual" style="display:flex; gap:8px;">
                        <input v-model="pickupManualTxt" placeholder="Type address or landmark…" @keydown.enter="confirmManual('pickup')" :style="{ ...inputStyle, marginBottom: 0, flex: 1 }" />
                        <button @click="confirmManual('pickup')" :style="setButtonStyle">Set</button>
                      </div>
                      <div v-else style="position:relative;">
                        <select v-model="form.pickup" :style="{ ...selectStyle, color: form.pickup ? '#fff' : 'rgba(255,255,255,0.35)', colorScheme: 'dark' }">
                          <option value="" style="background:#0d2137; color:rgba(255,255,255,0.4);">— Select or pin location —</option>
                          <option v-for="loc in LOCATIONS" :key="loc" :value="loc" style="background:#0d2137; color:#fff;">{{ loc }}</option>
                        </select>
                        <button @click="openMap('pickup')" title="Pin on map" :style="mapPinButtonStyle(form.pickup === 'Custom location (pin on map)')">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                              :fill="form.pickup === 'Custom location (pin on map)' ? '#0d2137' : '#e8c97e'"/>
                          </svg>
                        </button>
                      </div>
                      <div v-if="form.pickup && !pickupManual" :style="previewStyle(form.pickup === 'Custom location (pin on map)')">
                        <span v-if="form.pickup === 'Custom location (pin on map)'">
                          📍 {{ form.pickupLat.toFixed(5) }}, {{ form.pickupLng.toFixed(5) }}
                          <button @click="openMap('pickup')" :style="editPinStyle">Edit pin</button>
                        </span>
                        <span v-else>✓ {{ form.pickup }}</span>
                      </div>
                    </div>
                  </template>
                </div>

                <!-- ── Step 3 Transfer: Schedule ── -->
                <div v-else-if="step === 3 && form.type === 'transfer'" key="s3t">
                  <div :style="stepTitle">Date, Time & Details</div>
                  <div style="display:flex; gap:14px; margin-bottom:4px;">
                    <div style="flex:1;">
                      <div :style="fieldLabel">Date</div>
                      <input type="date" v-model="form.date" :min="minDate" :style="inputStyle" />
                    </div>
                    <div style="flex:1;">
                      <div :style="fieldLabel">Time</div>
                      <input type="time" v-model="form.time" :style="inputStyle" />
                    </div>
                  </div>
                  <div :style="fieldLabel">Number of Passengers</div>
                  <div :style="counterWrapper">
                    <button @click="changePassengers(-1)" :style="counterBtn">−</button>
                    <span :style="counterNum">{{ form.passengers }}</span>
                    <button @click="changePassengers(1)" :style="counterBtn">+</button>
                    <span style="font-size:13px; color:rgba(255,255,255,0.45); letter-spacing:0.05em;">
                      passenger{{ form.passengers !== 1 ? 's' : '' }}
                    </span>
                  </div>
                  <div :style="fieldLabel">Number of Luggages</div>
                  <div :style="counterWrapper">
                    <button @click="form.luggage = Math.max(0, form.luggage - 1)" :style="counterBtn">−</button>
                    <span :style="counterNum">{{ form.luggage }}</span>
                    <button @click="form.luggage = Math.min(20, form.luggage + 1)" :style="counterBtn">+</button>
                    <span style="font-size:13px; color:rgba(255,255,255,0.45); letter-spacing:0.05em;">
                      {{ form.luggage === 1 ? 'bag' : 'bags' }}
                    </span>
                  </div>
                </div>

                <!-- ── Step 3 Tour / Step 4 Transfer: Contact ── -->
                <div v-else key="s-contact">
                  <div :style="stepTitle">Your Details</div>

                  <!-- Indicative price box (transfers only) -->
                  <div v-if="form.type === 'transfer'">
                    <!-- Large group: price on request -->
                    <div v-if="form.passengers > 8" :style="{
                      marginBottom: '24px', padding: '16px 20px', borderRadius: '12px',
                      background: 'rgba(126,200,227,0.06)',
                      border: '1px solid rgba(126,200,227,0.2)',
                      display: 'flex', alignItems: 'center', gap: '14px',
                    }">
                      <div style="font-size:22px; flex-shrink:0;">📞</div>
                      <div>
                        <div :style="{
                          fontFamily: '\'DM Sans\',sans-serif',
                          fontSize: '13px', fontWeight: 600,
                          color: '#fff', marginBottom: '4px',
                        }">Large group booking</div>
                        <div :style="{
                          fontFamily: '\'DM Sans\',sans-serif',
                          fontSize: '12px', color: 'rgba(255,255,255,0.45)',
                          lineHeight: 1.5,
                        }">We'll contact you shortly with a tailored price for your group.</div>
                      </div>
                    </div>
                    <!-- Normal: indicative price -->
                    <div v-else :style="{
                      marginBottom: '24px', padding: '16px 20px', borderRadius: '12px',
                      background: indicativePrice
                        ? 'rgba(232,201,126,0.07)'
                        : 'rgba(255,255,255,0.04)',
                      border: indicativePrice
                        ? '1px solid rgba(232,201,126,0.25)'
                        : '1px solid rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }">
                      <div>
                        <div :style="{
                          fontFamily: '\'DM Sans\',sans-serif',
                          fontSize: '10px', fontWeight: 600,
                          color: 'rgba(255,255,255,0.4)',
                          letterSpacing: '0.14em', textTransform: 'uppercase',
                          marginBottom: '4px',
                        }">Indicative Price</div>
                        <div :style="{
                          fontFamily: '\'DM Sans\',sans-serif',
                          fontSize: '12px', color: 'rgba(255,255,255,0.35)',
                          lineHeight: 1.4,
                        }">
                          {{ form.passengers }} passenger{{ form.passengers !== 1 ? 's' : '' }}
                          <template v-if="form.time && +form.time.split(':')[0] < 6">
                            · night surcharge +€15
                          </template>
                        </div>
                      </div>
                      <div v-if="indicativePrice" :style="{
                        fontFamily: '\'Cormorant Garamond\',serif',
                        fontSize: '36px', fontWeight: 600,
                        color: 'var(--gold)', lineHeight: 1,
                      }">€{{ indicativePrice }}</div>
                      <div v-else :style="{
                        fontFamily: '\'DM Sans\',sans-serif',
                        fontSize: '13px', fontWeight: 600,
                        color: 'rgba(255,255,255,0.35)',
                        letterSpacing: '0.05em',
                      }">On request</div>
                    </div>
                  </div>

                  <div :style="fieldLabel">Full Name</div>
                  <input v-model="form.name" placeholder="Your full name" :style="inputStyle" />
                  <div :style="fieldLabel">Phone / WhatsApp</div>
                  <input v-model="form.phone" placeholder="+30 or international" :style="inputStyle" />
                  <div :style="fieldLabel">
                    Email
                    <span style="color:rgba(255,255,255,0.3); font-size:11px;">(optional)</span>
                  </div>
                  <input v-model="form.email" type="email" placeholder="email@example.com" :style="inputStyle" />
                  <div :style="fieldLabel">
                    Special Requests
                    <span style="color:rgba(255,255,255,0.3); font-size:11px;">(optional)</span>
                  </div>
                  <textarea
                    v-model="form.notes"
                    placeholder="Child seat, accessibility, extra luggage…"
                    rows="3"
                    :style="{ ...inputStyle, resize: 'vertical', fontFamily: '\'DM Sans\',sans-serif' }"
                  />
                </div>

              </Transition>
            </div>

            <!-- Footer -->
            <div :style="{
              padding: '16px 24px 20px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'rgba(0,0,0,0.1)',
              flexShrink: 0,
            }">
              <button v-if="step > 1" @click="prevStep" :style="backBtnStyle">← Back</button>
              <div style="flex:1;" />
              <!-- Continue / Confirm -->
              <button
                @click="nextOrSubmit"
                :disabled="!canNext || submitting"
                :style="{
                  padding: '12px 28px',
                  background: step === totalSteps
                    ? 'linear-gradient(135deg, #e8c97e, #c8a240)'
                    : 'linear-gradient(135deg, var(--sea), #0a4a6e)',
                  border: step === totalSteps
                    ? 'none'
                    : '1px solid rgba(126,200,227,0.2)',
                  borderRadius: '10px',
                  fontFamily: '\'DM Sans\',sans-serif', fontSize: '13px', fontWeight: 700,
                  color: step === totalSteps ? '#0d2137' : '#fff',
                  cursor: canNext && !submitting ? 'pointer' : 'not-allowed',
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  transition: 'all 0.2s',
                  opacity: canNext && !submitting ? 1 : 0.35,
                  boxShadow: step === totalSteps
                    ? '0 4px 20px rgba(232,201,126,0.3)'
                    : '0 4px 20px rgba(30,95,140,0.4)',
                }"
              >
                {{ submitting ? 'Sending…' : step === totalSteps ? 'Confirm Booking ✓' : 'Continue →' }}
              </button>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>

    <!-- ── Map pin modal ── -->
    <Transition name="map-fade">
      <div
        v-if="showMapFor"
        :style="{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(13,33,55,0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }"
        @click.self="closeMap"
      >
        <div :style="{
          background: '#0d2137',
          borderRadius: '16px',
          overflow: 'hidden',
          width: '100%', maxWidth: '540px',
          border: '1px solid rgba(232,201,126,0.2)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
        }">
          <!-- Map header -->
          <div :style="{
            padding: '18px 22px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }">
            <div>
              <div style="font-family:'DM Sans',sans-serif; font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--gold); margin-bottom:3px;">
                Pin Your Location
              </div>
              <div style="font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600; color:#fff;">
                Drop a pin on the map
              </div>
            </div>
            <button
              @click="closeMap"
              :style="{
                background: 'rgba(255,255,255,0.08)', border: 'none',
                color: 'rgba(255,255,255,0.6)', width: '32px', height: '32px',
                borderRadius: '50%', cursor: 'pointer', fontSize: '14px',
              }"
            >✕</button>
          </div>

          <!-- Leaflet map container -->
          <div ref="mapContainerRef" style="width:100%; height:320px;" />

          <!-- Map footer -->
          <div style="padding:14px 22px 18px; background:rgba(13,33,55,0.8);">
            <div style="font-family:'DM Sans',sans-serif; font-size:12px; color:rgba(255,255,255,0.5); margin-bottom:12px;">
              📍 {{ tempLat.toFixed(5) }}, {{ tempLng.toFixed(5) }} — Drag the pin or tap to reposition
            </div>
            <button
              @click="confirmPin"
              :style="{
                width: '100%', padding: '12px',
                background: 'linear-gradient(135deg, var(--sea), var(--navy))',
                border: '1px solid rgba(232,201,126,0.3)',
                borderRadius: '8px', color: '#fff',
                fontFamily: '\'DM Sans\',sans-serif', fontSize: '13px', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
              }"
            >Confirm Location</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>


<style scoped>
/* ── Modal entrance ── */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.35s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* ── Modal panel scale ── */
.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

/* ── Step transition ── */
.step-fade-enter-active,
.step-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.step-fade-enter-from,
.step-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

/* ── Map modal ── */
.map-fade-enter-active,
.map-fade-leave-active {
  transition: opacity 0.25s ease;
}
.map-fade-enter-from,
.map-fade-leave-to {
  opacity: 0;
}

/* Thin scrollbar for body */
div::-webkit-scrollbar { width: 4px; }
div::-webkit-scrollbar-track { background: transparent; }
div::-webkit-scrollbar-thumb { background: rgba(232,201,126,0.3); border-radius: 2px; }
</style>
