<script setup>
</script>

<template>
  <footer class="bg-[#f5f5f7] border-t border-[#d2d2d7]/50 py-12">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Emergency banner -->
      <div class="flex items-center gap-4 flex-wrap bg-white border border-red-200 border-l-4 border-l-red-500 rounded-2xl p-5 mb-4 shadow-sm">
        <div class="bg-red-50 rounded-xl p-2 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <path d="M12 9v4"/><path d="M12 17h.01"/>
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-[#1d1d1f] font-semibold text-sm mb-0.5">Experiencing severe symptoms right now?</h3>
          <p class="text-[#86868b] text-sm">Severe headache, vomiting, seizures, loss of consciousness or slurred speech. Do not wait. Call emergency services immediately.</p>
        </div>
        <a href="tel:000"
          class="bg-red-500 hover:bg-red-600 text-white font-bold text-sm px-5 py-2.5 rounded-full transition-colors flex-shrink-0">
          Call 000
        </a>
      </div>

      <!-- Medical disclaimer -->
      <div class="bg-white border border-[#d2d2d7]/50 rounded-2xl p-6 mb-8 shadow-sm">
        <div class="flex items-start gap-3">
          <div class="bg-[#007aff]/10 rounded-xl p-2 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
              viewBox="0 0 24 24" fill="none" stroke="#007aff" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" x2="12" y1="8" y2="12"/>
              <line x1="12" x2="12.01" y1="16" y2="16"/>
            </svg>
          </div>
          <div>
            <h3 class="text-[#1d1d1f] font-semibold mb-2">Medical Disclaimer</h3>
            <p class="text-[#86868b] text-sm leading-relaxed">
              Concovery is for educational purposes only and does not replace medical advice.
              If you suspect a concussion, seek immediate professional medical assessment.
              Always follow the advice of qualified healthcare professionals regarding return to play decisions.
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-[#86868b] text-sm">
        <div>
          <span class="text-[#1d1d1f] font-semibold">Con<span class="text-[#007aff]">covery</span></span>
          © 2026. Built for Australian community sport players.
        </div>
        <div class="flex gap-6">
          <a href="#" class="hover:text-[#007aff] transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-[#007aff] transition-colors">Terms of Use</a>
          <a href="#" class="hover:text-[#007aff] transition-colors">Contact</a>
        </div>
      </div>

    </div>
  </footer>
</template>

<style scoped></style>
