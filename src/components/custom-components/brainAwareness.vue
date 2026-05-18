<script setup lang="ts">
import { ref, onMounted } from 'vue'

const fabOpen = ref(false)

onMounted(() => {
  document.addEventListener('click', (e) => {
    const fab = document.querySelector('.fab-wrap')
    if (fab && !fab.contains(e.target as Node)) fabOpen.value = false
  })

  const fadeObserver = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
    { threshold: 0.1 }
  )
  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el))

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

  const progressEl = document.getElementById('progressCard')
  if (progressEl) {
  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          barsVisible.value = true
          progressObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.3 }
  )
  progressObserver.observe(progressEl)
}
})

const animActive = ref(true)

function restartAnim() {
  animActive.value = false
  setTimeout(() => animActive.value = true, 50)
}

const barsVisible = ref(false)
</script>

<template>
  <div>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-overlay" />
      <div class="hero-lines" />
      <div class="hero-edge" />

      <div class="hero-inner">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="hero-badge-dot" />
            Australian Community Sport
          </div>

          <h1 class="hero-title">
            PLAY HARD.<br>
            <span class="always-ice">RECOVER</span> SMART.<br>
            COME BACK STRONGER.
          </h1>

          <p class="hero-sub">
            Everything you need to know about concussion, from the moment it happens to the day you return.
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
              <button class="btn-primary">I recently had a knock →</button>
            </router-link>
          </div>
        </div>

        <div class="hero-image-wrap">
          <img src="/bg_image2.png" class="hero-image" alt="Athlete" />
        </div>
      </div>

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


    <!-- STATS -->
    <div class="stats-section">
      <div class="stats-row" id="statsRow">
        <div class="stat-item">
          <span class="stat-num" data-target="21" data-suffix="">0</span>
          <div class="stat-desc">
            <strong>Days minimum</strong>
            Brain recovery. Not symptoms, actual cellular healing.
          </div>
        </div>
        <div class="stat-item stat-bordered">
          <span class="stat-num" data-target="80" data-suffix="%">0%</span>
          <div class="stat-desc">
            <strong>Return too early</strong>
            Of community sport players return before their brain has fully healed.
          </div>
        </div>
        <div class="stat-item">
          <span class="stat-num" data-target="5" data-suffix="×">0×</span>
          <div class="stat-desc">
            <strong>Re-injury risk</strong>
            Higher re-injury risk when returning during the recovery window.
          </div>
        </div>
      </div>
    </div>


    <!-- WHERE ARE YOU RIGHT NOW? -->
    <section class="section bg-black fade-up">
      <div class="container">
        <div class="eyebrow">Get Started</div>
        <div class="section-header">
          <h2 class="section-title">Where are you right now?</h2>
          <p class="section-sub">Concovery works for both. Choose your starting point.</p>
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
              Know your actual risk before it happens. Not from the changeroom. From the data.
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


    <!-- DAY 7 TRAP -->
    <section class="section bg-deep fade-up">
      <div class="container">
        <div class="recovery-grid">

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
              Come back at full strength on Day 21. Not at 30% on Day 7.
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

          <div class="progress-card" id="progressCard">
            <div class="progress-card-label">Brain Recovery Progress</div>
            <div
              v-for="(item, index) in [
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
                <div class="progress-fill" :style="{
  width: barsVisible ? `${item.pct}%` : '0%',
  background: item.color,
  transitionDelay: `${index * 0.18}s`
}" />
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


    <!-- LOTTIE / ANIMATED SECTION -->
  <!-- FOOTBALL CONCUSSION ANIMATION -->
