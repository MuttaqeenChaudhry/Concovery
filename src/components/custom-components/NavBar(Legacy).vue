<script setup>
import router from '@/router';
import { ref } from 'vue';
console.log("router.currentRoute", router.currentRoute.value)



const isMenuOpen = ref(false)

</script>

<template>
    <nav class="bg-white/80 backdrop-blur-xl border-b border-[#d2d2d7]/50 sticky top-0 z-50">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <router-link class="flex items-center" to="/"><span
                        class="text-2xl font-semibold text-[#1d1d1f]">Con<span
                            class="text-[#007aff]">covery</span></span></router-link>
                <div class="hidden md:flex items-center space-x-8">
                    <router-link class="transition-colors hover:text-[#007aff] font-semibold" to="/" :class="router.currentRoute.value.path == '/' ? 'text-blue-500': 'text-black'">Home</router-link>
                    <router-link class="transition-colors hover:text-[#007aff] font-semibold" to="/exploredata" :class="router.currentRoute.value.path == '/exploredata' ? 'text-blue-500': 'text-black'">
                        Data Insights
                    </router-link>
                    <router-link class="transition-colors hover:text-[#007aff] font-semibold" to="/locatesupport" :class="router.currentRoute.value.path == '/locatesupport' ? 'text-blue-500': 'text-black'">Find
                        Support</router-link>
                    <router-link class="transition-colors hover:text-[#007aff] font-semibold" to="/crtresources" :class="router.currentRoute.value.path == '/crtresources' ? 'text-blue-500': 'text-black'">Diagnostic Resources</router-link>
                    <!-- <router-link class="transition-colors hover:text-[#007aff] font-semibold" to="/rtprule" :class="router.currentRoute.value.path == '/rtprule' ? 'text-blue-500': 'text-black'">21 Day Science</router-link> -->
                    <router-link class="transition-colors hover:text-[#007aff] font-semibold" to="/iteration3/stagedrecovery" :class="router.currentRoute.value.path == '/iteration3/stagedrecovery' ? 'text-blue-500': 'text-black'">Staged Recovery</router-link>       
                </div>
                <button v-if="!isMenuOpen" class="md:hidden text-[#1d1d1f] p-2" aria-label="Toggle menu" @click="() => isMenuOpen = true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-menu"
                        data-fg-h9b18="33.59:33.2725:/src/app/components/Navigation.tsx:54:49:1963:18:e:Menu::::::D5X5"
                        data-fgid-h9b18=":ri:">
                        <line x1="4" x2="20" y1="12" y2="12"></line>
                        <line x1="4" x2="20" y1="6" y2="6"></line>
                        <line x1="4" x2="20" y1="18" y2="18"></line>
                    </svg>
                </button>
                <button v-if="isMenuOpen" class="md:hidden text-[#1d1d1f] p-2" aria-label="Toggle menu" @click="() => isMenuOpen = false">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-x">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                    </svg>
                </button>

            </div>

            <!-- Mobile Navigation Menu -->
            <div v-if="isMenuOpen" class="md:hidden py-4 px-4 space-y-2 border-t border-[#d2d2d7]/50 fadeInAnim">
                <router-link @click="() => isMenuOpen = false" class="block py-2 transition-colors hover:text-[#007aff] font-semibold" to="/" :class="router.currentRoute.value.path == '/' ? 'text-blue-500': 'text-black'">Home</router-link>
                <router-link @click="() => isMenuOpen = false" class="block py-2 transition-colors hover:text-[#007aff] font-semibold" to="/exploredata" :class="router.currentRoute.value.path == '/exploredata' ? 'text-blue-500': 'text-black'">
                    Data Insights
                </router-link>
                <router-link @click="() => isMenuOpen = false" class="block py-2 transition-colors hover:text-[#007aff] font-semibold" to="/locatesupport" :class="router.currentRoute.value.path == '/locatesupport' ? 'text-blue-500': 'text-black'">
                    Find Support
                </router-link>
                <router-link @click="() => isMenuOpen = false" class="block py-2 transition-colors hover:text-[#007aff] font-semibold" to="/crtresources" :class="router.currentRoute.value.path == '/crtresources' ? 'text-blue-500': 'text-black'">
                    Diagnostic Resources
                </router-link>
                <!-- <router-link @click="() => isMenuOpen = false" class="block py-2 transition-colors hover:text-[#007aff] font-semibold" to="/rtprule" :class="router.currentRoute.value.path == '/rtprule' ? 'text-blue-500': 'text-black'">
                    21 Day Science
                </router-link> -->
                <router-link @click="() => isMenuOpen = false" class="block py-2 transition-colors hover:text-[#007aff] font-semibold" to="/iteration3/stagedrecovery" :class="router.currentRoute.value.path == '/iteration3/stagedrecovery' ? 'text-blue-500': 'text-black'">
                    Staged Recovery
                </router-link>     
                <!-- <router-link @click="() => isMenuOpen = false" class="block py-2 transition-colors text-[#1d1d1f] hover:text-[#007aff]"
                    to="/">About</router-link> -->
            </div>
        </div>

    </nav>
</template>

<style scoped>

.fadeInAnim {
    animation-name: fadeInKeyFrame;
    animation-duration: 0.3s;
    animation-timing-function: ease-in;
    animation-iteration-count: 1;
}

@keyframes fadeInKeyFrame {
    0% {
        opacity: 0;

    }
    100% {
        opacity: 1;
    }
}
</style>