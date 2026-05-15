<script setup>
import { computed } from 'vue'
import BlurReveal from '../ui/blur-reveal/BlurReveal.vue'


const props = defineProps({
    day: {
        type: Number,
        default: () => 0
    },
    description: {
        type: String,
        default: () => ''
    },
    toDo: {
        type: Array,
        default: () => []
    },
    notToDo: {
        type: Array,
        default: () => []
    }
})

const phase = computed(() => {
    if (props.day >= 1 && props.day <= 3) {
        return 'Acute Phase'
    } else if (props.day >= 4 && props.day <=6) {
        return 'Early Recovery'
    } else if (props.day == 7) {
        return 'DANGER ZONE'
    } else if (props.day >= 8 && props.day <= 12) {
        return 'Mild Recovery'
    } else if (props.day >= 13 && props.day <=20) {
        return 'Late Recovery'
    } else {
        return 'Fully Recovered'
    }
})

const severityColor = computed(() => {
    if (props.day >= 1 && props.day <= 3) {
        return 'text-[rgb(255,59,48)]' 
    } else if (props.day >= 4 && props.day <=7) {
        return 'text-[rgb(255,149,0)]'
    } else if (props.day >= 8 && props.day <= 9) {
        return 'text-[rgb(255,204,0)]'
    } else if (props.day >= 10 && props.day <= 11) {
        return 'text-[rgb(200,230,0)]'
    } else if (props.day == 12) {
        return 'text-[rgb(160,216,0)]'
    } else if (props.day == 13) {
        return 'text-[rgb(120,200,0)]'
    } else if (props.day >= 14 && props.day <= 15) {
        return 'text-[rgb(80,184,0)]'
    } else {
        return 'text-[rgb(52,199,89)]'
    }
})

const descriptionContainerContrast = computed(() => {
     if (props.day >= 1 && props.day <= 3) {
        return 'bg-[rgba(255,59,48,0.03)] border-[rgba(255,59,48,0.145)]' 
    } else if (props.day >= 4 && props.day <= 5) {
        return 'bg-[rgba(255,107,48,0.03)] border-[rgba(255,107,48,0.145)]' 
    } else if (props.day >= 6 && props.day <= 7) {
        return 'bg-[rgba(255,149,0,0.03)] border-[rgba(255,149,0,0.145)]' 
    } else if (props.day >= 8 && props.day <= 9) {
        return 'bg-[rgba(255,204,0,0.03)] border-[rgba(255,204,0,0.145)]' 
    } else if (props.day >= 10 && props.day <= 11) {
        return 'bg-[rgba(200,230,0,0.03)] border-[rgba(200,230,0,0.145)]' 
    } else if (props.day == 12) {
        return 'bg-[rgba(160,216,0,0.03)] border-[rgba(160,216,0,0.145)]' 
    } else if (props.day == 13) {
        return 'bg-[rgba(120,200,0,0.03)] border-[rgba(120,200,0,0.145)]' 
    } else if (props.day >= 14 && props.day <= 15) {
        return 'bg-[rgba(64,168,0,0.03)] border-[rgba(64,168,0,0.145)]' 
    } else {
        return 'bg-[rgba(52,199,89,0.03)] border-[rgba(52,199,89,0.145)]'
    }
})

</script>

<template>  
    <div class="lg:col-span-3">
        <BlurReveal :delay="0.2" :duration="0.75" :key="props.day">
        <div class="mb-6">
            <div class="flex items-center gap-3 mb-2">
                <div class="text-6xl font-bold" :class="severityColor">
                    Day {{ props.day }}
                </div>
                <div v-if="props.day == 7" class="bg-[#ff9500] text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    DANGER ZONE
                </div>
                <div v-if="props.day == 21" class="flex items-center bg-[#34c759] text-white text-xs font-bold px-3 py-1 rounded-full">
                    RECOVERED <svg style="display: inline;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
	                                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m5 13l4 4L19 7" />
                                    </svg> 
                </div>
            </div>
            <div class="text-lg font-semibold mb-1" :class="severityColor">
                {{ phase }}
            </div>
        </div>
        <div class="rounded-2xl p-6 mb-6 border" :class="descriptionContainerContrast">
            <div class="flex items-center gap-2 mb-3">
                <svg :class="severityColor" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" class="lucide lucide-circle-alert">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" x2="12" y1="8" y2="12"></line>
                    <line x1="12" x2="12.01" y1="16" y2="16"></line>
                </svg>
                <span class="text-xs font-bold uppercase tracking-widest" :class="severityColor">
                    What's happening in your brain
                </span>
            </div>
            <p class="text-[#1d1d1f] leading-relaxed text-lg" :class="severityColor">
               {{ props.description }}
            </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-[#34c759]/6 border border-[#34c759]/20 rounded-2xl p-5">
                <div class="flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" class="lucide lucide-circle-check text-[#34c759]"
                        data-fg-cnbi168="33.116:33.38486:/src/app/pages/TwentyOneDayRule.tsx:1019:25:35679:129:e:CheckCircle2::::::CELI"
                        data-fgid-cnbi168=":r16r:">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m9 12 2 2 4-4"></path>
                    </svg>
                    <span class="font-bold text-sm text-[#1d1d1f]">
                        What you should do
                    </span>
                </div>
                <ul class="space-y-2.5">
                    <li v-for="item in props.toDo" :key="item" class="flex items-start gap-2 text-sm text-[#1d1d1f]">
                        <svg class="text-[#34c759]" style="display: inline;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
	                         <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m5 13l4 4L19 7" />
                        </svg>
                        {{ item }}
                    </li>
                </ul>
            </div>
            <div class="bg-[#ff3b30]/6 border border-[#ff3b30]/20 rounded-2xl p-5">
                <div class="flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" class="lucide lucide-circle-x text-[#ff3b30]"
                        data-fg-cnbi179="33.116:33.38486:/src/app/pages/TwentyOneDayRule.tsx:1043:25:36782:124:e:XCircle::::::BEhq"
                        data-fgid-cnbi179=":r17a:">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m15 9-6 6"></path>
                        <path d="m9 9 6 6"></path>
                    </svg>
                    <span class="font-bold text-sm text-[#1d1d1f]">
                        What you should avoid
                    </span>
                </div>
                <ul class="space-y-2.5">
                    <li v-for="item in props.notToDo" :key="item" class="flex items-start gap-2 text-sm text-[#1d1d1f]">
                        <svg class="text-[#ff3b30]" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
	                        <path fill="currentColor" d="M12 3a9 9 0 1 0 9 9a9 9 0 0 0-9-9m-7.5 9a7.44 7.44 0 0 1 1.7-4.74L16.74 17.8A7.49 7.49 0 0 1 4.5 12m13.3 4.74L7.26 6.2A7.49 7.49 0 0 1 17.8 16.74" />
                        </svg>
                        {{ item }}
                    </li>
                </ul>
            </div>
        </div>
        </BlurReveal>
    </div>
</template>

<style scoped></style>