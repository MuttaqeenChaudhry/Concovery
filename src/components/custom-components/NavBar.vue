<script setup>
import router from '@/router'
import { ref, onMounted } from 'vue'

const isMenuOpen = ref(false)
const isDark      = ref(true)   // default is dark mode

// On mount, check if user had a saved preference from last visit
onMounted(() => {
  const saved = localStorage.getItem('concovery-theme')
  if (saved === 'light') {
    isDark.value = false
    document.body.classList.add('light')
  }
})

// Toggle between dark and light mode
function toggleTheme() {
  isDark.value = !isDark.value
  document.body.classList.toggle('light', !isDark.value)
  localStorage.setItem('concovery-theme', isDark.value ? 'dark' : 'light')
}
</script>

<template>
  <nav :class="isDark ? 'nav-dark' : 'nav-light'" class="nav-base">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">

        <!-- Logo -->
        <router-link to="/" class="logo-link">
          <span class="logo-text">
            CON<span class="logo-accent">COVERY</span>
          </span>
        </router-link>

        <!-- Desktop nav links -->
        <div class="hidden md:flex items-center gap-1">

          <router-link to="/" class="nav-link"
            :class="{ 'nav-link-active': router.currentRoute.value.path === '/' }">
            Home
          </router-link>

          <router-link to="/iteration3/stagedrecovery" class="nav-link"
            :class="{ 'nav-link-active': router.currentRoute.value.path === '/iteration3/stagedrecovery' }">
            My Recovery
          </router-link>

          <router-link to="/exploredata" class="nav-link"
            :class="{ 'nav-link-active': router.currentRoute.value.path === '/exploredata' }">
            Know Your Risk
          </router-link>

          <!-- CTA pill button -->
          <router-link to="/locatesupport" class="nav-cta"
            :class="router.currentRoute.value.path === '/locatesupport' ? 'nav-cta-active' : ''">
            I had a knock
          </router-link>

          <router-link to="/crtresources" class="nav-link"
            :class="{ 'nav-link-active': router.currentRoute.value.path === '/crtresources' }">
            Resources
          </router-link>

          <!-- Dark / Light toggle -->
          <div class="theme-toggle" @click="toggleTheme">
            <span class="toggle-label">{{ isDark ? 'Dark' : 'Light' }}</span>
            <div class="toggle-track" :class="{ 'toggle-track-light': !isDark }">
              <!-- Moon icon shows in dark mode, sun shows in light mode -->
              <span class="toggle-icon toggle-icon-moon">🌙</span>
              <span class="toggle-icon toggle-icon-sun">☀️</span>
              <div class="toggle-thumb" :class="{ 'toggle-thumb-right': !isDark }" />
            </div>
          </div>

        </div>

        <!-- Mobile hamburger -->
        <button class="md:hidden p-2" :class="isDark ? 'text-white' : 'text-[#0a1628]'"
          aria-label="Toggle menu" @click="isMenuOpen = !isMenuOpen">
          <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" x2="20" y1="12" y2="12"/>
            <line x1="4" x2="20" y1="6"  y2="6"/>
            <line x1="4" x2="20" y1="18" y2="18"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>

      </div>

      <!-- Mobile menu -->
      <div v-if="isMenuOpen"
        class="md:hidden py-4 px-2 space-y-1 border-t"
        :class="isDark ? 'border-white/10' : 'border-black/10'"
      >
        <router-link @click="isMenuOpen = false" to="/"
          class="mobile-link" :class="{ 'mobile-link-active': router.currentRoute.value.path === '/' }">
          Home
        </router-link>
        <router-link @click="isMenuOpen = false" to="/iteration3/stagedrecovery"
          class="mobile-link" :class="{ 'mobile-link-active': router.currentRoute.value.path === '/iteration3/stagedrecovery' }">
          My Recovery
        </router-link>
        <router-link @click="isMenuOpen = false" to="/exploredata"
          class="mobile-link" :class="{ 'mobile-link-active': router.currentRoute.value.path === '/exploredata' }">
          Know Your Risk
        </router-link>
        <router-link @click="isMenuOpen = false" to="/locatesupport"
          class="mobile-link" :class="{ 'mobile-link-active': router.currentRoute.value.path === '/locatesupport' }">
          I had a knock
        </router-link>
        <router-link @click="isMenuOpen = false" to="/crtresources"
          class="mobile-link" :class="{ 'mobile-link-active': router.currentRoute.value.path === '/crtresources' }">
          Resources
        </router-link>

        <!-- Toggle in mobile menu too -->
        <div class="mobile-link cursor-pointer" @click="toggleTheme">
          {{ isDark ? '☀️ Switch to Light' : '🌙 Switch to Dark' }}
        </div>
      </div>

    </div>
  </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap');

