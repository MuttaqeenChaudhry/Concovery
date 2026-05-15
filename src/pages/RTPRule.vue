<script setup>
import DayRecoveryDescription from '@/components/custom-components/DayRecoveryDescription.vue';
import BlurReveal from '@/components/ui/blur-reveal/BlurReveal.vue';
import { computed, ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';

const scienceHidden = ref(true)
const selectedTimeline = ref(1)
const selectedNeuroButton = ref(1)

const sceneMap = {
    1: 'impact',
    2: 'shearing',
    3: 'cascade',
    4: 'symptom-gap',
    5: 'repair',
    6: 'recovered',
}

const currentScene = computed(() => {
    return sceneMap[selectedNeuroButton.value]
})

const controlNsPagination = (direction) => {
    if(direction == "forwards"){
        if(selectedNeuroButton.value < 6){
            selectedNeuroButton.value += 1
        }
    } else {
        if(selectedNeuroButton.value > 1){
            selectedNeuroButton.value -= 1
        }
    }
}

// const neuroScienceData = [
//     {
//         heading: "The Impact",
//         subheading: "What happends in milliseconds",
//         description: "A rotational force hits the brain. The skull stops but the brain keeps moving — twisting inside. This shearing force stretches axons (the long fibres connecting neurons) beyond their elastic limit.",
//         citation: "Diffuse Axonal Injury - Giza & Hovda, 2014"
//     },
//     {
//         heading: "Axonal Shearing",
//         subheading: "The invisible damage",
//         description: "Stretched axons lose their ability to transmit signals. Some snap completely. This disrupts communication across the entire brain - even though you cannot see or feel it happening.",
//         citation: "Axonal Stretch Injury - Queensland Brain Institute"
//     },
//     {
//         heading: "Neurometabolic Crisis",
//         subheading: "Days 1 through 7",
//         description: "Damaged axons flood the brain with glutamate. Potassium leaks out of cells. The brain burns through ATP (energy) trying to restore balance. This energy crisis is why you feel foggy, slow, and exhausted.",
//         citation: "Neurometabolic Cascade - Giza & Hovda, 2014"
//     },
//     {
//         heading: "The Symptom Gap",
//         subheading: "Day 7 - the danger zone",
//         description: "Your symptoms clear because the acute energy crisis stabilises. But axonal repair has barely begun. Your brain is only 30-40% recovered. This is why feeling fine is not the same as being healed.",
//         citation: "AIS Position Statement 2024 - concussioninsport.gov.au"
//     },
//     {
//         heading: "Axonal Repair",
//         subheading: "Days 7 through 21",
//         description: "Microtubules slowly rebuild inside damaged axons. New myelin sheaths form. Neural pathways reconnect. This structural repair takes the full 21 days - it cannot be rushed.",
//         citation: "Structural Recovery Timeline - AIS 2024"
//     },
//     {
//         heading: "Day 21 - Fully Recovered",
//         subheading: "Safe to return",
//         description: "Axons are repaired. Energy metabolism is restored. Myelin sheaths are rebuilt. Neural pathways are reconnected. Only now is the brain ready to handle the forces of contact sport.",
//         citation: "AIS Concussion and Brain Health Position Statement 2024"
//     }
// ]

const neuroScienceData = [
    {
        heading: "The Impact",
        subheading: "What happens instantly",
        description: "A hit causes your brain to twist inside your skull. Even though your head stops, your brain keeps moving. This stretches important connections in the brain beyond what they can handle.",
        citation: "Giza & Hovda, 2014"
    },
    {
        heading: "Axonal Shearing",
        subheading: "Hidden injury",
        description: "The brain's communication lines get stretched or torn. Messages between different parts of your brain slow down or stop - even if you don't feel it right away.",
        citation: "Queensland Brain Institute"
    },
    {
        heading: "Energy Crash",
        subheading: "Days 1 through 7",
        description: "Your brain goes into overdrive trying to fix itself. It burns a lot of energy, which is why you feel tired, foggy, and slow during this time.",
        citation: "Giza & Hovda, 2014"
    },
    {
        heading: "The Danger Zone",
        subheading: "Around Day 7",
        description: "You might feel normal again - but your brain isn't fully healed. It's still recovering behind the scenes, which makes this a risky time to return too early.",
        citation: "AIS 2024"
    },
    {
        heading: "Repair Phase",
        subheading: "Days 7-21",
        description: "Your brain starts rebuilding damaged connections. This process takes time and can't be rushed, even if you feel okay.",
        citation: "AIS 2024"
    },
    {
        heading: "Full Recovery",
        subheading: "Around Day 21",
        description: "Your brain connections are repaired and working properly again. Only now is it safe to return to full contact sport.",
        citation: "AIS 2024"
    }
]

const helpfulTrackingInfo = [
    {
        recoveryPercentage: 5, 
        brainState: "Brain in crisis"
    },
    {
        recoveryPercentage: 8, 
        brainState: "Brain in crisis"
    },
    {
        recoveryPercentage: 12, 
        brainState: "Brain in crisis"
    },
    {
        recoveryPercentage: 18, 
        brainState: "Brain in crisis"
    },
    {
        recoveryPercentage: 22, 
        brainState: "Brain in crisis"
    },
    {
        recoveryPercentage: 27, 
        brainState: "Still healing"
    },
    {
        recoveryPercentage: 30, 
        brainState: "Still healing"
    },
    {
        recoveryPercentage: 38, 
        brainState: "Still healing"
    },
    {
        recoveryPercentage: 45, 
        brainState: "Repairing"
    },
    {
        recoveryPercentage: 52, 
        brainState: "Repairing"
    },
    {
        recoveryPercentage: 58, 
        brainState: "Repairing"
    },
    {
        recoveryPercentage: 64, 
        brainState: "Repairing"
    },
    {
        recoveryPercentage: 70, 
        brainState: "Repairing"
    },
    {
        recoveryPercentage: 76, 
        brainState: "Repairing"
    },
    {
        recoveryPercentage: 82, 
        brainState: "Repairing"
    },
    {
        recoveryPercentage: 86, 
        brainState: "Repairing"
    },
    {
        recoveryPercentage: 89, 
        brainState: "Repairing"
    },
    {
        recoveryPercentage: 92, 
        brainState: "Repairing"
    },
    {
        recoveryPercentage: 94, 
        brainState: "Repairing"
    },
    {
        recoveryPercentage: 97, 
        brainState: "Repairing"
    },
    {
        recoveryPercentage: 100, 
        brainState: "Fully Recovered"
    }
]

const subHeadingColor  = computed(() => {
    switch(selectedNeuroButton.value){
        case 1:
            return "text-[rgb(255,49,48)]"
        case 2:
            return "text-[rgb(255,107,48)]"
        case 3:
            return "text-[rgb(255,149,0)]"
        case 4:
            return "text-[rgb(255,204,0)]"
        case 5:
            return "text-[rgb(52,199,89)]"
        case 6:
            return "text-[rgb(0,122,255)]"
    }
})

const percentageRecoveryBgColor = computed(() => {
    if(selectedTimeline.value <= 3){
        return "bg-[rgba(255,59,48,0.082)] text-[rgb(255,59,48)]"
    } else if (selectedTimeline.value > 3 && selectedTimeline.value <= 5){
        return "bg-[rgba(255,107,48,0.082)] text-[rgb(255,107,48)]"
    } else if (selectedTimeline.value > 5 && selectedTimeline.value <= 7){
        return "bg-[rgba(255,149,0,0.082)] text-[rgb(255,149,0)]"
    } else if (selectedTimeline.value > 7 && selectedTimeline.value <= 9){
        return "bg-[rgba(255,204,0,0.082)] text-[rgb(255,204,0)]"
    } else if (selectedTimeline.value > 9 && selectedTimeline.value <= 11){
        return "bg-[rgba(200,230,0,0.082)] text-[rgb(200,230,0)]"
    } else if (selectedTimeline.value == 12){
        return "bg-[rgba(160,216,0,0.082)] text-[rgb(160,216,0)]"
    } else if (selectedTimeline.value == 13){
        return "bg-[rgba(120,200,0,0.082)] text-[rgb(120,200,0)]"
    } else if (selectedTimeline.value > 13 && selectedTimeline.value <= 15){
        return "bg-[rgba(80,184,0,0.082)] text-[rgb(80,184,0)]"
    }  else {
        return "bg-[rgba(52,199,89,0.082)] text-[rgb(52,199,89)]"
    }
})

const handleTimelinePagination = (direction) => {
    if (direction === 'forwards' && selectedTimeline.value < 21) {
        selectedTimeline.value++;
    } else if (direction === 'backwards' && selectedTimeline.value > 1) {
        selectedTimeline.value--;
    }
}

const daysDescription = [
    {
        day: 1,
        description: "Your brain has just been injured. Energy metabolism is disrupted and cells are vulnerable. Complete rest is critical.",
        toDo: [
            "Stay home in a quiet, dark room",
            "Sleep as much as possible",
            "Light meals if you can stomach them",
            "Tell someone about all symptoms",
            "See a doctor as soon as possible"
        ],
        notToDo: [
            "All screens (phone, TV, computer)",
            "Physical activity of any kind",
            "Loud noises or bright lights",
            "Loud noises or bright lights",
            "Being alone  have someone check on you"
        ]
    },
    {
        day: 2,
        description: "Your brain is still in crisis mode. Chemical imbalances continue. You likely feel worse today than yesterday - that's normal.",
        toDo: [
            "Continue complete rest",
            "Stay in a calm environment",
            "Drink water regularly",
            "Track your symptoms",
            "Keep emergency numbers handy"
        ],
        notToDo: [
            "All screens (phone, TV, computer)",
            "Any physical exertion",
            "Stress or emotional situations",
            "Trying to 'test' if you're better",
            "Alcohol and recreational drugs"
        ]
    },
    {
        day: 3,
        description: "Inflammation is still high. Your brain is working hard to stabilize, even if you're lying still.",
        toDo: [
            "Rest remains the priority",
            "Very short walks around the house if tolerated",
            "Keep room dark and quiet",
            "Eat nutritious meals",
            "Journal symptoms if possible"
        ],
        notToDo: [
            "Screens (small amounts only if necessary)",
            "Leaving the house unnecessarily",
            "Physical activity",
            "Stressful conversations",
            "Rushing recovery"
        ]
    },
    {
        day: 4,
        description: "Acute symptoms may start to ease slightly, but cellular recovery is just beginning. Don't be fooled by feeling 'a bit better'.",
        toDo: [
            "Very light activities if symptoms allow",
            "Short walks (5-10 minutes)",
            "Light stretching",
            "Gradual return to screens (15-20 min max)",
            "Continue tracking symptoms"
        ],
        notToDo: [
            "Cardio or elevated heart rate",
            "Contact sports or collision risk",
            "Long screen time",
            "Returning to study or work",
            "Anything that brings symptoms back"
        ]
    },
    {
        day: 5,
        description: "You might feel almost normal for periods. Remember: your brain cells are still repairing connections and restoring energy balance.",
        toDo: [
            "Light cognitive tasks if no symptom increase",
            "Gentle movement (walking, yoga)",
            "Return to screens gradually",
            "Social interaction in calm settings",
            "Listen to your body"
        ],
        notToDo: [
            "Any activity that causes symptoms",
            "Sports or high-intensity exercise",
            "Loud environments",
            "Driving if symptoms return",
            "Full work or school days"
        ]
    },
    {
        day: 6,
        description: "Symptom-free periods are getting longer. This is progress, but cellular healing continues beneath the surface.",
        toDo: [
            "Increase activity gradually",
            "Light exercise if cleared by doctor",
            "Return to school/work part-time",
            "Continue good sleep habits",
            "Stay patient"
        ],
        notToDo: [
            "Returning to sport",
            "High-risk activities",
            "All-nighters or poor sleep",
            "Alcohol",
            "Rushing back to full intensity"
        ]
    },
    {
        day: 7,
        description: "THIS IS THE DANGER ZONE. You likely feel completely fine. Your symptoms have resolved. But your brain is only 30-40% recovered at the cellular level.",
        toDo: [
            "Continue gradual increase in activity",
            "Maintain good sleep and nutrition",
            "Light exercise if symptom-free",
            "Remember: no symptoms - not equal to - fully healed",
            "Resist pressure to return to sport"
        ],
        notToDo: [
            "RETURNING TO SPORT - 3-5x re-injury risk",
            "Contact drills or collision risk",
            "High-intensity training",
            "Believing you're fully healed",
            "Letting others pressure you"
        ]
    },
    {
        day: 8,
        description: "You feel normal but axons (brain cell connections) are still regenerating. Energy metabolism is still compromised.",
        toDo: [
            "Increase cognitive load gradually",
            "Moderate exercise if cleared",
            "Full school/work if tolerated",
            "Stay consistent with recovery plan",
            "Keep doctor appointments"
        ],
        notToDo: [
            "Contact sports",
            "Activities with collision risk",
            "Overconfidence",
            "Skipping follow-up appointments",
            "Training at game intensity"
        ]
    },
    {
        day: 9,
        description: "Mitochondria (cell power plants) are recovering function. Blood flow is normalizing but still not baseline.",
        toDo: [
            "Continue structured return-to-sport protocol if cleared",
            "Non-contact drills only",
            "Cardiovascular exercise",
            "Strength training (light)",
            "Monitor for any symptom return"
        ],
        notToDo: [
            "Contact practice",
            "Heading the ball (soccer)",
            "Tackling drills",
            "Full-intensity sprints",
            "Game situations"
        ]
    },
    {
        day: 10,
        description: "Your brain is rebuilding its capacity to handle stress and impact, but it's still vulnerable to re-injury.",
        toDo: [
            "Progress to moderate-intensity exercise",
            "Sport-specific skills without contact",
            "Continue monitoring symptoms",
            "Gradual return to normal routine",
            "Stay hydrated and well-nourished"
        ],
        notToDo: [
            "Contact training",
            "Match play",
            "Competitive intensity",
            "Ignoring minor symptoms"
        ]
    },
    {
        day: 11,
        description: "Neuroplasticity is active. New pathways are forming to replace damaged ones.",
        toDo: [
            "Continue graded return-to-sport protocol",
            "Increase training intensity slightly",
            "Non-contact skills work",
            "Team training (no contact)",
            "Maintain sleep schedule"
        ],
        notToDo: [
            "Full contact",
            "Match simulation",
            "High-collision drills",
            "Rushing progression",
            "Late nights"
        ]
    },
    {
        day: 12,
        description: "Roughly halfway through cellular recovery. Your brain is more resilient than Day 7 but still not ready for full contact.",
        toDo: [
            "Progress to higher-intensity training",
            "Controlled contact drills if cleared by doctor",
            "Continue symptom monitoring",
            "Full return to school/work",
            "Maintain healthy habits"
        ],
        notToDo: [
            "Game play",
            "Full-speed contact",
            "High-risk situations",
            "Assuming you're fully healed",
            "Alcohol and drugs"
        ]
    },
    {
        day: 13,
        description: "The finish line is in sight but not here yet. Axonal regeneration is ongoing. Energy stores are replenishing.",
        toDo: [
            "Continue return-to-sport progression",
            "Near-normal training if symptom-free",
            "Light contact drills if cleared",
            "Prepare mentally for return",
            "Stay patient"
        ],
        notToDo: [
            "Match play",
            "Full-intensity contact",
            "Complacency",
            "Peer pressure to play early"
        ]
    },
    {
        day: 14,
        description: "Two weeks in. Your brain has made significant progress but is still finishing critical repairs at the microscopic level.",
        toDo: [
            "Full training if symptom-free and cleared",
            "Controlled full-contact practice",
            "Continue monitoring",
            "Stay committed to final week",
            "Prepare for medical clearance"
        ],
        notToDo: [
            "Game play without medical clearance",
            "Shortcuts in protocol",
            "Returning if any doubt",
            "Pressure from coaches"
        ]
    },
    {
        day: 15,
        description: "Cell membranes are stabilizing. Neurotransmitter levels are approaching normal. Blood flow is nearly restored.",
        toDo: [
            "Full training load",
            "Match-simulation drills",
            "Complete return-to-sport protocol",
            "Medical assessment for clearance",
            "Trust the process"
        ],
        notToDo: [
            "Playing without clearance",
            "Skipping medical check",
            "High-risk behavior off the field",
            "Alcohol",
            "All-nighters"
        ]
    },
    {
        day: 16,
        description: "Your brain is rebuilding reserves that will protect you from future injury. Each additional day matters.",
        toDo: [
            "Full participation in training",
            "Maintain all healthy habits",
            "Stay focused on recovery",
            "Complete any required testing",
            "Prepare for return"
        ],
        notToDo: [
            "Rushing back without clearance",
            "Risky activities outside sport",
            "Poor sleep or nutrition",
            "Complacency"
        ]
    },
    {
        day: 17,
        description: "Metabolic recovery is nearly complete but structural repair continues. Your brain is almost ready.",
        toDo: [
           "Continue full training",
            "Maintain symptom-free status",
            "Stay consistent",
            "Follow medical advice",
            "Plan for safe return"
        ],
        notToDo: [
            "Playing without medical clearance",
            "Assuming you're invincible",
            "Risky decisions",
            "Alcohol or drugs"
        ]
    },
    {
        day: 18,
        description: "Your brain's resilience is returning. The cellular architecture is stabilizing. Nearly there.",
        toDo: [
            "Full training participation",
            "Prepare mentally for return",
            "Stay focused",
            "Complete medical clearance process",
            "Reflect on recovery journey"
        ],
        notToDo: [
            "Playing without approval",
            "Overconfidence",
            "High-risk activities",
            "Substance use"
        ]
    },
    {
        day: 19,
        description: "Final stages of cellular recovery. Your brain is rebuilding the reserves that were depleted on Day 1.",
        toDo: [
            "Full training",
            "Medical clearance appointment",
            "Stay symptom-free",
            "Prepare equipment and mindset",
            "Trust you've done the work"
        ],
        notToDo: [
            "Returning without clearance",
            "Complacency in final days",
            "Risky behavior",
            "Alcohol"
        ]
    },
    {
        day: 20,
        description: "One day away. Your brain has nearly completed the complex process of healing from cellular injury",
        toDo: [
            "Final medical clearance",
            "Full training if approved",
            "Prepare for return to play",
            "Stay healthy and rested",
            "Be proud of your patience"
        ],
        notToDo: [
            "Playing without final clearance",
            "Celebrating too early with alcohol",
            "Risky behavior",
            "Overexertion"
        ]
    },
    {
        day: 21,
        description: "Congratulations. Your brain has completed neurometabolic and structural recovery. Energy metabolism is restored. Axons are regenerated. You're cleared to return - WITH medical clearance.",
        toDo: [
            "Get final medical clearance",
            "Return to full competition",
            "Continue monitoring for symptoms",
            "Protect yourself from future injury",
            "Remember what you learned"
        ],
        notToDo: [
            "Playing without medical sign-off",
            "Immediately playing at maximum intensity",
            "Ignoring any returning symptoms",
            "Taking unnecessary risks"
        ]
    }
]

// Global Animation Variables
const brainCanvas = ref(null)

let animationFrame = null
let time = 0

const axons = []
const glutamateParticles = []
const potassiumParticles = []
const atpParticles = []
const leftNeurons = []
const rightNeurons = []
const recoveredNeurons = []

watch(currentScene, () => {

    time = 0

    const canvas = brainCanvas.value

    if (!canvas) return

    createScene(canvas.width, canvas.height)
})

function createScene(width, height) {

    axons.length = 0

    const scene = currentScene.value

    // IMPACT + SHEARING
    if (scene === 'impact' || scene === 'shearing') {

        const AXON_COUNT = 40

        for (let i = 0; i < AXON_COUNT; i++) {

            const angle = (i / AXON_COUNT) * Math.PI * 2
            const r = 60 + Math.random() * 80

            axons.push({
                x: width / 2 + Math.cos(angle) * r * 0.7,
                y: height / 2 + Math.sin(angle) * r * 0.5,
                length: 30 + Math.random() * 40,
                angle: Math.random() * Math.PI * 2,
                opacity: 0.7 + Math.random() * 0.3,
                broken: false,
            })
        }
    }
    // Cascade
    if (scene === 'cascade') {

    glutamateParticles.length = 0
    potassiumParticles.length = 0
    atpParticles.length = 0

    // GLUTAMATE FLOOD
    for (let i = 0; i < 60; i++) {

        glutamateParticles.push({
            x: width / 2 + (Math.random() - 0.5) * 80,
            y: height / 2 + (Math.random() - 0.5) * 80,

            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,

            r: 4 + Math.random() * 3,

            opacity: 0
        })
    }

    // POTASSIUM LEAK
    for (let i = 0; i < 40; i++) {

        potassiumParticles.push({
            x: width / 2 + (Math.random() - 0.5) * 120,
            y: height / 2 + (Math.random() - 0.5) * 100,

            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,

            r: 3 + Math.random() * 2,

            opacity: 0
        })
    }

    // ATP ENERGY
    for (let i = 0; i < 50; i++) {

        atpParticles.push({
            x: 30 + Math.random() * (width - 60),
            y: 30 + Math.random() * (height - 60),

            r: 5 + Math.random() * 3,

            depleted: false,

            depleteTime: 1 + Math.random() * 5
        })
    }
    }

    // Symptom Gap
    if (scene === 'symptom-gap') {
        leftNeurons.length = 0
        rightNeurons.length = 0
        //
        // LEFT SIDE
        //
        for (let i = 0; i < 25; i++) {

            leftNeurons.push({

                x: width * 0.08 + Math.random() * (width * 0.38),

                y: height * 0.15 + Math.random() * (height * 0.7),

                r: 5 + Math.random() * 4,

                pulse: Math.random() * Math.PI * 2,

                active: true
            })
        }

        //
        // RIGHT SIDE
        //
        for (let i = 0; i < 25; i++) {

            rightNeurons.push({

                x: width * 0.54 + Math.random() * (width * 0.38),

                y: height * 0.15 + Math.random() * (height * 0.7),

                r: 5 + Math.random() * 4,

                pulse: Math.random() * Math.PI * 2,

                active: Math.random() > 0.45,

                broken: Math.random() > 0.5
            })
        }

    }

    // Repair
    if (scene === "repair") {

    axons.length = 0

    for (let i = 0; i < 35; i++) {

        const angle = Math.random() * Math.PI * 2
        const r = 40 + Math.random() * 90

        axons.push({
            x: width / 2 + Math.cos(angle) * r * 0.75,

            y: height / 2 + Math.sin(angle) * r * 0.55,

            length: 25 + Math.random() * 40,

            angle: Math.random() * Math.PI * 2,

            repairProgress: 0,

            repairDelay: Math.random() * 3,

            repairSpeed: 0.08 + Math.random() * 0.15
        })
    }
    }   
    // recovered neurons
    if (scene === "recovered") {

    recoveredNeurons.length = 0

    for (let i = 0; i < 40; i++) {

        const angle = Math.random() * Math.PI * 2
        const r = 20 + Math.random() * 110

        recoveredNeurons.push({

            x: width / 2 + Math.cos(angle) * r * 0.8,

            y: height / 2 + Math.sin(angle) * r * 0.65,

            r: 4 + Math.random() * 4,

            pulse: Math.random() * Math.PI * 2,

            signalPhase: Math.random()
        })
    }
    }
}

function drawBrainSilhouette(ctx, width, height) {
    ctx.beginPath()

    ctx.ellipse(
        width / 2,
        height / 2,
        width * 0.42,
        height * 0.4,
        0,
        0,
        Math.PI * 2
    )

    ctx.fillStyle = 'rgba(255,59,48,0.06)'
    ctx.fill()

    ctx.strokeStyle = 'rgba(255,59,48,0.2)'
    ctx.lineWidth = 1.5
    ctx.stroke()
}

function animate() {

    const canvas = brainCanvas.value

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const W = canvas.width
    const H = canvas.height

    const scene = currentScene.value

    time += 0.016

    ctx.clearRect(0, 0, W, H)

    // IMPACT
    if (scene === "impact") {

        const shakeX =
            Math.sin(time * 8) * Math.max(0, 1 - time * 0.5) * 8

        const shakeY =
            Math.cos(time * 6) * Math.max(0, 1 - time * 0.5) * 4

        ctx.save()

        ctx.translate(shakeX, shakeY)

        drawBrainSilhouette(ctx, W, H)

        const stretchAmount = Math.min(time * 0.5, 0.8)

        axons.forEach((axon) => {

            const stretch =
                1 + stretchAmount * (0.3 + Math.random() * 0.2)

            const len = axon.length * stretch

            const x1 =
                axon.x - (Math.cos(axon.angle) * len) / 2

            const y1 =
                axon.y - (Math.sin(axon.angle) * len) / 2

            const x2 =
                axon.x + (Math.cos(axon.angle) * len) / 2

            const y2 =
                axon.y + (Math.sin(axon.angle) * len) / 2

            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)

            ctx.strokeStyle = `rgba(100,180,255,${axon.opacity})`
            ctx.lineWidth = 2
            ctx.stroke()

            ctx.beginPath()
            ctx.arc(x1, y1, 3, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(100,180,255,0.8)'
            ctx.fill()

            ctx.beginPath()
            ctx.arc(x2, y2, 3, 0, Math.PI * 2)
            ctx.fill()
        })

        ctx.restore()
    }

    // SHEARING
    if (scene === "shearing") {

        drawBrainSilhouette(ctx, W, H)

        axons.forEach((axon) => {

            if (!axon.broken && Math.random() < 0.01) {
                axon.broken = true
            }

            if (!axon.broken) {

                const x1 =
                    axon.x - (Math.cos(axon.angle) * axon.length) / 2

                const y1 =
                    axon.y - (Math.sin(axon.angle) * axon.length) / 2

                const x2 =
                    axon.x + (Math.cos(axon.angle) * axon.length) / 2

                const y2 =
                    axon.y + (Math.sin(axon.angle) * axon.length) / 2

                ctx.beginPath()
                ctx.moveTo(x1, y1)
                ctx.lineTo(x2, y2)

                ctx.strokeStyle = 'rgba(100,180,255,0.8)'
                ctx.lineWidth = 2
                ctx.stroke()

            } else {

                ctx.beginPath()

                ctx.moveTo(axon.x - 15, axon.y)
                ctx.lineTo(axon.x - 2, axon.y)

                ctx.strokeStyle = 'rgba(255,80,80,0.9)'
                ctx.lineWidth = 2
                ctx.stroke()

                ctx.beginPath()

                ctx.moveTo(axon.x + 2, axon.y)
                ctx.lineTo(axon.x + 15, axon.y)

                ctx.stroke()
            }
        })
    }

    // Cascade
    if (scene === 'cascade') {

Add:

drawBrainSilhouette(ctx, W, H)

//
// ATP ENERGY
//
atpParticles.forEach((a) => {

    if (!a.depleted && time > a.depleteTime) {
        a.depleted = true
    }

    if (!a.depleted) {

        const g = ctx.createRadialGradient(
            a.x,
            a.y,
            0,
            a.x,
            a.y,
            a.r * 2.5
        )

        g.addColorStop(0, 'rgba(0,122,255,0.6)')
        g.addColorStop(1, 'rgba(0,122,255,0)')

        ctx.beginPath()
        ctx.arc(a.x, a.y, a.r * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()

        ctx.beginPath()
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0,122,255,0.8)'
        ctx.fill()

    } else {

        ctx.beginPath()
        ctx.arc(a.x, a.y, a.r * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(150,150,150,0.2)'
        ctx.fill()
    }
})

//
// GLUTAMATE FLOOD
//
glutamateParticles.forEach((g) => {

    g.x += g.vx
    g.y += g.vy

    const dx = g.x - W / 2
    const dy = g.y - H / 2

    const dist =
        (dx * dx) / ((W * 0.42) ** 2) +
        (dy * dy) / ((H * 0.4) ** 2)

    if (dist > 1) {
        g.vx *= -1
        g.vy *= -1
    }

    g.opacity = Math.min(g.opacity + 0.03, 0.9)

    const gradient = ctx.createRadialGradient(
        g.x,
        g.y,
        0,
        g.x,
        g.y,
        g.r * 2.5
    )

    gradient.addColorStop(0, `rgba(255,59,48,${g.opacity})`)
    gradient.addColorStop(1, 'rgba(255,59,48,0)')

    ctx.beginPath()
    ctx.arc(g.x, g.y, g.r * 2.5, 0, Math.PI * 2)

    ctx.fillStyle = gradient
    ctx.fill()

    ctx.beginPath()
    ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2)

    ctx.fillStyle = `rgba(255,59,48,${g.opacity})`
    ctx.fill()
})

//
// POTASSIUM LEAK
//
potassiumParticles.forEach((k) => {

    k.x += k.vx
    k.y += k.vy

    const dx = k.x - W / 2
    const dy = k.y - H / 2

    const dist =
        (dx * dx) / ((W * 0.42) ** 2) +
        (dy * dy) / ((H * 0.4) ** 2)

    if (dist > 1) {
        k.vx *= -1
        k.vy *= -1
    }

    k.opacity = Math.min(k.opacity + 0.03, 0.8)

    ctx.beginPath()

    ctx.arc(
        k.x,
        k.y,
        k.r,
        0,
        Math.PI * 2
    )

    ctx.fillStyle = `rgba(255,149,0,${k.opacity})`
    ctx.fill()
})

//
// LABELS
//
ctx.fillStyle = 'rgba(255,59,48,0.85)'
ctx.font = '12px sans-serif'
ctx.fillText('Glutamate flood', 45, H - 50)

ctx.fillStyle = 'rgba(255,149,0,0.85)'
ctx.fillText('K+ ion leak', 45, H - 34)

ctx.fillStyle = 'rgba(0,122,255,0.85)'
ctx.fillText('ATP depletion', 45, H - 16)

    }

    // Symptom Gap
    if (scene === 'symptom-gap') {
        //
// LEFT BRAIN
//
ctx.beginPath()

ctx.ellipse(
    W * 0.27,
    H / 2,
    W * 0.22,
    H * 0.4,
    0,
    0,
    Math.PI * 2
)

ctx.fillStyle = 'rgba(52,199,89,0.05)'
ctx.fill()

ctx.strokeStyle = 'rgba(52,199,89,0.25)'
ctx.lineWidth = 1.5
ctx.stroke()

//
// LEFT CONNECTIONS
//
for (let i = 0; i < leftNeurons.length; i++) {

    for (let j = i + 1; j < leftNeurons.length; j++) {

        const dx = leftNeurons[i].x - leftNeurons[j].x
        const dy = leftNeurons[i].y - leftNeurons[j].y

        const d = Math.sqrt(dx * dx + dy * dy)

        if (d < 65) {

            ctx.beginPath()

            ctx.moveTo(
                leftNeurons[i].x,
                leftNeurons[i].y
            )

            ctx.lineTo(
                leftNeurons[j].x,
                leftNeurons[j].y
            )

            ctx.strokeStyle =
                `rgba(52,199,89,${(1 - d / 65) * 0.35})`

            ctx.lineWidth = 0.8
            ctx.stroke()
        }
    }
}

//
// LEFT NEURONS
//
leftNeurons.forEach((n) => {

    const pulse =
        Math.sin(time * 1.5 + n.pulse) * 0.2

    const g = ctx.createRadialGradient(
        n.x,
        n.y,
        0,
        n.x,
        n.y,
        n.r * 3
    )

    g.addColorStop(0, `rgba(52,199,89,${0.4 + pulse})`)
    g.addColorStop(1, 'rgba(52,199,89,0)')

    ctx.beginPath()
    ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2)

    ctx.fillStyle = g
    ctx.fill()

    ctx.beginPath()
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)

    ctx.fillStyle = `rgba(52,199,89,${0.7 + pulse})`
    ctx.fill()
})

//
// CENTER DIVIDER
//
ctx.beginPath()

ctx.moveTo(W / 2, H * 0.1)
ctx.lineTo(W / 2, H * 0.9)

ctx.strokeStyle = 'rgba(0,0,0,0.08)'
ctx.lineWidth = 1

ctx.setLineDash([6, 4])

ctx.stroke()

ctx.setLineDash([])

//
// RIGHT BRAIN
//
ctx.beginPath()

ctx.ellipse(
    W * 0.73,
    H / 2,
    W * 0.22,
    H * 0.4,
    0,
    0,
    Math.PI * 2
)

ctx.fillStyle = 'rgba(255,149,0,0.05)'
ctx.fill()

ctx.strokeStyle = 'rgba(255,149,0,0.25)'
ctx.lineWidth = 1.5
ctx.stroke()

//
// RIGHT CONNECTIONS
//
for (let i = 0; i < rightNeurons.length; i++) {

    for (let j = i + 1; j < rightNeurons.length; j++) {

        if (
            !rightNeurons[i].active ||
            !rightNeurons[j].active
        ) continue

        const dx = rightNeurons[i].x - rightNeurons[j].x
        const dy = rightNeurons[i].y - rightNeurons[j].y

        const d = Math.sqrt(dx * dx + dy * dy)

        if (d < 60) {

            ctx.beginPath()

            ctx.moveTo(
                rightNeurons[i].x,
                rightNeurons[i].y
            )

            if (
                rightNeurons[i].broken ||
                rightNeurons[j].broken
            ) {

                ctx.setLineDash([4, 6])

                ctx.strokeStyle =
                    `rgba(255,149,0,${(1 - d / 60) * 0.2})`

            } else {

                ctx.strokeStyle =
                    `rgba(255,149,0,${(1 - d / 60) * 0.3})`
            }

            ctx.lineTo(
                rightNeurons[j].x,
                rightNeurons[j].y
            )

            ctx.lineWidth = 0.7
            ctx.stroke()

            ctx.setLineDash([])
        }
    }
}

//
// RIGHT NEURONS
//
rightNeurons.forEach((n) => {

    if (!n.active) {

        ctx.beginPath()

        ctx.arc(
            n.x,
            n.y,
            n.r * 0.7,
            0,
            Math.PI * 2
        )

        ctx.fillStyle = 'rgba(180,180,180,0.3)'
        ctx.fill()

        return
    }

    const flicker =
        n.broken
            ? Math.sin(time * 8 + n.pulse) * 0.4
            : Math.sin(time * 1.2 + n.pulse) * 0.15

    const color =
        n.broken
            ? '255,100,50'
            : '255,149,0'

    const g = ctx.createRadialGradient(
        n.x,
        n.y,
        0,
        n.x,
        n.y,
        n.r * 2.5
    )

    g.addColorStop(
        0,
        `rgba(${color},${0.35 + Math.abs(flicker)})`
    )

    g.addColorStop(1, `rgba(${color},0)`)

    ctx.beginPath()

    ctx.arc(
        n.x,
        n.y,
        n.r * 2.5,
        0,
        Math.PI * 2
    )

    ctx.fillStyle = g
    ctx.fill()

    ctx.beginPath()

    ctx.arc(
        n.x,
        n.y,
        n.r,
        0,
        Math.PI * 2
    )

    ctx.fillStyle =
        `rgba(${color},${0.6 + flicker})`

    ctx.fill()
})

//
// LABELS
//
ctx.fillStyle = 'rgba(52,199,89,0.9)'
ctx.font = 'bold 13px sans-serif'
ctx.textAlign = 'center'

ctx.fillText(
    'How you feel',
    W * 0.27,
    H * 0.1
)

ctx.fillStyle = 'rgba(52,199,89,0.7)'
ctx.font = '11px sans-serif'

ctx.fillText(
    'Symptom-free',
    W * 0.27,
    H * 0.87
)

ctx.fillStyle = 'rgba(255,149,0,0.9)'
ctx.font = 'bold 13px sans-serif'

ctx.fillText(
    "What's in your brain",
    W * 0.73,
    H * 0.1
)

ctx.fillStyle = 'rgba(255,149,0,0.7)'
ctx.font = '11px sans-serif'

ctx.fillText(
    '30-40% recovered',
    W * 0.73,
    H * 0.87
)

//
// CENTER WARNING
//
ctx.fillStyle = 'rgba(255,59,48,0.85)'
ctx.font = 'bold 12px sans-serif'

ctx.fillText(
    'THE GAP',
    W / 2,
    H / 2 - 8
)

ctx.fillStyle = 'rgba(255,59,48,0.6)'
ctx.font = '10px sans-serif'

ctx.fillText(
    'Day 7–21',
    W / 2,
    H / 2 + 8
)
    }

    // Repair
    if (scene === "repair") {

    drawBrainSilhouette(ctx, W, H)

    axons.forEach((axon) => {

        // begin repairing after delay
        if (time > axon.repairDelay) {

            axon.repairProgress = Math.min(
                axon.repairProgress + axon.repairSpeed * 0.016,
                1
            )
        }

        const p = axon.repairProgress

        const x1 =
            axon.x - (Math.cos(axon.angle) * axon.length) / 2

        const y1 =
            axon.y - (Math.sin(axon.angle) * axon.length) / 2

        const x2 =
            axon.x + (Math.cos(axon.angle) * axon.length) / 2

        const y2 =
            axon.y + (Math.sin(axon.angle) * axon.length) / 2

        // damaged pathway
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)

        ctx.strokeStyle = 'rgba(255,100,50,0.15)'
        ctx.lineWidth = 2
        ctx.stroke()

        // repaired section
        const repairX =
            x1 + (x2 - x1) * p

        const repairY =
            y1 + (y2 - y1) * p

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(repairX, repairY)

        ctx.strokeStyle =
            `rgba(52,199,89,${0.4 + p * 0.5})`

        ctx.lineWidth = 3
        ctx.lineCap = "round"
        ctx.stroke()

        ctx.lineCap = "butt"

        // glowing repair point
        if (p < 1) {

            const glow = ctx.createRadialGradient(
                repairX,
                repairY,
                0,
                repairX,
                repairY,
                10
            )

            glow.addColorStop(0, "rgba(52,199,89,0.8)")
            glow.addColorStop(1, "rgba(52,199,89,0)")

            ctx.beginPath()
            ctx.arc(repairX, repairY, 10, 0, Math.PI * 2)

            ctx.fillStyle = glow
            ctx.fill()
        }

        // endpoints
        ctx.beginPath()
        ctx.arc(x1, y1, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(52,199,89,0.9)'
        ctx.fill()

        if (p >= 1) {

            ctx.beginPath()
            ctx.arc(x2, y2, 3.5, 0, Math.PI * 2)

            ctx.fillStyle = 'rgba(52,199,89,0.9)'
            ctx.fill()
        }
    })

    // total repair %
    const totalRepair =
        axons.reduce((sum, a) =>
            sum + a.repairProgress, 0
        ) / axons.length

    ctx.fillStyle = 'rgba(52,199,89,0.9)'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'

    ctx.fillText(
        `Axonal repair: ${Math.round(totalRepair * 100)}%`,
        W / 2,
        H - 20
    )
    }

    // Recovered
    if (scene === "recovered") {

    // soft healthy glow background
    const outerGlow = ctx.createRadialGradient(
        W / 2,
        H / 2,
        0,
        W / 2,
        H / 2,
        W * 0.45
    )

    outerGlow.addColorStop(0, "rgba(0,122,255,0.08)")
    outerGlow.addColorStop(0.7, "rgba(52,199,89,0.04)")
    outerGlow.addColorStop(1, "rgba(0,0,0,0)")

    ctx.fillStyle = outerGlow
    ctx.fillRect(0, 0, W, H)

    // healthy brain silhouette
    ctx.beginPath()

    ctx.ellipse(
        W / 2,
        H / 2,
        W * 0.42,
        H * 0.4,
        0,
        0,
        Math.PI * 2
    )

    ctx.fillStyle = "rgba(0,122,255,0.05)"
    ctx.fill()

    ctx.strokeStyle = "rgba(0,122,255,0.25)"
    ctx.lineWidth = 1.5
    ctx.stroke()

    // neural connections
    for (let i = 0; i < recoveredNeurons.length; i++) {

        for (let j = i + 1; j < recoveredNeurons.length; j++) {

            const n1 = recoveredNeurons[i]
            const n2 = recoveredNeurons[j]

            const dx = n1.x - n2.x
            const dy = n1.y - n2.y

            const d = Math.sqrt(dx * dx + dy * dy)

            if (d < 75) {

                const opacity = (1 - d / 75) * 0.25

                ctx.beginPath()

                ctx.moveTo(n1.x, n1.y)
                ctx.lineTo(n2.x, n2.y)

                ctx.strokeStyle =
                    `rgba(0,122,255,${opacity})`

                ctx.lineWidth = 0.8
                ctx.stroke()

                // travelling signal
                const phase =
                    (time * 0.8 + n1.signalPhase) % 1

                if (phase < 0.3 && d < 60) {

                    const px =
                        n1.x + (n2.x - n1.x) * (phase / 0.3)

                    const py =
                        n1.y + (n2.y - n1.y) * (phase / 0.3)

                    const pulseGlow =
                        ctx.createRadialGradient(
                            px,
                            py,
                            0,
                            px,
                            py,
                            6
                        )

                    pulseGlow.addColorStop(
                        0,
                        "rgba(0,122,255,0.8)"
                    )

                    pulseGlow.addColorStop(
                        1,
                        "rgba(0,122,255,0)"
                    )

                    ctx.beginPath()

                    ctx.arc(
                        px,
                        py,
                        6,
                        0,
                        Math.PI * 2
                    )

                    ctx.fillStyle = pulseGlow
                    ctx.fill()
                }
            }
        }
    }

    // neurons
    recoveredNeurons.forEach((n) => {

        const pulse =
            Math.sin(time * 1.2 + n.pulse) * 0.25

        const glow = ctx.createRadialGradient(
            n.x,
            n.y,
            0,
            n.x,
            n.y,
            n.r * 4
        )

        glow.addColorStop(
            0,
            `rgba(0,122,255,${0.4 + pulse})`
        )

        glow.addColorStop(
            1,
            "rgba(0,122,255,0)"
        )

        ctx.beginPath()

        ctx.arc(
            n.x,
            n.y,
            n.r * 4,
            0,
            Math.PI * 2
        )

        ctx.fillStyle = glow
        ctx.fill()

        ctx.beginPath()

        ctx.arc(
            n.x,
            n.y,
            n.r,
            0,
            Math.PI * 2
        )

        ctx.fillStyle =
            `rgba(0,122,255,${0.75 + pulse})`

        ctx.fill()
    })

    // healthy check mark
    ctx.strokeStyle = "rgba(52,199,89,0.9)"
    ctx.lineWidth = 4

    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    ctx.beginPath()

    ctx.moveTo(W / 2 - 18, H / 2 + 5)
    ctx.lineTo(W / 2 - 5, H / 2 + 18)
    ctx.lineTo(W / 2 + 22, H / 2 - 14)

    ctx.stroke()

    ctx.lineCap = "butt"
    }   


    animationFrame = requestAnimationFrame(animate)
}

