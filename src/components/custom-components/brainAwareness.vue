<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Sport data — hardcoded from AIHW 2023-24
// rate = hospitalisations per 100,000 participants
// null means participation data wasn't available to calculate a rate
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

// Highest rate — used to scale the bar widths proportionally
const maxRate = ref(
  Math.max(...sports.value.filter(s => s.rate !== null).map(s => s.rate as number))
)

function selectSport(sport: typeof sports.value[0]) {
  selectedSport.value = sport
}

// Returns the ranking of a sport by rate (1 = highest risk)
function getRank(sport: typeof sports.value[0]) {
  const ranked = [...sports.value]
    .filter(s => s.rate !== null)
    .sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0))
  return ranked.findIndex(s => s.name === sport.name) + 1
}

// Trigger fade-up animations when sections scroll into view
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    },
    { threshold: 0.1 }
  )
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))
})
</script>

<template>
  <div>

    <!-- ════════════════════════════════════════
         HERO — dark background, athlete image
    ════════════════════════════════════════ -->
    <section class="hero-section">

      <!-- Athlete photo — sits behind everything -->
      <div class="hero-backdrop" />

      <!-- Dark gradient overlay so text stays readable -->
      <div class="hero-overlay" />

      <!-- Moving diagonal lines — subtle athletic feel -->
      <div class="hero-lines" />

      <!-- Left edge accent bar -->
      <div class="hero-edge-bar" />

      <!-- Main content -->
      <div class="hero-content">
        <div class="hero-inner">

          <!-- "Australian Community Sport" badge -->
          <div class="hero-badge">
            <span class="badge-dot" />
            <span>Australian Community Sport</span>
          </div>

          <!-- Big headline — Bebas Neue, same wording as before -->
          <h1 class="hero-title">CONCOVERY</h1>

          <!-- Tagline — always white, light mode or dark -->
          <p class="hero-tagline">
            Play hard. <span class="recover-text">Recover</span> smart. Come back stronger.
          </p>

          <!-- Sub text -->
          <p class="hero-sub">
            Concussion awareness for Victorian community sport players, parents and coaches.
            Real AIHW data. Actual science. No guessing.
          </p>

          <!-- CTA buttons -->
          <div class="hero-actions">
            <router-link to="/exploredata">
              <button class="btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6"  y1="20" x2="6"  y2="14"/>
                </svg>
                Check my sport's risk
              </button>
            </router-link>

            <router-link to="/iteration3/stagedrecovery">
              <button class="btn-ghost">I recently had a knock</button>
            </router-link>
          </div>

        </div>
      </div>

      <!-- EKG heartbeat line at the bottom of the hero -->
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


    <!-- ════════════════════════════════════════
         STATS — three key numbers
    ════════════════════════════════════════ -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">

          <div class="stat-item">
            <div class="stat-number">21</div>
            <div class="stat-divider" />
            <p class="stat-label">Days minimum brain recovery — not symptoms, actual healing</p>
          </div>

          <div class="stat-item stat-item--bordered">
            <div class="stat-number">80%</div>
            <div class="stat-divider" />
            <p class="stat-label">Of community sport players return before their brain has healed</p>
          </div>

          <div class="stat-item">
            <div class="stat-number">5×</div>
            <div class="stat-divider" />
            <p class="stat-label">Higher re-injury risk when returning during the recovery window</p>
          </div>

        </div>
      </div>
    </section>


    <!-- ════════════════════════════════════════
         TWO PATH FORK — where are you right now
    ════════════════════════════════════════ -->
    <section class="paths-section fade-up">
      <div class="container">

        <span class="eyebrow">Get Started</span>
        <div class="section-header">
          <h2 class="section-title">Where are you right now?</h2>
          <p class="section-sub">Concovery works for both — choose your starting point.</p>
        </div>

        <div class="paths-grid">

          <!-- Card 1 — Recovery -->
          <div class="path-card">
            <span class="ghost-number">01</span>
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
                  fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </button>
            </router-link>
          </div>

          <!-- Card 2 — Risk data -->
          <div class="path-card">
            <span class="ghost-number">02</span>
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
                  fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </button>
            </router-link>
          </div>

        </div>
      </div>
    </section>


    <!-- ════════════════════════════════════════
         SPORT CHART — interactive bar chart
    ════════════════════════════════════════ -->
    <section class="chart-section fade-up">
      <div class="container">

        <span class="eyebrow">Your Sport</span>
        <div class="section-header">
          <h2 class="section-title">Real numbers. No filter.</h2>
          <span class="data-source">AIHW Sports Injury in Australia 2023–24</span>
        </div>

        <div class="chart-grid">

          <!-- Bar chart panel -->
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
                :class="{ 'chart-row--active': selectedSport.name === sport.name }"
                @click="selectSport(sport)"
              >
                <span class="chart-row-label">{{ sport.name }}</span>

                <div class="chart-row-track">
                  <div
                    class="chart-row-fill"
                    :style="{
                      width: sport.rate ? `${(sport.rate / maxRate) * 100}%` : '4%',
                      background: selectedSport.name === sport.name ? '#38bfff' : 'rgba(255,255,255,0.18)'
                    }"
                  />
                </div>

                <span class="chart-row-value">
                  {{ sport.rate ? Math.round(sport.rate) : '–' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Selected sport detail panel -->
          <div class="detail-panel">

            <div class="detail-rank">
              <div class="detail-rank-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="#38bfff" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                </svg>
              </div>
              <span class="detail-rank-text">
                #{{ getRank(selectedSport) }} of {{ sports.filter(s => s.rate).length }} sports
              </span>
            </div>

            <h3 class="detail-sport-name">{{ selectedSport.name }}</h3>

            <div class="detail-big-number">
              {{ selectedSport.rate ? Math.round(selectedSport.rate) : selectedSport.count }}
            </div>
            <p class="detail-big-label">
              {{ selectedSport.rate
                ? 'hospitalisations per 100,000 participants'
                : 'total hospitalisations (rate unavailable)' }}
            </p>

            <div class="detail-tips">
              <div class="detail-tips-heading">What smart players do</div>
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
                <div class="tip-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24"
                    fill="none" stroke="white" stroke-width="3"
                    stroke-linecap="round" stroke-linejoin="round">
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


    <!-- ════════════════════════════════════════
         DAY 7 TRAP — the recovery window explainer
    ════════════════════════════════════════ -->
    <section class="recovery-section fade-up">
      <div class="container">
        <div class="recovery-grid">

          <!-- Left — text content -->
          <div class="recovery-left">
            <div class="eyebrow eyebrow--light">The thing your coach never told you</div>

            <h2 class="recovery-title">
              Day 7 feels fine.<br>
              <span class="recover-text">Day 21 is ready.</span>
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
                  fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </button>
            </router-link>
          </div>

          <!-- Right — progress card -->
          <div class="progress-card">
            <div class="progress-card-label">Brain Recovery Progress</div>

            <div class="progress-rows">
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
                <div class="progress-row-meta">
                  <div class="progress-row-left">
                    <span class="progress-dot" :style="{ background: item.color }" />
                    <span class="progress-day">{{ item.day }}</span>
                    <span class="progress-label">{{ item.label }}</span>
                  </div>
                  <span class="progress-pct">{{ item.pct }}%</span>
                </div>
                <div class="progress-track">
                  <div
                    class="progress-fill"
                    :style="{ width: `${item.pct}%`, background: item.color }"
                  />
                </div>
              </div>
            </div>

            <!-- Day 7 trap callout -->
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


    <!-- ════════════════════════════════════════
         FINAL CTA
    ════════════════════════════════════════ -->
    <section class="cta-section fade-up">
      <div class="container cta-inner">

        <div class="cta-eyebrow">Free · No sign-up · Built for Victorian community sport</div>

        <h2 class="cta-title">
          THE<br>COMEBACK<br>
          <span class="recover-text">STARTS HERE.</span>
        </h2>

        <p class="cta-sub">Built for Australian community sport players, parents and coaches.</p>

        <div class="cta-actions">
          <router-link to="/exploredata">
            <button class="btn-primary btn-primary--large">Check my sport</button>
          </router-link>
          <router-link to="/iteration3/stagedrecovery">
            <button class="btn-ghost btn-ghost--large">
              Start recovery plan
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
          </router-link>
        </div>

      </div>
    </section>

  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════
   DESIGN TOKENS
   Ice blue theme — dark by default
   Light mode applies when <body class="light">
═══════════════════════════════════════════ */
:root {
  --ice:        #38bfff;
  --ice-dim:    #0099dd;
  --black:      #07090e;
  --surface:    #0b1220;
  --card:       #0f1a2e;
  --border:     rgba(56,191,255,0.10);
  --border-hi:  rgba(56,191,255,0.25);
  --white:      #ffffff;
  --muted:      #6b8aaa;
}

/* ── Utility ──────────────────────────────── */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* "RECOVER" — always ice blue, both modes */
.recover-text { color: #38bfff !important; }

/* ── Scroll fade-up ────────────────────────── */
.fade-up {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.fade-up.visible { opacity: 1; transform: none; }

/* ── Eyebrow label ─────────────────────────── */
.eyebrow {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--ice);
  margin-bottom: 16px;
}
.eyebrow--light { color: rgba(56,191,255,0.7); }

/* ── Section header ────────────────────────── */
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 48px;
  flex-wrap: wrap;
  gap: 16px;
}
.section-title {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  color: var(--white);
  letter-spacing: -0.03em;
}
.section-sub {
  font-size: 14px;
  font-weight: 300;
  color: var(--muted);
  max-width: 280px;
  line-height: 1.6;
}
.data-source {
  font-size: 11px;
  color: var(--muted);
}

/* ── Buttons ────────────────────────────────── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--ice);
  color: #07090e;
  font-weight: 700;
  font-size: 14px;
  padding: 14px 24px;
  border-radius: 100px;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
}
.btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
.btn-primary--large { padding: 18px 36px; font-size: 15px; }

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: rgba(255,255,255,0.65);
  font-weight: 600;
  font-size: 14px;
  padding: 14px 24px;
  border-radius: 100px;
  border: 1px solid rgba(255,255,255,0.2);
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}
.btn-ghost:hover { color: white; border-color: rgba(255,255,255,0.4); }
.btn-ghost--large { padding: 18px 36px; font-size: 15px; }

.btn-white {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: #0f1a2e;
  font-weight: 700;
  font-size: 14px;
  padding: 14px 24px;
  border-radius: 100px;
  border: none;
  cursor: pointer;
  margin-top: 32px;
  transition: opacity 0.2s;
}
.btn-white:hover { opacity: 0.9; }

/* ════════════════════════════════════════════
   HERO
════════════════════════════════════════════ */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: #07090e;
}

.hero-backdrop {
  position: absolute;
  inset: 0;
  background-image: url('/bg_image2.png');
  background-size: cover;
  background-position: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    rgba(7,9,14,0.97) 42%,
    rgba(7,9,14,0.65) 68%,
    rgba(7,9,14,0.25) 100%
  );
}

