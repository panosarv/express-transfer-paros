<script setup>
import BookingForm from '../components/BookingForm.vue'
</script>

<template>
    <div class="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8" id="booking">
        <!-- Background Image with Overlay -->
        <div class="absolute inset-0">
            <img 
                src="../assets/etp-meetteam.jpg"
                class="w-full h-full object-cover"
                alt="Safari Background"
                loading="lazy"
            />
            <div class="absolute inset-0 bg-[#232436]/70 backdrop-blur-sm"></div>
        </div>

        <!-- Booking Form Container -->
        <div class="relative max-w-4xl w-full bg-[#232436]/80 p-8 rounded-lg shadow-lg mt-20">
            <div class="text-center mb-8">
                <h2 class="text-3xl sm:text-4xl font-bold text-stone-200 mb-4">
                    Book Your Transfer
                </h2>
                <p class="text-lg sm:text-xl text-stone-300">
                    Fill out the form below to book your transfer with Express Transfer Paros.
                </p>
            </div>
            <BookingForm />
        </div>
    </div>
</template>
