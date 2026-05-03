<script setup>
import { ref } from 'vue';
import BookingDrawer from '../components/ui/BookingDrawer.vue';
import meetTeam from '../assets/etp-meetteam.jpg';

const open = ref(true);
</script>

<template>
  <div
    style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--navy);
      position: relative;
      overflow: hidden;
    "
    id="booking"
  >
    <!-- Background -->
    <img
      :src="meetTeam"
      alt=""
      style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.18;"
    />

    <!-- Prompt to open drawer if closed -->
    <div
      v-if="!open"
      style="position:relative;z-index:1;text-align:center;"
    >
      <h1 style="font-family:'Cormorant Garamond',serif;font-size:clamp(36px,5vw,56px);font-weight:600;color:#fff;margin-bottom:20px;">
        Book Your Transfer
      </h1>
      <button
        @click="open = true"
        style="
          padding:16px 40px;
          background:var(--sea);
          border:1px solid rgba(232,201,126,0.3);
          border-radius:6px;
          font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;
          color:#fff;cursor:pointer;letter-spacing:0.06em;text-transform:uppercase;
        "
      >Open Booking Form</button>
    </div>

    <BookingDrawer v-model:open="open" />
  </div>
</template>
