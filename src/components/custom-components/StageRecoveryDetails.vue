<script setup>
const props = defineProps({
    stage: {
        type: Number,
        default: () => 0
    }
})

const stages = [
    {
        stage: 1,
        title: 'Stage 1: Complete Rest',
        duration: 'Minimum 24-48 hours (or until symptoms improve)',
        brainInfo: "Your brain has just experienced an energy crisis. Neurons are struggling to maintain normal function. The sudden impact disrupted your brain's chemical balance, causing a cascade of metabolic changes. Ion pumps are working overtime trying to restore equilibrium, depleting energy reserves. This is why you need complete rest - your brain needs all available energy just to stabilize itself at the cellular level.",
        allowedActivities: [
            'Complete physical and cognitive rest',
            'Sleep as much as possible',
            'Stay in a quiet, dark room',
            'Light meals if tolerated',
            'Have someone check on you regularly'
        ],
        restrictedActivities: [
            'ALL screens (phone, TV, computer, tablets)',
            'Any physical activity or exertion',
            'Reading, studying, or concentration tasks',
            'Loud noises or bright lights',
            'Being alone - you need supervision',
            'Driving or operating machinery'
        ],
        nextStageCriteria: 'Symptoms begin to stabilize and are no longer worsening. You can tolerate quiet room environment without symptom increase.'
    },
    {
        stage: 2,
        title: 'Stage 2: Light Activity',
        duration: 'Minimum 24 hours at this stage',
        brainInfo: "Your brain is still inflamed, but the acute crisis is passing. Mitochondria (your cells' power plants) are beginning to recover function. Blood flow is returning toward normal, but energy metabolism is still compromised. Think of your brain like a phone battery at 20% - it works, but you need to conserve power. Light activity helps promote healing without overwhelming your recovering neurons.",
        allowedActivities: [
            "Daily activities that don't increase symptoms",
            'Light walking (5-10 minutes)',
            'Very light cognitive tasks (short conversations)',
            'Gentle stretching or yoga',
            'Short screen time (15-20 minutes max) if tolerated'
        ],
        restrictedActivities: [
            'Any activity that increases symptoms',
            'Elevated heart rate or sweating',
            'Contact sports or collision risk',
            'Long periods of concentration',
            'Return to work or school',
            'Driving (unless symptoms fully resolved)'
        ],
        nextStageCriteria: "You can complete light daily activities without symptoms returning. You're symptom-free during rest periods."
    },
    {
        stage: 3,
        title: 'Stage 3: Moderate Activity',
        duration: 'Minimum 24 hours at this stage',
        brainInfo: "Your brain is rebuilding. Axons - the long nerve fibers that connect neurons - are regenerating. This is like repairing damaged cables in a computer network. Your brain's wiring is being restored, but it's fragile. Moderate cardiovascular activity helps promote blood flow, delivering oxygen and nutrients to healing cells. But contact sports would risk re-injuring these delicate new connections.",
        allowedActivities: [
            "Moderate cardiovascular exercise (stationary bike, jogging)",
            'Return to work or school (with accommodations if needed)',
            'Increased screen time if symptom-free',
            'Sport-specific skills without contact',
            'Strength training (light weights)'
        ],
        restrictedActivities: [
            'Contact sports or collision risk',
            'Heading the ball (soccer)',
            'Heavy weights or high-intensity training',
            'Activities with risk of falling',
            'Match play or competition',
        ],
        nextStageCriteria: "You can complete moderate exercise without symptoms. Cognitive tasks (school/work) are manageable without symptom return."
    },
    {
        stage: 4,
        title: 'Stage 4: Heavy Non-Contact Activity',
        duration: 'Minimum 24 hours at this stage',
        brainInfo: "Your brain's energy systems are coming back online. Mitochondria are producing ATP (cellular energy) more efficiently. Blood flow has normalized. However, your brain still doesn't have full reserves. Think of it like a car that's been refueled but the engine is still warming up. You can handle more intensity, but a collision could still cause disproportionate damage because your cellular reserves aren't fully restored.",
        allowedActivities: [
            "Progressive resistance training (heavier weights)",
            'Running and interval training',
            'Sport-specific drills at high intensity',
            'Non-contact team training',
            'Full return to school or work'
        ],
        restrictedActivities: [
            'Full contact practice',
            'Match play or competition',
            'Tackling or collision drills',
            'Any activity with head impact risk',
            'Heading the ball (soccer)',
        ],
        nextStageCriteria: "You can complete high-intensity training without symptoms. You feel confident in physical capacity but haven't been cleared for contact."
    },
    {
        stage: 5,
        title: 'Stage 5: Return to Full Training',
        duration: 'Minimum 24 hours at this stage',
        brainInfo: "Your brain has nearly completed structural repair. Cell membranes are stable. Axonal connections are restored. Neurotransmitter levels are back to normal. Your brain's architecture is sound again. Full training including controlled contact helps test your brain's resilience in a supervised environment before competition. This stage confirms your brain can handle the physical and cognitive demands of your sport.",
        allowedActivities: [
            "Full training with contact (if cleared by doctor)",
            'All sport-specific activities',
            'Match simulation drills',
            'Tactical training',
            'Normal daily activities without restriction'
        ],
        restrictedActivities: [
            'Match play or competition (until medical clearance)',
            'Returning without medical sign-off',
        ],
        nextStageCriteria: "You complete full training including contact without any symptom return. Medical assessment confirms you're ready for competition."
    },
    {
        stage: 6,
        title: 'Stage 6: Return to Sport',
        duration: 'After medical clearance',
        brainInfo: "Congratulations - your brain has completed neurometabolic recovery. Energy metabolism is fully restored. Axons are regenerated. Cell membranes are stable. Your brain has rebuilt the reserves that were depleted on Day 1. You're cleared to return to full competition. However, remember: each concussion makes the next one more likely and more severe. Protect your brain through proper technique, appropriate equipment, and by never hiding symptoms.",
        allowedActivities: [
            "Full return to competition and match play",
            'All sport activities without restriction',
            'Continue monitoring for any symptoms',
        ],
        restrictedActivities: [
            'Playing through head injury symptoms',
            'Hiding concussion signs from coaches or teammates',
            'Taking unnecessary risks'
        ],
        nextStageCriteria: "Medical clearance obtained. No symptoms during full training or competition."
    },
]
</script>

