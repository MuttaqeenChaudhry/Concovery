<script setup>
import router from '@/router'
import { ref, onMounted } from 'vue'

const isMenuOpen = ref(false)
const isDark      = ref(true)

onMounted(() => {
  const saved = localStorage.getItem('concovery-theme')
  if (saved === 'light') {
    isDark.value = false
    document.body.classList.add('light')
  }
})

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
          <span class="logo-text">CON<span class="logo-accent">COVERY</span></span>
        </router-link>

        <!-- Desktop links -->
        <div class="hidden md:flex items-center gap-2">

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

          <router-link to="/locatesupport" class="nav-link"
            :class="{ 'nav-link-active': router.currentRoute.value.path === '/locatesupport' }">
            I had a knock
          </router-link>

          <router-link to="/crtresources" class="nav-link"
            :class="{ 'nav-link-active': router.currentRoute.value.path === '/crtresources' }">
            Resources
          </router-link>

          <!-- Dark / Light toggle -->
          <div class="theme-toggle" @click="toggleTheme">
  <span class="toggle-label">{{ isDark ? 'Dark' : 'Light' }}</span>
  <span class="toggle-emoji">{{ isDark ? '☀️' : '🌙' }}</span>
  <div class="toggle-track" :class="{ 'toggle-track-light': !isDark }">
    <div class="toggle-thumb" :class="{ 'toggle-thumb-right': !isDark }" />
  </div>
</div>
          </div>

        </div>

        <!-- Mobile hamburger -->
        <button class="md:hidden p-2"
          :class="isDark ? 'text-white' : 'text-black'"
          aria-label="Toggle menu"
          @click="isMenuOpen = !isMenuOpen">
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

      <!-- Mobile dropdown -->
      <div v-if="isMenuOpen"
        class="md:hidden py-4 px-2 space-y-1 border-t"
        :class="isDark ? 'border-white/10' : 'border-black/10'">

        <router-link @click="isMenuOpen = false" to="/"
          class="mobile-link"
          :class="{ 'mobile-link-active': router.currentRoute.value.path === '/' }">
          Home
        </router-link>
        <router-link @click="isMenuOpen = false" to="/iteration3/stagedrecovery"
          class="mobile-link"
          :class="{ 'mobile-link-active': router.currentRoute.value.path === '/iteration3/stagedrecovery' }">
          My Recovery
        </router-link>
        <router-link @click="isMenuOpen = false" to="/exploredata"
          class="mobile-link"
          :class="{ 'mobile-link-active': router.currentRoute.value.path === '/exploredata' }">
          Know Your Risk
        </router-link>
        <router-link @click="isMenuOpen = false" to="/locatesupport"
          class="mobile-link"
          :class="{ 'mobile-link-active': router.currentRoute.value.path === '/locatesupport' }">
          I had a knock
        </router-link>
        <router-link @click="isMenuOpen = false" to="/crtresources"
          class="mobile-link"
          :class="{ 'mobile-link-active': router.currentRoute.value.path === '/crtresources' }">
          Resources
        </router-link>

        <div class="mobile-link cursor-pointer" @click="toggleTheme">
          {{ isDark ? '☀️ Switch to Light' : '🌙 Switch to Dark' }}
        </div>
      </div>


  </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap');

.nav-base {
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background 0.35s ease, border-color 0.35s ease;
}

.nav-dark {
  background: rgba(7, 9, 14, 0.92);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(56, 191, 255, 0.10);
}

.nav-light {
  background: rgba(237, 246, 255, 0.92);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(0, 100, 200, 0.12);
}

/* Logo */
.logo-link   { text-decoration: none; }
.logo-text   { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 3px; }
.logo-accent { color: #38bfff; }

.nav-dark  .logo-text { color: #ffffff; }
.nav-light .logo-text { color: #0a1628; }

/* Nav links — all treated the same, including "I had a knock" */
.nav-link {
  font-size: 15px;
  font-weight: 600;
  padding: 7px 14px;
  border-radius: 6px;
  text-decoration: none;
  transition: color 0.2s;
}

/* Dark mode: white text, hover stays white */
.nav-dark .nav-link         { color: #ffffff; }
.nav-dark .nav-link:hover   { color: #38bfff; }

/* Light mode: black text, hover turns ice blue */
.nav-light .nav-link        { color: #000000; }
.nav-light .nav-link:hover  { color: #38bfff; }

/* Active page — always ice blue regardless of mode */
.nav-link-active { color: #38bfff !important; }

/* Theme toggle */
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
  font-size: 13px;
  font-weight: 500;
}
.nav-dark  .toggle-label { color: #ffffff; }
.nav-light .toggle-label { color: #000000; }

.toggle-track {
  position: relative;
  width: 48px;
  height: 26px;
  border-radius: 13px;
  background: #1a2540;
  border: 1px solid rgba(56,191,255,0.2);
  transition: background 0.3s;
  flex-shrink: 0;
}
.toggle-track-light { background: #38bfff; border-color: #38bfff; }

.toggle-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  pointer-events: none;
  transition: opacity 0.2s;
}

.toggle-emoji {
  font-size: 14px;
  line-height: 1;
}


.toggle-thumb {
  position: absolute;
  top: 3px; left: 3px;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toggle-thumb-right { transform: translateX(22px); background: #07090e; }

/* Mobile links */
.mobile-link {
  display: block;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s, background 0.2s;
}
.nav-dark  .mobile-link       { color: #ffffff; }
.nav-light .mobile-link       { color: #000000; }
.nav-dark  .mobile-link:hover { background: rgba(255,255,255,0.05); }
.nav-light .mobile-link:hover { background: rgba(0,0,0,0.05); }
.mobile-link-active           { color: #38bfff !important; }
</style>