/* Moving diagonal speed lines */
.hero-lines {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.hero-lines::before {
  content: '';
  position: absolute;
  top: -200%; left: -50%;
  width: 200%; height: 400%;
  background-image: repeating-linear-gradient(
    -65deg,
    transparent, transparent 80px,
    rgba(56,191,255,0.025) 80px, rgba(56,191,255,0.025) 81px
  );
  animation: linesDrift 22s linear infinite;
}
@keyframes linesDrift {
  from { transform: translateX(0); }
  to   { transform: translateX(81px); }
}

/* Left ice-blue accent bar */
.hero-edge-bar {
  position: absolute;
  left: 0; top: 20%; bottom: 20%;
  width: 3px;
  background: linear-gradient(to bottom, transparent, #38bfff 40%, #38bfff 60%, transparent);
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
  width: 100%;
  padding: 0 24px;
}
.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 140px 0 100px;
  max-width: 680px;
}

/* Badge */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 100px;
  padding: 6px 16px;
  margin-bottom: 28px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
}
.badge-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #38bfff;
  animation: blink 2s infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

/* Hero title — always white, always massive */
.hero-title {
  font-size: clamp(72px, 13vw, 148px);
  font-weight: 900;
  line-height: 0.88;
  letter-spacing: -0.03em;
  color: white;
  margin-bottom: 16px;
}

