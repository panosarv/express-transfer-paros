<script setup>
import { trackPhoneClick } from '../utils/analytics';
</script>

<template>
  <footer style="background:#0a1628;padding:0;">
    <div
      class="footer-inner"
      style="
        display:flex;flex-wrap:wrap;gap:40px;
        justify-content:space-between;align-items:flex-start;
        padding:60px 60px 40px;
        max-width:1200px;margin:0 auto;
        border-bottom:1px solid rgba(255,255,255,0.08);
      "
    >
      <!-- Brand -->
      <div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:#fff;margin-bottom:8px;">
          Express Transfer Paros
        </div>
        <div style="font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(255,255,255,0.4);letter-spacing:0.06em;">
          Arrive in Style. Explore the Aegean.
        </div>
      </div>

      <!-- Links -->
      <div style="display:flex;flex-direction:column;gap:10px;">
        <a
          v-for="l in ['Fleet','Services','About','Reviews']"
          :key="l"
          :href="`#${l.toLowerCase()}`"
          style="font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(255,255,255,0.5);text-decoration:none;letter-spacing:0.06em;transition:color 0.2s;"
          @mouseenter="e => e.target.style.color='#fff'"
          @mouseleave="e => e.target.style.color='rgba(255,255,255,0.5)'"
        >{{ l }}</a>
      </div>

      <!-- Contact -->
      <div style="display:flex;flex-direction:column;gap:10px;">
        <a
          href="tel:+306980911843"
          style="font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(255,255,255,0.5);text-decoration:none;transition:color 0.2s;"
          @mouseenter="e => e.target.style.color='#fff'"
          @mouseleave="e => e.target.style.color='rgba(255,255,255,0.5)'"
          @click="trackPhoneClick('footer', 'tel')"
        >📞 +30 698 091 1843</a>
        <a
          href="mailto:info@expresstransferparos.com"
          style="font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(255,255,255,0.5);text-decoration:none;transition:color 0.2s;"
          @mouseenter="e => e.currentTarget.style.color='#fff'"
          @mouseleave="e => e.currentTarget.style.color='rgba(255,255,255,0.5)'"
        >✉ info@expresstransferparos.com</a>
        <a
          href="https://wa.me/306980911843"
          target="_blank"
          rel="noopener noreferrer"
          style="font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(255,255,255,0.5);text-decoration:none;transition:color 0.2s;"
          @mouseenter="e => e.target.style.color='#25D366'"
          @mouseleave="e => e.target.style.color='rgba(255,255,255,0.5)'"
          @click="trackPhoneClick('footer', 'whatsapp')"
        >💬 WhatsApp Available</a>
        <div style="font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(255,255,255,0.5);">
          📍 Paros Island, Greece
        </div>
      </div>

      <!-- Instagram -->
      <div style="display:flex;flex-direction:column;gap:10px;">
        <a
          href="https://www.instagram.com/expresstransfer_paros"
          target="_blank"
          rel="noopener noreferrer"
          style="display:flex;align-items:center;gap:8px;font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(255,255,255,0.5);text-decoration:none;transition:color 0.2s;"
          @mouseenter="e => e.currentTarget.style.color='#E1306C'"
          @mouseleave="e => e.currentTarget.style.color='rgba(255,255,255,0.5)'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Follow us · @expresstransfer_paros
        </a>
      </div>
    </div>

    <!-- Bottom bar -->
    <div style="
      text-align:center;
      padding:20px 24px;
      font-family:'DM Sans',sans-serif;
      font-size:12px;
      color:rgba(255,255,255,0.25);
      letter-spacing:0.04em;
    ">
      © {{ new Date().getFullYear() }} Express Transfer Paros. All rights reserved.
    </div>
  </footer>
</template>
