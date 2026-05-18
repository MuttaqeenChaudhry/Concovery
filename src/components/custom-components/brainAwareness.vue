<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Sport data — hardcoded from AIHW 2023-24
// null rate means participation data wasn't available to calculate per 100k
const sports = ref([
  { name: 'Australian Rules Football', rate: 69.57,  count: 391 },
  { name: 'Rugby',                     rate: 144.46, count: 353 },
  { name: 'Cycling',                   rate: null,   count: 350 },
  { name: 'Soccer',                    rate: 19.39,  count: 239 },
  { name: 'Basketball',                rate: 11.27,  count: 119 },
  { name: 'Cricket',                   rate: 5.91,   count: 32  },
  { name: 'Netball',                   rate: 11.75,  count: 52  },
  { name: 'Swimming',                  rate: null,   count: 22  },
])

const selectedSport = ref(sports.value[0])

const maxRate = ref(
  Math.max(...sports.value.filter(s => s.rate !== null).map(s => s.rate as number))
)

function selectSport(sport: typeof sports.value[0]) {
  selectedSport.value = sport
}

function getRank(sport: typeof sports.value[0]) {
  const ranked = [...sports.value]
    .filter(s => s.rate !== null)
    .sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0))
  return ranked.findIndex(s => s.name === sport.name) + 1
}

// FAB open/close state — controls the floating action button menu
const fabOpen = ref(false)

onMounted(() => {
  // Close FAB when clicking anywhere outside of it
  document.addEventListener('click', (e) => {
    const fab = document.querySelector('.fab-wrap')
    if (fab && !fab.contains(e.target as Node)) fabOpen.value = false
  })

  // Fade-up on scroll
  const fadeObserver = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
    { threshold: 0.1 }
  )
  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el))

  // Stat counter animation
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.querySelectorAll('.stat-num').forEach((num: Element) => {
          const el     = num as HTMLElement
          const target = parseInt(el.dataset.target || '0')
          const suffix = el.dataset.suffix || ''
          let current  = 0
          const step   = Math.ceil(target / 40)
          const tick   = setInterval(() => {
            current = Math.min(current + step, target)
            el.textContent = current + suffix
            if (current >= target) clearInterval(tick)
          }, 30)
        })
        statsObserver.unobserve(entry.target)
      })
    },
    { threshold: 0.3 }
  )
  const statsEl = document.getElementById('statsRow')
  if (statsEl) statsObserver.observe(statsEl)

  // Bar chart grow-up animation
  const chartObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.querySelectorAll('.bar-body').forEach((bar: Element, i: number) => {
          const el = bar as HTMLElement
          setTimeout(() => { el.style.height = (el.dataset.h || '0') + '%' }, i * 90)
        })
        chartObserver.unobserve(entry.target)
      })
    },
    { threshold: 0.2 }
  )
  const chartEl = document.getElementById('chartWrap')
  if (chartEl) chartObserver.observe(chartEl)
})
</script>

<template>
  <div>

    <!-- ══════════════════════════════════════
         HERO
    ══════════════════════════════════════ -->
    <section class="hero">
  <div class="hero-overlay" />
  <div class="hero-lines" />
  <div class="hero-edge" />

  <div class="hero-inner">

    <!-- Left — text -->
    <div class="hero-content">
      <div class="hero-badge">
        <span class="hero-badge-dot" />
        Australian Community Sport
      </div>

      <h1 class="hero-title">
        PLAY<br>
        HARD.<br>
        <span class="always-ice">RECOVER</span><br>
        SMART.<br>
        COME BACK<br>
        STRONGER.
      </h1>

      <p class="hero-sub">
        Concussion awareness for Victorian community sport players, parents and coaches.
        Real AIHW data. Actual science. No guessing.
      </p>

      <div class="hero-actions">
        <router-link to="/exploredata">
          <button class="btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6"  y1="20" x2="6"  y2="14"/>
            </svg>
            Check my sport's risk
          </button>
        </router-link>
        <router-link to="/iteration3/stagedrecovery">
          <button class="btn-ghost">I recently had a knock →</button>
        </router-link>
      </div>
    </div>

    <!-- Right — athlete image, mirrored to face inward -->
    <div class="hero-image-wrap">
      <img src="/bg_image2.png" class="hero-image" alt="Athlete" />
    </div>

  </div>

  <!-- EKG heartbeat line -->
  <div class="hero-ekg">
    <svg class="ekg-svg" viewBox="0 0 1200 56" fill="none"
      xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <polyline
        points="0,28 80,28 100,28 115,4 130,52 145,8 160,28 240,28
                320,28 340,28 355,4 370,52 385,8 400,28 480,28
                560,28 580,28 595,4 610,52 625,8 640,28 720,28
                800,28 820,28 835,4 850,52 865,8 880,28 960,28 1200,28"
        stroke="#38bfff" stroke-width="1.5" fill="none"/>
    </svg>
  </div>