onMounted(async () => {

    await nextTick()
    const canvas = brainCanvas.value
    if (!canvas) return
    createScene(canvas.width, canvas.height)
    animate()
})

onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrame)
})
</script>

<template>
    <main class="flex-1">
        <div class="bg-white min-h-screen">
            <section class="relative min-h-[60vh] flex items-center justify-center overflow-hidden" style="background: linear-gradient(rgb(250, 250, 250) 0%, rgb(255, 255, 255) 100%);">
                <div class="relative text-center max-w-4xl mx-auto px-6 py-20">
                    <BlurReveal :delay="0.2" :duration="0.75">
                    <div class="inline-flex items-center gap-2 bg-[#ff9500]/8 border border-[#ff9500]/20 text-[#ff9500] text-sm font-semibold px-5 py-2 rounded-full mb-8 tracking-wide uppercase"
                        style="opacity: 1; transform: none;">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#ff9500] animate-pulse">
                        </span>
                        The Science Behind the Rule
                    </div>
                    <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1d1d1f] mb-8 leading-tight tracking-tight"
                        style="opacity: 1; transform: none;">
                        Why your brain needs <span class="text-[#ff9500]">21 days</span>
                        <br>not 7
                    </h1>
                    <p class="text-xl text-[#86868b] mb-12 leading-relaxed max-w-2xl mx-auto"
                        style="opacity: 1; transform: none;">Symptoms clear on day 7. Your
                        brain doesn't finish healing until day 21. That gap is where most players get seriously
                        re-injured.
                    </p>
                    </BlurReveal>
                    <!-- <div style="opacity: 1; transform: none;">
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-10">
                            <div class="bg-white border border-[#ff3b30]/20 rounded-2xl px-4 py-3 text-sm text-[#1d1d1f] italic shadow-sm text-left"
                                style="opacity: 1; transform: none;">
                                "I'll be fine."
                            </div>
                            <div class="bg-white border border-[#ff3b30]/20 rounded-2xl px-4 py-3 text-sm text-[#1d1d1f] italic shadow-sm text-left"
                                style="opacity: 1; transform: none;">
                                "It's just a headache."
                            </div>
                            <div class="bg-white border border-[#ff3b30]/20 rounded-2xl px-4 py-3 text-sm text-[#1d1d1f] italic shadow-sm text-left"
                                style="opacity: 1; transform: none;">
                                "I feel completely
                                normal."
                            </div>
                            <div class="bg-white border border-[#ff3b30]/20 rounded-2xl px-4 py-3 text-sm text-[#1d1d1f] italic shadow-sm text-left"
                                style="opacity: 1; transform: none;">
                                "I can't let my team
                                down."
                            </div>
                            <div class="bg-white border border-[#ff3b30]/20 rounded-2xl px-4 py-3 text-sm text-[#1d1d1f] italic shadow-sm text-left"
                                style="opacity: 1; transform: none;">
                                "It wasn't even that bad."
                            </div>
                            <div class="bg-white border border-[#ff3b30]/20 rounded-2xl px-4 py-3 text-sm text-[#1d1d1f] italic shadow-sm text-left"
                                style="opacity: 1; transform: none;">
                                "I don't need three weeks
                                off."
                            </div>
                        </div>
                        <button @click="() => scienceHidden = !scienceHidden"
                            class="bg-[#ff9500] text-white px-10 py-5 text-lg rounded-full font-semibold flex items-center gap-2 mx-auto shadow-xl shadow-[#ff9500]/25 hover:shadow-2xl hover:shadow-[#ff9500]/35 hover:scale-105 transition-all duration-150 cursor-pointer">
                            Show me the science
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-arrow-right">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg>
                        </button>
                    </div> -->
                    <div style="opacity: 1; transform: none;">
                        <div class="flex flex-col items-center gap-2 text-[#86868b]" style="opacity: 1;">
                            <span class="text-md tracking-widest uppercase font-medium">
                                Recovery is <b class="text-black">Easy</b><br/>Explore the <b class="text-black">Fun</b> Science
                            </span>
                            <div class="animateUpandDown">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="lucide lucide-arrow-right rotate-90"
                                    data-fg-cnbi86="33.116:33.38486:/src/app/pages/TwentyOneDayRule.tsx:767:17:24731:46:e:ArrowRight::::::s5N"
                                    data-fgid-cnbi86=":r10c:">
                                    <path d="M5 12h14"></path>
                                    <path d="m12 5 7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
            <div class="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-20 space-y-24">
                <div class="relative">
                    <div class="rounded-3xl overflow-hidden shadow-2xl" style="background: linear-gradient(135deg, rgb(29, 29, 31) 0%, rgb(45, 26, 26) 100%);">
                        <div class="bg-[#ff9500] px-8 py-4 flex items-center gap-3">
                            <div class="w-3 h-3 rounded-full bg-white animate-pulse">
                            </div>
                            <span class="text-white font-bold text-lg tracking-wide uppercase">
                                The Day 7 Trap - Why Players Get It Wrong
                            </span>
                        </div>
                        <div class="p-10 lg:p-14">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                                <!-- What you feel on day 7 Section -->
                                <BlurReveal :delay="0.2" :duration="1.25"> 
                                <div class="text-center">
                                    <div class="text-[#86868b] text-sm font-semibold uppercase tracking-widest mb-6">
                                        What you feel on Day 7
                                    </div>
                                    <div class="bg-white/5 border border-white/10 rounded-2xl p-8 mb-6">
                                        <div class="flex justify-center text-6xl mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
                                                <ellipse cx="32" cy="31.964" fill="#fbbf67" rx="32" ry="31.961" />
                                                <path fill="#633d19" d="M52.1 39.35c0 10.996-8.932 19.921-19.947 19.921c-11.01 0-19.941-8.925-19.941-19.921m17.181-14.2c-1.371-3.738-4.481-7.317-8.775-7.232c-4 .076-6.419 4.308-7.725 7.512c-.814 2 2.428 2.861 3.234.89c.838-2.057 2.073-4.329 4.339-5.02c2.594-.794 4.968 2.764 5.692 4.739c.737 2.01 3.978 1.144 3.235-.891m5.827-.028c1.371-3.739 4.479-7.316 8.774-7.234c4.01.078 6.417 4.309 7.723 7.512c.817 2-2.428 2.863-3.232.892c-.838-2.059-2.075-4.329-4.338-5.02c-2.597-.792-4.971 2.767-5.693 4.741c-.738 2.01-3.979 1.138-3.234-.892" />
                                                <path fill="#fff" d="M48.688 41.35c0 4.392-7.553 7.958-16.863 7.958c-9.303 0-16.858-3.566-16.858-7.958" />
                                            </svg>
                                        </div>
                                        <div class="text-white text-2xl font-bold mb-3">
                                            I feel fine
                                        </div>
                                        <div class="space-y-2 text-left">
                                            <div class="flex items-center gap-2">
                                                <div class="w-2 h-2 rounded-full bg-[#34c759]"></div>
                                                <span class="text-white/70 text-sm">No headache</span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <div class="w-2 h-2 rounded-full bg-[#34c759]"></div>
                                                <span class="text-white/70 text-sm">
                                                    No dizziness
                                                </span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <div class="w-2 h-2 rounded-full bg-[#34c759]"></div>
                                                <span class="text-white/70 text-sm">
                                                    Normal energy
                                                </span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <div class="w-2 h-2 rounded-full bg-[#34c759]"></div>
                                                <span class="text-white/70 text-sm">
                                                    Ready to play
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-[#34c759] font-semibold">Symptoms: CLEAR</div>
                                </div>
                                </BlurReveal>
                                <!-- VS -->
                                <div class="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 pointer-events-none z-10">
                                    <div class="w-px h-20 bg-white/20"></div>
                                    <div class="bg-[#ff9500] rounded-full px-3 py-1 text-white text-xs font-bold">VS</div>
                                    <div class="w-px h-20 bg-white/20"></div>
                                </div>
                                <!-- What your brain is doing on Day 7 Section -->
                                <BlurReveal :delay="0.2" :duration="1.25">
                                <div class="text-center">
                                    <div class="text-[#86868b] text-sm font-semibold uppercase tracking-widest mb-6">
                                        What your brain is doing on Day 7
                                    </div>
                                    <div class="bg-[#ff9500]/10 border border-[#ff9500]/30 rounded-2xl p-8 mb-6">
                                        <div class="flex justify-center text-6xl mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 36 36">
                                                <path fill="#ea596e" d="M29.896 26.667c.003.283-.07.653-.146.958c-.531 2.145-2.889 4.552-6.208 4.333c-3.008-.198-5.458-1.642-5.458-3.667s2.444-3.667 5.458-3.667s6.335.018 6.354 2.043" />
                                                <path fill="#dd2e44" d="M23.542 24.964c-1.619 0-5.314.448-6.162.448c-1.498 0-2.713.94-2.713 2.1c0 .558.286 1.062.744 1.438c0 0 1.006 1.009 2.818.525c.793-.212 2.083-1.786 4.354-2.036c1.131-.125 3.25.75 6.974.771c.16-.344.193-.583.193-.583c0-2.027-3.194-2.663-6.208-2.663" />
                                                <path fill="#f4abba" d="M29.75 27.625s2.184-.443 3.542-2.229c1.583-2.083 1.375-4.312 1.375-4.312c1.604-3-.5-5.813-.5-5.813C33.958 12.104 32 10.792 32 10.792c-1.271-3.021-4.083-3.833-4.083-3.833c-2.208-2.583-6.125-2.5-6.125-2.5s-3.67-1.345-8.708.167c-.833.25-3.625.833-5.667 2.083C.981 10.649.494 16.793.584 17.792C1.083 23.375 5 24.375 7.5 24.958c.583 1.583 2.729 4.5 6.583 3.417c4.75-.833 6.75-2.25 7.917-2.25s4.417 1.25 7.75 1.5" />
                                                <g fill="#ea596e">
                                                    <path d="M17.737 18.648c2.328-1.255 3.59-1.138 4.704-1.037c.354.032.689.057 1.028.055c1.984-.045 3.591-.881 4.302-1.69a.501.501 0 0 0-.752-.661c-.548.624-1.899 1.313-3.573 1.351c-.3.009-.601-.021-.913-.05c-1.195-.111-2.679-.247-5.271 1.152c-.665.359-1.577.492-2.565.592c-2.197-3.171-.875-5.933-.497-6.591c.037.002.073.014.111.014c.4 0 .802-.098 1.166-.304a.5.5 0 0 0-.492-.87a1.426 1.426 0 0 1-1.88-.467a.5.5 0 0 0-.841.539c.237.371.571.65.948.837c-.521 1.058-1.51 3.84.372 6.951c-1.324.13-2.65.317-3.688.986a7.2 7.2 0 0 0-1.878 1.791c-.629-.108-2.932-.675-3.334-3.231c.25-.194.452-.45.577-.766a.5.5 0 1 0-.93-.368a.77.77 0 0 1-.454.461a.78.78 0 0 1-.643-.07a.5.5 0 0 0-.486.874c.284.158.588.238.89.238c.037 0 .072-.017.109-.019c.476 2.413 2.383 3.473 3.732 3.794a3.7 3.7 0 0 0-.331 1.192a.5.5 0 0 0 .454.542l.045.002a.5.5 0 0 0 .498-.456c.108-1.213 1.265-2.48 2.293-3.145c.964-.621 2.375-.752 3.741-.879c1.325-.121 2.577-.237 3.558-.767m12.866-1.504a.5.5 0 0 0 .878.48c.019-.034 1.842-3.449-1.571-5.744a.5.5 0 0 0-.558.83c2.644 1.778 1.309 4.326 1.251 4.434M9.876 9.07a.5.5 0 0 0 .406-.208c1.45-2.017 3.458-1.327 3.543-1.295a.5.5 0 0 0 .345-.938c-.96-.356-3.177-.468-4.7 1.65a.5.5 0 0 0 .406.791m13.072-1.888c2.225-.181 3.237 1.432 3.283 1.508a.5.5 0 0 0 .863-.507c-.054-.091-1.34-2.218-4.224-1.998a.5.5 0 0 0 .078.997m9.15 14.611c-.246-.014-.517.181-.539.457c-.002.018-.161 1.719-1.91 2.294a.499.499 0 0 0 .157.975a.5.5 0 0 0 .156-.025c2.372-.778 2.586-3.064 2.594-3.161a.5.5 0 0 0-.458-.54" />
                                                    <path d="M7.347 16.934a.5.5 0 1 0 .965.26a1.423 1.423 0 0 1 1.652-1.014a.5.5 0 0 0 .205-.979a2.35 2.35 0 0 0-1.248.086c-1.166-1.994-.939-3.96-.936-3.981a.5.5 0 0 0-.429-.562a.503.503 0 0 0-.562.427c-.013.097-.28 2.316 1.063 4.614a2.4 2.4 0 0 0-.71 1.149m11.179-2.47a1.07 1.07 0 0 1 1.455.015a.5.5 0 0 0 .707-.011a.5.5 0 0 0-.01-.707a2 2 0 0 0-.797-.465c.296-1.016.179-1.467-.096-2.312a21 21 0 0 1-.157-.498l-.03-.1c-.364-1.208-.605-2.005.087-3.13a.5.5 0 0 0-.852-.524c-.928 1.508-.587 2.637-.192 3.944l.03.1q.088.29.163.517c.247.761.322 1.016.02 1.936a2 2 0 0 0-1.01.504a.5.5 0 0 0 .682.731m6.365-2.985a2 2 0 0 0 .859-.191a.5.5 0 0 0-.426-.905a1.07 1.07 0 0 1-1.384-.457a.5.5 0 1 0-.881.472c.18.336.448.601.76.785c-.537 1.305-.232 2.691.017 3.426a.5.5 0 1 0 .947-.319c-.168-.498-.494-1.756-.002-2.826c.038.002.073.015.11.015m4.797 9.429a.497.497 0 0 0-.531-.467a1.825 1.825 0 0 1-1.947-1.703a.51.51 0 0 0-.533-.465a.5.5 0 0 0-.465.533c.041.59.266 1.122.608 1.555c-.804.946-1.857 1.215-2.444 1.284c-.519.062-.973.009-1.498-.053c-.481-.055-1.025-.118-1.698-.098l-.005.001c-.02-.286-.088-.703-.305-1.05a.501.501 0 0 0-.847.531c.134.215.159.558.159.725c-.504.181-.94.447-1.334.704c-.704.458-1.259.82-2.094.632c-.756-.173-1.513-.208-2.155-.118c-.1-.251-.258-.551-.502-.782a.5.5 0 0 0-.687.727c.086.081.154.199.209.317c-1.103.454-1.656 1.213-1.682 1.25a.499.499 0 0 0 .407.788a.5.5 0 0 0 .406-.205c.005-.008.554-.743 1.637-1.04c.56-.154 1.363-.141 2.146.037c.219.05.422.067.619.07c.093.218.129.477.134.573a.5.5 0 0 0 .499.472l.027-.001a.5.5 0 0 0 .473-.523a3 3 0 0 0-.13-.686c.461-.167.862-.428 1.239-.673c.572-.373 1.113-.726 1.82-.749c.592-.021 1.08.036 1.551.091c.474.055.94.091 1.454.061c.091.253.084.591.07.704a.503.503 0 0 0 .497.563a.5.5 0 0 0 .495-.435a2.9 2.9 0 0 0-.059-.981a4.67 4.67 0 0 0 2.345-1.471a2.8 2.8 0 0 0 1.656.413a.5.5 0 0 0 .465-.531" />
                                                </g>
                                            </svg>
                                        </div>
                                        <div class="text-[#ff9500] text-2xl font-bold mb-3">30 - 40% healed</div>
                                        <div class="space-y-2 text-left">
                                            <div class="flex items-center gap-2">
                                                <div class="w-2 h-2 rounded-full bg-[#ff9500]"></div>
                                                <span class="text-white/70 text-sm">
                                                    Axons still regenerating
                                                </span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <div class="w-2 h-2 rounded-full bg-[#ff9500]"></div>
                                                <span class="text-white/70 text-sm">
                                                    Energy metabolism compromised
                                                </span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <div class="w-2 h-2 rounded-full bg-[#ff9500]"></div>
                                                <span class="text-white/70 text-sm">
                                                    Blood flow not normalized
                                                </span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <div class="w-2 h-2 rounded-full bg-[#ff9500]"></div>
                                                <span class="text-white/70 text-sm">
                                                    Cell membranes repairing
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-[#ff9500] font-semibold">Brain: STILL HEALING</div>
                                </div>
                                </BlurReveal>
                            </div>
                            <div class="mt-10 bg-[#ff3b30]/15 border border-[#ff3b30]/30 rounded-2xl p-6 text-center">
                                <div class="text-[#ff3b30] text-4xl font-bold mb-2">3-5x</div>
                                <div class="text-white text-lg font-semibold">
                                    More likely to be re-injured if you return on Day 7
                                </div>
                                <div class="text-white/50 text-sm mt-2">
                                    Source: AIS Concussion and Brain Health Position Statement
                                    2024
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Day by Day Recovery Guide Section -->
                <div class="flex flex-col justify-center">
                    <div class="text-center mb-16" style="opacity: 1; transform: none;">
                        <h2 class="text-4xl sm:text-5xl font-bold text-[#1d1d1f] tracking-tight mb-4">
                            Day-by-Day Recovery Guide
                        </h2>
                        <p class="text-xl text-[#86868b]">
                            Click any day to see what's happening inside your brain
                        </p>
                    </div>
                    <div class="flex flex-wrap gap-3 justify-center mb-10">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full" style="background: rgb(255, 59, 48);"></div>
                            <span class="text-sm text-[#86868b] font-medium">Acute</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full" style="background: rgb(255, 107, 48);"></div>
                            <span class="text-sm text-[#86868b] font-medium">Early Recovery</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full" style="background: rgb(255, 149, 0);"></div>
                            <span class="text-sm text-[#86868b] font-medium">
                                <svg style="display: inline;" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 36 36">
                                <path fill="#ffcc4d" d="M2.653 35C.811 35-.001 33.662.847 32.027L16.456 1.972c.849-1.635 2.238-1.635 3.087 0l15.609 30.056c.85 1.634.037 2.972-1.805 2.972z" />
                                <path fill="#231f20" d="M15.583 28.953a2.42 2.42 0 0 1 2.419-2.418a2.42 2.42 0 0 1 2.418 2.418a2.42 2.42 0 0 1-2.418 2.419a2.42 2.42 0 0 1-2.419-2.419m.186-18.293c0-1.302.961-2.108 2.232-2.108c1.241 0 2.233.837 2.233 2.108v11.938c0 1.271-.992 2.108-2.233 2.108c-1.271 0-2.232-.807-2.232-2.108z" />
                                </svg> Day 7
                            </span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full" style="background: rgb(200, 230, 0);"></div>
                            <span class="text-sm text-[#86868b] font-medium">Mid Recovery</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full" style="background: rgb(52, 199, 89);"></div>
                            <span class="text-sm text-[#86868b] font-medium">Late Recovery</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full" style="background: rgb(0, 122, 255);"></div>
                            <span class="text-sm text-[#86868b] font-medium">Recovered</span>
                        </div>
                    </div>
                    <!-- The Timeline Dots Section -->
                    <div class="flex flex-col lg:flex-row space-x-12 space-y-5 items-center mb-10 w-fit pt-5">
                        <!-- Original full timeline view -->
                        <div class="relative flex gap-2 overflow-visible pb-10 lg:pb-0 pt-0 scroll-smooth" style="scrollbar-width: none;">
                            <div class="absolute z-11 top-[1.45rem] left-0 right-0 h-1 rounded-full bg-gradient-to-r from-[#ff3b30] via-[#ff9500] lg:via-[#c8e600] to-[rgb(255,149,0)] lg:to-[#34c759]"></div>
                            <!-- Day 1 -->
                            <button class="flex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 1">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 1 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(255,59,48)]' : ''" style="background: rgb(255, 59, 48);">
                                </div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200  bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 1 ? 'bg-[rgb(255,59,48)]! text-white!' : ''">
                                    1
                                </div>
                            </button>
                             <!-- Day 2 -->
                            <button class="flex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 2">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 2 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(255,59,48)]' : ''" style="background: rgb(255, 59, 48);"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 2 ? 'bg-[rgb(255,59,48)]! text-white!' : ''">
                                    2
                                </div>
                            </button>
                            <!-- Day 3 -->
                            <button class="flex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 3">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 3 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(255,59,48)]' : ''" style="background: rgb(255, 59, 48)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 3 ? 'bg-[rgb(255,59,48)]! text-white!' : ''">
                                    3
                                </div>
                            </button>
                            <!-- Day 4 -->
                            <button class="flex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 4">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 4 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(255,107,48)]' : ''" style="background: rgb(255, 107, 48);"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 4 ? 'bg-[rgb(255,107,48)]! text-white!' : ''">
                                    4
                                </div>
                            </button>
                            <!-- Day 5 -->
                            <button class="flex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 5">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 5 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(255,107,48)]' : ''" style="background: rgb(255, 107, 48);"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 5 ? 'bg-[rgb(255,107,48)]! text-white!' : ''">
                                    5
                                </div>
                            </button>
                            <!-- Day 6 -->
                            <button class="flex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 6">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 6 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(255,149,0)]' : ''" style="background: rgb(255, 149, 0);"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 6 ? 'bg-[rgb(255,149,0)]! text-white!' : ''">
                                    6
                                </div>
                            </button>
                            <!-- Day 7 -->
                            <button class="flex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 7">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 7 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(255,149,0)]' : ''"  style="background: rgb(255, 149, 0)">
                                </div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#ff9500]/10 text-[#ff9500] border border-[#ff9500]/30" :class="selectedTimeline == 7 ? 'bg-[rgb(255,149,0)]! text-white!' : ''">
                                    <svg style="display: inline;" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 36 36">
                                        <path fill="#ffcc4d" d="M2.653 35C.811 35-.001 33.662.847 32.027L16.456 1.972c.849-1.635 2.238-1.635 3.087 0l15.609 30.056c.85 1.634.037 2.972-1.805 2.972z" />
                                        <path fill="#231f20" d="M15.583 28.953a2.42 2.42 0 0 1 2.419-2.418a2.42 2.42 0 0 1 2.418 2.418a2.42 2.42 0 0 1-2.418 2.419a2.42 2.42 0 0 1-2.419-2.419m.186-18.293c0-1.302.961-2.108 2.232-2.108c1.241 0 2.233.837 2.233 2.108v11.938c0 1.271-.992 2.108-2.233 2.108c-1.271 0-2.232-.807-2.232-2.108z" />
                                    </svg> 7
                                </div>
                            </button>
                            <!-- Day 8 -->
                            <button class="hidden flex-shrink-0 lg:flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 8">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 8 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(255,204,0)]' : ''" style="background: rgb(255, 204, 0);"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 8 ? 'bg-[rgb(255,204,0)]! text-white!' : ''">
                                    8
                                </div>
                            </button>
                            <!-- Day 9 -->
                            <button class="hidden flex-shrink-0 lg:flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 9">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 9 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(255,204,0)]' : ''" style="background: rgb(255, 204, 0)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 9 ? 'bg-[rgb(255,204,0)]! text-white!' : ''">
                                    9
                                </div>
                            </button>
                            <!-- Day 10 -->
                            <button class="hidden flex-shrink-0 lg:flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 10">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 10 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(200,230,0)]' : ''"  style="background: rgb(200, 230, 0)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 10 ? 'bg-[rgb(200,230,0)]! text-white!' : ''">
                                    10
                                </div>
                            </button>
                            <!-- Day 11 -->
                            <button class="hidden flex-shrink-0 lg:flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 11">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 11 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(200,230,0)]' : ''"  style="background: rgb(200, 230, 0)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 11 ? 'bg-[rgb(200,230,0)]! text-white!' : ''">
                                    11
                                </div>
                            </button>
                            <!-- Day 12 -->
                            <button class="hidden flex-shrink-0 lg:flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 12">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 12 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(200,230,0)]' : ''"  style="background: rgb(160, 216, 0)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 12 ? 'bg-[rgb(160,216,0)]! text-white!' : ''">
                                    12
                                </div>
                            </button>
                            <!-- Day 13 -->
                            <button class="hidden flex-shrink-0 lg:flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 13">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 13 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(120,200,0)]' : ''"  style="background: rgb(120, 200, 0)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 13 ? 'bg-[rgb(120,200,0)]! text-white!' : ''">
                                    13
                                </div>
                            </button>
                             <!-- Day 14 -->
                            <button class="hidden flex-shrink-0 lg:flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 14">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 14 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(80,184,0)]' : ''"  style="background: rgb(80, 184, 0)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 14 ? 'bg-[rgb(80,184,0)]! text-white!' : ''">
                                    14
                                </div>
                            </button>
                            <!-- Day 15 -->
                            <button class="hidden flex-shrink-0 lg:flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 15">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 15 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(120,200,0)]' : ''"  style="background: rgb(80, 184, 0)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 15 ? 'bg-[rgb(80,184,0)]! text-white!' : ''">
                                    15
                                </div>
                            </button>
                            <!-- Day 16 -->
                            <button class="hidden flex-shrink-0 lg:flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 16">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 16 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(52,199,89)]' : ''"  style="background: rgb(52, 199, 89)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 16 ? 'bg-[rgb(52,199,89)]! text-white!' : ''">
                                    16
                                </div>
                            </button>
                            <!-- Day 17 -->
                            <button class="hidden flex-shrink-0 lg:flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 17">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 17 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(52,199,89)]' : ''"  style="background: rgb(52, 199, 89)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 17 ? 'bg-[rgb(52,199,89)]! text-white!' : ''">
                                    17
                                </div>
                            </button>
                            <!-- Day 18 -->
                            <button class="hidden flex-shrink-0 lg:flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 18">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 18 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(52,199,89)]' : ''"  style="background: rgb(52, 199, 89)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 18 ? 'bg-[rgb(52,199,89)]! text-white!' : ''">
                                    18
                                </div>
                            </button>
                            <!-- Day 19 -->
                            <button class="hidden flex-shrink-0 lg:flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 19">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 19 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(52,199,89)]' : ''"  style="background: rgb(52, 199, 89)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 19 ? 'bg-[rgb(52,199,89)]! text-white!' : ''">
                                    19
                                </div>
                            </button>
                            <!-- Day 20 -->
                            <button class="hidden flex-shrink-0 lg:flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 20">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 20 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(52,199,89)]' : ''"  style="background: rgb(52, 199, 89)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 20 ? 'bg-[rgb(52,199,89)]! text-white!' : ''">
                                    20
                                </div>
                            </button>
                            <!-- Day 21 -->
                            <button @click="() => selectedTimeline = 21" class="hidden flex-shrink-0 lg:flex flex-col items-center space-y-2  gap-2 pt-0 cursor-pointer">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 21 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(52,199,89)]' : ''"  style="background: rgb(52, 199, 89)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/30" :class="selectedTimeline == 21 ? 'bg-[rgb(52,199,89)]! text-white!' : ''">
                                    <svg style="display: inline;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
	                                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m5 13l4 4L19 7" />
                                    </svg> 21
                                </div>
                            </button>
                        </div>
                        <!-- Mobile View Days 8-14 -->
                        <div class="relative flex lg:hidden gap-2 overflow-visible pb-10 pt-0 scroll-smooth" style="scrollbar-width: none;">
                            <div class="absolute z-11 top-[1.45rem] left-0 right-0 h-1 rounded-full bg-gradient-to-r from-[rgb(255,204,0)] via-[rgb(200,230,0)] to-[rgb(80,184,0)]"></div>
                            <!-- Day 8 -->
                            <button class="flex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 8">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 8 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(255,204,0)]' : ''" style="background: rgb(255, 204, 0);"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 8 ? 'bg-[rgb(255,204,0)]! text-white!' : ''">
                                    8
                                </div>
                            </button>
                            <!-- Day 9 -->
                            <button class="flex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 9">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 9 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(255,204,0)]' : ''" style="background: rgb(255, 204, 0)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 9 ? 'bg-[rgb(255,204,0)]! text-white!' : ''">
                                    9
                                </div>
                            </button>
                            <!-- Day 10 -->
                            <button class="flex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 10">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 10 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(200,230,0)]' : ''"  style="background: rgb(200, 230, 0)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 10 ? 'bg-[rgb(200,230,0)]! text-white!' : ''">
                                    10
                                </div>
                            </button>
                            <!-- Day 11 -->
                            <button class="flex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 11">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 11 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(200,230,0)]' : ''"  style="background: rgb(200, 230, 0)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 11 ? 'bg-[rgb(200,230,0)]! text-white!' : ''">
                                    11
                                </div>
                            </button>
                            <!-- Day 12 -->
                            <button class="flex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 12">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 12 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(200,230,0)]' : ''"  style="background: rgb(160, 216, 0)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 12 ? 'bg-[rgb(160,216,0)]! text-white!' : ''">
                                    12
                                </div>
                            </button>
                            <!-- Day 13 -->
                            <button class="flex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 13">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 13 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(120,200,0)]' : ''"  style="background: rgb(120, 200, 0)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 13 ? 'bg-[rgb(120,200,0)]! text-white!' : ''">
                                    13
                                </div>
                            </button>
                             <!-- Day 14 -->
                            <button class="flex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 14">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 14 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(80,184,0)]' : ''"  style="background: rgb(80, 184, 0)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 14 ? 'bg-[rgb(80,184,0)]! text-white!' : ''">
                                    14
                                </div>
                            </button>
                        </div>
                        <!-- Mobile View Days 15-21 -->
                        <div class="relative flex lg:hidden gap-2 overflow-visible pb-10 pt-0 scroll-smooth" style="scrollbar-width: none;">
                            <div class="absolute z-11 top-[1.45rem] left-0 right-0 h-1 rounded-full bg-gradient-to-r from-[rgb(80,184,0)] to-[rgb(52,199,89)]"></div>
                            <!-- Day 15 -->
                            <button class="flex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 15">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 15 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(120,200,0)]' : ''"  style="background: rgb(80, 184, 0)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 15 ? 'bg-[rgb(80,184,0)]! text-white!' : ''">
                                    15
                                </div>
                            </button>
                            <!-- Day 16 -->
                            <button class="flex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 16">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 16 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(52,199,89)]' : ''"  style="background: rgb(52, 199, 89)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 16 ? 'bg-[rgb(52,199,89)]! text-white!' : ''">
                                    16
                                </div>
                            </button>
                            <!-- Day 17 -->
                            <button class="flex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 17">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 17 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(52,199,89)]' : ''"  style="background: rgb(52, 199, 89)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 17 ? 'bg-[rgb(52,199,89)]! text-white!' : ''">
                                    17
                                </div>
                            </button>
                            <!-- Day 18 -->
                            <button class="flex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 18">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 18 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(52,199,89)]' : ''"  style="background: rgb(52, 199, 89)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 18 ? 'bg-[rgb(52,199,89)]! text-white!' : ''">
                                    18
                                </div>
                            </button>
                            <!-- Day 19 -->
                            <button class="flex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 19">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 19 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(52,199,89)]' : ''"  style="background: rgb(52, 199, 89)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 19 ? 'bg-[rgb(52,199,89)]! text-white!' : ''">
                                    19
                                </div>
                            </button>
                            <!-- Day 20 -->
                            <button class="flex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 20">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 20 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(52,199,89)]' : ''"  style="background: rgb(52, 199, 89)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]" :class="selectedTimeline == 20 ? 'bg-[rgb(52,199,89)]! text-white!' : ''">
                                    20
                                </div>
                            </button>
                            <!-- Day 21 -->
                            <button class="sflex-shrink-0 flex flex-col items-center space-y-2 gap-2 pt-0 cursor-pointer" @click="() => selectedTimeline = 21">
                                <div class="w-3 h-3 rounded-full relative z-10 transition-all duration-200" :class="selectedTimeline == 21 ? 'scale-[1.4] shadow-[0_0_0_4px_white,_0_0_0_6px_rgb(52,199,89)]' : ''"  style="background: rgb(52, 199, 89)"></div>
                                <div class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/30" :class="selectedTimeline == 21 ? 'bg-[rgb(52,199,89)]! text-white!' : ''">
                                    <svg style="display: inline;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
	                                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m5 13l4 4L19 7" />
                                    </svg> 21
                                </div>
                            </button>
                        </div>
                        <div class="flex items-center gap-4">
                                <button @click="() => handleTimelinePagination('backwards')" class="w-12 h-12 rounded-full border-2 border-[#d2d2d7] flex items-center justify-center disabled:opacity-30 transition-all cursor-pointer disabled:cursor-default" tabindex="0" :class="selectedTimeline == 1 ? '' : 'hover:border-[#007aff] hover:text-[#007aff] '" :disabled="selectedTimeline == 1 ? true : false">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="lucide lucide-chevron-left">
                                        <path d="m15 18-6-6 6-6"></path>
                                    </svg>
                                </button>
                                <span class="text-[#86868b] text-sm font-medium">Day {{ selectedTimeline }} of 21</span>
                                <button @click="() => handleTimelinePagination('forwards')" class="w-12 h-12 rounded-full border-2 border-[#d2d2d7] flex items-center justify-center disabled:opacity-30 transition-all cursor-pointer disabled:cursor-default" :class="selectedTimeline == 21 ? '' : 'hover:border-[#007aff] hover:text-[#007aff]'" :disabled="selectedTimeline == 21 ? true : false">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="lucide lucide-chevron-right">
                                        <path d="m9 18 6-6-6-6"></path>
                                    </svg>
                                </button>
                        </div>
                        
                    </div>
                </div>
                <!-- Day Description Display Section -->
                <div class="grid grid-cols-1 lg:grid-cols-5 gap-8" style="opacity: 1; transform: none;">
                        <div class="lg:col-span-2 flex flex-col items-stretch justify-start">
                            <div class="bg-white rounded-3xl border border-[#f0f0f0] shadow-xl overflow-hidden">
                                <div class="px-6 py-4 flex items-center justify-between" style="background: rgba(0, 122, 255, 0.03); border-bottom: 1px solid rgba(0, 122, 255, 0.125);">
                                    <div class="flex items-center gap-3">
                                        <div class="w-2.5 h-2.5 rounded-full animate-pulse" style="background: rgb(0, 122, 255);"></div>
                                        <span class="text-xs font-bold uppercase tracking-widest" style="color: rgb(0, 122, 255);">Neuroscience
                                            Animation
                                        </span>
                                    </div>
                                </div>
                                <div class="p-6 pb-4">
                                    <div style="opacity: 1">
                                        <div class="relative flex flex-col items-center justify-center">
                                            <div class="w-full text-xs text-gray-800">
                                                <p>- The circle / ellipse represents the brain</p>
                                                <p>- Animated elements represent: 
                                                    <span v-if="selectedNeuroButton === 1">Impacted Axons (They connect neurons)</span>
                                                    <span v-else-if="selectedNeuroButton === 2">Axons being torn or damaged</span>
                                                    <span v-else-if="selectedNeuroButton === 3">Molecules inside the brain</span>
                                                    <span v-else-if="selectedNeuroButton === 4">Molecules inside the brain</span>
                                                    <span v-else-if="selectedNeuroButton === 5">Axons (bridge between neurons)</span>
                                                    <span v-else-if="selectedNeuroButton === 6">Healthy Axons and Neurons</span>

                                                </p>
                                            </div>

                                            <canvas
                                                ref="brainCanvas"
                                                width="380"
                                                height="300"
                                                class="relative z-10 rounded-xl"
                                                style="max-width: 100%; background: rgba(250, 250, 252, 0.5);">
                                            </canvas>
                                        </div>
                                    </div>
                                </div>
                                <div class="px-6 pb-4">
                                    <div>
                                        <BlurReveal :delay="0.2" :duration="0.75" :key="selectedNeuroButton">
                                        <div class="font-bold text-xl text-[#1d1d1f] mb-1">{{ neuroScienceData[selectedNeuroButton - 1].heading }}</div>
                                        <div class="text-sm font-semibold mb-3" :class="subHeadingColor">
                                            {{ neuroScienceData[selectedNeuroButton - 1].subheading }}
                                        </div>
                                        <p class="text-[#86868b] text-sm leading-relaxed mb-3">
                                            {{ neuroScienceData[selectedNeuroButton - 1].description }}
                                        </p>
                                        <div class="text-[10px] text-[#c0c0c0] font-medium">
                                            {{ neuroScienceData[selectedNeuroButton - 1].citation }}
                                        </div>
                                        </BlurReveal>
                                    </div>
                                    
                                </div>
                                <div class="px-6 pb-6">
                                    <div class="flex items-center justify-between">
                                        <!-- Backwards Button -->
                                        <button @click="() => controlNsPagination('backwards')" class="w-8 h-8 rounded-full border border-[#e0e0e0] flex items-center justify-center disabled:opacity-30 cursor-pointer disabled:cursor-default transition-all text-[#86868b]" :class="selectedNeuroButton == 1 ? '' : 'hover:text-[#007aff] hover:border-[#007aff]'" :disabled="selectedNeuroButton == 1 ? true : false">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16"
                                                height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                class="lucide lucide-chevron-left">
                                                <path d="m15 18-6-6 6-6"></path>
                                            </svg>
                                        </button>
                                        <div class="flex gap-2">
                                            <button @click="() => selectedNeuroButton = 1" class="transition-all duration-300 rounded-full cursor-pointer" :class="selectedNeuroButton == 1 ? 'w-[24px] bg-[rgb(255,49,48)]' : 'w-[8px] bg-[rgb(210,210,215)]'" style="height: 8px;"></button>
                                            <button @click="() => selectedNeuroButton = 2" class="transition-all duration-300 rounded-full cursor-pointer" :class="selectedNeuroButton == 2 ? 'w-[24px] bg-[rgb(255,107,48)]': 'w-[8px] bg-[rgb(210,210,215)]'" style="height: 8px;"></button>
                                            <button @click="() => selectedNeuroButton = 3" class="transition-all duration-300 rounded-full cursor-pointer" :class="selectedNeuroButton == 3 ? 'w-[24px] bg-[rgb(255,149,0)]' : 'w-[8px] bg-[rgb(210,210,215)]'" style="height: 8px;"></button>
                                            <button @click="() => selectedNeuroButton = 4" class="transition-all duration-300 rounded-full cursor-pointer" :class="selectedNeuroButton == 4 ? 'w-[24px] bg-[rgb(255,204,0)]' : 'w-[8px] bg-[rgb(210,210,215)]'" style="height: 8px;"></button>
                                            <button @click="() => selectedNeuroButton = 5" class="transition-all duration-300 rounded-full cursor-pointer" :class="selectedNeuroButton == 5 ? 'w-[24px] bg-[rgb(52,199,89)]' : 'w-[8px] bg-[rgb(210,210,215)]'" style="height: 8px;"></button>
                                            <button @click="() => selectedNeuroButton = 6" class="transition-all duration-300 rounded-full cursor-pointer" :class="selectedNeuroButton == 6 ? 'w-[24px] bg-[rgb(0,122,255)]' : 'w-[8px] bg-[rgb(210,210,215)]'" style="height: 8px;"></button>
                                        </div>
                                        <!-- Forwards Button -->
                                        <button @click="() => controlNsPagination('forwards')" class="w-8 h-8 rounded-full border border-[#e0e0e0] flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-default transition-all text-[#86868b]" :class="selectedNeuroButton == 6 ? '' : 'hover:text-[#007aff] hover:border-[#007aff]'" :disabled="selectedNeuroButton == 6 ? true : false">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round" class="lucide lucide-chevron-right">
                                                <path d="m9 18 6-6-6-6"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <BlurReveal :delay="0.2" :duration="0.75" :key="selectedTimeline">
                            <div class="mt-4 flex items-center justify-between px-2">
                    
                                <div class="text-sm font-semibold px-3 py-1.5 rounded-full" :class="percentageRecoveryBgColor">
                                    {{ helpfulTrackingInfo[selectedTimeline - 1].recoveryPercentage }}% recovered
                                </div>
                                <div class="text-xs text-[#86868b]">
                                    <svg v-if="selectedTimeline <= 8" style="display: inline;" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 36 36">
                                        <path fill="#ffcc4d" d="M2.653 35C.811 35-.001 33.662.847 32.027L16.456 1.972c.849-1.635 2.238-1.635 3.087 0l15.609 30.056c.85 1.634.037 2.972-1.805 2.972z" />
                                        <path fill="#231f20" d="M15.583 28.953a2.42 2.42 0 0 1 2.419-2.418a2.42 2.42 0 0 1 2.418 2.418a2.42 2.42 0 0 1-2.418 2.419a2.42 2.42 0 0 1-2.419-2.419m.186-18.293c0-1.302.961-2.108 2.232-2.108c1.241 0 2.233.837 2.233 2.108v11.938c0 1.271-.992 2.108-2.233 2.108c-1.271 0-2.232-.807-2.232-2.108z" />
                                    </svg>
                                    <svg v-if="selectedTimeline > 8 && selectedTimeline <= 20" style="display: inline;" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 64 64">
                                        <path fill="#1b75bb" d="M63.918 57.025a6.89 6.89 0 0 1-6.891 6.895H6.888A6.89 6.89 0 0 1 0 57.025V6.891A6.89 6.89 0 0 1 6.888 0h50.139a6.89 6.89 0 0 1 6.891 6.891z" />
                                        <g fill="#fff">
                                            <path d="M8.885 35.11c2.835-.656 5.733-.901 8.748-.968c.205-5.423 1.842-9.312 4.959-11.619q1.11-.852 2.622-1.323c1-.312 1.979-.51 2.917-.589c.943-.079 2.24-.12 3.9-.12h7.553v.035h9.97v-.827q-.002-2.093-.42-3.4q-.417-1.31-1.795-2.032c-.915-.479-2.285-.721-4.095-.721h-13c-2.253 0-4.292.13-6.085.383a21.8 21.8 0 0 0-5.058 1.325a17.3 17.3 0 0 0-4.331 2.503a18.6 18.6 0 0 0-4.131 4.605q-1.61 2.569-2.382 5.782c-.456 1.895-.68 3.999-.732 6.251a5.4 5.4 0 0 1 1.36.715" />
                                            <path d="M41.749 27.731c.601.899 1.724 1.545 3.051 1.651l14.183-12.328L44.812 4.812c-1.339.106-2.462.75-3.062 1.653z" />
                                            <circle cx="12.607" cy="33.9" r="5.125" />
                                            <path d="M58.39 29.938c-2.833.656-5.729.901-8.744.968c-.205 5.422-1.842 9.312-4.96 11.619q-1.108.852-2.623 1.323c-1 .312-1.979.511-2.917.589c-.944.078-2.239.12-3.902.12h-7.552v-.036H17.72v.827q.001 2.093.421 3.4q.417 1.308 1.793 2.032c.916.479 2.286.72 4.096.72h13c2.254 0 4.292-.129 6.086-.383a22 22 0 0 0 5.058-1.325a17.3 17.3 0 0 0 4.329-2.503a18.6 18.6 0 0 0 4.132-4.605q1.608-2.57 2.384-5.782c.453-1.895.68-3.999.73-6.251a5.4 5.4 0 0 1-1.361-.713" />
                                            <path d="M25.529 37.31c-.604-.898-1.726-1.545-3.053-1.65L8.294 47.987L22.465 60.23c1.339-.106 2.461-.75 3.064-1.653zm29.142-11.29a5.125 5.125 0 1 1-5.128 5.124a5.126 5.126 0 0 1 5.128-5.124" />
                                        </g>
                                    </svg>
                                    <svg v-if="selectedTimeline == 21" style="display: inline; color: rgb(52,199,89);" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
	                                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m5 13l4 4L19 7" />
                                    </svg>
                                     {{ helpfulTrackingInfo[selectedTimeline - 1].brainState}}
                                </div>
                            </div>
                            </BlurReveal>
                            <div class="flex items-center gap-4 mt-6 justify-center">
                                <button @click="() => handleTimelinePagination('backwards')" class="w-12 h-12 rounded-full border-2 border-[#d2d2d7] flex items-center justify-center disabled:opacity-30 transition-all cursor-pointer disabled:cursor-default" tabindex="0" :class="selectedTimeline == 1 ? '' : 'hover:border-[#007aff] hover:text-[#007aff] '" :disabled="selectedTimeline == 1 ? true : false">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="lucide lucide-chevron-left">
                                        <path d="m15 18-6-6 6-6"></path>
                                    </svg>
                                </button>
                                <span class="text-[#86868b] text-sm font-medium">Day {{ selectedTimeline }} of 21</span>
                                <button @click="() => handleTimelinePagination('forwards')" class="w-12 h-12 rounded-full border-2 border-[#d2d2d7] flex items-center justify-center disabled:opacity-30 transition-all cursor-pointer disabled:cursor-default" :class="selectedTimeline == 21 ? '' : 'hover:border-[#007aff] hover:text-[#007aff]'" :disabled="selectedTimeline == 21 ? true : false">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="lucide lucide-chevron-right">
                                        <path d="m9 18 6-6-6-6"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <!-- Day Description Component to be displayed here --> 
                            <DayRecoveryDescription :day="daysDescription[selectedTimeline - 1].day" :description="daysDescription[selectedTimeline - 1].description" :toDo="daysDescription[selectedTimeline - 1].toDo" :notToDo="daysDescription[selectedTimeline - 1].notToDo"/>
                </div>
                <!-- Helpful disclaimer -->
                <div class="text-center border-t border-[#f0f0f0] pt-12">
                    <p class="text-[#86868b] text-base">
                        All recovery protocols based on the
                        <span class="font-semibold text-[#1d1d1f]">
                            Australian Institute of Sport (AIS) Concussion and Brain Health
                            Position Statement 2024
                        </span>
                        <br>Neuroscience grounded in Giza &amp; Hovda (2014) neurometabolic
                        cascade research
                    </p>
                </div>
            </div>
        </div>
    </main>

</template>

<style scoped>
.animateUpandDown {
    animation-name: itemUpandDown;
    animation-iteration-count: infinite;
    animation-duration: 1500ms;
    animation-timing-function: ease-out;
}


@keyframes itemUpandDown {
    0% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(5.76755px);
    }

    100% {
        transform: translateY(0px);
    }

}
</style>