/* ── Base nav shell ───────────────────────── */
.nav-base {
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background 0.35s ease, border-color 0.35s ease;
}

/* Dark mode nav */
.nav-dark {
  background: rgba(7, 9, 14, 0.92);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(56, 191, 255, 0.10);
}

/* Light mode nav */
.nav-light {
  background: rgba(237, 246, 255, 0.92);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(0, 100, 200, 0.12);
}

/* ── Logo ─────────────────────────────────── */
.logo-link { text-decoration: none; }

.logo-text {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 24px;
  letter-spacing: 3px;
  color: white;
}

/* Dark mode: white + ice blue */
.nav-dark  .logo-text { color: #ffffff; }
.nav-light .logo-text { color: #0a1628; }

.logo-accent { color: #38bfff; }

/* ── Nav links ────────────────────────────── */
.nav-link {
  font-size: 13px;
  font-weight: 500;
  padding: 7px 14px;
  border-radius: 6px;
  text-decoration: none;
  letter-spacing: 0.2px;
  transition: color 0.2s;
}

.nav-dark  .nav-link { color: #6b8aaa; }
.nav-light .nav-link { color: #4a6882; }

.nav-dark  .nav-link:hover { color: #ffffff; }
.nav-light .nav-link:hover { color: #0a1628; }

.nav-link-active {
  color: #38bfff !important;
}

/* ── CTA pill ─────────────────────────────── */
.nav-cta {
  font-size: 13px;
  font-weight: 600;
  padding: 8px 18px;
  border-radius: 8px;
  text-decoration: none;
  background: #38bfff;
  color: #07090e;
  transition: opacity 0.2s, transform 0.15s;
}
.nav-cta:hover { opacity: 0.88; transform: translateY(-1px); }
.nav-cta-active { opacity: 0.9; }

/* ── Theme toggle ─────────────────────────── */
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;
  padding-left: 12px;
  border-left: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
  user-select: none;
}

.nav-light .theme-toggle { border-left-color: rgba(0,0,0,0.1); }

.toggle-label {
  font-size: 12px;
  font-weight: 500;
  transition: color 0.3s;
}
.nav-dark  .toggle-label { color: #6b8aaa; }
.nav-light .toggle-label { color: #4a6882; }

/* The pill track */
.toggle-track {
  position: relative;
  width: 48px;
  height: 26px;
  border-radius: 13px;
  background: #1a2540;
  border: 1px solid rgba(56,191,255,0.2);
  transition: background 0.3s, border-color 0.3s;
  flex-shrink: 0;
}
.toggle-track-light {
  background: #38bfff;
  border-color: #38bfff;
}

/* Moon and sun icons inside the track */
.toggle-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  line-height: 1;
  pointer-events: none;
  transition: opacity 0.2s;
}
.toggle-icon-moon { left: 5px;  opacity: 1; }
.toggle-icon-sun  { right: 5px; opacity: 0; }

/* Swap which icon shows based on mode */
.toggle-track-light .toggle-icon-moon { opacity: 0; }
.toggle-track-light .toggle-icon-sun  { opacity: 1; }

/* Sliding knob */
.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toggle-thumb-right { transform: translateX(22px); background: #07090e; }

/* ── Mobile links ─────────────────────────── */
.mobile-link {
  display: block;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s, background 0.2s;
}
.nav-dark  .mobile-link { color: #6b8aaa; }
.nav-light .mobile-link { color: #4a6882; }

.nav-dark  .mobile-link:hover { color: white;   background: rgba(255,255,255,0.05); }
.nav-light .mobile-link:hover { color: #0a1628; background: rgba(0,0,0,0.05); }

.mobile-link-active { color: #38bfff !important; }
</style>
