<script setup>
import router from '@/router'
import { ref } from 'vue'

const isMenuOpen = ref(false)
</script>

<template>
  <nav class="nav-base">
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

        </div>

        <!-- Mobile hamburger -->
        <button class="md:hidden p-2 text-black"
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
        class="md:hidden py-4 px-2 space-y-1 border-t border-black/10">

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

      </div>

    </div>
  </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap');

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Always white — toggle removed, no dark mode
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.nav-base {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(0, 100, 200, 0.10);
}

/* Logo */
.logo-link   { text-decoration: none; }
.logo-text   { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 3px; color: #0a1628; }
.logo-accent { color: #38bfff; }

/* Nav links */
.nav-link {
  font-size: 15px;
  font-weight: 600;
  padding: 7px 14px;
  border-radius: 6px;
  text-decoration: none;
  color: #0a1628;
  transition: color 0.2s;
}
.nav-link:hover  { color: #38bfff; }
.nav-link-active { color: #38bfff !important; }

/* Mobile links */
.mobile-link {
  display: block;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  color: #0a1628;
  transition: color 0.2s, background 0.2s;
}
.mobile-link:hover  { background: rgba(0, 0, 0, 0.04); }
.mobile-link-active { color: #38bfff !important; }
</style>
