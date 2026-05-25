<script setup>
import router from '@/router'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMenuOpen = ref(false)
const scrolled = ref(false)

function handleScroll() {
  scrolled.value = window.scrollY > 10
}

watch(() => route.path, () => {
  isMenuOpen.value = false
})

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <nav
    class="bg-white/80 backdrop-blur-xl border-b sticky top-0 z-50 transition-shadow duration-300"
    :class="scrolled ? 'border-[#d2d2d7]/50 shadow-md' : 'border-transparent'"
  >
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">

        <!-- Logo -->
        <router-link class="flex items-center" to="/">
          <span class="text-2xl font-semibold text-[#1d1d1f]">Con<span class="text-[#007aff]">covery</span></span>
        </router-link>

        <!-- Desktop nav -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            to="/"
            class="transition-colors hover:text-[#007aff] font-semibold"
            :class="router.currentRoute.value.path === '/' ? 'text-[#007aff]' : 'text-black'"
          >Home</router-link>

          <router-link
            to="/iteration3/stagedrecovery"
            class="transition-colors hover:text-[#007aff] font-semibold"
            :class="router.currentRoute.value.path === '/iteration3/stagedrecovery' ? 'text-[#007aff]' : 'text-black'"
          >My Recovery</router-link>

          <router-link
            to="/exploredata"
            class="transition-colors hover:text-[#007aff] font-semibold"
            :class="router.currentRoute.value.path === '/exploredata' ? 'text-[#007aff]' : 'text-black'"
          >Know Your Risk</router-link>

          <router-link
            to="/locatesupport"
            class="transition-colors hover:text-[#007aff] font-semibold rounded-full px-4 py-1.5"
            :class="router.currentRoute.value.path === '/locatesupport' ? 'text-[#007aff]' : 'text-black'"
          >Find Support</router-link>

          <router-link
            to="/crtresources"
            class="transition-colors hover:text-[#007aff] font-semibold"
            :class="router.currentRoute.value.path === '/crtresources' ? 'text-[#007aff]' : 'text-black'"
          >Resources</router-link>
        </div>

        <!-- Mobile hamburger -->
        <button
          class="md:hidden text-[#1d1d1f] p-2 cursor-pointer relative"
          aria-label="Toggle menu"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>

      </div>

      <!-- Mobile menu -->
      <div
        v-if="isMenuOpen"
        class="flex flex-col md:hidden py-4 px-4 space-y-2 border-t border-[#d2d2d7]/50 fadeIn bg-white"
      >
        <router-link to="/"
          class="block py-2 transition-colors hover:text-[#007aff] font-semibold"
          :class="router.currentRoute.value.path === '/' ? 'text-[#007aff]' : 'text-black'"
        >Home</router-link>

        <router-link to="/iteration3/stagedrecovery"
          class="block py-2 transition-colors hover:text-[#007aff] font-semibold"
          :class="router.currentRoute.value.path === '/iteration3/stagedrecovery' ? 'text-[#007aff]' : 'text-black'"
        >My Recovery</router-link>

        <router-link to="/exploredata"
          class="block py-2 transition-colors hover:text-[#007aff] font-semibold"
          :class="router.currentRoute.value.path === '/exploredata' ? 'text-[#007aff]' : 'text-black'"
        >Know Your Risk</router-link>

        <router-link to="/locatesupport"
          class="block py-2 transition-colors hover:text-[#007aff] font-semibold"
          :class="router.currentRoute.value.path === '/locatesupport' ? 'text-[#007aff]' : 'text-black'"
        >Find Support</router-link>

        <router-link to="/crtresources"
          class="block py-2 transition-colors hover:text-[#007aff] font-semibold"
          :class="router.currentRoute.value.path === '/crtresources' ? 'text-[#007aff]' : 'text-black'"
        >Resources</router-link>
      </div>

    </div>
  </nav>
</template>

<style scoped>
.fadeIn {
  animation: fadeInDown 0.25s ease-in;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
