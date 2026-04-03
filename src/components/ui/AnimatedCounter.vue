<script setup>
import { ref, onMounted, computed } from 'vue';
import { useGsap } from '../../composables/useGsap';

const props = defineProps({
  target: {
    type: Number,
    required: true
  },
  suffix: {
    type: String,
    default: ''
  },
  prefix: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 2
  },
  label: {
    type: String,
    default: ''
  }
});

const counterRef = ref(null);
const displayValue = ref(0);
const hasAnimated = ref(false);

const { gsap, ScrollTrigger } = useGsap();

const formattedValue = computed(() => {
  return displayValue.value.toLocaleString();
});

onMounted(() => {
  const counter = { value: 0 };

  gsap.fromTo(counter, {
    value: 0
  }, {
    value: props.target,
    scrollTrigger: {
      trigger: counterRef.value,
      start: 'top 85%',
      end: 'bottom 15%',
      scrub: 1
    },
    onUpdate: () => {
      displayValue.value = Math.floor(counter.value);
    },
    ease: 'none'
  });
});
</script>

<template>
  <div ref="counterRef" class="counter-wrapper text-center">
    <div class="counter-value font-heading text-5xl md:text-6xl lg:text-7xl text-etp-dark mb-2">
      <span v-if="prefix" class="text-etp-gold">{{ prefix }}</span>
      <span class="counter-number">{{ formattedValue }}</span>
      <span v-if="suffix" class="text-etp-gold">{{ suffix }}</span>
    </div>
    <div v-if="label" class="counter-label text-etp-dark/70 text-sm md:text-base uppercase tracking-widest">
      {{ label }}
    </div>
  </div>
</template>

<style scoped>
.counter-number {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}
</style>