<section class="section bg-surface fade-up">
  <div class="container">
    <div class="lottie-grid">

      <!-- SVG football scene — click to restart animation -->
      <div class="fp-wrap" @click="restartAnim" :class="{ 'fp-active': animActive }">
        <svg viewBox="0 0 400 400" class="fp-svg" xmlns="http://www.w3.org/2000/svg">

          <!-- Pitch background -->
          <rect width="400" height="400" fill="#07090e"/>
          <!-- Grass stripes -->
          <rect x="0"   width="57"  height="400" fill="#0b1220" opacity="0.7"/>
          <rect x="114" width="57"  height="400" fill="#0b1220" opacity="0.7"/>
          <rect x="228" width="57"  height="400" fill="#0b1220" opacity="0.7"/>
          <rect x="342" width="57"  height="400" fill="#0b1220" opacity="0.7"/>

          <!-- Pitch lines -->
          <line x1="200" y1="0" x2="200" y2="400" stroke="rgba(56,191,255,0.25)" stroke-width="2"/>
          <circle cx="200" cy="200" r="55" fill="none" stroke="rgba(56,191,255,0.2)" stroke-width="1.5"/>
          <circle cx="200" cy="200" r="3"  fill="rgba(255,255,255,0.3)"/>
          <!-- Penalty boxes -->
          <rect x="0"   y="150" width="80"  height="100" fill="none" stroke="rgba(56,191,255,0.2)" stroke-width="1.5"/>
          <rect x="320" y="150" width="80"  height="100" fill="none" stroke="rgba(56,191,255,0.2)" stroke-width="1.5"/>

          <!-- Goalpost left -->
          <line x1="10" y1="158" x2="55" y2="158" stroke="white" stroke-width="4" stroke-linecap="round"/>
          <line x1="10" y1="158" x2="10" y2="242" stroke="white" stroke-width="4" stroke-linecap="round"/>
          <line x1="55" y1="158" x2="55" y2="242" stroke="white" stroke-width="4" stroke-linecap="round"/>
          <!-- Net pattern -->
          <rect x="10" y="158" width="45" height="84" fill="url(#net)" opacity="0.4"/>
          <defs>
            <pattern id="net" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M0 0 L8 8 M8 0 L0 8" stroke="white" stroke-width="0.5"/>
            </pattern>
          </defs>

          <!-- Ground shadow under player -->
          <ellipse cx="155" cy="336" rx="22" ry="5" fill="rgba(0,0,0,0.3)"/>

          <!-- Player body — jersey #7 -->
          <!-- Legs -->
          <line x1="150" y1="290" x2="138" y2="332" stroke="#003399" stroke-width="9" stroke-linecap="round" class="fp-leg-l"/>
          <line x1="160" y1="290" x2="172" y2="332" stroke="#003399" stroke-width="9" stroke-linecap="round" class="fp-leg-r"/>
          <!-- Shorts -->
          <rect x="138" y="273" width="34" height="20" rx="3" fill="#002277"/>
          <!-- Torso / jersey -->
          <rect x="136" y="228" width="38" height="48" rx="5" fill="#cc0000"/>
          <!-- Jersey number -->
          <text x="155" y="257" text-anchor="middle" font-size="14" font-weight="bold" fill="white">7</text>
          <!-- Arms -->
          <line x1="136" y1="242" x2="112" y2="265" stroke="#cc0000" stroke-width="9" stroke-linecap="round" class="fp-arm-l"/>
          <line x1="174" y1="242" x2="198" y2="265" stroke="#cc0000" stroke-width="9" stroke-linecap="round" class="fp-arm-r"/>
          <!-- Neck -->
          <rect x="149" y="218" width="12" height="12" rx="3" fill="#ffcc88"/>

          <!-- Head group — wobbles on impact -->
          <g class="fp-head-group">
            <circle cx="155" cy="203" r="22" fill="#ffcc88"/>
            <!-- Eyes (normal) -->
            <circle cx="148" cy="199" r="3" fill="#333" class="fp-eye-l"/>
            <circle cx="162" cy="199" r="3" fill="#333" class="fp-eye-r"/>
            <!-- Mouth (normal smile → frown on impact) -->
            <path d="M148 210 Q155 215 162 210" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round" class="fp-mouth"/>
            <!-- Hair -->
            <path d="M133 198 Q135 178 155 177 Q175 178 177 198" fill="#3a1a00"/>

            <!-- Stars (appear on impact, orbit around head) -->
            <g class="fp-stars">
              <text x="128" y="178" font-size="14" fill="#ffd700">★</text>
              <text x="153" y="171" font-size="14" fill="#ffaa00">★</text>
              <text x="178" y="178" font-size="14" fill="#ffd700">★</text>
            </g>

            <!-- Dizzy swirls (appear on impact) -->
            <g class="fp-dizzy">
              <circle cx="148" cy="199" r="5" fill="#ff6600" class="fp-dizzy-eye-l"/>
              <circle cx="162" cy="199" r="5" fill="#ff6600" class="fp-dizzy-eye-r"/>
              <!-- X eyes -->
              <line x1="145" y1="196" x2="151" y2="202" stroke="white" stroke-width="1.5"/>
              <line x1="151" y1="196" x2="145" y2="202" stroke="white" stroke-width="1.5"/>
              <line x1="159" y1="196" x2="165" y2="202" stroke="white" stroke-width="1.5"/>
              <line x1="165" y1="196" x2="159" y2="202" stroke="white" stroke-width="1.5"/>
            </g>
          </g>

          <!-- Impact ring (expands on hit) -->
          <circle cx="155" cy="203" r="28" fill="none" stroke="#ffff00" stroke-width="3" class="fp-impact-ring"/>

          <!-- The football — comes from right, hits head, bounces off -->
          <text x="345" y="215" font-size="32" class="fp-ball">⚽</text>

          <!-- Info labels -->
          <rect x="8"   y="350" width="128" height="28" rx="14" fill="rgba(56,191,255,0.15)" stroke="rgba(56,191,255,0.4)" stroke-width="1"/>
          <text x="72"  y="368" text-anchor="middle" font-size="11" font-weight="bold" fill="#38bfff"> Day 7 trap</text>

          <rect x="258" y="14" width="134" height="28" rx="14" fill="rgba(56,191,255,0.15)" stroke="rgba(56,191,255,0.4)" stroke-width="1"/>
          <text x="325" y="32" text-anchor="middle" font-size="11" font-weight="bold" fill="#38bfff">Brain: 30% healed</text>

          <!-- Click hint -->
          <text x="200" y="392" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.35)">click to replay</text>

        </svg>
      </div>

      <div class="fade-up">
        <div class="eyebrow">Why it matters</div>
        <h2 class="section-title" style="font-size: clamp(40px,6vw,72px);line-height:0.95;letter-spacing:-0.03em;margin-bottom:24px;">
          YOUR BRAIN<br>ISN'T A<br><span class="always-ice">MUSCLE.</span>
        </h2>
        <p class="body-text">
          Muscles heal when you rest them. Brains heal on a completely different timeline,
          one that does not care how good you feel on Day 7.
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


    <section class="cta-section fade-up">
      <div class="container cta-inner">
        <div class="cta-eyebrow">Free · No sign-up · Built for Australian community sport</div>
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
            <button class="btn-primary btn-large">
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

  </div>
