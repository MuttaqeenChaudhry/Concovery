<script setup></script>

<template>
  <div class="bg-white rounded-2xl p-6  border border-[#d2d2d7] animate-pulse">
    
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        
        <!-- Tags -->
        <div class="flex items-center gap-3 mb-2">
          <div class="h-5 w-20 bg-gray-200 rounded-full"></div>
          <div class="h-4 w-24 bg-gray-200 rounded"></div>
        </div>

        <!-- Title -->
        <div class="h-6 w-3/4 bg-gray-300 rounded"></div>
      </div>
    </div>

    <!-- Info Section -->
    <div class="space-y-3 mb-4">
      
      <!-- Address -->
      <div class="flex items-start gap-2">
        <div class="h-4 w-4 bg-gray-300 rounded-full mt-1"></div>
        <div class="h-4 w-full bg-gray-200 rounded"></div>
      </div>

      <!-- Phone -->
      <div class="flex items-start gap-2">
        <div class="h-4 w-4 bg-gray-300 rounded-full mt-1"></div>
        <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
      </div>

      <!-- Status -->
      <div class="flex items-start gap-2">
        <div class="h-4 w-4 bg-gray-300 rounded-full mt-1"></div>
        <div class="h-4 w-1/3 bg-gray-200 rounded"></div>
      </div>

    </div>

    <!-- Button -->
    <div class="h-10 w-full bg-gray-300 rounded-xl"></div>

  </div>
</template>

<style scoped>
</style>