/* Tagline — always white text with ice blue on "Recover" */
.hero-tagline {
  font-size: clamp(18px, 2.5vw, 26px);
  font-weight: 600;
  color: white;
  margin-bottom: 16px;
  line-height: 1.3;
}

.hero-sub {
  font-size: 16px;
  font-weight: 300;
  color: rgba(255,255,255,0.5);
  max-width: 440px;
  line-height: 1.75;
  margin-bottom: 40px;
}

.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

/* EKG line */
.hero-ekg {
  position: absolute;
  bottom: 60px; left: 80px; right: 80px;
  z-index: 3;
  height: 56px;
  overflow: hidden;
  opacity: 0.28;
}
.ekg-svg {
  width: 200%; height: 100%;
  animation: ekgScroll 3s linear infinite;
}
@keyframes ekgScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ════════════════════════════════════════════
   STATS
════════════════════════════════════════════ */
.stats-section {
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 0 24px;
}
.stats-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.stat-item {
  padding: 56px 40px;
  text-align: center;
  position: relative;
}
.stat-item--bordered {
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
}
.stat-number {
  font-size: clamp(56px, 8vw, 80px);
  font-weight: 900;
  letter-spacing: -0.03em;
  color: var(--ice);
  margin-bottom: 12px;
  line-height: 1;
}
.stat-divider {
  width: 32px; height: 2px;
  background: var(--ice);
  margin: 0 auto 14px;
}
.stat-label {
  font-size: 13px;
  font-weight: 300;
  color: var(--muted);
  line-height: 1.6;
  max-width: 160px;
  margin: 0 auto;
}

