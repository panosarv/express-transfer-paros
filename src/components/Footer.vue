<template>
  <div class="bg-[#1C1C1C] text-white py-16 px-4 sm:px-6 lg:px-8" id="contact">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
      <!-- Contact Details -->
      <div class="flex flex-col sm:flex-row sm:space-x-12 items-center text-center sm:text-left">
        <a href="tel:+306980911843" @click="handlePhoneClick" class="flex items-center space-x-3 hover:text-[#d9b16b] transition-colors">
          <svg class="h-6 w-6 text-[#d9b16b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <p class="text-lg">+30 698 091 1843</p>
        </a>

        <div class="flex items-center space-x-3 mt-6 sm:mt-0">
          <svg class="h-6 w-6 text-[#d9b16b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p class="text-lg">info@expresstransferparos.com</p>
        </div>

        <div class="flex items-center space-x-3 mt-6 sm:mt-0">
          <svg class="h-6 w-6 text-[#d9b16b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p class="text-lg">Paros, Greece</p>
        </div>
      </div>

      <!-- Social Media Links -->
      <div class="flex space-x-6 mt-8 lg:mt-0">
        <a href="https://www.facebook.com/profile.php?id=61576086925589" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="text-white hover:text-[#d9b16b]">
          <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.02 3.676 9.165 8.438 9.877v-6.988H7.898v-2.89h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.459h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
          </svg>
        </a>
        <a href="https://www.instagram.com/expresstransfer_paros/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="text-white hover:text-[#d9b16b]">
          <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.762.054 1.264.058 1.938.27 2.39.45a4.78 4.78 0 011.675 1.088 4.78 4.78 0 011.088 1.675c.18.452.392 1.126.45 2.39.044.978.054 1.332.054 3.762s-.01 2.784-.054 3.762c-.058 1.264-.27 1.938-.45 2.39a4.78 4.78 0 01-1.088 1.675 4.78 4.78 0 01-1.675 1.088c-.452.18-1.126.392-2.39.45-.978.044-1.332.054-3.762.054s-2.784-.01-3.762-.054c-1.264-.058-1.938-.27-2.39-.45a4.78 4.78 0 01-1.675-1.088 4.78 4.78 0 01-1.088-1.675c-.18-.452-.392-1.126-.45-2.39C2.325 14.784 2.315 14.43 2.315 12s.01-2.784.054-3.762c.058-1.264.27-1.938.45-2.39a4.78 4.78 0 011.088-1.675 4.78 4.78 0 011.675-1.088c.452-.18 1.126-.392 2.39-.45C9.531 2.01 9.885 2 12.315 2zm0 1.802c-2.36 0-2.644.01-3.574.052-1.083.05-1.67.228-2.062.38a2.977 2.977 0 00-1.088.71c-.3.3-.518.65-.71 1.088-.152.392-.33.979-.38 2.062-.042.93-.052 1.214-.052 3.574s.01 2.644.052 3.574c.05 1.083.228 1.67.38 2.062.192.438.41.788.71 1.088.3.3.65.518 1.088.71.392.152.979.33 2.062.38.93.042 1.214.052 3.574.052s2.644-.01 3.574-.052c1.083-.05 1.67-.228 2.062-.38a2.977 2.977 0 001.088-.71 2.977 2.977 0 00.71-1.088c.152-.392.33-.979.38-2.062.042-.93.052-1.214.052-3.574s-.01-2.644-.052-3.574c-.05-1.083-.228-1.67-.38-2.062a2.977 2.977 0 00-.71-1.088 2.977 2.977 0 00-1.088-.71c-.392-.152-.979-.33-2.062-.38-.93-.042-1.214-.052-3.574-.052zm0 4.616c2.018 0 3.656 1.638 3.656 3.656 0 2.018-1.638 3.656-3.656 3.656-2.018 0-3.656-1.638-3.656-3.656 0-2.018 1.638-3.656 3.656-3.656zm0 1.802a1.854 1.854 0 100 3.708 1.854 1.854 0 000-3.708zm3.752-2.058a.434.434 0 11-.868 0 .434.434 0 01.868 0z" clip-rule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { trackPhoneClick } from '../utils/analytics';

function handlePhoneClick() {
  trackPhoneClick('footer', 'tel');
}
</script>
