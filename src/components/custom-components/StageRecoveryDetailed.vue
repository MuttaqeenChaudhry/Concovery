<script setup>
import { ref } from 'vue';
import BlurReveal from '../ui/blur-reveal/BlurReveal.vue';
import StageRecoveryDetails from './StageRecoveryDetails.vue';

const isAnyStageSelected = ref(false)
const selectedStage = ref(null)
const handleStageClick = (stage) => {
    isAnyStageSelected.value = true
    selectedStage.value = stage
}

const resetStageSelection = () => {
    isAnyStageSelected.value = false
    selectedStage.value = null

}
</script>

<template>
    <div>
        <!-- Button Selection for Stages -->
        <div class="mb-12" style="opacity: 1; transform: none;">
            <div class="bg-[#f5f5f7] rounded-3xl p-8 shadow-xl">
                <div class="flex justify-between items-center mb-8">
                    <h2 class="text-2xl font-semibold text-[#1d1d1f]">Recovery Stages</h2>
                    <button v-if="isAnyStageSelected" class="text-[#007aff] hover:text-[#0051d5] underline-offset-8 hover:underline font-semibold transition-all p-2 cursor-pointer" @click="() => resetStageSelection()">Change Stage</button>
                </div>
                <!-- Stages Button Section -->
                <BlurReveal :delay="0.2" :duration="0.75">
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <!-- Stage 1 -->
                    <button @click="() => handleStageClick('1')" class="relative group rounded-2xl p-6 border-2 transition-all bg-white border-[#007aff] text-[#007aff] hover:shadow-xl hover:scale-105 cursor-pointer" :disabled="isAnyStageSelected && selectedStage != '1'"
                    :class="selectedStage == '1' ? 'bg-[#007aff]! scale-105! text-white!' : isAnyStageSelected && selectedStage > 1 ? 'bg-[#34c759]/10! border-[#34c759]! text-[#34c759]! cursor-default! hover:shadow-[none]! hover:scale-none!' : isAnyStageSelected && selectedStage != '1' ? 'border-[#D2D1D7]! text-[#d2d2d7]! cursor-not-allowed! hover:shadow-[none]! hover:scale-none!' : ''">
                        <div class="flex flex-col items-center gap-3">
                            <svg v-if="selectedStage == '1' && isAnyStageSelected" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity animate-pulse">
                                <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
                            </svg>
                            <svg v-if="!isAnyStageSelected && selectedStage != '1'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle">
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg> 
                            <svg v-if="isAnyStageSelected && selectedStage > 1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check" data-fg-bc1y44="33.113:33.21835:/src/app/pages/Recovery.tsx:266:43:13589:42:e:CheckCircle2::::::CELI" data-fgid-bc1y44=":rp6:"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
                            <!-- <svg v-if="isAnyStageSelected && selectedStage < 1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>  -->
                            <div class="text-center">
                                <div class="font-bold text-sm mb-1">Stage 1</div>
                                <div class="text-xs font-semibold">Rest</div>
                            </div>
                        </div>
                        <div v-if="isAnyStageSelected && selectedStage != 1">
                        </div>
                        <div v-else class="mt-3 pt-3 border-t border-current/20" >
                            <p class="text-xs leading-relaxed opacity-80">Your brain cells are in metabolic crisis</p>
                        </div>
                    </button>
                    <!-- Stage 2 -->
                    <button @click="() => handleStageClick('2')" class="relative group rounded-2xl p-6 border-2 transition-all bg-white border-[#007aff] text-[#007aff] hover:shadow-xl hover:scale-105 cursor-pointer" :disabled="isAnyStageSelected && selectedStage != '1'"
                     :class="selectedStage == '2' ? 'bg-[#007aff]! scale-105! text-white!' : isAnyStageSelected && selectedStage > 2 ? 'bg-[#34c759]/10! border-[#34c759]! text-[#34c759]! cursor-default! hover:shadow-[none]! hover:scale-none!' : isAnyStageSelected && selectedStage != '2' ? 'border-[#D2D1D7]! text-[#d2d2d7]! cursor-not-allowed! hover:shadow-[none]! hover:scale-none!' : ''">
                        <div class="flex flex-col items-center gap-3">
                            <svg v-if="selectedStage == '2' && isAnyStageSelected" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity animate-pulse">
                                <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
                            </svg>
                            <svg v-if="!isAnyStageSelected && selectedStage != '2'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle">
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg> 
                            <svg v-if="isAnyStageSelected && selectedStage < 2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> 
                            <svg v-if="isAnyStageSelected && selectedStage > 2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check" data-fg-bc1y44="33.113:33.21835:/src/app/pages/Recovery.tsx:266:43:13589:42:e:CheckCircle2::::::CELI" data-fgid-bc1y44=":rp6:"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
                            <div class="text-center">
                                <div class="font-bold text-sm mb-1">Stage 2</div>
                                <div class="text-xs font-semibold">Light Activity</div>
                            </div>
                        </div>
                        <div v-if="isAnyStageSelected && selectedStage != 2">
                        </div>
                        <div v-else class="mt-3 pt-3 border-t border-current/20" >
                            <p class="text-xs leading-relaxed opacity-80">Cellular inflammation is high, but stabilizing</p>
                        </div>
                    </button>
                    <!-- Stage 3 -->
                    <button @click="() => handleStageClick('3')" class="relative group rounded-2xl p-6 border-2 transition-all bg-white border-[#007aff] text-[#007aff] hover:shadow-xl hover:scale-105 cursor-pointer" :disabled="isAnyStageSelected && selectedStage != '1'"
                     :class="selectedStage == '3' ? 'bg-[#007aff]! scale-105! text-white!' : isAnyStageSelected && selectedStage > 3 ? 'bg-[#34c759]/10! border-[#34c759]! text-[#34c759]! cursor-default! hover:shadow-[none]! hover:scale-none!' : isAnyStageSelected && selectedStage != '3' ? 'border-[#D2D1D7]! text-[#d2d2d7]! cursor-not-allowed! hover:shadow-[none]! hover:scale-none!' : ''">
                        <div class="flex flex-col items-center gap-3">
                            <svg v-if="selectedStage == '3' && isAnyStageSelected" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity animate-pulse">
                                <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
                            </svg>
                            <svg v-if="!isAnyStageSelected && selectedStage != '3'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle">
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg> 
                            <svg v-if="isAnyStageSelected && selectedStage < 3" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> 
                            <svg v-if="isAnyStageSelected && selectedStage > 3" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check" data-fg-bc1y44="33.113:33.21835:/src/app/pages/Recovery.tsx:266:43:13589:42:e:CheckCircle2::::::CELI" data-fgid-bc1y44=":rp6:"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg> 
                            <div class="text-center">
                                <div class="font-bold text-sm mb-1">Stage 3</div>
                                <div class="text-xs font-semibold">Moderate</div>
                            </div>
                        </div>
                        <div v-if="isAnyStageSelected && selectedStage != 3">
                        </div>
                        <div v-else class="mt-3 pt-3 border-t border-current/20" >
                            <p class="text-xs leading-relaxed opacity-80">Axons are begining to regenerate connectionss</p>
                        </div>
                    </button>
                    <!-- Stage 4 -->
                    <button @click="() => handleStageClick('4')" class="relative group rounded-2xl p-6 border-2 transition-all bg-white border-[#007aff] text-[#007aff] hover:shadow-xl hover:scale-105 cursor-pointer" :disabled="isAnyStageSelected && selectedStage != '1'"
                    :class="selectedStage == '4' ? 'bg-[#007aff]! scale-105! text-white!' : isAnyStageSelected && selectedStage > 4 ? 'bg-[#34c759]/10! border-[#34c759]! text-[#34c759]! cursor-default! hover:shadow-[none]! hover:scale-none!' : isAnyStageSelected && selectedStage != '4' ? 'border-[#D2D1D7]! text-[#d2d2d7]! cursor-not-allowed! hover:shadow-[none]! hover:scale-none!' : ''">
                        <div class="flex flex-col items-center gap-3">
                            <svg v-if="selectedStage == '4' && isAnyStageSelected" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity animate-pulse">
                                <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
                            </svg>
                            <svg v-if="!isAnyStageSelected && selectedStage != '4'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle">
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg> 
                            <svg v-if="isAnyStageSelected && selectedStage < 4" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> 
                            <svg v-if="isAnyStageSelected && selectedStage > 4" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check" data-fg-bc1y44="33.113:33.21835:/src/app/pages/Recovery.tsx:266:43:13589:42:e:CheckCircle2::::::CELI" data-fgid-bc1y44=":rp6:"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg> 
                            <div class="text-center">
                                <div class="font-bold text-sm mb-1">Stage 4</div>
                                <div class="text-xs font-semibold">Heavy Activity</div>
                            </div>
                        </div>
                        <div v-if="isAnyStageSelected && selectedStage != 4">
                        </div>
                        <div v-else class="mt-3 pt-3 border-t border-current/20" >
                            <p class="text-xs leading-relaxed opacity-80">Energy metabolism is recovering but not baseline</p>
                        </div>
                    </button>
                    <!-- Stage 5 -->
                    <button @click="() => handleStageClick('5')" class="relative group rounded-2xl p-6 border-2 transition-all bg-white border-[#007aff] text-[#007aff] hover:shadow-xl hover:scale-105 cursor-pointer" :disabled="isAnyStageSelected && selectedStage != '1'"
                    :class="selectedStage == '5' ? 'bg-[#007aff]! scale-105! text-white!' : isAnyStageSelected && selectedStage > 5 ? 'bg-[#34c759]/10! border-[#34c759]! text-[#34c759]! cursor-default! hover:shadow-[none]! hover:scale-none!' : isAnyStageSelected && selectedStage != '5' ? 'border-[#D2D1D7]! text-[#d2d2d7]! cursor-not-allowed! hover:shadow-[none]! hover:scale-none!' : ''">
                        <div class="flex flex-col items-center gap-3">
                            <svg v-if="selectedStage == '5' && isAnyStageSelected" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity animate-pulse">
                                <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
                            </svg>
                            <svg v-if="!isAnyStageSelected && selectedStage != '5'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle">
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg> 
                             <svg v-if="isAnyStageSelected && selectedStage < 5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> 
                            <svg v-if="isAnyStageSelected && selectedStage > 5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check" data-fg-bc1y44="33.113:33.21835:/src/app/pages/Recovery.tsx:266:43:13589:42:e:CheckCircle2::::::CELI" data-fgid-bc1y44=":rp6:"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg> 
                            <div class="text-center">
                                <div class="font-bold text-sm mb-1">Stage 5</div>
                                <div class="text-xs font-semibold">Full Training</div>
                            </div>
                        </div>
                        <div v-if="isAnyStageSelected && selectedStage != 5">
                        </div>
                        <div v-else class="mt-3 pt-3 border-t border-current/20" >
                            <p class="text-xs leading-relaxed opacity-80">Cellular architecture is stabilizing</p>
                        </div>
                    </button>
                    <!-- Stage 6 -->
                    <button @click="() => handleStageClick('6')" class="relative group rounded-2xl p-6 border-2 transition-all bg-white border-[#007aff] text-[#007aff] hover:shadow-xl hover:scale-105 cursor-pointer" :disabled="isAnyStageSelected && selectedStage != '1'"
                    :class="selectedStage == '6' ? 'bg-[#007aff]! scale-105! text-white!' : isAnyStageSelected && selectedStage != '6' ? 'border-[#D2D1D7]! text-[#d2d2d7]! cursor-not-allowed! hover:shadow-[none]! hover:scale-none!' : ''">
                        <div class="flex flex-col items-center gap-3">
                            <svg v-if="selectedStage == '6' && isAnyStageSelected" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity animate-pulse">
                                <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
                            </svg>
                            <svg v-if="!isAnyStageSelected && selectedStage != '6'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle">
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg> 
                             <svg v-if="isAnyStageSelected && selectedStage < 6" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> 
                            <svg v-if="isAnyStageSelected && selectedStage > 6" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check" data-fg-bc1y44="33.113:33.21835:/src/app/pages/Recovery.tsx:266:43:13589:42:e:CheckCircle2::::::CELI" data-fgid-bc1y44=":rp6:"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
                            <div class="text-center">
                                <div class="font-bold text-sm mb-1">Stage 6</div>
                                <div class="text-xs font-semibold">Return</div>
                            </div>
                        </div>
                        <div v-if="isAnyStageSelected && selectedStage != 6">
                        </div>
                        <div v-else class="mt-3 pt-3 border-t border-current/20" >
                            <p class="text-xs leading-relaxed opacity-80">Brain fully recovered in an optimal state</p>
                        </div>
                    </button>              
                </div>
                </BlurReveal>
            </div>
        </div>
        <!-- Selected Stage Description Component -->
        <div v-if="isAnyStageSelected">
            <BlurReveal :delay="0.2" :duration="0.75">
            <StageRecoveryDetails :stage="parseInt(selectedStage)" />
            </BlurReveal>
        </div>
        <div v-if="!isAnyStageSelected" class="bg-[#f5f5f7] rounded-3xl p-16 text-center" style="opacity: 1; transform: none;">
            <div class="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                    xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-activity text-[#007aff]">
                    <path
                        d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2">
                    </path>
                </svg>
            </div>
            <h3 class="text-3xl font-semibold text-[#1d1d1f] mb-3">Select your current recovery stage</h3>
            <p class="text-[#86868b] text-lg">Click on any stage above to see detailed guidance, activities, and brain
                science
            </p>
        </div>
        <div class="mt-12 bg-white rounded-2xl p-6 border border-[#d2d2d7]/50" style="opacity: 1;">
            <div class="flex items-start gap-3">
                <div class="bg-[#ff9500]/10 rounded-xl p-2 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-triangle-alert text-[#ff9500]">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
                        <path d="M12 9v4"></path>
                        <path d="M12 17h.01"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-[#86868b] text-sm"><strong class="text-[#1d1d1f]">Important Disclaimer:</strong> No
                        data is stored between sessions. This tool is for education only and does not replace medical
                        advice. Always progress through stages under medical supervision. If symptoms return at any
                        stage, stop immediately and return to the previous stage.</p>
                </div>
            </div>
        </div>
        <div class="mt-6 text-center">
            <p class="text-[#86868b] text-sm">All content sourced from <strong class="text-[#1d1d1f]">Australian
                    Institute of Sport (AIS) Concussion and Brain Health Position Statement 2024</strong></p>
        </div>
    </div>
</template>

<style scoped></style>