</section>


    <!-- ══════════════════════════════════════
         STATS — 21 / 80% / 5×
    ══════════════════════════════════════ -->
    <div class="stats-section">
      <div class="stats-row" id="statsRow">
        <div class="stat-item">
          <span class="stat-num" data-target="21" data-suffix="">0</span>
          <div class="stat-desc">
            <strong>Days minimum</strong>
            Brain recovery — not symptoms, actual healing
          </div>
        </div>
        <div class="stat-item stat-bordered">
          <span class="stat-num" data-target="80" data-suffix="%">0%</span>
          <div class="stat-desc">
            <strong>Return too early</strong>
            Of community sport players return before their brain has healed
          </div>
        </div>
        <div class="stat-item">
          <span class="stat-num" data-target="5" data-suffix="×">0×</span>
          <div class="stat-desc">
            <strong>Re-injury risk</strong>
            Higher when returning during the recovery window
          </div>
        </div>
      </div>
    </div>


    <!-- ══════════════════════════════════════
         WHERE ARE YOU RIGHT NOW?
    ══════════════════════════════════════ -->
    <section class="section bg-black fade-up">
      <div class="container">
        <div class="eyebrow">Get Started</div>
        <div class="section-header">
          <h2 class="section-title">Where are you right now?</h2>
          <p class="section-sub">Concovery works for both — choose your starting point.</p>
        </div>

        <div class="path-grid">
          <div class="path-card">
            <span class="ghost-num">01</span>
            <div class="path-tag">Recently had a knock</div>
            <h3 class="path-title">Your recovery.<br>Day by day.</h3>
            <p class="path-desc">
              Find out exactly where you are in the 21-day recovery window, what your brain is doing
              at the cellular level right now, and what you can and cannot do today.
            </p>
            <router-link to="/iteration3/stagedrecovery">
              <button class="btn-primary">
                Start my recovery plan
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </button>
            </router-link>
          </div>

          <div class="path-card">
            <span class="ghost-num">02</span>
            <div class="path-tag">Understand your risk</div>
            <h3 class="path-title">Real data for<br>your sport.</h3>
            <p class="path-desc">
              See live AIHW concussion hospitalisation numbers for your sport and age group.
              Know your actual risk before it happens — not from the changeroom, from the data.
            </p>
            <router-link to="/exploredata">
              <button class="btn-primary">
                Explore the data
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </section>


    <!-- ══════════════════════════════════════
         SPORT CHART — interactive bars
    ══════════════════════════════════════ -->
    <section class="section bg-surface fade-up">
      <div class="container">
        <div class="eyebrow">Your Sport</div>
        <div class="section-header">
          <h2 class="section-title">Real numbers. No filter.</h2>
          <span class="data-source">AIHW Sports Injury in Australia 2023–24</span>
        </div>

        <div class="chart-grid">
          <!-- Interactive bar chart -->
          <div class="chart-panel">
            <div class="chart-panel-header">
              <span>Hospitalisations per 100,000 participants</span>
              <span>AIHW 2023–24</span>
            </div>
            <div class="chart-bars">
              <div
                v-for="sport in sports"
                :key="sport.name"
                class="chart-row"
                :class="{ 'chart-row-active': selectedSport.name === sport.name }"
                @click="selectSport(sport)"
              >
                <span class="chart-label">{{ sport.name }}</span>
                <div class="chart-track">
                  <div
                    class="chart-fill"
                    :style="{
                      width: sport.rate ? `${(sport.rate / maxRate) * 100}%` : '4%',
                      background: selectedSport.name === sport.name ? '#38bfff' : 'rgba(255,255,255,0.18)'
                    }"
                  />
                </div>
                <span class="chart-value">{{ sport.rate ? Math.round(sport.rate) : '–' }}</span>
              </div>
            </div>
          </div>

          <!-- Selected sport detail -->
          <div class="detail-panel">
            <div class="detail-rank">
              <div class="rank-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="#38bfff" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                </svg>
              </div>
              <span class="rank-text">
                #{{ getRank(selectedSport) }} of {{ sports.filter(s => s.rate).length }} sports
              </span>
            </div>

            <h3 class="detail-name">{{ selectedSport.name }}</h3>
            <div class="detail-number">
              {{ selectedSport.rate ? Math.round(selectedSport.rate) : selectedSport.count }}
            </div>
            <p class="detail-number-label">
              {{ selectedSport.rate
                ? 'hospitalisations per 100,000 participants'
                : 'total hospitalisations (rate unavailable)' }}
            </p>

            <div class="tips-section">
              <div class="tips-heading">What smart players do</div>
              <div
                v-for="tip in [
                  'Come off the field immediately after any head knock',
                  'See a GP or sports doctor within 24 hours',
                  'Follow the full 21-day graduated return-to-play protocol',
                  'Get medical clearance — no exceptions, no shortcuts',
                ]"
                :key="tip"
                class="tip-row"
              >
                <div class="tip-check">
                  <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24"
                    fill="none" stroke="white" stroke-width="3">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </div>
                <span class="tip-text">{{ tip }}</span>
              </div>
            </div>
            <p class="detail-source">Source: AIHW Sports Injury in Australia 2023–24 · AusPlay 2023–24</p>
          </div>
        </div>
      </div>
    </section>


    <!-- ══════════════════════════════════════
         DAY 7 TRAP
    ══════════════════════════════════════ -->
    <section class="section bg-deep fade-up">
      <div class="container">
        <div class="recovery-grid">

          <!-- Left — text -->
          <div>
            <div class="eyebrow eyebrow-light">The thing your coach never told you</div>
            <h2 class="recovery-title">
              Day 7 feels fine.<br>
              <span class="always-ice">Day 21 is ready.</span>
            </h2>
            <p class="recovery-body">
              Most players feel completely fine about a week after a concussion. That feeling is real.
              But inside, the brain is still repairing itself at the cellular level.
            </p>
            <p class="recovery-body">
              Come back at full strength on Day 21 — not at 30% on Day 7.
              Your career lasts longer that way.
            </p>
            <router-link to="/rtprule">
              <button class="btn-white">
                See the full recovery guide
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </button>
            </router-link>
          </div>

          <!-- Right — progress card -->
          <div class="progress-card">
            <div class="progress-card-label">Brain Recovery Progress</div>
            <div
              v-for="item in [
                { day: 'Day 1',  label: 'Acute phase. Complete rest.',  pct: 10,  color: '#ff3d00' },
                { day: 'Day 7',  label: 'Feels fine. 30% recovered.',   pct: 30,  color: '#ff9900' },
                { day: 'Day 14', label: 'Repairing. Not ready yet.',     pct: 70,  color: '#4488ff' },
                { day: 'Day 21', label: 'Fully recovered. Return.',      pct: 100, color: '#38bfff' },
              ]"
              :key="item.day"
              class="progress-row"
            >
              <div class="progress-meta">
                <div class="progress-left">
                  <span class="progress-dot" :style="{ background: item.color }" />
                  <span class="progress-day">{{ item.day }}</span>
                  <span class="progress-label">{{ item.label }}</span>
                </div>
                <span class="progress-pct">{{ item.pct }}%</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: `${item.pct}%`, background: item.color }" />
              </div>
            </div>

            <div class="trap-callout">
              <div class="trap-icon">!</div>
              <p class="trap-text">
                <strong>The Day 7 trap.</strong>
                You feel 100%. Your brain is at 30%. That gap is where most re-injuries happen.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>


    <!-- ══════════════════════════════════════
         LOTTIE / ANIMATED SECTION
         Replace the CSS runner with a real
         Lottie file from lottiefiles.com
    ══════════════════════════════════════ -->
    <section class="section bg-surface fade-up">
      <div class="container">
        <div class="lottie-grid">

          <!-- Animation frame -->
          <div class="lottie-frame">
            <!--
              REPLACE THIS WITH YOUR LOTTIE FILE:
              <lottie-player
                src="/your-animation.json"
                background="transparent"
                speed="1" loop autoplay>
              </lottie-player>

              Get free files at: lottiefiles.com
              Search "running athlete" or "sport brain"
              Download JSON → put in /public → update src
            -->
            <div class="runner-scene">
              <span class="scene-bubble">Day 7 trap ⚡</span>
              <span class="scene-bubble">Brain healing: 30%</span>
              <span class="scene-bubble">Don't rush it</span>
              <div class="speed-lines">
                <div class="speed-line" />
                <div class="speed-line" />
                <div class="speed-line" />
              </div>
              <div class="runner">
                <div class="r-head" />
                <div class="r-body" />
                <div class="r-arm-l" />
                <div class="r-arm-r" />
                <div class="r-leg-l" />
                <div class="r-leg-r" />
              </div>
              <div class="track" />
            </div>
            <div class="lottie-badge">REPLACE WITH LOTTIE</div>
          </div>

          <!-- Text -->
          <div class="fade-up">
            <div class="eyebrow">Why it matters</div>
            <h2 class="section-title" style="font-size: clamp(40px,6vw,72px);line-height:0.95;letter-spacing:-0.03em;margin-bottom:24px;">
              YOUR BRAIN<br>ISN'T A<br><span class="always-ice">MUSCLE.</span>
            </h2>
            <p class="body-text">
              Muscles heal when you rest them. Brains heal on a completely different timeline —
              one that doesn't care how good you feel on Day 7.
            </p>
            <router-link to="/rtprule">
              <button class="btn-primary" style="margin-top:32px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                Read the science
              </button>
            </router-link>
          </div>

        </div>
      </div>
    </section>


    <!-- ══════════════════════════════════════
         DATA / KNOW YOUR RISK
    ══════════════════════════════════════ -->
    <section class="section bg-black fade-up">
      <div class="container">
        <div class="data-grid">

          <!-- Bar chart -->
          <div class="bar-chart-card" id="chartWrap">
            <div class="bar-chart-eyebrow">AIHW Data · Victoria · 2024</div>
            <div class="bar-chart-title">Concussion rate per 100,000 players</div>
            <div class="bars">
              <div class="bar-col">
                <div class="bar-body" data-h="45"
                  style="background:rgba(56,191,255,0.22);border-top:2px solid #38bfff;">
                  <span class="bar-top" style="color:#38bfff;">28</span>
                </div>
                <span class="bar-bot">AFL</span>
              </div>
              <div class="bar-col">
                <div class="bar-body" data-h="62"
                  style="background:rgba(56,191,255,0.30);border-top:2px solid #38bfff;">
                  <span class="bar-top" style="color:#38bfff;">39</span>
                </div>
                <span class="bar-bot">Rugby</span>
              </div>
              <div class="bar-col">
                <div class="bar-body" data-h="28"
                  style="background:rgba(56,191,255,0.16);border-top:2px solid #38bfff;">
                  <span class="bar-top" style="color:#38bfff;">18</span>
                </div>
                <span class="bar-bot">Soccer</span>
              </div>
              <div class="bar-col">
                <div class="bar-body" data-h="38"
                  style="background:rgba(56,191,255,0.20);border-top:2px solid #38bfff;">
                  <span class="bar-top" style="color:#38bfff;">24</span>
                </div>
                <span class="bar-bot">Hockey</span>
              </div>
              <div class="bar-col">
                <div class="bar-body" data-h="22"
                  style="background:rgba(56,191,255,0.14);border-top:2px solid #38bfff;">
                  <span class="bar-top" style="color:#38bfff;">14</span>
                </div>
                <span class="bar-bot">Netball</span>
              </div>
              <div class="bar-col">
                <div class="bar-body" data-h="80"
                  style="background:rgba(255,61,0,0.28);border-top:2px solid #ff3d00;">
                  <span class="bar-top" style="color:#ff3d00;">52</span>
                </div>
                <span class="bar-bot">Boxing</span>
              </div>
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-dot" style="background:#38bfff;" />
                Standard risk
              </div>
              <div class="legend-item">
                <div class="legend-dot" style="background:#ff3d00;" />
                Elevated risk
              </div>
            </div>
          </div>

          <!-- Text + chips -->
          <div>
            <div class="eyebrow">Know your risk</div>
            <h2 class="section-title" style="font-size:clamp(40px,6vw,72px);line-height:0.95;letter-spacing:-0.03em;margin-bottom:20px;">
              DATA YOUR<br>SPORT<br><span class="always-ice">HIDES.</span>
            </h2>
            <p class="body-text">
              Live AIHW hospitalisation data by sport, age group and gender.
              Know exactly where you stand — before a knock happens.
            </p>

            <div class="chip-grid">
              <div class="chip">
                <div class="chip-val">15–24</div>
                <div class="chip-text">Highest risk age bracket in community sport</div>
              </div>
              <div class="chip">
                <div class="chip-val">3×</div>
                <div class="chip-text">More likely in contact vs non-contact sports</div>
              </div>
              <div class="chip">
                <div class="chip-val">62%</div>
                <div class="chip-text">Of concussions go unreported at community level</div>
              </div>
              <div class="chip">
                <div class="chip-val">VIC</div>
                <div class="chip-text">Data sourced directly from AIHW Victorian records</div>
              </div>
            </div>

            <router-link to="/exploredata">
              <button class="btn-primary" style="margin-top:36px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                Explore my sport's data
              </button>
            </router-link>
          </div>

        </div>
      </div>
    </section>


    <!-- ══════════════════════════════════════
         EMERGENCY BANNER
    ══════════════════════════════════════ -->
    <div class="emergency-section">
      <div class="container">
        <div class="emergency-bar">
          <div class="emg-icon">⚠️</div>
          <div class="emg-text">
            <h3>Experiencing severe symptoms right now?</h3>
            <p>Severe headache, vomiting, seizures, loss of consciousness or slurred speech — don't wait.</p>
          </div>
          <a href="tel:000" class="btn-danger">Call 000</a>
        </div>
      </div>
    </div>


    <!-- ══════════════════════════════════════
         FINAL CTA — THE COMEBACK STARTS HERE
    ══════════════════════════════════════ -->
    <section class="cta-section fade-up">
      <div class="container cta-inner">
        <div class="cta-eyebrow">Free · No sign-up · Built for Victorian community sport</div>
        <h2 class="cta-title">
          THE<br>COMEBACK<br>
          <span class="always-ice">STARTS HERE.</span>
        </h2>
        <p class="cta-sub">Built for Australian community sport players, parents and coaches.</p>
        <div class="cta-actions">
          <router-link to="/exploredata">
            <button class="btn-primary btn-large">Check my sport</button>
          </router-link>
          <router-link to="/iteration3/stagedrecovery">
            <button class="btn-ghost btn-large">
              Start recovery plan
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
          </router-link>
        </div>
      </div>
    </section>


    <!-- ══════════════════════════════════════
         FLOATING ACTION BUTTON
         Click the + to expand quick links
    ══════════════════════════════════════ -->
    <div class="fab-wrap" :class="{ 'fab-open': fabOpen }">
      <div class="fab-items">
        <div class="fab-item">
          <span class="fab-label">I had a knock — get help now</span>
          <router-link to="/iteration3/stagedrecovery">
            <button class="fab-ico fab-ico-red">🚨</button>
          </router-link>
        </div>
        <div class="fab-item">
          <span class="fab-label">Start my recovery plan</span>
          <router-link to="/iteration3/stagedrecovery">
            <button class="fab-ico fab-ico-dark">🧠</button>
          </router-link>
        </div>
        <div class="fab-item">
          <span class="fab-label">Check my sport's risk</span>
          <router-link to="/exploredata">
            <button class="fab-ico fab-ico-ice">⚡</button>
          </router-link>
        </div>
      </div>
      <button class="fab-main" @click="fabOpen = !fabOpen" aria-label="Quick actions">
        <span class="fab-icon">{{ fabOpen ? '✕' : '+' }}</span>
      </button>
    </div>

  </div>
