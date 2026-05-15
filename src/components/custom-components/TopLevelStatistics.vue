<script setup>
import Focus from '../ui/focus/Focus.vue';
import NumberTicker from '../ui/number-ticker/NumberTicker.vue';

</script>

<template>
    <div>
        <div class="flex flex-col justify-center pt-19">
            <div class="relative max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
                <div class="flex flex-col items-center text-center mb-16" style="opacity: 1; transform: none;">
                        <Focus class="text-sm! lg:text-6xl font-bold text-[#1d1d1f] tracking-tight mb-4" sentence="The numbers don't lie"/>
                    <p class="text-xl text-[#86868b]">What's really happening in Australian community sport</p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
                    <div class="relative group" style="opacity: 1; transform: none;">
                        <div class="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"
                            style="background: rgba(0, 122, 255, 0.082);"></div>
                        <div
                            class="relative bg-white/80 backdrop-blur-sm border border-white/60 rounded-3xl p-8 lg:p-10 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/8 transition-all duration-500 hover:-translate-y-1">
                            <div class="absolute top-0 left-8 right-8 h-[2px] rounded-full opacity-60"
                                style="background: linear-gradient(90deg, transparent, rgb(0, 122, 255), transparent);">
                            </div>
                            <div class="text-center">
                                <div class="text-7xl lg:text-8xl font-bold mb-3 tabular-nums"
                                    style="color: rgb(0, 122, 255);"><NumberTicker :value="21" decimal-places="0" class="text-blue-500"/></div>
                                <div class="text-[#86868b] text-lg font-medium leading-snug">Days minimum brain recovery
                                    - not symptoms, actual healing</div>
                            </div>
                        </div>
                    </div>
                    <div class="relative group" style="opacity: 1; transform: none;">
                        <div class="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"
                            style="background: rgba(255, 149, 0, 0.082);"></div>
                        <div
                            class="relative bg-white/80 backdrop-blur-sm border border-white/60 rounded-3xl p-8 lg:p-10 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/8 transition-all duration-500 hover:-translate-y-1">
                            <div class="absolute top-0 left-8 right-8 h-[2px] rounded-full opacity-60"
                                style="background: linear-gradient(90deg, transparent, rgb(255, 149, 0), transparent);">
                            </div>
                            <div class="text-center">
                                <div class="text-7xl lg:text-8xl font-bold mb-3 tabular-nums"
                                    style="color: rgb(255, 149, 0);"><NumberTicker :value="80" decimal-places="0" style="color: rgb(255, 149, 0);"/>%</div>
                                <div class="text-[#86868b] text-lg font-medium leading-snug">Of community sport players
                                    return before their brain has healed</div>
                            </div>
                        </div>
                    </div>
                    <div class="relative group" style="opacity: 1; transform: none;">
                        <div class="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"
                            style="background: rgba(255, 59, 48, 0.082);"></div>
                        <div
                            class="relative bg-white/80 backdrop-blur-sm border border-white/60 rounded-3xl p-8 lg:p-10 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/8 transition-all duration-500 hover:-translate-y-1">
                            <div class="absolute top-0 left-8 right-8 h-[2px] rounded-full opacity-60"
                                style="background: linear-gradient(90deg, transparent, rgb(255, 59, 48), transparent);">
                            </div>
                            <div class="text-center">
                                <div class="text-7xl lg:text-8xl font-bold mb-3 tabular-nums"
                                    style="color: rgb(255, 59, 48);"><NumberTicker :value="5" decimal-places="0" style="color: rgb(255, 59, 48)"/>×</div>
                                <div class="text-[#86868b] text-lg font-medium leading-snug">Higher re-injury risk when
                                    returning during the recovery window</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped></style>