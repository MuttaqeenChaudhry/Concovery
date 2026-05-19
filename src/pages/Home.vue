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

    <!-- HERO — always dark -->
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
            <router-link to="/iteration3/stagedrecovery">
              <button class="btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6"  y1="20" x2="6"  y2="14"/>
                </svg>
                Track my recovery
              </button>
            </router-link>
            <router-link to="/locatesupport">
              <button class="btn-primary">Find Support →</button>
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


    <!-- STATS — always light blue -->
    <div class="stats-section">
      <div class="stats-row" id="statsRow">
        <div class="stat-item">
          <span class="stat-num" data-target="21" data-suffix="">0</span>
          <div class="stat-desc">
            <strong>Days minimum</strong>
            Brain recovery. Not symptoms, actual cellular healing.
          </div>
        </div>
        <div class="stat-item">
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


    <!-- WHERE ARE YOU RIGHT NOW? — always light -->
    <section class="section bg-light fade-up">
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


    <!-- DAY 7 TRAP — always dark navy -->
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
            <router-link to="/iteration3/stagedrecovery">
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


    <!-- FOOTBALL ANIMATION — always lighter blue -->
    <section class="section bg-lighter fade-up">
      <div class="container">
        <div class="lottie-grid">

          <div class="fp-wrap" @click="restartAnim" :class="{ 'fp-active': animActive }">
            <svg viewBox="0 0 400 400" class="fp-svg" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="400" fill="#07090e"/>
              <rect x="0"   width="57"  height="400" fill="#0b1220" opacity="0.7"/>
              <rect x="114" width="57"  height="400" fill="#0b1220" opacity="0.7"/>
              <rect x="228" width="57"  height="400" fill="#0b1220" opacity="0.7"/>
              <rect x="342" width="57"  height="400" fill="#0b1220" opacity="0.7"/>
              <line x1="200" y1="0" x2="200" y2="400" stroke="rgba(56,191,255,0.25)" stroke-width="2"/>
              <circle cx="200" cy="200" r="55" fill="none" stroke="rgba(56,191,255,0.2)" stroke-width="1.5"/>
              <circle cx="200" cy="200" r="3"  fill="rgba(255,255,255,0.3)"/>
              <rect x="0"   y="150" width="80"  height="100" fill="none" stroke="rgba(56,191,255,0.2)" stroke-width="1.5"/>
              <rect x="320" y="150" width="80"  height="100" fill="none" stroke="rgba(56,191,255,0.2)" stroke-width="1.5"/>
              <line x1="10" y1="158" x2="55" y2="158" stroke="white" stroke-width="4" stroke-linecap="round"/>
              <line x1="10" y1="158" x2="10" y2="242" stroke="white" stroke-width="4" stroke-linecap="round"/>
              <line x1="55" y1="158" x2="55" y2="242" stroke="white" stroke-width="4" stroke-linecap="round"/>
              <rect x="10" y="158" width="45" height="84" fill="url(#net)" opacity="0.4"/>
              <defs>
                <pattern id="net" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M0 0 L8 8 M8 0 L0 8" stroke="white" stroke-width="0.5"/>
                </pattern>
              </defs>
              <ellipse cx="155" cy="336" rx="22" ry="5" fill="rgba(0,0,0,0.3)"/>
              <line x1="150" y1="290" x2="138" y2="332" stroke="#003399" stroke-width="9" stroke-linecap="round" class="fp-leg-l"/>
              <line x1="160" y1="290" x2="172" y2="332" stroke="#003399" stroke-width="9" stroke-linecap="round" class="fp-leg-r"/>
              <rect x="138" y="273" width="34" height="20" rx="3" fill="#002277"/>
              <rect x="136" y="228" width="38" height="48" rx="5" fill="#cc0000"/>
              <text x="155" y="257" text-anchor="middle" font-size="14" font-weight="bold" fill="white">7</text>
              <line x1="136" y1="242" x2="112" y2="265" stroke="#cc0000" stroke-width="9" stroke-linecap="round" class="fp-arm-l"/>
              <line x1="174" y1="242" x2="198" y2="265" stroke="#cc0000" stroke-width="9" stroke-linecap="round" class="fp-arm-r"/>
              <rect x="149" y="218" width="12" height="12" rx="3" fill="#ffcc88"/>
              <g class="fp-head-group">
                <circle cx="155" cy="203" r="22" fill="#ffcc88"/>
                <circle cx="148" cy="199" r="3" fill="#333" class="fp-eye-l"/>
                <circle cx="162" cy="199" r="3" fill="#333" class="fp-eye-r"/>
                <path d="M148 210 Q155 215 162 210" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round" class="fp-mouth"/>
                <path d="M133 198 Q135 178 155 177 Q175 178 177 198" fill="#3a1a00"/>
                <g class="fp-stars">
                  <text x="128" y="178" font-size="14" fill="#ffd700">★</text>
                  <text x="153" y="171" font-size="14" fill="#ffaa00">★</text>
                  <text x="178" y="178" font-size="14" fill="#ffd700">★</text>
                </g>
                <g class="fp-dizzy">
                  <circle cx="148" cy="199" r="5" fill="#ff6600" class="fp-dizzy-eye-l"/>
                  <circle cx="162" cy="199" r="5" fill="#ff6600" class="fp-dizzy-eye-r"/>
                  <line x1="145" y1="196" x2="151" y2="202" stroke="white" stroke-width="1.5"/>
                  <line x1="151" y1="196" x2="145" y2="202" stroke="white" stroke-width="1.5"/>
                  <line x1="159" y1="196" x2="165" y2="202" stroke="white" stroke-width="1.5"/>
                  <line x1="165" y1="196" x2="159" y2="202" stroke="white" stroke-width="1.5"/>
                </g>
              </g>
              <circle cx="155" cy="203" r="28" fill="none" stroke="#ffff00" stroke-width="3" class="fp-impact-ring"/>
              <text x="345" y="215" font-size="32" class="fp-ball">⚽</text>
              <rect x="8"   y="350" width="128" height="28" rx="14" fill="rgba(56,191,255,0.15)" stroke="rgba(56,191,255,0.4)" stroke-width="1"/>
              <text x="72"  y="368" text-anchor="middle" font-size="11" font-weight="bold" fill="#38bfff"> Day 7 trap</text>
              <rect x="258" y="14" width="134" height="28" rx="14" fill="rgba(56,191,255,0.15)" stroke="rgba(56,191,255,0.4)" stroke-width="1"/>
              <text x="325" y="32" text-anchor="middle" font-size="11" font-weight="bold" fill="#38bfff">Brain: 30% healed</text>
              <text x="200" y="392" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.35)">click to replay</text>
            </svg>
          </div>

          <div class="fade-up">
            <div class="eyebrow">Why it matters</div>
            <h2 class="section-title" style="font-size:clamp(40px,6vw,72px);line-height:0.95;letter-spacing:-0.03em;margin-bottom:24px;">
              THE<br>COMEBACK<br><span class="always-ice">STARTS HERE.</span>
            </h2>
            <p class="body-text">
              Built for Australian community sport players, parents and coaches.
            </p>
            <router-link to="/iteration3/stagedrecovery">
              <button class="btn-primary" style="margin-top:32px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                Track your recovery
              </button>
            </router-link>
          </div>

        </div>
      </div>
    </section>


  </div>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   All colours are hardcoded below.
   The dark/light toggle on the navbar has zero effect
   on this page.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.always-ice { color: #38bfff !important; }

/* Layout */
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.section    { padding: 96px 24px; }

/* Section backgrounds */
.bg-light   { background: #f0f7ff; }
.bg-lighter { background: #e8f3ff; }
.bg-deep    { background: #0f2040; border-top: 1px solid rgba(255,255,255,0.06); }

/* Scroll animations */
.fade-up { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
.fade-up.visible { opacity: 1; transform: none; }

/* Labels */
.eyebrow       { font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #38bfff; margin-bottom: 16px; display: block; }
.eyebrow-light { color: rgba(56,191,255,0.65); }

/* Section header */
.section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 48px; flex-wrap: wrap; gap: 16px; }
.section-title  { font-size: clamp(28px,4vw,40px); font-weight: 800; color: #0a1628; letter-spacing: -0.03em; }
.section-sub    { font-size: 14px; font-weight: 300; color: #4a6882; max-width: 260px; line-height: 1.6; }
.body-text      { font-size: 16px; font-weight: 300; color: #4a6882; line-height: 1.8; max-width: 460px; }

/* Buttons */
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: #38bfff; color: #07090e;
  font-weight: 700; font-size: 14px; padding: 14px 24px;
  border-radius: 100px; border: none; cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
}
.btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
.btn-large { padding: 18px 36px; font-size: 15px; }

.btn-white {
  display: inline-flex; align-items: center; gap: 8px;
  background: white; color: #0f2040; font-weight: 700; font-size: 14px;
  padding: 14px 24px; border-radius: 100px; border: none;
  cursor: pointer; margin-top: 32px; transition: opacity 0.2s;
}
.btn-white:hover { opacity: 0.9; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HERO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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
  display: flex; align-items: center; gap: 40px; min-height: 100vh;
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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   STATS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.stats-section { background: #e8f3ff; }
.stats-row { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(3,1fr); }
.stat-item { padding: 56px 40px; text-align: center; position: relative; transition: background 0.3s; }
.stat-item:hover { background: #0f1a2e; }
.stat-item:hover .stat-num  { color: #ffffff; }
.stat-item:hover .stat-desc { color: rgba(255,255,255,0.55); }
.stat-item:hover .stat-desc strong { color: #ffffff; }
.stat-item::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: #38bfff; transform: scaleX(0); transform-origin: left;
  transition: transform 0.45s ease;
}
.stat-item:hover::before { transform: scaleX(1); }
.stat-num  { font-size: clamp(56px,8vw,80px); font-weight: 900; letter-spacing: -0.03em; color: #38bfff; display: block; margin-bottom: 12px; line-height: 1; }
.stat-desc { font-size: 13px; font-weight: 300; color: #4a6882; line-height: 1.6; }
.stat-desc strong { display: block; color: #0a1628; font-weight: 600; font-size: 15px; margin-bottom: 4px; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PATH CARDS — white default, dark navy on hover
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.path-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 1px; background: rgba(56,191,255,0.15);
  border-radius: 16px; overflow: hidden;
}
.path-card {
  background: #ffffff; padding: 48px;
  position: relative; overflow: hidden;
  transition: background 0.25s; cursor: pointer;
}
.path-card:hover { background: #0f1a2e; }
.path-card:hover .path-title { color: #ffffff; }
.path-card:hover .path-desc  { color: #6b8aaa; }
.path-card:hover .path-tag   { color: #38bfff; }
.path-card:hover .ghost-num  { color: rgba(255,255,255,0.04); }
.path-card::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
  background: #38bfff; transform: scaleY(0); transform-origin: bottom;
  transition: transform 0.3s ease;
}
.path-card:hover::before { transform: scaleY(1); }
.ghost-num  { position: absolute; right: 28px; bottom: -12px; font-size: 160px; font-weight: 900; color: rgba(0,0,0,0.06); line-height: 1; user-select: none; letter-spacing: -4px; transition: color 0.25s; }
.path-tag   { font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #0099dd; margin-bottom: 20px; transition: color 0.25s; }
.path-title { font-size: 28px; font-weight: 800; color: #0a1628; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 16px; transition: color 0.25s; }
.path-desc  { font-size: 14px; font-weight: 300; color: #4a6882; line-height: 1.75; margin-bottom: 32px; max-width: 380px; transition: color 0.25s; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DAY 7 SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.recovery-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.recovery-title { font-size: clamp(32px,5vw,52px); font-weight: 900; letter-spacing: -0.03em; line-height: 1.05; color: white; margin-bottom: 24px; }
.recovery-body  { font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.6); line-height: 1.75; margin-bottom: 14px; }
.progress-card  { background: rgba(255,255,255,0.06); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; }
.progress-card-label { font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 28px; }
.progress-row   { margin-bottom: 20px; }
.progress-meta  { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.progress-left  { display: flex; align-items: center; gap: 10px; }
.progress-dot   { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.progress-day   { font-size: 14px; font-weight: 600; color: white; }
.progress-label { font-size: 12px; font-weight: 300; color: rgba(255,255,255,0.45); }
.progress-pct   { font-size: 12px; color: rgba(255,255,255,0.35); }
.progress-track { height: 4px; background: rgba(255,255,255,0.07); border-radius: 2px; overflow: hidden; }
.progress-fill  { height: 100%; border-radius: 2px; transition: width 1.3s cubic-bezier(0.22, 1, 0.36, 1); }
.trap-callout   { display: flex; gap: 12px; margin-top: 24px; background: rgba(56,191,255,0.07); border: 1px solid rgba(56,191,255,0.2); border-left: 3px solid #38bfff; border-radius: 10px; padding: 14px 16px; }
.trap-icon      { width: 22px; height: 22px; border-radius: 50%; background: #38bfff; color: #07090e; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.trap-text      { font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.6; }
.trap-text strong { color: #38bfff; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FOOTBALL ANIMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.lottie-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.fp-wrap {
  position: relative; border-radius: 20px; overflow: hidden;
  border: 1px solid rgba(56,191,255,0.15); cursor: pointer; aspect-ratio: 1;
}
.fp-wrap:hover { opacity: 0.95; }
.fp-svg { width: 100%; height: 100%; display: block; }

.fp-active .fp-ball { animation: fpBallFly 5s ease-in-out infinite; }
@keyframes fpBallFly {
  0%, 15%  { transform: translate(0px,   0px)  rotate(0deg);    opacity: 1; }
  35%      { transform: translate(-95px, -18px) rotate(-180deg); opacity: 1; }
  50%      { transform: translate(-196px, 0px)  rotate(-360deg); opacity: 1; }
  54%      { transform: translate(-175px,-30px) rotate(-400deg); opacity: 1; }
  68%      { transform: translate(-20px, -90px) rotate(-540deg); opacity: 0.2; }
  70%, 90% { transform: translate(0px, 0px) rotate(0deg); opacity: 0; }
  100%     { transform: translate(0px, 0px) rotate(0deg); opacity: 1; }
}
.fp-active .fp-head-group { transform-origin: 155px 203px; animation: fpHeadBonk 5s ease-in-out infinite; }
@keyframes fpHeadBonk {
  0%, 48%   { transform: rotate(0deg); }
  50%       { transform: rotate(-28deg); }
  52%       { transform: rotate(22deg); }
  55%       { transform: rotate(-16deg); }
  58%       { transform: rotate(10deg); }
  62%       { transform: rotate(-5deg); }
  67%, 100% { transform: rotate(0deg); }
}
.fp-active .fp-stars { transform-origin: 155px 203px; animation: fpStarOrbit 5s ease-in-out infinite; opacity: 0; }
@keyframes fpStarOrbit {
  0%, 48% { opacity: 0; transform: rotate(0deg) scale(0); }
  50%     { opacity: 1; transform: rotate(0deg) scale(1); }
  60%     { opacity: 1; transform: rotate(120deg) scale(1); }
  70%     { opacity: 0; transform: rotate(240deg) scale(0.5); }
  100%    { opacity: 0; }
}
.fp-active .fp-dizzy { animation: fpDizzy 5s ease-in-out infinite; opacity: 0; }
@keyframes fpDizzy {
  0%, 48%   { opacity: 0; }
  50%, 68%  { opacity: 1; }
  72%, 100% { opacity: 0; }
}
.fp-active .fp-eye-l, .fp-active .fp-eye-r, .fp-active .fp-mouth { animation: fpEyeHide 5s ease-in-out infinite; }
@keyframes fpEyeHide {
  0%, 48%   { opacity: 1; }
  50%, 68%  { opacity: 0; }
  72%, 100% { opacity: 1; }
}
.fp-active .fp-impact-ring { transform-origin: 155px 203px; animation: fpImpactRing 5s ease-in-out infinite; opacity: 0; }
@keyframes fpImpactRing {
  0%, 48% { transform: scale(0); opacity: 0; }
  50%     { transform: scale(1);   opacity: 1; }
  57%     { transform: scale(2.8); opacity: 0; }
  100%    { transform: scale(0);   opacity: 0; }
}
.fp-active .fp-leg-l { transform-origin: 150px 290px; animation: fpLegStagger 5s ease-in-out infinite; }
@keyframes fpLegStagger {
  0%, 48%   { transform: rotate(0deg); }
  50%, 66%  { transform: rotate(-12deg); }
  70%, 100% { transform: rotate(0deg); }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.cta-section { background: #07090e; padding: 112px 24px; }
.cta-inner   { text-align: center; }
.cta-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.28); margin-bottom: 32px; }
.cta-title   { font-size: clamp(56px,12vw,130px); font-weight: 900; letter-spacing: -0.04em; line-height: 0.9; color: white; margin-bottom: 24px; }
.cta-sub     { font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.4); margin-bottom: 48px; }
.cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
</style>