</template>


<!-- Non-scoped: CSS variables must live here.
     Vue scopes break :root if you put it in <style scoped> -->
<style>
:root {
  --ice:       #38bfff;
  --ice-dim:   #0099dd;
  --black:     #07090e;
  --surface:   #0b1220;
  --deep:      #0f2040;
  --card:      #0f1a2e;
  --border:    rgba(56,191,255,0.10);
  --border-hi: rgba(56,191,255,0.25);
  --white:     #ffffff;
  --muted:     #6b8aaa;
  --danger:    #ff3d00;
}

/* Light mode — toggled by body.light via the navbar toggle switch */
body.light {
  --black:     #f0f7ff;
  --surface:   #e8f3ff;
  --card:      #ffffff;
  --border:    rgba(56,191,255,0.15);
  --border-hi: rgba(56,191,255,0.30);
  --white:     #0a1628;
  --muted:     #4a6882;
  --danger:    #cc2200;
}
</style>

<style scoped>
/* ══════════════════════════════════════════
   COMPONENT STYLES
   Variables live in the non-scoped block
   above — just reference them here.
══════════════════════════════════════════ */

/* "Recover" / accent text — ALWAYS ice blue, light mode or dark */
.always-ice { color: #38bfff !important; }

/* ── Layout helpers ─────────────────────── */
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.section    { padding: 96px 24px; }
.bg-black   { background: var(--black); }
.bg-surface { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.bg-deep    { background: var(--deep);   border-top: 1px solid rgba(255,255,255,0.06); }

/* ── Scroll animation ───────────────────── */
.fade-up { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
.fade-up.visible { opacity: 1; transform: none; }

/* ── Labels / eyebrows ──────────────────── */
.eyebrow {
  font-size: 11px; font-weight: 600; letter-spacing: 3px;
  text-transform: uppercase; color: var(--ice);
  margin-bottom: 16px; display: block;
}
.eyebrow-light { color: rgba(56,191,255,0.65); }

/* ── Section header ─────────────────────── */
.section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 48px; flex-wrap: wrap; gap: 16px; }
.section-title  { font-size: clamp(28px,4vw,40px); font-weight: 800; color: var(--white); letter-spacing: -0.03em; }
.section-sub    { font-size: 14px; font-weight: 300; color: var(--muted); max-width: 260px; line-height: 1.6; }
.data-source    { font-size: 11px; color: var(--muted); }
.body-text      { font-size: 16px; font-weight: 300; color: var(--muted); line-height: 1.8; max-width: 460px; }

/* ── Buttons ────────────────────────────── */
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--ice); color: #07090e;
  font-weight: 700; font-size: 14px; padding: 14px 24px;
  border-radius: 100px; border: none; cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
}
.btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
.btn-large { padding: 18px 36px; font-size: 15px; }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  background: transparent; color: rgba(255,255,255,0.65);
  font-weight: 600; font-size: 14px; padding: 14px 24px;
  border-radius: 100px; border: 1px solid rgba(255,255,255,0.2);
  cursor: pointer; transition: color 0.2s, border-color 0.2s;
}
.btn-ghost:hover { color: white; border-color: rgba(255,255,255,0.4); }

