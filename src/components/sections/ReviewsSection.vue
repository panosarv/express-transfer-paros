<script setup>
import { onMounted, onBeforeUnmount, nextTick } from 'vue'

const scriptId = 'EmbedSocialHashtagScript'
const widgetRef = '316ef2aa52350db680fdf9735b30182bf23401da'

const loadEmbedSocial = async () => {
  await nextTick()

  // Clear previous rendered iframe/content if Vue remounts this component
  const widget = document.querySelector('.embedsocial-hashtag')
  if (widget) {
    widget.innerHTML = `
      <a
        class="feed-powered-by-es feed-powered-by-es-feed-img es-widget-branding"
        href="https://embedsocial.com/google-reviews-widget/"
        target="_blank"
        rel="noopener noreferrer"
        title="Embed Google reviews"
      >
        <img src="https://embedsocial.com/cdn/icon/embedsocial-logo.webp" alt="EmbedSocial" />
        <div class="es-widget-branding-text">Embed Google reviews</div>
      </a>
    `
  }

  // Remove old EmbedSocial script
  const oldScript = document.getElementById(scriptId)
  if (oldScript) {
    oldScript.remove()
  }

  // Add script again
  const script = document.createElement('script')
  script.id = scriptId
  script.src = 'https://embedsocial.com/cdn/ht.js'
  script.async = true

  script.onload = () => {
    console.log('EmbedSocial script loaded')
  }

  script.onerror = () => {
    console.error('EmbedSocial script failed to load')
  }

  document.head.appendChild(script)
}

onMounted(() => {
  loadEmbedSocial()
})

onBeforeUnmount(() => {
  const oldScript = document.getElementById(scriptId)
  if (oldScript) {
    oldScript.remove()
  }
})
</script>

<template>
  <section
    id="reviews"
    :style="{
      padding: '100px 40px',
      background: 'var(--sand)',
      textAlign: 'center',
      overflow: 'hidden',
    }"
  >
    <div
      style="
        font-family: 'DM Sans', sans-serif;
        font-size: 11px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--sea);
        margin-bottom: 14px;
        font-weight: 600;
      "
    >
      Guest Reviews
    </div>

    <div
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        margin-bottom: 8px;
        flex-wrap: wrap;
      "
    >
      <h2
        style="
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 600;
          color: var(--navy);
          line-height: 1.15;
          margin: 0;
        "
      >
        What Our Guests Say
      </h2>

      <div
        style="
          display: flex;
          align-items: center;
          gap: 6px;
          background: #fff;
          border: 1px solid rgba(13, 33, 55, 0.1);
          border-radius: 100px;
          padding: 5px 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        "
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>

        <span
          style="
            font-family: 'DM Sans', sans-serif;
            font-size: 12px;
            font-weight: 600;
            color: var(--navy);
          "
        >
          Google
        </span>

        <span
          style="
            font-family: 'DM Sans', sans-serif;
            font-size: 12px;
            color: var(--muted);
          "
        >
          Reviews
        </span>
      </div>
    </div>

    <p
      style="
        font-family: 'DM Sans', sans-serif;
        font-size: 17px;
        color: var(--muted);
        line-height: 1.7;
        max-width: 560px;
        margin: 0 auto ;
      "
    >
      Real experiences from real travellers
    </p>

    <div class="reviews-widget-wrapper">
      <div
        class="embedsocial-hashtag"
        :data-ref="widgetRef"
        data-dynamicload="yes"
      >
        <a
          class="feed-powered-by-es feed-powered-by-es-feed-img es-widget-branding"
          href="https://embedsocial.com/google-reviews-widget/"
          target="_blank"
          rel="noopener noreferrer"
          title="Embed Google reviews"
        >
          <img
            src="https://embedsocial.com/cdn/icon/embedsocial-logo.webp"
            alt="EmbedSocial"
          />
          <div class="es-widget-branding-text">Embed Google reviews</div>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.reviews-widget-wrapper {
  width: 100%;
  max-width: 1180px;
  min-height: 320px;
  margin: 0 auto;
}

.reviews-widget-wrapper :deep(iframe) {
  width: 100% !important;
  max-width: 100% !important;
}

@media (max-width: 768px) {
  section {
    padding: 80px 20px !important;
  }

  .reviews-widget-wrapper {
    max-width: 100%;
  }
}
</style>