/* ════════════════════════════════════════════
   PATHS (where are you right now)
════════════════════════════════════════════ */
.paths-section { background: var(--black); padding: 96px 24px; }
.paths-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: var(--border);
  border-radius: 16px;
  overflow: hidden;
}
.path-card {
  background: var(--card);
  padding: 48px;
  position: relative;
  overflow: hidden;
  transition: background 0.2s;
}
.path-card:hover { background: #131e35; }
.path-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--ice);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.3s ease;
}
.path-card:hover::before { transform: scaleY(1); }

.ghost-number {
  position: absolute;
  right: 28px; bottom: -12px;
  font-size: 160px;
  font-weight: 900;
  color: rgba(255,255,255,0.03);
  line-height: 1;
  user-select: none;
  letter-spacing: -4px;
}
.path-tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--ice);
  margin-bottom: 20px;
}
.path-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--white);
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 16px;
}
.path-desc {
  font-size: 14px;
  font-weight: 300;
  color: var(--muted);
  line-height: 1.75;
  margin-bottom: 32px;
  max-width: 380px;
}

/* ════════════════════════════════════════════
   CHART
════════════════════════════════════════════ */
.chart-section { background: var(--surface); padding: 96px 24px; }
.chart-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

/* Bar chart panel */
.chart-panel {
  background: #07090e;
  border-radius: 16px;
  padding: 24px;
}
.chart-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 11px;
  color: rgba(255,255,255,0.35);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.chart-bars { display: flex; flex-direction: column; gap: 12px; }