.btn-white {
  display: inline-flex; align-items: center; gap: 8px;
  background: white; color: #0f2040; font-weight: 700; font-size: 14px;
  padding: 14px 24px; border-radius: 100px; border: none;
  cursor: pointer; margin-top: 32px; transition: opacity 0.2s;
}
.btn-white:hover { opacity: 0.9; }

.btn-danger {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--danger); color: white; font-weight: 700; font-size: 14px;
  padding: 12px 24px; border-radius: 8px; text-decoration: none;
  flex-shrink: 0; white-space: nowrap; transition: opacity 0.2s;
}
.btn-danger:hover { opacity: 0.85; }

/* ══════════════════════════════════════════
   HERO
══════════════════════════════════════════ */
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: #07090e;
}

.hero-overlay {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(
    to right,
    rgba(7,9,14,1.0) 0%,
    rgba(7,9,14,0.85) 55%,
    rgba(7,9,14,0.2) 100%
  );
}

.hero-lines {
  position: absolute; inset: 0;
  overflow: hidden; pointer-events: none; z-index: 1;
}
.hero-lines::before {
  content: ''; position: absolute; top: -200%; left: -50%;
  width: 200%; height: 400%;
  background-image: repeating-linear-gradient(
    -65deg, transparent, transparent 80px,
    rgba(56,191,255,0.025) 80px, rgba(56,191,255,0.025) 81px
  );
  animation: linesDrift 22s linear infinite;
}
@keyframes linesDrift {
  from { transform: translateX(0); }
  to   { transform: translateX(81px); }
}

