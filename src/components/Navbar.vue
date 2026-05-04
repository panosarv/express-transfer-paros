<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { trackEvent } from '../utils/analytics';
import { useRouter, useRoute } from 'vue-router';
import logoSrc from '../assets/etp-logo.png';

const emit = defineEmits(['book']);

const router = useRouter();
const route = useRoute();

const scrolled = ref(false);
const menuOpen = ref(false);
const logoUrl = ref(null);

const NAV_LINKS = [
  ['tours', 'Tours'],
  ['services', 'Services'],
  ['fleet', 'Fleet'],
  ['about', 'About'],
  ['reviews', 'Reviews'],
];

const hovLink = ref('');

function makeTransparent(src) {
  const img = new Image();

  img.onload = () => {
    const canvas = document.createElement('canvas');

    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (r > 228 && g > 228 && b > 228) {
        data[i + 3] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    logoUrl.value = canvas.toDataURL('image/png');
  };

  img.src = src;
}

function onScroll() {
  scrolled.value = window.scrollY > 60;
}

async function scrollTo(id) {
  menuOpen.value = false;

  const scrollToSection = async () => {
    await nextTick();

    const el = document.getElementById(id);

    if (el) {
      const navOffset = 80;

      window.scrollTo({
        top: el.offsetTop - navOffset,
        behavior: 'smooth',
      });
    }
  };

  if (route.path === '/') {
    await scrollToSection();
    return;
  }

  await router.push({
    path: '/',
    hash: `#${id}`,
  });

  setTimeout(scrollToSection, 120);
}

function handleBook() {
  menuOpen.value = false;
  trackEvent('book_button_click', { source: 'navbar' });
  emit('book');
}

onMounted(async () => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  makeTransparent(logoSrc);

  if (route.hash) {
    const id = route.hash.replace('#', '');

    await nextTick();

    setTimeout(() => {
      const el = document.getElementById(id);

      if (el) {
        window.scrollTo({
          top: el.offsetTop - 80,
          behavior: 'smooth',
        });
      }
    }, 120);
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <nav
    :style="{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 200,
      padding: scrolled ? '10px 24px' : '18px 24px',
      background: scrolled || menuOpen ? 'rgba(13,33,55,0.97)' : 'transparent',
      backdropFilter: scrolled || menuOpen ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: scrolled || menuOpen ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(232,201,126,0.12)' : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.4s ease',
    }"
  >
    <!-- Logo -->
    <div
      style="display:flex;align-items:center;gap:10px;cursor:pointer;"
      @click="scrollTo('hero')"
    >
      <img
        v-if="logoUrl"
        :src="logoUrl"
        alt="Express Transfer Paros"
        :style="{
          height: scrolled ? '38px' : '48px',
          width: 'auto',
          transition: 'height 0.4s ease',
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
        }"
      />

      <div
        v-else
        style="
          font-family:'Cormorant Garamond',serif;
          font-size:18px;
          font-weight:600;
          color:#fff;
        "
      >
        <em style="color:var(--gold)">Express</em>
        Transfer Paros
      </div>
    </div>

    <!-- Desktop nav -->
    <div
      class="desktop-nav"
      style="display:flex;gap:28px;align-items:center;"
    >
      <button
        v-for="[id, label] in NAV_LINKS"
        :key="id"
        @click="scrollTo(id)"
        @mouseenter="hovLink = id"
        @mouseleave="hovLink = ''"
        :style="{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: '\'DM Sans\', sans-serif',
          fontSize: '12px',
          fontWeight: 400,
          color: hovLink === id ? '#fff' : 'rgba(255,255,255,0.62)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          transition: 'color 0.2s, border-bottom 0.2s',
          padding: '4px 0',
          borderBottom: hovLink === id
            ? '1px solid var(--gold)'
            : '1px solid transparent',
        }"
      >
        {{ label }}
      </button>

      <button
        @click="handleBook"
        style="
          padding:10px 22px;
          background:var(--sea);
          border:1px solid rgba(232,201,126,0.3);
          border-radius:4px;
          font-family:'DM Sans',sans-serif;
          font-size:12px;
          font-weight:700;
          color:#fff;
          cursor:pointer;
          letter-spacing:0.08em;
          text-transform:uppercase;
          transition:background 0.2s;
        "
      >
        Book Now
      </button>
    </div>

    <!-- Mobile hamburger -->
    <button
      class="mobile-menu-btn"
      @click="menuOpen = !menuOpen"
      style="
        display:none;
        background:none;
        border:none;
        cursor:pointer;
        padding:8px;
        z-index:201;
      "
      aria-label="Menu"
      :aria-expanded="menuOpen"
    >
      <div style="display:flex;flex-direction:column;gap:5px;">
        <div
          :style="{
            width: '24px',
            height: '1.5px',
            background: '#fff',
            transition: 'all 0.3s',
            transform: menuOpen
              ? 'translateY(6.5px) rotate(45deg)'
              : 'none',
          }"
        />

        <div
          :style="{
            width: '24px',
            height: '1.5px',
            background: '#fff',
            opacity: menuOpen ? 0 : 1,
            transition: 'opacity 0.2s',
          }"
        />

        <div
          :style="{
            width: '24px',
            height: '1.5px',
            background: '#fff',
            transition: 'all 0.3s',
            transform: menuOpen
              ? 'translateY(-6.5px) rotate(-45deg)'
              : 'none',
          }"
        />
      </div>
    </button>
  </nav>

  <!-- Mobile fullscreen menu -->
  <div
    class="mobile-dropdown"
    :style="{
      display: 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(13,33,55,0.98)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      zIndex: 199,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '28px',
      opacity: menuOpen ? 1 : 0,
      pointerEvents: menuOpen ? 'auto' : 'none',
      transition: 'opacity 0.3s ease',
    }"
  >
    <button
      v-for="[id, label] in NAV_LINKS"
      :key="id"
      @click="scrollTo(id)"
      style="
        background:none;
        border:none;
        cursor:pointer;
        font-family:'Cormorant Garamond',serif;
        font-size:clamp(32px,8vw,44px);
        font-weight:300;
        color:rgba(255,255,255,0.85);
        letter-spacing:0.04em;
      "
    >
      {{ label }}
    </button>

    <button
      @click="handleBook"
      style="
        margin-top:8px;
        padding:14px 40px;
        background:var(--sea);
        border:1px solid rgba(232,201,126,0.3);
        border-radius:4px;
        font-family:'DM Sans',sans-serif;
        font-size:14px;
        font-weight:700;
        color:#fff;
        cursor:pointer;
        letter-spacing:0.08em;
        text-transform:uppercase;
      "
    >
      Book Now
    </button>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .desktop-nav {
    display: none !important;
  }

  .mobile-menu-btn {
    display: block !important;
  }

  .mobile-dropdown {
    display: flex !important;
  }
}
</style>