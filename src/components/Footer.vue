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
        >📞 +30 698 091 1843</a>
        <a
          href="https://wa.me/306980911843"
          target="_blank"
          rel="noopener noreferrer"
          style="font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(255,255,255,0.5);text-decoration:none;transition:color 0.2s;"
          @mouseenter="e => e.target.style.color='#25D366'"
          @mouseleave="e => e.target.style.color='rgba(255,255,255,0.5)'"
        >💬 WhatsApp Available</a>
        <div style="font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(255,255,255,0.5);">
          📍 Paros Island, Greece
        </div>
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