.hero-edge {
  position: absolute; left: 0; top: 20%; bottom: 20%;
  width: 3px; z-index: 2;
  background: linear-gradient(to bottom, transparent, #38bfff 40%, #38bfff 60%, transparent);
}

/* Two column layout — text left, image right */
.hero-inner {
  position: relative; z-index: 3;
  width: 100%; max-width: 1200px;
  margin: 0 auto;
  padding: 120px 80px 100px;
  display: flex;
  align-items: center;
  gap: 40px;
}

.hero-content {
  flex: 0 0 auto;
  width: 52%;
}

/* Athlete image — right side, mirrored so they face inward */
.hero-image-wrap {
  flex: 1;
  position: relative;
  height: 85vh;
  overflow: hidden;
  mask-image: linear-gradient(to left, rgba(0,0,0,0.9) 40%, transparent 100%);
  -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,0.9) 40%, transparent 100%);
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transform: scaleX(-1);
  opacity: 0.75;
}

.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  border: 1px solid rgba(255,255,255,0.18); border-radius: 100px;
  padding: 6px 16px; margin-bottom: 24px;
  font-size: 11px; font-weight: 500; letter-spacing: 2px;
  text-transform: uppercase; color: rgba(255,255,255,0.6);
}
.hero-badge-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #38bfff; animation: blink 2s infinite;
}
@keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }

/* Bebas Neue — big stacked headline like the mockup */
.hero-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(64px, 10vw, 120px);
  line-height: 0.92;
  letter-spacing: 2px;
  color: white;
  margin-bottom: 28px;
}

.hero-sub {
  font-size: 16px; font-weight: 300;
  color: rgba(255,255,255,0.5);
  max-width: 440px; line-height: 1.75; margin-bottom: 40px;
}

