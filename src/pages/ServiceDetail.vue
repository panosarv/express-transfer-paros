<script setup>
import { useRoute } from 'vue-router';
import { defineAsyncComponent, computed } from 'vue';

const route = useRoute();
const service = computed(() => route.params.service);

const componentsMap = {
  'private-transfers': defineAsyncComponent(() => import('../components/services/PrivateTransfers.vue')),
  'island-tours': defineAsyncComponent(() => import('../components/services/IslandTours.vue')),
  'disposal-services': defineAsyncComponent(() => import('../components/services/DisposalServices.vue')),
  'wedding': defineAsyncComponent(() => import('../components/services/Wedding.vue')),  
};

const ServiceComponent = computed(() => componentsMap[service.value] || null);
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <component v-if="ServiceComponent" :is="ServiceComponent" />
    <div v-else class="text-center text-red-600 py-10">Service not found.</div>
  </div>
</template>

<style scoped>
/* Global styles for service detail pages */
</style>