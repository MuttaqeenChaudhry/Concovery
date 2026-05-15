<script setup lang="ts">
import { ref, onMounted } from 'vue'

const sports = ref([
  { name: 'Australian Rules Football', rate: 69.57, count: 391 },
  { name: 'Rugby', rate: 144.46, count: 353 },
  { name: 'Cycling', rate: null, count: 350 },
  { name: 'Soccer', rate: 19.39, count: 239 },
  { name: 'Basketball', rate: 11.27, count: 119 },
  { name: 'Cricket', rate: 5.91, count: 32 },
  { name: 'Netball', rate: 11.75, count: 52 },
  { name: 'Swimming', rate: null, count: 22 },
])

const selectedSport = ref(sports.value[0])
const maxRate = ref(Math.max(...sports.value.filter((s): s is { name: string; rate: number; count: number } => typeof s.rate === 'number').map(s => s.rate)))

function selectSport(sport: any) {
  selectedSport.value = sport
}

function getRank(sport: any) {
  const ranked = [...sports.value]
    .filter(s => s.rate)
    .sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0))
  return ranked.findIndex(s => s.name === sport.name) + 1
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    { threshold: 0.1 }
  )
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))
})
</script>

<template>
  <div class="bg-white">

    <section
      class="relative min-h-screen flex items-center"
      style="background: #0A1628;"
    >
      <!-- Background image -->
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style="background-image: url('/bg_image2.png');"
      />
      <!-- Gradient overlay -->
      <div
        class="absolute inset-0"
        style="background: linear-gradient(to right, rgba(10,22,40,0.95) 50%, rgba(10,22,40,0.6) 100%); opacity: 60% !important;"
      />

      <!-- Content -->
      <div class="relative z-10 max-w-[1200px] mx-auto px-6 py-24 w-full">
        <div class="max-w-2xl">

          <!-- Eyebrow -->
          <div class="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <span class="w-1.5 h-1.5 rounded-full bg-[#1A4FAB]"/>
            <span class="text-white/60 text-xs font-medium tracking-widest uppercase">Australian Community Sport</span>
          </div>

          <!-- Title -->
          <h1
            class="text-white font-black leading-none mb-6"
            style="font-size: clamp(56px, 10vw, 120px); letter-spacing: -0.03em;"
          >
            CONCOVERY
          </h1>

          <!-- Subtitle -->
          <p class="text-white/50 text-lg font-light mb-10 max-w-md leading-relaxed">
            Play hard. Recover smart. Come back stronger.
          </p>

          <!-- CTAs -->
          <div class="flex flex-wrap gap-4">
            <router-link to="/exploredata">
              <button class="bg-[#1A4FAB] text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-[#1440A0] transition-all duration-200 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                Check my sport's risk
              </button>
            </router-link>
            <router-link to="/iteration3/stagedrecovery">
              <button class="border border-white/20 text-white/70 hover:text-white hover:border-white/40 px-8 py-4 rounded-full font-semibold text-sm transition-all duration-200">
                I recently had a knock
              </button>
            </router-link>
          </div>

        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </section>

    <!-- STATS -->
    <section class="bg-white py-16 border-b border-[#EBEBEB]">
      <div class="max-w-[1200px] mx-auto px-6">
        <div class="grid grid-cols-3 gap-0">
          <div class="text-center py-4">
            <div class="text-5xl lg:text-6xl font-black text-[#1A4FAB] mb-3" style="letter-spacing:-0.03em">21</div>
            <div class="w-8 h-0.5 bg-[#1A4FAB] mx-auto mb-3"></div>
            <div class="text-[#5A7A9B] text-sm leading-relaxed max-w-[160px] mx-auto">Days minimum brain recovery - not symptoms, actual healing</div>
          </div>
          <div class="text-center py-4 border-x border-[#EBEBEB]">
            <div class="text-5xl lg:text-6xl font-black text-[#E65100] mb-3" style="letter-spacing:-0.03em">80%</div>
            <div class="w-8 h-0.5 bg-[#E65100] mx-auto mb-3"></div>
            <div class="text-[#5A7A9B] text-sm leading-relaxed max-w-[160px] mx-auto">Of community sport players return before their brain has healed</div>
          </div>
          <div class="text-center py-4">
            <div class="text-5xl lg:text-6xl font-black text-[#C62828] mb-3" style="letter-spacing:-0.03em">5x</div>
            <div class="w-8 h-0.5 bg-[#C62828] mx-auto mb-3"></div>
            <div class="text-[#5A7A9B] text-sm leading-relaxed max-w-[160px] mx-auto">Higher re-injury risk when returning during the recovery window</div>
          </div>
        </div>
      </div>
    </section>

    <!-- TWO PATH FORK  -->
    <section class="bg-white py-24 fade-up">
      <div class="max-w-[1200px] mx-auto px-6">
        <div class="mb-3">
          <span class="text-[#1A4FAB] text-xs font-semibold tracking-widest uppercase">Get Started</span>
        </div>
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-4">
          <h2 class="text-4xl font-bold text-[#1A1A1A] tracking-tight">Where are you right now?</h2>
          <p class="text-[#5A7A9B] text-sm max-w-xs leading-relaxed">Concovery works for both - choose your starting point.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Card 1 - Recovery -->
          <div class="relative bg-[#F5F8FF] border-l-4 border-[#1A4FAB] rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
            <div class="text-6xl font-black text-[#1A4FAB]/10 absolute top-6 right-6 leading-none">01</div>
            <div class="text-[#1A4FAB] text-xs font-semibold tracking-widest uppercase mb-4">Recently had a knock</div>
            <h3 class="text-2xl font-bold text-[#1A1A1A] mb-4 leading-tight">Your recovery.<br>Day by day.</h3>
            <p class="text-[#5A7A9B] text-sm leading-relaxed mb-8">Find out exactly where you are in the 21-day recovery window, what your brain is doing at the cellular level right now, and what you can and cannot do today.</p>
            <router-link to="/iteration3/stagedrecovery">
              <button class="bg-[#1A4FAB] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#1440A0] transition-colors duration-200 flex items-center gap-2">
                Start my recovery plan
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </router-link>
          </div>

          <!-- Card 2 - Risk -->
          <div class="relative bg-[#F5F8FF] border-l-4 border-[#1A4FAB] rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
            <div class="text-6xl font-black text-[#1A4FAB]/10 absolute top-6 right-6 leading-none">02</div>
            <div class="text-[#1A4FAB] text-xs font-semibold tracking-widest uppercase mb-4">Understand your risk</div>
            <h3 class="text-2xl font-bold text-[#1A1A1A] mb-4 leading-tight">Real data for<br>your sport.</h3>
            <p class="text-[#5A7A9B] text-sm leading-relaxed mb-8">See live AIHW concussion hospitalisation numbers for your sport and age group. Know your actual risk before it happens - not from the changeroom, from the data.</p>
            <router-link to="/exploredata">
              <button class="bg-[#1A4FAB] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#1440A0] transition-colors duration-200 flex items-center gap-2">
                Explore the data
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- SPORT CHART  -->
    <section class="bg-[#F7F9FC] py-24 fade-up">
      <div class="max-w-[1200px] mx-auto px-6">
        <div class="mb-3">
          <span class="text-[#1A4FAB] text-xs font-semibold tracking-widest uppercase">Your Sport</span>
        </div>
        <div class="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-4">
          <h2 class="text-4xl font-bold text-[#1A1A1A] tracking-tight">Real numbers. No filter.</h2>
          <span class="text-[#5A7A9B] text-xs">AIHW Sports Injury in Australia 2023-24</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Chart -->
          <div class="bg-[#0A1628] rounded-2xl p-6">
            <div class="flex justify-between items-center mb-6">
              <span class="text-white/40 text-xs font-medium uppercase tracking-wider">Hospitalisations per 100,000 participants</span>
              <span class="text-white/40 text-xs">AIHW 2023-24</span>
            </div>
            <div class="space-y-3">
              <div
                v-for="sport in sports"
                :key="sport.name"
                class="flex items-center gap-3 cursor-pointer group"
                @click="selectSport(sport)"
              >
                <div
                  class="text-xs w-32 truncate transition-colors"
                  :class="selectedSport.name === sport.name ? 'text-white font-medium' : 'text-white/50 group-hover:text-white'"
                >
                  {{ sport.name }}
                </div>
                <div class="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :style="{
                      width: sport.rate ? `${(sport.rate / maxRate) * 100}%` : '4%',
                      background: selectedSport.name === sport.name ? '#1A4FAB' : 'rgba(255,255,255,0.2)'
                    }"
                  />
                </div>
                <div
                  class="text-xs w-8 text-right transition-colors"
                  :class="selectedSport.name === sport.name ? 'text-white font-semibold' : 'text-white/60'"
                >
                  {{ sport.rate ? Math.round(sport.rate) : '-' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Selected sport detail -->
          <div class="bg-white rounded-2xl p-8 border border-[#EBEBEB]">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-8 h-8 rounded-full bg-[#F5F8FF] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              </div>
              <span class="text-[#5A7A9B] text-xs font-medium">
                #{{ getRank(selectedSport) }} of {{ sports.filter(s => s.rate).length }} sports
              </span>
            </div>
            <h3 class="text-xl font-bold text-[#1A1A1A] mb-4">{{ selectedSport.name }}</h3>
            <div class="text-6xl font-black text-[#1A4FAB] mb-1" style="letter-spacing:-0.03em">
              {{ selectedSport.rate ? Math.round(selectedSport.rate) : selectedSport.count }}
            </div>
            <p class="text-[#5A7A9B] text-sm mb-6">
              {{ selectedSport.rate ? 'hospitalisations per 100,000 participants' : 'total hospitalisations (rate unavailable)' }}
            </p>

            <div class="border-t border-[#EBEBEB] pt-6">
              <div class="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-3">What smart players do</div>
              <div class="space-y-2">
                <div
                  v-for="tip in [
                    'Come off the field immediately after any head knock',
                    'See a GP or sports doctor within 24 hours',
                    'Follow the full 21-day graduated return-to-play protocol',
                    'Get medical clearance - no exceptions, no shortcuts',
                  ]"
                  :key="tip"
                  class="flex items-start gap-3"
                >
                  <div class="w-4 h-4 rounded-full bg-[#1B7C3D] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  <span class="text-[#5A7A9B] text-xs leading-relaxed">{{ tip }}</span>
                </div>
              </div>
            </div>
            <p class="text-[#5A7A9B] text-xs mt-4">Source: AIHW Sports Injury in Australia 2023-24 · AusPlay 2023-24</p>
          </div>
        </div>
      </div>
    </section>

    <!-- DAY 7 TRAP  -->
    <section class="py-24 fade-up" style="background: #1A3A6B;">
      <div class="max-w-[1200px] mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <!-- Left -->
          <div>
            <div class="text-white/40 text-xs font-semibold tracking-widest uppercase mb-6">The thing your coach never told you</div>
            <h2
              class="text-white font-black leading-tight mb-6"
              style="font-size: clamp(32px, 5vw, 52px); letter-spacing: -0.03em;"
            >
              Day 7 feels fine.<br>
              <span class="text-[#4D9FFF]">Day 21 is ready.</span>
            </h2>
            <p class="text-white/60 text-base leading-relaxed mb-4">
              Most players feel completely fine about a week after a concussion. That feeling is real. But inside, the brain is still repairing itself at the cellular level.
            </p>
            <p class="text-white/60 text-base leading-relaxed mb-10">
              Come back at full strength on Day 21 - not at 30% on Day 7. Your career lasts longer that way.
            </p>
            <router-link to="/rtprule">
              <button class="bg-white text-[#1A3A6B] px-8 py-4 rounded-full font-semibold text-sm hover:bg-white/90 transition-colors duration-200 flex items-center gap-2">
                See the full recovery guide
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </router-link>
          </div>

          <!-- Right - progress card -->
          <div class="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/10">
            <div class="text-white/40 text-xs font-semibold tracking-widest uppercase mb-8">Brain Recovery Progress</div>
            <div class="space-y-6">
              <div
                v-for="item in [
                  { day: 'Day 1',  label: 'Acute phase. Complete rest.',  pct: 10,  color: '#C62828' },
                  { day: 'Day 7',  label: 'Feels fine. 30% recovered.',   pct: 30,  color: '#E65100' },
                  { day: 'Day 14', label: 'Repairing. Not ready yet.',     pct: 70,  color: '#1A4FAB' },
                  { day: 'Day 21', label: 'Fully recovered. Return.',      pct: 100, color: '#1B7C3D' },
                ]"
                :key="item.day"
                class="space-y-2"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-2 h-2 rounded-full" :style="{ background: item.color }"/>
                    <span class="text-white font-semibold text-sm">{{ item.day }}</span>
                    <span class="text-white/50 text-sm">{{ item.label }}</span>
                  </div>
                  <span class="text-white/40 text-xs font-medium">{{ item.pct }}%</span>
                </div>
                <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full"
                    :style="{ width: `${item.pct}%`, background: item.color }"
                  />
                </div>
              </div>
            </div>

            <!-- Callout -->
            <div class="mt-8 bg-[#1A4FAB]/30 border border-[#1A4FAB]/40 rounded-xl p-4 flex gap-3">
              <div class="w-6 h-6 rounded-full bg-[#1A4FAB] flex items-center justify-center flex-shrink-0">
                <span class="text-white text-xs font-bold">!</span>
              </div>
              <p class="text-white/80 text-sm leading-relaxed">
                <span class="font-semibold">The Day 7 trap.</span> You feel 100%. Your brain is at 30%. That gap is where most re-injuries happen.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- FINAL CTA  -->
    <section class="py-28 text-center fade-up" style="background: #0A1628;">
      <div class="max-w-[1200px] mx-auto px-6">
        <div class="text-white/30 text-xs font-medium tracking-widest uppercase mb-8">Free · No sign-up · Built for Victorian community sport</div>
        <h2
          class="text-white font-black leading-none mb-6"
          style="font-size: clamp(48px, 10vw, 120px); letter-spacing: -0.04em;"
        >
          THE<br>COMEBACK<br>
          <span style="color: #4D9FFF;">STARTS HERE.</span>
        </h2>
        <p class="text-white/40 text-base mb-12">Built for Australian community sport players, parents and coaches.</p>
        <div class="flex flex-wrap gap-4 justify-center">
          <router-link to="/exploredata">
            <button class="bg-[#1A4FAB] text-white px-10 py-5 rounded-full font-semibold text-base hover:bg-[#1440A0] transition-colors duration-200">
              Check my sport
            </button>
          </router-link>
          <router-link to="/iteration3/stagedrecovery">
            <button class="border border-white/20 text-white/70 hover:text-white hover:border-white/40 px-10 py-5 rounded-full font-semibold text-base transition-all duration-200 flex items-center gap-2">
              Start recovery plan
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </router-link>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.fade-up {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