.chart-row {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}
.chart-row-label {
  font-size: 12px;
  width: 128px;
  flex-shrink: 0;
  color: rgba(255,255,255,0.45);
  truncate: true;
  transition: color 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chart-row--active .chart-row-label { color: white; font-weight: 500; }
.chart-row:hover .chart-row-label   { color: rgba(255,255,255,0.75); }

.chart-row-track {
  flex: 1;
  background: rgba(255,255,255,0.05);
  border-radius: 100px;
  height: 8px;
  overflow: hidden;
}
.chart-row-fill {
  height: 100%;
  border-radius: 100px;
  transition: width 0.5s ease, background 0.3s;
}
.chart-row-value {
  font-size: 12px;
  width: 28px;
  text-align: right;
  color: rgba(255,255,255,0.5);
}
.chart-row--active .chart-row-value { color: white; font-weight: 600; }

/* Detail panel */
.detail-panel {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
}
.detail-rank {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.detail-rank-icon {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: rgba(56,191,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.detail-rank-text { font-size: 12px; color: var(--muted); }
.detail-sport-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 16px;
}
.detail-big-number {
  font-size: 64px;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: var(--ice);
  line-height: 1;
  margin-bottom: 6px;
}
.detail-big-label {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 24px;
}
.detail-tips {
  border-top: 1px solid var(--border);
  padding-top: 20px;
}
.detail-tips-heading {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--white);
  margin-bottom: 12px;
}
.tip-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}
.tip-icon {
  width: 16px; height: 16px;
  border-radius: 50%;
  background: #1b7c3d;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
.tip-text { font-size: 12px; color: var(--muted); line-height: 1.5; }
.detail-source { font-size: 11px; color: var(--muted); margin-top: 16px; }

/* ════════════════════════════════════════════
   RECOVERY / DAY 7 TRAP
════════════════════════════════════════════ */
.recovery-section {
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 96px 24px;
}
.recovery-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}
.recovery-title {
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: white;
  margin-bottom: 24px;
}
.recovery-body {
  font-size: 15px;
  font-weight: 300;
  color: rgba(255,255,255,0.6);
  line-height: 1.75;
  margin-bottom: 14px;
}

/* Progress card */
.progress-card {
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 32px;
}
.progress-card-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  margin-bottom: 28px;
}
.progress-rows { display: flex; flex-direction: column; gap: 20px; }
.progress-row {}
.progress-row-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.progress-row-left { display: flex; align-items: center; gap: 10px; }
.progress-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.progress-day { font-size: 14px; font-weight: 600; color: white; }
.progress-label { font-size: 12px; font-weight: 300; color: rgba(255,255,255,0.45); }
.progress-pct { font-size: 12px; color: rgba(255,255,255,0.35); }
.progress-track {
  height: 4px;
  background: rgba(255,255,255,0.07);
  border-radius: 2px;
  overflow: hidden;
}
.progress-fill { height: 100%; border-radius: 2px; }

.trap-callout {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  background: rgba(56,191,255,0.07);
  border: 1px solid rgba(56,191,255,0.2);
  border-left: 3px solid #38bfff;
  border-radius: 10px;
  padding: 14px 16px;
}
.trap-icon {
  width: 22px; height: 22px;
  border-radius: 50%;
  background: #38bfff;
  color: #07090e;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.trap-text { font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.6; }
.trap-text strong { color: #38bfff; }

/* ════════════════════════════════════════════
   FINAL CTA
════════════════════════════════════════════ */
.cta-section { background: #07090e; padding: 112px 24px; }
.cta-inner { text-align: center; }
.cta-eyebrow {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.28);
  margin-bottom: 32px;
}
.cta-title {
  font-size: clamp(56px, 12vw, 130px);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 0.9;
  color: white;
  margin-bottom: 24px;
}
.cta-sub {
  font-size: 15px;
  font-weight: 300;
  color: rgba(255,255,255,0.4);
  margin-bottom: 48px;
}
.cta-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* ════════════════════════════════════════════
   LIGHT MODE OVERRIDES
   Applied when <body class="light"> is set
   by the navbar toggle
════════════════════════════════════════════ */
:global(body.light) .stats-section,
:global(body.light) .paths-section,
:global(body.light) .chart-section,
:global(body.light) .recovery-section { background: #f5f9ff; }

:global(body.light) .section-title { color: #0a1628; }
:global(body.light) .section-sub   { color: #4a6882; }
:global(body.light) .stat-label    { color: #4a6882; }

:global(body.light) .path-card { background: #ffffff; border: 1px solid rgba(56,191,255,0.12); }
:global(body.light) .path-card:hover { background: #eef6ff; }
:global(body.light) .path-title { color: #0a1628; }
:global(body.light) .path-desc  { color: #4a6882; }

:global(body.light) .detail-panel { background: #ffffff; border-color: rgba(56,191,255,0.15); }
:global(body.light) .detail-sport-name { color: #0a1628; }
:global(body.light) .detail-big-label  { color: #4a6882; }
:global(body.light) .detail-tips-heading { color: #0a1628; }
:global(body.light) .tip-text           { color: #4a6882; }

/* Hero, recovery section, CTA stay dark — they're photo/dark backgrounds intentionally */
:global(body.light) .hero-section    { background: #07090e; }
:global(body.light) .recovery-section { background: #0f2040; }
:global(body.light) .cta-section     { background: #07090e; }
</style>
