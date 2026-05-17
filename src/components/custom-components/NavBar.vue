<script setup>

import { ref } from 'vue'

import { useRoute } from 'vue-router'



const route = useRoute()

const isMenuOpen = ref(false)



const navLinks = [

    { label: 'Home', path: '/' },

    { label: 'My Recovery', path: '/iteration3/stagedrecovery' },

    { label: 'Know Your Risk', path: '/exploredata' },

    { label: 'I had a knock', path: '/locatesupport' },

    { label: 'Resources', path: '/crtresources' },

]

</script>

<template>

    <nav class="bg-white border-b border-[#EBEBEB] sticky top-0 z-50">
        <div class="max-w-[1200px] mx-auto px-6">
            <div class="flex justify-between items-center h-16">    
                 <!-- Logo -->
                <router-link to="/" class="flex items-center">
                    <span class="text-xl font-medium text-[#1A1A1A] tracking-tight">
                        Con<span class="text-[#1A4FAB]">covery</span>
                    </span>
                </router-link>
                <!-- Desktop Links -->
            <div class="hidden md:flex items-center gap-8">
                <router-link v-for="link in navLinks" :key="link.path" :to="link.path" class="text-sm transition-colors duration-200" :class="route.path === link.path ? 'text-[#1A4FAB] font-medium' : 'text-[#888] hover:text-[#1A1A1A]'">
                    {{ link.label }}
                </router-link>
            </div>
            <!-- Mobile Hamburger -->
            <button class="md:hidden text-[#1A1A1A] p-2 cursor-pointer" @click="isMenuOpen = !isMenuOpen" aria-label="Toggle menu">
                <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                </svg>

            </button>

           </div>
           <!-- Mobile Menu -->
            <div v-if="isMenuOpen" class="md:hidden py-4 border-t border-[#EBEBEB] space-y-1 fadeIn">
                <router-link v-for="link in navLinks" :key="link.path" :to="link.path" @click="isMenuOpen = false" class="block py-2.5 px-2 text-sm rounded-lg transition-colors duration-200" :class="route.path === link.path

                        ? 'text-[#1A4FAB] font-medium bg-[#F5F8FF]' : 'text-[#555] hover:text-[#1A1A1A] hover:bg-[#F7F9FC]'">
                    {{ link.label }}
                </router-link>
            </div>

        </div>
    </nav>

</template>

<style scoped>
.fadeIn {

    animation: fadeInDown 0.25s ease;

}



@keyframes fadeInDown {

    from {
        opacity: 0;
        transform: translateY(-8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }

}
</style>
