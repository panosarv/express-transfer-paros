<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Service detail pages are now handled by the home page Services section
onMounted(() => {
  router.replace('/#services');
});
</script>

<template>
  <div style="min-height:100vh;background:var(--navy);display:flex;align-items:center;justify-content:center;">
    <div style="text-align:center;color:#fff;font-family:'DM Sans',sans-serif;">
      Redirecting…
    </div>
  </div>
</template>