.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }

.hero-ekg {
  position: absolute; bottom: 60px; left: 80px; right: 80px;
  z-index: 3; height: 56px; overflow: hidden; opacity: 0.28;
}
.ekg-svg { width: 200%; height: 100%; animation: ekgScroll 3s linear infinite; }
@keyframes ekgScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ══════════════════════════════════════════
   STATS
══════════════════════════════════════════ */
.stats-section { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.stats-row { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(3,1fr); }
.stat-item { padding: 56px 40px; text-align: center; position: relative; transition: background 0.3s; }
.stat-item:hover { background: rgba(56,191,255,0.04); }
.stat-item::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: var(--ice); transform: scaleX(0); transform-origin: left;
  transition: transform 0.45s ease;
}
.stat-item:hover::before { transform: scaleX(1); }
.stat-bordered { border-left: 1px solid var(--border); border-right: 1px solid var(--border); }
.stat-num { font-size: clamp(56px,8vw,80px); font-weight: 900; letter-spacing: -0.03em; color: var(--ice); display: block; margin-bottom: 12px; line-height: 1; }
.stat-desc { font-size: 13px; font-weight: 300; color: var(--muted); line-height: 1.6; }
.stat-desc strong { display: block; color: var(--white); font-weight: 600; font-size: 15px; margin-bottom: 4px; }

/* ══════════════════════════════════════════
   PATH CARDS
══════════════════════════════════════════ */
.path-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); border-radius: 16px; overflow: hidden; }
.path-card { background: var(--card); padding: 48px; position: relative; overflow: hidden; transition: background 0.2s; cursor: pointer; }
.path-card:hover { background: #131e35; }
.path-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--ice); transform: scaleY(0); transform-origin: bottom; transition: transform 0.3s ease; }
.path-card:hover::before { transform: scaleY(1); }
.ghost-num { position: absolute; right: 28px; bottom: -12px; font-size: 160px; font-weight: 900; color: rgba(255,255,255,0.03); line-height: 1; user-select: none; letter-spacing: -4px; }
.path-tag  { font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--ice); margin-bottom: 20px; }
.path-title { font-size: 28px; font-weight: 800; color: var(--white); letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 16px; }
.path-desc  { font-size: 14px; font-weight: 300; color: var(--muted); line-height: 1.75; margin-bottom: 32px; max-width: 380px; }

/* ══════════════════════════════════════════
   INTERACTIVE SPORT CHART
══════════════════════════════════════════ */
.chart-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

