<script setup>
import IntroStagedRecovery from '@/components/custom-components/IntroStagedRecovery.vue';
import { ref } from 'vue';
import StagedRecoveryDetailed from '@/components/custom-components/StageRecoveryDetailed.vue'

const hasJourneyBegan = ref(false)

const handleJourneyClick = () => {
    hasJourneyBegan.value = true
}

</script>

<template>
    <main class="flex-1">
        <div class="bg-white min-h-screen">
            <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div class="text-center mb-16" style="opacity: 1; transform: none;">
                    <h1 class="text-5xl sm:text-7xl font-semibold text-[#1d1d1f] mb-6 tracking-tight">Your Recovery
                        Journey</h1>
                    <p class="text-xl sm:text-2xl text-[#86868b] max-w-3xl mx-auto">Follow the Australian Institute of
                        Sport (AIS) 6-stage return-to-play protocol. Understand what your brain needs at each stage.</p>
                </div>
                <IntroStagedRecovery v-if="!hasJourneyBegan" @begin-journey="handleJourneyClick"/>
                <StagedRecoveryDetailed v-if="hasJourneyBegan"/>
            </div>
        </div>
    </main>

</template>

<style scoped></style>