<script setup>
import BlurReveal from '@/components/ui/blur-reveal/BlurReveal.vue'
</script>

<template>
  <main class="flex-1">
    <div class="bg-white min-h-screen">

      <!-- ══════════════════════════════════════════════════════════════════════
        HERO SECTION
      ══════════════════════════════════════════════════════════════════════════ -->
      <section class="res-hero text-white">
        <div class="res-hero-lines"></div>
        <div class="res-hero-edge"></div>

        <div class="w-full py-24 relative z-10" style="padding-left:80px; padding-right:80px;">
          <BlurReveal :delay="0.1" :duration="0.75">
            <div class="inline-flex items-center border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span class="w-1.5 h-1.5 rounded-full bg-[#38bfff] mr-2 animate-pulse"></span>
              <span class="text-white/50 text-xs font-medium tracking-widest uppercase">Resources</span>
            </div>
            <h1 class="res-hero-title text-white mb-6">
              TRUSTED<br>
              <span style="color:#38bfff;">RESOURCES.</span>
            </h1>
            <p class="text-white/55 text-lg font-light max-w-lg leading-relaxed">
              Evidence-based resources from leading Australian health and sports organisations. Everything here is verified and endorsed.
            </p>
          </BlurReveal>
        </div>

        <!-- EKG heartbeat line -->
        <div class="res-ekg">
          <svg class="res-ekg-svg" viewBox="0 0 1200 56" fill="none"
            xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <polyline
              points="0,28
                      60,28  80,28  95,4  110,52  125,8  140,28
                      340,28 360,28 375,4 390,52  405,8  420,28
                      620,28 640,28 655,4 670,52  685,8  700,28
                      900,28 920,28 935,4 950,52  965,8  980,28
                      1200,28"
              stroke="#38bfff" stroke-width="1.5" fill="none"/>
          </svg>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════════════════════════
        CRT5 FEATURED CARD
      ══════════════════════════════════════════════════════════════════════════ -->
      <section class="py-20" style="background: linear-gradient(160deg, #EBF3FF 0%, #DEF0FF 50%, #EBF3FF 100%);">
        <div class="max-w-[1200px] mx-auto px-10">

          <div class="mb-3">
            <span class="text-[#1A4FAB] text-xs font-semibold tracking-widest uppercase">Featured tool</span>
          </div>
          <h2 class="text-4xl font-bold text-[#1A1A1A] tracking-tight mb-10">The tool every player should know.</h2>

          <div class="bg-[#1A4FAB] rounded-3xl p-10 lg:p-14 relative overflow-hidden">

            <!-- Dot grid -->
            <div class="absolute inset-0 opacity-[0.05] pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="res-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="white"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#res-dots)"/>
              </svg>
            </div>
            <!-- Glow blob -->
            <div class="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none" style="background:#38bfff; transform: translate(20%, -30%);"/>

            <div class="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">

              <!-- Left content -->
              <div class="lg:col-span-2">
                <div class="inline-block bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-2 mb-5">
                  <span class="text-white font-semibold text-xs uppercase tracking-widest">Concussion Recognition Tool</span>
                </div>
                <h3 class="text-4xl sm:text-5xl font-bold text-white mb-5">CRT5 Assessment Tool</h3>
                <p class="text-white/80 text-lg mb-6 leading-relaxed">
                  The Concussion Recognition Tool 5 (CRT5) is a standardised assessment designed for coaches, parents, and non-medical personnel to help recognise the signs and symptoms of possible concussion. It is used globally and endorsed by the International Concussion in Sport Group.
                </p>

                <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
                  <div class="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
                    </svg>
                    <div>
                      <p class="text-white font-semibold mb-2 text-sm">Important</p>
                      <ul class="text-white/80 text-sm space-y-1.5">
                        <li>CRT5 does NOT diagnose concussion — only trained medical professionals can</li>
                        <li>It helps you decide whether to seek medical assessment</li>
                        <li>If you suspect concussion, remove the player from activity immediately</li>
                        <li>When in doubt, sit them out</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <a href="https://cattonline.com/" target="_blank" rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 bg-white text-[#1A4FAB] hover:bg-white/90 px-10 py-4 text-base rounded-2xl font-bold shadow-lg transition-all hover:scale-105">
                  Access CRT5 Tool
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  </svg>
                </a>
              </div>

              <!-- Right badge -->
              <div class="hidden lg:flex items-center justify-center">
                <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-10 border border-white/20 text-center">
                  <div class="bg-white rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-5 shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                      <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                      <path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
                    </svg>
                  </div>
                  <div class="text-5xl font-black text-white mb-2" style="letter-spacing:-0.03em;">CRT5</div>
                  <div class="text-white/70 text-sm">Endorsed by medical professionals worldwide</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

/* ━━ HERO ━━ */
.res-hero {
  position: relative;
  background: #07090e;
  overflow: hidden;
  min-height: 480px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.res-hero-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(48px, 8vw, 96px);
  line-height: 1.02;
  letter-spacing: 2px;
}

.res-hero-lines {
  position: absolute; inset: 0;
  overflow: hidden; pointer-events: none; z-index: 1;
}
.res-hero-lines::before {
  content: '';
  position: absolute; top: -200%; left: -50%; width: 200%; height: 400%;
  background-image: repeating-linear-gradient(
    -65deg, transparent, transparent 80px,
    rgba(56,191,255,0.025) 80px, rgba(56,191,255,0.025) 81px
  );
  animation: resLinesDrift 22s linear infinite;
}
@keyframes resLinesDrift {
  from { transform: translateX(0); }
  to   { transform: translateX(81px); }
}

.res-hero-edge {
  position: absolute; left: 0; top: 15%; bottom: 15%;
  width: 3px; z-index: 2;
  background: linear-gradient(to bottom, transparent, #38bfff 40%, #38bfff 60%, transparent);
}

/* ━━ EKG ━━ */
.res-ekg {
  position: absolute; bottom: 0; left: 0; right: 0;
  z-index: 2; height: 56px; overflow: hidden; opacity: 0.18;
}
.res-ekg-svg {
  width: 200%; height: 100%;
  animation: resEkgScroll 3s linear infinite;
}
@keyframes resEkgScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
</style>