.chart-panel { background: #07090e; border-radius: 16px; padding: 24px; }
.chart-panel-header { display: flex; justify-content: space-between; font-size: 11px; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 24px; }
.chart-bars { display: flex; flex-direction: column; gap: 12px; }
.chart-row { display: flex; align-items: center; gap: 12px; cursor: pointer; }
.chart-label { font-size: 12px; width: 128px; flex-shrink: 0; color: rgba(255,255,255,0.4); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color 0.2s; }
.chart-row-active .chart-label, .chart-row:hover .chart-label { color: white; }
.chart-row-active .chart-label { font-weight: 500; }
.chart-track { flex: 1; background: rgba(255,255,255,0.05); border-radius: 100px; height: 8px; overflow: hidden; }
.chart-fill  { height: 100%; border-radius: 100px; transition: width 0.5s ease, background 0.3s; }
.chart-value { font-size: 12px; width: 28px; text-align: right; color: rgba(255,255,255,0.45); }
.chart-row-active .chart-value { color: white; font-weight: 600; }

.detail-panel { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; }
.detail-rank { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.rank-icon { width: 28px; height: 28px; border-radius: 50%; background: rgba(56,191,255,0.1); display: flex; align-items: center; justify-content: center; }
.rank-text { font-size: 12px; color: var(--muted); }
.detail-name { font-size: 18px; font-weight: 700; color: var(--white); margin-bottom: 16px; }
.detail-number { font-size: 64px; font-weight: 900; letter-spacing: -0.03em; color: var(--ice); line-height: 1; margin-bottom: 6px; }
.detail-number-label { font-size: 13px; color: var(--muted); margin-bottom: 24px; }
.tips-section { border-top: 1px solid var(--border); padding-top: 20px; }
.tips-heading { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--white); margin-bottom: 12px; }
.tip-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
.tip-check { width: 16px; height: 16px; border-radius: 50%; background: #1b7c3d; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
.tip-text { font-size: 12px; color: var(--muted); line-height: 1.5; }
.detail-source { font-size: 11px; color: var(--muted); margin-top: 16px; }

/* ══════════════════════════════════════════
   RECOVERY / DAY 7 TRAP
══════════════════════════════════════════ */
.recovery-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.recovery-title { font-size: clamp(32px,5vw,52px); font-weight: 900; letter-spacing: -0.03em; line-height: 1.05; color: white; margin-bottom: 24px; }
.recovery-body  { font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.6); line-height: 1.75; margin-bottom: 14px; }

.progress-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; }
.progress-card-label { font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 28px; }
.progress-row { margin-bottom: 20px; }
.progress-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.progress-left { display: flex; align-items: center; gap: 10px; }
.progress-dot  { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.progress-day  { font-size: 14px; font-weight: 600; color: white; }
.progress-label { font-size: 12px; font-weight: 300; color: rgba(255,255,255,0.45); }
.progress-pct  { font-size: 12px; color: rgba(255,255,255,0.35); }
.progress-track { height: 4px; background: rgba(255,255,255,0.07); border-radius: 2px; overflow: hidden; }
.progress-fill  { height: 100%; border-radius: 2px; }

.trap-callout { display: flex; gap: 12px; margin-top: 24px; background: rgba(56,191,255,0.07); border: 1px solid rgba(56,191,255,0.2); border-left: 3px solid #38bfff; border-radius: 10px; padding: 14px 16px; }
.trap-icon { width: 22px; height: 22px; border-radius: 50%; background: #38bfff; color: #07090e; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.trap-text { font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.6; }
.trap-text strong { color: #38bfff; }

/* ══════════════════════════════════════════
   LOTTIE / ANIMATED RUNNER
══════════════════════════════════════════ */
.lottie-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.lottie-frame { position: relative; border-radius: 20px; border: 1px solid var(--border); overflow: hidden; background: var(--card); aspect-ratio: 1; display: flex; align-items: center; justify-content: center; }
.lottie-badge { position: absolute; top: 14px; right: 14px; background: rgba(56,191,255,0.1); border: 1px solid rgba(56,191,255,0.25); border-radius: 20px; padding: 5px 12px; font-size: 11px; font-weight: 600; color: var(--ice); letter-spacing: 1px; }

.runner-scene { position: relative; width: 100%; height: 100%; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 40px; }
.track { position: absolute; bottom: 60px; left: 0; right: 0; height: 1px; background: rgba(56,191,255,0.2); }
.runner { position: absolute; bottom: 62px; left: 50%; transform: translateX(-50%); width: 60px; height: 90px; }
.r-head { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 18px; height: 18px; border-radius: 50%; background: var(--ice); }
.r-body { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); width: 10px; height: 26px; background: var(--ice); border-radius: 4px; opacity: 0.85; }
.r-arm-l, .r-arm-r { position: absolute; top: 24px; width: 7px; height: 20px; background: var(--ice); border-radius: 4px; opacity: 0.7; transform-origin: top center; }
.r-arm-l { left: 10px; animation: armL 0.55s ease-in-out infinite alternate; }
.r-arm-r { right: 10px; animation: armR 0.55s ease-in-out infinite alternate; }
@keyframes armL { from { transform: rotate(-38deg); } to { transform: rotate(38deg); } }
@keyframes armR { from { transform: rotate(38deg); } to { transform: rotate(-38deg); } }
.r-leg-l, .r-leg-r { position: absolute; top: 44px; width: 9px; height: 26px; background: var(--ice); border-radius: 4px; opacity: 0.9; transform-origin: top center; }
.r-leg-l { left: 16px; animation: legL 0.55s ease-in-out infinite alternate; }
.r-leg-r { right: 16px; animation: legR 0.55s ease-in-out infinite alternate; }
@keyframes legL { from { transform: rotate(-42deg); } to { transform: rotate(18deg); } }
@keyframes legR { from { transform: rotate(18deg); } to { transform: rotate(-42deg); } }

.speed-lines { position: absolute; right: 55%; top: 30%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 7px; }
.speed-line { height: 1.5px; background: linear-gradient(to right, transparent, rgba(56,191,255,0.45)); border-radius: 1px; animation: speedFade 0.85s ease-in-out infinite; }
.speed-line:nth-child(1) { width: 60px; animation-delay: 0s; }
.speed-line:nth-child(2) { width: 38px; animation-delay: 0.12s; }
.speed-line:nth-child(3) { width: 50px; animation-delay: 0.24s; }
@keyframes speedFade { 0%,100% { opacity:0.55; } 50% { opacity:0.25; } }

.scene-bubble { position: absolute; background: rgba(56,191,255,0.09); border: 1px solid rgba(56,191,255,0.28); border-radius: 24px; padding: 8px 16px; font-size: 12px; font-weight: 600; color: var(--ice); white-space: nowrap; animation: bobFloat 3.5s ease-in-out infinite; }
.scene-bubble:nth-child(1) { top: 18%; left: 10%; animation-delay: 0s; }
.scene-bubble:nth-child(2) { top: 40%; right: 8%; animation-delay: 1.1s; }
.scene-bubble:nth-child(3) { bottom: 22%; left: 8%; animation-delay: 2.2s; }
@keyframes bobFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }

/* ══════════════════════════════════════════
   DATA / BAR CHART
══════════════════════════════════════════ */
.data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.bar-chart-card { background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 36px; }
.bar-chart-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
.bar-chart-title { font-size: 22px; font-weight: 800; color: var(--white); letter-spacing: -0.03em; margin-bottom: 28px; }

.bars { display: flex; align-items: flex-end; gap: 10px; height: 160px; padding-bottom: 30px; border-bottom: 1px solid var(--border); position: relative; }
.bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; position: relative; }
.bar-body { width: 100%; border-radius: 3px 3px 0 0; height: 0; transition: height 1s cubic-bezier(0.22,1,0.36,1); cursor: pointer; }
.bar-body:hover { opacity: 0.75; }
.bar-top { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 700; white-space: nowrap; opacity: 0; transition: opacity 0.4s 0.9s; }
.bar-bot { position: absolute; bottom: -22px; left: 50%; transform: translateX(-50%); font-size: 11px; color: var(--muted); white-space: nowrap; }

.chart-legend { display: flex; gap: 20px; margin-top: 18px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted); }
.legend-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }

