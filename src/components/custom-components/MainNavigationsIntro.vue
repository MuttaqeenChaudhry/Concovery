<script setup>
</script>

<template>
    <section class="bg-white py-24 lg:py-32">
        <div class="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
            <div class="text-center mb-16" style="opacity: 1; transform: none;">
                <h2 class="text-4xl sm:text-5xl font-bold text-[#1d1d1f] tracking-tight mb-4">Built for players like
                    you.</h2>
                <p class="text-xl text-[#86868b] max-w-2xl mx-auto leading-relaxed">
                    A free tool for Australian community sport players. Three things, done simply.
                </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <router-link to="/exploredata"
                    class="bg-white border border-[#f0f0f0] hover:border-[#e0e0e0] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1 flex flex-col"
                    style="opacity: 1; transform: none;">
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                        style="background: rgba(0, 122, 255, 0.07);"><svg xmlns="http://www.w3.org/2000/svg" width="26"
                            height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-column"
                            style="color: rgb(0, 122, 255);">
                            <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                            <path d="M18 17V9"></path>
                            <path d="M13 17V5"></path>
                            <path d="M8 17v-3"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-[#1d1d1f] mb-3">
                        Your sport's real numbers
                    </h3>
                    <p class="text-[#86868b] leading-relaxed flex-1 text-base">
                        Real AIHW concussion hospitalisation data filtered to your sport and age
                        group. Not global averages - actual numbers from Australian community sport.</p>
                    <div class="mt-6 block">
                        <div class="flex items-center gap-2 font-semibold text-sm"
                            style="color: rgb(0, 122, 255); transform: none;">Explore the data
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-arrow-right">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg>
                        </div>
                    </div>
                </router-link>
                <router-link to="/rtprule"
                    class="bg-white border border-[#f0f0f0] hover:border-[#e0e0e0] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1 flex flex-col"
                    style="opacity: 1; transform: none;">
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                        style="background: rgba(255, 59, 48, 0.07);"><svg xmlns="http://www.w3.org/2000/svg" width="26"
                            height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield"
                            style="color: rgb(255, 59, 48);">
                            <path
                                d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z">
                            </path>
                        </svg></div>
                    <h3 class="text-xl font-bold text-[#1d1d1f] mb-3">Know what's actually happening</h3>
                    <p class="text-[#86868b] leading-relaxed flex-1 text-base">You feel fine on Day 7. Your brain isn't.
                        Find out why the 21-day rule
                        isn't just a guideline - and what happens to players who skip it.</p><a class="mt-6 block">
                        <div class="flex items-center gap-2 font-semibold text-sm"
                            style="color: rgb(255, 59, 48); transform: none;">Learn why 21 days
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-arrow-right">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg>
                        </div>
                    </a>
                </router-link>
                <router-link to="/locatesupport"
                    class="bg-white border border-[#f0f0f0] hover:border-[#e0e0e0] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1 flex flex-col"
                    style="opacity: 1; transform: none;">
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                        style="background: rgba(52, 199, 89, 0.07);"><svg xmlns="http://www.w3.org/2000/svg" width="26"
                            height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"
                            style="color: rgb(52, 199, 89);">
                            <path
                                d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0">
                            </path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg></div>
                    <h3 class="text-xl font-bold text-[#1d1d1f] mb-3">Find help near you</h3>
                    <div class="text-[#86868b] leading-relaxed flex-1 text-base">Had a knock and not sure what to do?
                        Find the nearest GP, hospital, or
                        sports medicine clinic. Fast, no googling required.</div>
                    <div class="mt-6 block">
                        <div class="flex items-center gap-2 font-semibold text-sm"
                            style="color: rgb(52, 199, 89); transform: none;">Find support <svg
                                xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-arrow-right">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg></div>
                    </div>
                </router-link>
            </div>
        </div>
    </section>

</template>

<style scoped></style>