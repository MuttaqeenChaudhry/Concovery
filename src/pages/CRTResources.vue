<script setup>
import BlurReveal from '@/components/ui/blur-reveal/BlurReveal.vue';

</script>

<template>
    <main class="flex-1">
        <div class="bg-white min-h-screen">
            <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div class="text-center mb-16" style="opacity: 1; transform: none;">
                    <BlurReveal :delay="0.2" :duration="0.75">
                    <h1 class="text-5xl sm:text-7xl font-semibold text-[#1d1d1f] mb-6 tracking-tight">Trusted Resources
                    </h1>
                    <p class="text-xl sm:text-2xl text-[#86868b] max-w-3xl mx-auto">Evidence-based resources from
                        leading Australian health and sports organisations.
                    </p>
                    </BlurReveal>    
                </div>
                <div class="mb-20" style="opacity: 1; transform: none;">
                    <div
                        class="bg-gradient-to-br from-[#007aff] to-[#5ac8fa] rounded-3xl p-10 lg:p-16 shadow-2xl shadow-blue-500/20">
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                            <div class="lg:col-span-2">
                                <div class="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 inline-block mb-4"><span
                                        class="text-white font-semibold text-sm uppercase tracking-wide">Concussion
                                        Recognition Tool</span></div>
                                <h2 class="text-4xl sm:text-5xl font-semibold text-white mb-6">CRT5 Assessment Tool</h2>
                                <p class="text-white/95 text-lg mb-6 leading-relaxed">The Concussion Recognition Tool 5
                                    (CRT5) is a standardized assessment designed for coaches, parents, and non-medical
                                    personnel to help recognize the signs and symptoms of possible concussion. It's used
                                    globally and endorsed by the International Concussion in Sport Group.</p>
                                <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
                                    <div class="flex items-start gap-3"><svg xmlns="http://www.w3.org/2000/svg"
                                            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="lucide lucide-circle-alert text-white flex-shrink-0 mt-1">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" x2="12" y1="8" y2="12"></line>
                                            <line x1="12" x2="12.01" y1="16" y2="16"></line>
                                        </svg>
                                        <div>
                                            <p class="text-white font-semibold mb-2">Important:</p>
                                            <ul class="text-white/90 text-sm space-y-1">
                                                <li>- CRT5 does NOT diagnose concussion - only trained medical
                                                    professionals can</li>
                                                <li>- It helps you decide whether to seek medical assessment</li>
                                                <li>- If you suspect concussion, remove the player from activity
                                                    immediately</li>
                                                <li>- When in doubt, sit them out</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <a data-slot="button" href="https://cattonline.com/" target="_blank" 
                                    class="inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-10 has-[&gt;svg]:px-4 bg-white text-[#007aff] hover:bg-white/90 px-12 py-7 text-xl rounded-full font-semibold shadow-lg transition-all hover:scale-105">Access
                                    CRT5 Tool<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"
                                        class="lucide lucide-external-link ml-2">
                                        <path d="M15 3h6v6"></path>
                                        <path d="M10 14 21 3"></path>
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    </svg></a>
                            </div>
                            <div class="hidden lg:block">
                                <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                                    <div
                                        class="bg-white rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="lucide lucide-file-text text-[#007aff]">
                                            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                                            <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                                            <path d="M10 9H8"></path>
                                            <path d="M16 13H8"></path>
                                            <path d="M16 17H8"></path>
                                        </svg></div>
                                    <div class="text-center text-white">
                                        <div class="text-4xl font-bold mb-2">CRT5</div>
                                        <div class="text-white/80 text-sm">Endorsed by medical professionals worldwide
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="space-y-12">
                    <!-- For Players -->
                    <div style="opacity: 1; transform: none;">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="bg-[#007aff] rounded-2xl p-3"><svg xmlns="http://www.w3.org/2000/svg" width="28"
                                    height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round"
                                    class="lucide lucide-users text-white">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <h2 class="text-3xl font-semibold text-[#1d1d1f]">For Players</h2>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="bg-white rounded-2xl p-6 shadow-lg shadow-black/5 border border-[#d2d2d7]/50 transition-all text-left group cursor-default" style="opacity: 1; transform: none;">
                                <div class="flex items-start gap-4 mb-4">
                                    <div class="bg-gradient-to-br from-[#007aff]/10 to-[#5ac8fa]/10 rounded-2xl p-3 flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="lucide lucide-file-text text-[#007aff]">
                                            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                                            <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                                            <path d="M10 9H8"></path>
                                            <path d="M16 13H8"></path>
                                            <path d="M16 17H8"></path>
                                        </svg>
                                    </div>
                                    <div class="flex-1">
                                        <h3
                                            class="text-lg font-semibold text-[#1d1d1f] mb-2">
                                            The external resources are under maintenance, please check back later.</h3>
                                        <p class="text-[#86868b] text-sm font-medium mb-3">
                                            We apologize for any inconvenience this may cause.
                                        </p>
                                    </div>
            
                                </div>
                            </div>
                            <!-- <a href="https://www.ausport.gov.au/ais/health-wellbeing/concussion" target="_blank" rel="noopener noreferrer"
                                class="bg-white rounded-2xl p-6 shadow-lg shadow-black/5 border border-[#d2d2d7]/50 hover:shadow-2xl hover:scale-[1.02] transition-all text-left group"
                                style="opacity: 1; transform: none;">
                                <div class="flex items-start gap-4 mb-4">
                                    <div
                                        class="bg-gradient-to-br from-[#007aff]/10 to-[#5ac8fa]/10 rounded-2xl p-3 flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="lucide lucide-file-text text-[#007aff]">
                                            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                                            <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                                            <path d="M10 9H8"></path>
                                            <path d="M16 13H8"></path>
                                            <path d="M16 17H8"></path>
                                        </svg>
                                    </div>
                                    <div class="flex-1">
                                        <h3
                                            class="text-lg font-semibold text-[#1d1d1f] mb-2 group-hover:text-[#007aff] transition-colors">
                                            AIS Concussion and Brain Health Position Statement 2024</h3>
                                        <p class="text-[#86868b] text-sm font-medium mb-3">Australian Institute of Sport
                                        </p>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"
                                        class="lucide lucide-external-link text-[#86868b] group-hover:text-[#007aff] transition-colors flex-shrink-0">
                                        <path d="M15 3h6v6"></path>
                                        <path d="M10 14 21 3"></path>
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    </svg>
                                </div>
                                <p class="text-[#1d1d1f] leading-relaxed">
                                    Official national guidelines on concussion
                                    management and return-to-play protocols
                                </p>
                            </a>
                            <a href="https://www.ausport.gov.au/concussion" target="_blank" rel="noopener noreferrer"
                                class="bg-white rounded-2xl p-6 shadow-lg shadow-black/5 border border-[#d2d2d7]/50 hover:shadow-2xl hover:scale-[1.02] transition-all text-left group"
                                style="opacity: 1; transform: none;">
                                <div class="flex items-start gap-4 mb-4">
                                    <div
                                        class="bg-gradient-to-br from-[#007aff]/10 to-[#5ac8fa]/10 rounded-2xl p-3 flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="lucide lucide-book-open text-[#007aff]">
                                            <path d="M12 7v14"></path>
                                            <path
                                                d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z">
                                            </path>
                                        </svg>
                                    </div>
                                    <div class="flex-1">
                                        <h3
                                            class="text-lg font-semibold text-[#1d1d1f] mb-2 group-hover:text-[#007aff] transition-colors">
                                            Concussion in Sport Australia</h3>
                                        <p class="text-[#86868b] text-sm font-medium mb-3">Commonwealth Government</p>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"
                                        class="lucide lucide-external-link text-[#86868b] group-hover:text-[#007aff] transition-colors flex-shrink-0">
                                        <path d="M15 3h6v6"></path>
                                        <path d="M10 14 21 3"></path>
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    </svg>
                                </div>
                                <p class="text-[#1d1d1f] leading-relaxed">
                                    National hub for concussion information,
                                    guidelines, and educational resources
                                </p>
                            </a>
                            <a href="https://qbi.uq.edu.au/concussion" target="_blank" rel="noopener noreferrer"
                                class="bg-white rounded-2xl p-6 shadow-lg shadow-black/5 border border-[#d2d2d7]/50 hover:shadow-2xl hover:scale-[1.02] transition-all text-left group"
                                style="opacity: 1; transform: none;">
                                <div class="flex items-start gap-4 mb-4">
                                    <div
                                        class="bg-gradient-to-br from-[#007aff]/10 to-[#5ac8fa]/10 rounded-2xl p-3 flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="lucide lucide-book-open text-[#007aff]">
                                            <path d="M12 7v14"></path>
                                            <path
                                                d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z">
                                            </path>
                                        </svg></div>
                                    <div class="flex-1">
                                        <h3
                                            class="text-lg font-semibold text-[#1d1d1f] mb-2 group-hover:text-[#007aff] transition-colors">
                                            Concussion Explainer</h3>
                                        <p class="text-[#86868b] text-sm font-medium mb-3">Queensland Brain Institute
                                        </p>
                                    </div><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"
                                        class="lucide lucide-external-link text-[#86868b] group-hover:text-[#007aff] transition-colors flex-shrink-0">
                                        <path d="M15 3h6v6"></path>
                                        <path d="M10 14 21 3"></path>
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    </svg>
                                </div>
                                <p class="text-[#1d1d1f] leading-relaxed">Plain-language guide to understanding what
                                    happens to your brain during and after concussion</p>
                            </a> -->
                        </div>
                    </div>
                    <!-- For Parents -->
                    <div style="opacity: 1; transform: none;">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="bg-[#34c759] rounded-2xl p-3"><svg xmlns="http://www.w3.org/2000/svg" width="28"
                                    height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round"
                                    class="lucide lucide-users text-white">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                        </div>
                            <h2 class="text-3xl font-semibold text-[#1d1d1f]">For Parents</h2>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="bg-white rounded-2xl p-6 shadow-lg shadow-black/5 border border-[#d2d2d7]/50 transition-all text-left group cursor-default" style="opacity: 1; transform: none;">
                                <div class="flex items-start gap-4 mb-4">
                                    <div class="bg-gradient-to-br from-[#007aff]/10 to-[#5ac8fa]/10 rounded-2xl p-3 flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="lucide lucide-file-text text-[#007aff]">
                                            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                                            <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                                            <path d="M10 9H8"></path>
                                            <path d="M16 13H8"></path>
                                            <path d="M16 17H8"></path>
                                        </svg>
                                    </div>
                                    <div class="flex-1">
                                        <h3
                                            class="text-lg font-semibold text-[#1d1d1f] mb-2">
                                            The external resources are under maintenance, please check back later.</h3>
                                        <p class="text-[#86868b] text-sm font-medium mb-3">
                                            We apologize for any inconvenience this may cause.
                                        </p>
                                    </div>
            
                                </div>
                            </div>
                            <!-- <a href="https://www.ausport.gov.au/concussion/parents" target="_blank" rel="noopener noreferrer"
                                class="bg-white rounded-2xl p-6 shadow-lg shadow-black/5 border border-[#d2d2d7]/50 hover:shadow-2xl hover:scale-[1.02] transition-all text-left group"
                                style="opacity: 1; transform: none;">
                                <div class="flex items-start gap-4 mb-4">
                                    <div
                                        class="bg-gradient-to-br from-[#34c759]/10 to-[#34c759]/5 rounded-2xl p-3 flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="lucide lucide-users text-[#34c759]">
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg></div>
                                    <div class="flex-1">
                                        <h3
                                            class="text-lg font-semibold text-[#1d1d1f] mb-2 group-hover:text-[#34c759] transition-colors">
                                            Parent Guide to Concussion</h3>
                                        <p class="text-[#86868b] text-sm font-medium mb-3">Concussion in Sport Australia
                                        </p>
                                    </div><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"
                                        class="lucide lucide-external-link text-[#86868b] group-hover:text-[#34c759] transition-colors flex-shrink-0">
                                        <path d="M15 3h6v6"></path>
                                        <path d="M10 14 21 3"></path>
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    </svg>
                                </div>
                                <p class="text-[#1d1d1f] leading-relaxed">How to recognize symptoms, support recovery,
                                    and make return-to-play decisions for young athletes</p>
                            </a>
                            <a href="https://www.ausport.gov.au/ais/health-wellbeing/concussion/children" target="_blank" rel="noopener noreferrer"
                                class="bg-white rounded-2xl p-6 shadow-lg shadow-black/5 border border-[#d2d2d7]/50 hover:shadow-2xl hover:scale-[1.02] transition-all text-left group"
                                style="opacity: 1; transform: none;">
                                <div class="flex items-start gap-4 mb-4">
                                    <div
                                        class="bg-gradient-to-br from-[#34c759]/10 to-[#34c759]/5 rounded-2xl p-3 flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="lucide lucide-file-text text-[#34c759]">
                                            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                                            <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                                            <path d="M10 9H8"></path>
                                            <path d="M16 13H8"></path>
                                            <path d="M16 17H8"></path>
                                        </svg></div>
                                    <div class="flex-1">
                                        <h3
                                            class="text-lg font-semibold text-[#1d1d1f] mb-2 group-hover:text-[#34c759] transition-colors">
                                            Child &amp; Adolescent Concussion Guidelines</h3>
                                        <p class="text-[#86868b] text-sm font-medium mb-3">Australian Institute of Sport
                                        </p>
                                    </div><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"
                                        class="lucide lucide-external-link text-[#86868b] group-hover:text-[#34c759] transition-colors flex-shrink-0">
                                        <path d="M15 3h6v6"></path>
                                        <path d="M10 14 21 3"></path>
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    </svg>
                                </div>
                                <p class="text-[#1d1d1f] leading-relaxed">Special considerations for young and
                                    developing brains, with age-specific recovery protocols</p>
                            </a> -->
                        </div>
                    </div>
                    <!-- For Coaches -->
                    <div style="opacity: 1; transform: none;">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="bg-[#ff9500] rounded-2xl p-3"><svg xmlns="http://www.w3.org/2000/svg" width="28"
                                    height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round"
                                    class="lucide lucide-users text-white">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg></div>
                            <h2 class="text-3xl font-semibold text-[#1d1d1f]">For Coaches</h2>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="bg-white rounded-2xl p-6 shadow-lg shadow-black/5 border border-[#d2d2d7]/50 transition-all text-left group cursor-default" style="opacity: 1; transform: none;">
                                <div class="flex items-start gap-4 mb-4">
                                    <div class="bg-gradient-to-br from-[#007aff]/10 to-[#5ac8fa]/10 rounded-2xl p-3 flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="lucide lucide-file-text text-[#007aff]">
                                            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                                            <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                                            <path d="M10 9H8"></path>
                                            <path d="M16 13H8"></path>
                                            <path d="M16 17H8"></path>
                                        </svg>
                                    </div>
                                    <div class="flex-1">
                                        <h3
                                            class="text-lg font-semibold text-[#1d1d1f] mb-2">
                                            The external resources are under maintenance, please check back later.</h3>
                                        <p class="text-[#86868b] text-sm font-medium mb-3">
                                            We apologize for any inconvenience this may cause.
                                        </p>
                                    </div>
            
                                </div>
                            </div>
                            <!-- <a href="https://www.ausport.gov.au/concussion/coaches" target="_blank" rel="noopener noreferrer"
                                class="bg-white rounded-2xl p-6 shadow-lg shadow-black/5 border border-[#d2d2d7]/50 hover:shadow-2xl hover:scale-[1.02] transition-all text-left group"
                                style="opacity: 1; transform: none;">
                                <div class="flex items-start gap-4 mb-4">
                                    <div
                                        class="bg-gradient-to-br from-[#ff9500]/10 to-[#ff9500]/5 rounded-2xl p-3 flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="lucide lucide-book-open text-[#ff9500]">
                                            <path d="M12 7v14"></path>
                                            <path
                                                d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z">
                                            </path>
                                        </svg></div>
                                    <div class="flex-1">
                                        <h3
                                            class="text-lg font-semibold text-[#1d1d1f] mb-2 group-hover:text-[#ff9500] transition-colors">
                                            Coach Concussion Education Module</h3>
                                        <p class="text-[#86868b] text-sm font-medium mb-3">Concussion in Sport Australia
                                        </p>
                                    </div><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"
                                        class="lucide lucide-external-link text-[#86868b] group-hover:text-[#ff9500] transition-colors flex-shrink-0">
                                        <path d="M15 3h6v6"></path>
                                        <path d="M10 14 21 3"></path>
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    </svg>
                                </div>
                                <p class="text-[#1d1d1f] leading-relaxed">Free online training on recognizing, managing,
                                    and preventing concussion in community sport</p>
                            </a>
                            <a href="https://www.ausport.gov.au/ais/health-wellbeing/concussion/sideline" target="_blank" rel="noopener noreferrer"
                                class="bg-white rounded-2xl p-6 shadow-lg shadow-black/5 border border-[#d2d2d7]/50 hover:shadow-2xl hover:scale-[1.02] transition-all text-left group"
                                style="opacity: 1; transform: none;">
                                <div class="flex items-start gap-4 mb-4">
                                    <div
                                        class="bg-gradient-to-br from-[#ff9500]/10 to-[#ff9500]/5 rounded-2xl p-3 flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="lucide lucide-file-text text-[#ff9500]">
                                            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                                            <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                                            <path d="M10 9H8"></path>
                                            <path d="M16 13H8"></path>
                                            <path d="M16 17H8"></path>
                                        </svg></div>
                                    <div class="flex-1">
                                        <h3
                                            class="text-lg font-semibold text-[#1d1d1f] mb-2 group-hover:text-[#ff9500] transition-colors">
                                            Sideline Concussion Management</h3>
                                        <p class="text-[#86868b] text-sm font-medium mb-3">Australian Institute of Sport
                                        </p>
                                    </div><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"
                                        class="lucide lucide-external-link text-[#86868b] group-hover:text-[#ff9500] transition-colors flex-shrink-0">
                                        <path d="M15 3h6v6"></path>
                                        <path d="M10 14 21 3"></path>
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    </svg>
                                </div>
                                <p class="text-[#1d1d1f] leading-relaxed">Immediate response protocols and when to
                                    remove a player from play</p>
                            </a> -->
                        </div>
                    </div>
                </div>
                <div class="mt-12 bg-[#f5f5f7] rounded-2xl p-6 border border-[#d2d2d7]/50"
                    style="opacity: 1; transform: none;">
                    <div class="flex items-start gap-3">
                        <div class="bg-[#007aff]/10 rounded-xl p-2 flex-shrink-0"><svg
                                xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-circle-alert text-[#007aff]">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" x2="12" y1="8" y2="12"></line>
                                <line x1="12" x2="12.01" y1="16" y2="16"></line>
                            </svg></div>
                        <p class="text-[#86868b] text-sm"><strong class="text-[#1d1d1f]">Note:</strong> All external
                            resources open in a new tab. Concovery does not control or endorse the content of external
                            websites, but all resources listed are from trusted Australian health and sports
                            organizations.</p>
                    </div>
                </div>
            </div>
        </div>
    </main>

</template>

<style scoped></style>