.chip-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 32px; }
.chip { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; transition: border-color 0.2s, transform 0.15s; }
.chip:hover { border-color: rgba(56,191,255,0.3); transform: translateY(-2px); }
.chip-val  { font-size: 34px; font-weight: 900; letter-spacing: -0.03em; color: var(--ice); line-height: 1; margin-bottom: 6px; }
.chip-text { font-size: 12px; font-weight: 300; color: var(--muted); line-height: 1.5; }

/* ══════════════════════════════════════════
   EMERGENCY BANNER
══════════════════════════════════════════ */
.emergency-section { background: var(--black); border-top: 1px solid var(--border); padding: 48px 24px; }
.emergency-bar { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; border: 1px solid rgba(255,61,0,0.3); border-left: 4px solid var(--danger); background: rgba(255,61,0,0.08); border-radius: 14px; padding: 28px 32px; }
.emg-icon { width: 44px; height: 44px; border-radius: 10px; background: rgba(255,61,0,0.12); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.emg-text { flex: 1; }
.emg-text h3 { font-weight: 700; font-size: 16px; margin-bottom: 3px; color: white; }
.emg-text p  { font-size: 13px; font-weight: 300; color: rgba(255,255,255,0.5); }

/* ══════════════════════════════════════════
   FINAL CTA
══════════════════════════════════════════ */
.cta-section { background: #07090e; padding: 112px 24px; }
.cta-inner   { text-align: center; }
.cta-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.28); margin-bottom: 32px; }
.cta-title   { font-size: clamp(56px,12vw,130px); font-weight: 900; letter-spacing: -0.04em; line-height: 0.9; color: white; margin-bottom: 24px; }
.cta-sub     { font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.4); margin-bottom: 48px; }
.cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

/* ══════════════════════════════════════════
   FLOATING ACTION BUTTON
══════════════════════════════════════════ */
.fab-wrap { position: fixed; bottom: 36px; right: 36px; z-index: 500; }
.fab-main {
  width: 58px; height: 58px; border-radius: 50%;
  background: var(--ice); border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  animation: fabGlow 2.8s ease-out infinite; transition: transform 0.2s;
}
.fab-main:hover { transform: scale(1.08); }
@keyframes fabGlow {
  0%   { box-shadow: 0 0 0 0 rgba(56,191,255,0.4); }
  70%  { box-shadow: 0 0 0 14px rgba(56,191,255,0); }
  100% { box-shadow: 0 0 0 0 rgba(56,191,255,0); }
}
.fab-icon { font-size: 22px; color: #07090e; font-weight: 700; transition: transform 0.25s; }

.fab-items { position: absolute; bottom: 70px; right: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; pointer-events: none; }
.fab-item  { display: flex; align-items: center; gap: 12px; opacity: 0; transform: translateY(12px) scale(0.92); transition: opacity 0.2s, transform 0.2s; pointer-events: none; }
.fab-open .fab-item { opacity: 1; transform: none; pointer-events: auto; }
.fab-open .fab-item:nth-child(1) { transition-delay: 0.00s; }
.fab-open .fab-item:nth-child(2) { transition-delay: 0.05s; }
.fab-open .fab-item:nth-child(3) { transition-delay: 0.10s; }

.fab-label { background: var(--card); border: 1px solid var(--border); color: var(--white); font-size: 13px; font-weight: 500; padding: 9px 16px; border-radius: 22px; white-space: nowrap; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
.fab-ico { width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: none; cursor: pointer; transition: transform 0.15s; }
.fab-ico:hover { transform: scale(1.1); }
.fab-ico-ice  { background: var(--ice); }
.fab-ico-dark { background: var(--card); border: 1px solid var(--border); }
.fab-ico-red  { background: var(--danger); }

/* ══════════════════════════════════════════
   LIGHT MODE
   Only the white sections flip — hero, recovery,
   CTA stay dark because they have dark backgrounds
══════════════════════════════════════════ */
:global(body.light) .bg-surface { background: #f0f7ff; }
:global(body.light) .bg-black   { background: #f5f9ff; }
:global(body.light) .stats-section { background: #e8f3ff; }

:global(body.light) .section-title  { color: #0a1628; }
:global(body.light) .section-sub    { color: #4a6882; }
:global(body.light) .stat-desc      { color: #4a6882; }
:global(body.light) .stat-desc strong { color: #0a1628; }
:global(body.light) .body-text      { color: #4a6882; }
:global(body.light) .stat-bordered  { border-color: rgba(56,191,255,0.2); }

:global(body.light) .path-card       { background: #ffffff; border: 1px solid rgba(56,191,255,0.12); }
:global(body.light) .path-card:hover { background: #eef6ff; }
:global(body.light) .path-title      { color: #0a1628; }
:global(body.light) .path-desc       { color: #4a6882; }

:global(body.light) .detail-panel        { background: #ffffff; border-color: rgba(56,191,255,0.15); }
:global(body.light) .detail-name         { color: #0a1628; }
:global(body.light) .detail-number-label { color: #4a6882; }
:global(body.light) .tips-heading        { color: #0a1628; }
:global(body.light) .tip-text            { color: #4a6882; }

:global(body.light) .bar-chart-card { background: #ffffff; }
:global(body.light) .bar-chart-title { color: #0a1628; }
:global(body.light) .chip { background: #ffffff; }
:global(body.light) .chip-text { color: #4a6882; }

/* Keep hero, cta, recovery, emergency dark always */
:global(body.light) .hero { background: #07090e; }
:global(body.light) .cta-section { background: #07090e; }
:global(body.light) .bg-deep { background: #0f2040; }
:global(body.light) .emergency-section { background: #07090e; }
</style>