<template>

    <div class="bg-white rounded-3xl p-10 shadow-2xl shadow-black/5 border-2 border-[#007aff]"
        style="opacity: 1; transform: none;">
        <div class="flex items-start justify-between mb-8 flex-wrap gap-4">
            <div>
                <div class="text-[#007aff] text-5xl font-semibold mb-3">Stage {{ stages[props.stage - 1].stage }}</div>
                <h3 class="text-3xl font-semibold text-[#1d1d1f] mb-2">{{ stages[props.stage - 1].title }}</h3>
                <p class="text-[#86868b] text-lg"><strong>Duration:</strong> {{ stages[props.stage - 1].duration }}</p>
            </div>
            <div class="bg-[#007aff]/10 rounded-2xl p-4"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" class="lucide lucide-brain text-[#007aff]">
                    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z">
                    </path>
                    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z">
                    </path>
                    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path>
                    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path>
                    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path>
                    <path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path>
                    <path d="M19.938 10.5a4 4 0 0 1 .585.396"></path>
                    <path d="M6 18a4 4 0 0 1-1.967-.516"></path>
                    <path d="M19.967 17.484A4 4 0 0 1 18 18"></path>
                </svg></div>
        </div>
        <div
            class="bg-gradient-to-br from-[#007aff]/10 to-[#5ac8fa]/10 rounded-2xl p-8 mb-8 border border-[#007aff]/30">
            <div class="flex items-start gap-4">
                <div class="bg-[#007aff] rounded-2xl p-3 flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg"
                        width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain text-white">
                        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z">
                        </path>
                        <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z">
                        </path>
                        <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path>
                        <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path>
                        <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path>
                        <path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path>
                        <path d="M19.938 10.5a4 4 0 0 1 .585.396"></path>
                        <path d="M6 18a4 4 0 0 1-1.967-.516"></path>
                        <path d="M19.967 17.484A4 4 0 0 1 18 18"></path>
                    </svg></div>
                <div>
                    <h4 class="text-[#1d1d1f] font-semibold mb-3 text-xl">What's happening in your brain</h4>
                    <p class="text-[#1d1d1f] leading-relaxed text-lg">
                        {{ stages[props.stage - 1].brainInfo }}
                    </p>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div class="bg-[#34c759]/5 rounded-2xl p-6 border border-[#34c759]/30">
                <h4 class="text-[#1d1d1f] font-semibold mb-4 flex items-center gap-2 text-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" class="lucide lucide-circle-check text-[#34c759]"
                        data-fg-cnbi168="33.116:33.38486:/src/app/pages/TwentyOneDayRule.tsx:1019:25:35679:129:e:CheckCircle2::::::CELI"
                        data-fgid-cnbi168=":r16r:">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m9 12 2 2 4-4"></path>
                    </svg>Allowed Activities
                </h4>
                <ul class="space-y-3">
                    <li class="flex items-start gap-3" v-for="activity in stages[props.stage - 1].allowedActivities"
                        :key="activity">
                        <svg class="text-[#34c759]" style="display: inline;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
	                         <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m5 13l4 4L19 7" />
                        </svg>
                        <span class="text-[#1d1d1f] text-lg">
                            {{ activity }}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="bg-[#ff3b30]/5 rounded-2xl p-6 border border-[#ff3b30]/30">
                <h4 class="text-[#1d1d1f] font-semibold mb-4 flex items-center gap-2 text-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" class="lucide lucide-circle-x text-[#ff3b30]"
                        data-fg-cnbi179="33.116:33.38486:/src/app/pages/TwentyOneDayRule.tsx:1043:25:36782:124:e:XCircle::::::BEhq"
                        data-fgid-cnbi179=":r17a:">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m15 9-6 6"></path>
                        <path d="m9 9 6 6"></path>
                    </svg>Restricted Activities</h4>
                <ul class="space-y-3">
                    <li class="flex items-start gap-3" v-for="activity in stages[props.stage - 1].restrictedActivities"
                        :key="activity">
                        <svg class="text-[#ff3b30]" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
	                        <path fill="currentColor" d="M12 3a9 9 0 1 0 9 9a9 9 0 0 0-9-9m-7.5 9a7.44 7.44 0 0 1 1.7-4.74L16.74 17.8A7.49 7.49 0 0 1 4.5 12m13.3 4.74L7.26 6.2A7.49 7.49 0 0 1 17.8 16.74" />
                        </svg>
                        <span class="text-[#1d1d1f] text-lg">
                            {{ activity }}
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="bg-[#f5f5f7] rounded-2xl p-6">
            <h4 class="text-[#1d1d1f] font-semibold mb-3 text-lg">When can I move to the next stage?</h4>
            <p class="text-[#1d1d1f] leading-relaxed text-lg">
                {{ stages[props.stage - 1].nextStageCriteria }}
            </p>
        </div>
    </div>

</template>

<style scoped></style>