</template>


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

body.light .bg-surface     { background: #f0f7ff; }
body.light .bg-black       { background: #f5f9ff; }
body.light .stats-section  { background: #e8f3ff; }
body.light .section-title  { color: #0a1628; }
body.light .section-sub    { color: #4a6882; }
body.light .stat-desc      { color: #4a6882; }
body.light .stat-desc strong { color: #0a1628; }
body.light .body-text      { color: #4a6882; }

body.light .path-grid { background: rgba(56,191,255,0.15); }
body.light .path-card { background: #ffffff !important; }
body.light .path-card .path-title { color: #0a1628 !important; }
body.light .path-card .path-desc  { color: #4a6882 !important; }
body.light .path-card .path-tag   { color: #0099dd !important; }
body.light .path-card .ghost-num  { color: rgba(0,0,0,0.06) !important; }
body.light .path-card:hover                { background: #0f1a2e !important; }
body.light .path-card:hover .path-title    { color: #ffffff !important; }
body.light .path-card:hover .path-desc     { color: #6b8aaa !important; }
body.light .path-card:hover .path-tag      { color: #38bfff !important; }
body.light .path-card:hover .ghost-num     { color: rgba(255,255,255,0.04) !important; }

body.light .hero              { background: #07090e; }
body.light .cta-section       { background: #07090e; }
body.light .bg-deep           { background: #0f2040; }
body.light .emergency-section { background: #07090e; }
</style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

.always-ice { color: #38bfff !important; }

.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.section    { padding: 96px 24px; }
.bg-black   { background: var(--black); }
.bg-surface { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.bg-deep    { background: var(--deep); border-top: 1px solid rgba(255,255,255,0.06); }

.fade-up { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
.fade-up.visible { opacity: 1; transform: none; }

.eyebrow {
  font-size: 11px; font-weight: 600; letter-spacing: 3px;
  text-transform: uppercase; color: var(--ice);
  margin-bottom: 16px; display: block;
}
.eyebrow-light { color: rgba(56,191,255,0.65); }

.section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 48px; flex-wrap: wrap; gap: 16px; }
.section-title  { font-size: clamp(28px,4vw,40px); font-weight: 800; color: var(--white); letter-spacing: -0.03em; }
.section-sub    { font-size: 14px; font-weight: 300; color: var(--muted); max-width: 260px; line-height: 1.6; }
.body-text      { font-size: 16px; font-weight: 300; color: var(--muted); line-height: 1.8; max-width: 460px; }

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

/* HERO */
.hero {
  position: relative; min-height: 100vh;
  display: flex; align-items: center;
  overflow: hidden; background: #07090e;
}
.hero-overlay {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(to right, rgba(7,9,14,1.0) 0%, rgba(7,9,14,0.85) 55%, rgba(7,9,14,0.2) 100%);
}
.hero-lines { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 1; }
.hero-lines::before {
  content: ''; position: absolute; top: -200%; left: -50%; width: 200%; height: 400%;
  background-image: repeating-linear-gradient(-65deg, transparent, transparent 80px, rgba(56,191,255,0.025) 80px, rgba(56,191,255,0.025) 81px);
  animation: linesDrift 22s linear infinite;
}
@keyframes linesDrift { from { transform: translateX(0); } to { transform: translateX(81px); } }
.hero-edge {
  position: absolute; left: 0; top: 20%; bottom: 20%; width: 3px; z-index: 2;
  background: linear-gradient(to bottom, transparent, #38bfff 40%, #38bfff 60%, transparent);
}
.hero-inner {
  position: relative; z-index: 3; width: 100%;
  margin: 0; padding: 0 80px;
  display: flex; align-items: center; gap: 40px;
  min-height: 100vh;
}
.hero-content { position: relative; z-index: 4; width: 55%; flex-shrink: 0; margin-top: -60px; }
.hero-image-wrap {
  position: absolute; right: 1px; top: 0; bottom: 0; width: 48%; overflow: hidden; z-index: 2;
  mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 25%, rgba(0,0,0,1) 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 25%, rgba(0,0,0,1) 100%);
}
.hero-image { width: 100%; height: 100%; object-fit: cover; object-position: top center; transform: scaleX(-1); opacity: 0.85; }
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  border: 1px solid rgba(255,255,255,0.18); border-radius: 100px;
  padding: 6px 16px; margin-bottom: 24px;
  font-size: 11px; font-weight: 500; letter-spacing: 2px;
  text-transform: uppercase; color: rgba(255,255,255,0.6);
}
.hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #38bfff; animation: blink 2s infinite; }
@keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
.hero-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(48px, 6.5vw, 86px);
  line-height: 1.05; letter-spacing: 2px; color: white; margin-bottom: 20px;
}
.hero-sub { font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.5); max-width: 420px; line-height: 1.7; margin-bottom: 20px; }
.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
.hero-ekg { position: absolute; bottom: 60px; left: 80px; right: 80px; z-index: 3; height: 56px; overflow: hidden; opacity: 0.28; }
.ekg-svg { width: 200%; height: 100%; animation: ekgScroll 3s linear infinite; }
@keyframes ekgScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* STATS */
.stats-section { background: var(--surface); }
.stats-row { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(3,1fr); }
.stat-item { padding: 56px 40px; text-align: center; position: relative; transition: background 0.3s; }
.stat-item:hover { background: rgba(56,191,255,0.04); }
.stat-item::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: var(--ice); transform: scaleX(0); transform-origin: left;
  transition: transform 0.45s ease;
}
.stat-item:hover::before { transform: scaleX(1); }
.stat-bordered { }
.stat-num { font-size: clamp(56px,8vw,80px); font-weight: 900; letter-spacing: -0.03em; color: var(--ice); display: block; margin-bottom: 12px; line-height: 1; }
.stat-desc { font-size: 13px; font-weight: 300; color: var(--muted); line-height: 1.6; }
.stat-desc strong { display: block; color: var(--white); font-weight: 600; font-size: 15px; margin-bottom: 4px; }

/* PATH CARDS */
.path-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); border-radius: 16px; overflow: hidden; }
.path-card {
  background: #0f1a2e; padding: 48px;
  position: relative; overflow: hidden;
  transition: background 0.2s, color 0.2s; cursor: pointer;
}
.path-card:hover { background: #ffffff; }
.path-card:hover .path-title { color: #0a1628; }
.path-card:hover .path-desc  { color: #4a6882; }
.path-card:hover .path-tag   { color: #0099dd; }
.path-card:hover .ghost-num  { color: rgba(0,0,0,0.06); }
.path-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--ice); transform: scaleY(0); transform-origin: bottom; transition: transform 0.3s ease; }
.path-card:hover::before { transform: scaleY(1); }
.ghost-num { position: absolute; right: 28px; bottom: -12px; font-size: 160px; font-weight: 900; color: rgba(255,255,255,0.03); line-height: 1; user-select: none; letter-spacing: -4px; }
.path-tag   { font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--ice); margin-bottom: 20px; }
.path-title { font-size: 28px; font-weight: 800; color: var(--white); letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 16px; }
.path-desc  { font-size: 14px; font-weight: 300; color: var(--muted); line-height: 1.75; margin-bottom: 32px; max-width: 380px; }

/* DAY 7 / RECOVERY */
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
.progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 1.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.trap-callout { display: flex; gap: 12px; margin-top: 24px; background: rgba(56,191,255,0.07); border: 1px solid rgba(56,191,255,0.2); border-left: 3px solid #38bfff; border-radius: 10px; padding: 14px 16px; }
.trap-icon { width: 22px; height: 22px; border-radius: 50%; background: #38bfff; color: #07090e; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.trap-text { font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.6; }
.trap-text strong { color: #38bfff; }

/* LOTTIE / RUNNER */
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

/* EMERGENCY — sits just above the footer */
.emergency-section { background: var(--black); border-top: 1px solid var(--border); padding: 32px 24px; }
.emergency-bar { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; border: 1px solid rgba(255,61,0,0.3); border-left: 4px solid var(--danger); background: rgba(255,61,0,0.08); border-radius: 14px; padding: 24px 28px; }
.emg-icon { width: 44px; height: 44px; border-radius: 10px; background: rgba(255,61,0,0.12); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.emg-text { flex: 1; }
.emg-text h3 { font-weight: 700; font-size: 15px; margin-bottom: 3px; color: white; }
.emg-text p  { font-size: 13px; font-weight: 300; color: rgba(255,255,255,0.5); }

/* FINAL CTA */
.cta-section { background: #07090e; padding: 112px 24px; }
.cta-inner   { text-align: center; }
.cta-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.28); margin-bottom: 32px; }
.cta-title   { font-size: clamp(56px,12vw,130px); font-weight: 900; letter-spacing: -0.04em; line-height: 0.9; color: white; margin-bottom: 24px; }
.cta-sub     { font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.4); margin-bottom: 48px; }
.cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

/* FAB */
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
.fab-icon { font-size: 22px; color: #07090e; font-weight: 700; }
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

/* FOOTBALL SCENE */
.fp-wrap {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--border);
  cursor: pointer;
  aspect-ratio: 1;
}
.fp-wrap:hover { opacity: 0.95; }

.fp-svg { width: 100%; height: 100%; display: block; }

/* Ball flies in, hits head, bounces back — 5s loop */
.fp-active .fp-ball {
  animation: fpBallFly 5s ease-in-out infinite;
}
@keyframes fpBallFly {
  0%, 15%  { transform: translate(0px,   0px)  rotate(0deg);    opacity: 1; }
  35%      { transform: translate(-95px, -18px) rotate(-180deg); opacity: 1; }
  50%      { transform: translate(-196px, 0px)  rotate(-360deg); opacity: 1; }
  54%      { transform: translate(-175px,-30px) rotate(-400deg); opacity: 1; }
  68%      { transform: translate(-20px, -90px) rotate(-540deg); opacity: 0.2; }
  70%, 90% { transform: translate(0px,   0px)  rotate(0deg);    opacity: 0; }
  100%     { transform: translate(0px,   0px)  rotate(0deg);    opacity: 1; }
}

/* Head wobbles on impact (at 50% = 2.5s) */
.fp-active .fp-head-group {
  transform-origin: 155px 203px;
  animation: fpHeadBonk 5s ease-in-out infinite;
}
@keyframes fpHeadBonk {
  0%, 48%  { transform: rotate(0deg); }
  50%      { transform: rotate(-28deg); }
  52%      { transform: rotate(22deg); }
  55%      { transform: rotate(-16deg); }
  58%      { transform: rotate(10deg); }
  62%      { transform: rotate(-5deg); }
  67%      { transform: rotate(0deg); }
  100%     { transform: rotate(0deg); }
}

/* Stars orbit around head after impact */
.fp-active .fp-stars {
  transform-origin: 155px 203px;
  animation: fpStarOrbit 5s ease-in-out infinite;
  opacity: 0;
}
@keyframes fpStarOrbit {
  0%, 48%   { opacity: 0; transform: rotate(0deg) scale(0); }
  50%       { opacity: 1; transform: rotate(0deg) scale(1); }
  60%       { opacity: 1; transform: rotate(120deg) scale(1); }
  70%       { opacity: 0; transform: rotate(240deg) scale(0.5); }
  100%      { opacity: 0; }
}

/* Dizzy X eyes appear on impact */
.fp-active .fp-dizzy {
  animation: fpDizzy 5s ease-in-out infinite;
  opacity: 0;
}
@keyframes fpDizzy {
  0%, 48%  { opacity: 0; }
  50%, 68% { opacity: 1; }
  72%      { opacity: 0; }
  100%     { opacity: 0; }
}

/* Normal eyes disappear on impact */
.fp-active .fp-eye-l,
.fp-active .fp-eye-r,
.fp-active .fp-mouth {
  animation: fpEyeHide 5s ease-in-out infinite;
}
@keyframes fpEyeHide {
  0%, 48%  { opacity: 1; }
  50%, 68% { opacity: 0; }
  72%      { opacity: 1; }
  100%     { opacity: 1; }
}

/* Yellow impact ring expands on hit */
.fp-active .fp-impact-ring {
  transform-origin: 155px 203px;
  animation: fpImpactRing 5s ease-in-out infinite;
  opacity: 0;
}
@keyframes fpImpactRing {
  0%, 48%  { transform: scale(0); opacity: 0; }
  50%      { transform: scale(1);   opacity: 1; }
  57%      { transform: scale(2.8); opacity: 0; }
  100%     { transform: scale(0);   opacity: 0; }
}

/* Left leg staggers on impact */
.fp-active .fp-leg-l {
  transform-origin: 150px 290px;
  animation: fpLegStagger 5s ease-in-out infinite;
}
@keyframes fpLegStagger {
  0%, 48%  { transform: rotate(0deg); }
  50%, 66% { transform: rotate(-12deg); }
  70%      { transform: rotate(0deg); }
  100%     { transform: rotate(0deg); }
}
</style>
