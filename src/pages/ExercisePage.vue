<script setup lang="ts">
// Run: npm install gsap
import gsap from 'gsap'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const exerciseDefinitions = [
  {
    name: 'Chin Tucks',
    reps: 10, sets: 3, holdSeconds: 5, restSeconds: 30,
    instructions: 'Gently pull your chin straight back, like you are making a double chin. Hold the position, then release slowly.',
    cue: 'Pull chin straight back - not down',
    diagram: 'chin-tuck',
  },
  {
    name: 'Neck Rotations',
    reps: 10, sets: 1, holdSeconds: 3, restSeconds: 20,
    instructions: 'Slowly turn your head to the left until you feel a gentle stretch. Hold briefly, return to centre. Repeat to the right. That is one rep.',
    cue: 'Turn slowly — stop before pain',
    diagram: 'neck-rotation',
  },
  {
    name: 'Neck Isometrics',
    reps: 8, sets: 3, holdSeconds: 8, restSeconds: 30,
    instructions: 'Place your palm flat against your forehead. Push your head forward into your hand — resist with your neck so your head does not move. Hold for 8 seconds.',
    cue: 'Head must stay completely still',
    diagram: 'isometric',
  },
]

const exerciseState = ref(exerciseDefinitions.map(() => ({
  phase: 'idle' as 'idle' | 'holding' | 'resting' | 'complete',
  currentSet: 1, currentRep: 0, timer: 0, totalRepsCompleted: 0,
})))

const videoRefs        = ref<(HTMLVideoElement | null)[]>([null, null, null])
const cameraActive     = ref<boolean[]>([false, false, false])
const cameraStreams     = ref<(MediaStream | null)[]>([null, null, null])
const positionFeedback = ref<string[]>(['', '', ''])
let exerciseIntervals: (ReturnType<typeof setInterval> | null)[] = [null, null, null]

const exerciseStreak   = ref(0)
const weeklyCompletion = ref<boolean[]>([false, false, false, false, false, false, false])
const allExercisesDone = computed(() => exerciseState.value.every(s => s.phase === 'complete'))

// ── GSAP animation refs ───────────────────────────────────────────────────────
const ctHead    = ref<SVGGElement | null>(null)
const ctBadgeN  = ref<SVGGElement | null>(null)
const ctBadgeT  = ref<SVGGElement | null>(null)

const nrHead    = ref<SVGGElement | null>(null)
const nrBadgeC  = ref<SVGGElement | null>(null)
const nrBadgeL  = ref<SVGGElement | null>(null)
const nrBadgeR  = ref<SVGGElement | null>(null)
const nrLblL    = ref<SVGTextElement | null>(null)
const nrLblR    = ref<SVGTextElement | null>(null)

const isoArm    = ref<SVGGElement | null>(null)
const isoForce  = ref<SVGGElement | null>(null)
const isoHold   = ref<SVGGElement | null>(null)

const gsapTimelines: gsap.core.Timeline[] = []

// ── GSAP timelines ────────────────────────────────────────────────────────────

function setupChinTuck() {
  if (!ctHead.value || !ctBadgeN.value || !ctBadgeT.value) return
  gsap.set(ctBadgeT.value, { opacity: 0 })

  const tl = gsap.timeline({ repeat: -1 })
  tl.to({}, { duration: 1 })
  tl.to(ctHead.value, { x: -26, duration: 1.4, ease: 'power2.inOut' })
    .to(ctBadgeN.value, { opacity: 0, duration: 0.3 }, '<0.8')
    .to(ctBadgeT.value, { opacity: 1, duration: 0.3 }, '<')
  tl.to({}, { duration: 1.8 })
  tl.to(ctHead.value, { x: 0, duration: 1.4, ease: 'power2.inOut' })
    .to(ctBadgeT.value, { opacity: 0, duration: 0.3 }, '<0.6')
    .to(ctBadgeN.value, { opacity: 1, duration: 0.3 }, '<')
  tl.to({}, { duration: 1.2 })
  gsapTimelines.push(tl)
}

function setupNeckRotation() {
  if (!nrHead.value) return
  gsap.set(nrBadgeL.value, { opacity: 0 })
  gsap.set(nrBadgeR.value, { opacity: 0 })
  gsap.set(nrLblL.value,   { opacity: 0.35 })
  gsap.set(nrLblR.value,   { opacity: 0.35 })

  const tl = gsap.timeline({ repeat: -1 })
  tl.to({}, { duration: 0.8 })
  tl.to(nrHead.value, { x: -30, scaleX: 0.75, duration: 1.5, ease: 'power2.inOut' })
    .to(nrBadgeC.value, { opacity: 0, duration: 0.3 }, '<0.8')
    .to(nrBadgeL.value, { opacity: 1, duration: 0.3 }, '<')
    .to(nrLblL.value,   { opacity: 1, duration: 0.3 }, '<')
  tl.to({}, { duration: 1.3 })
  tl.to(nrHead.value, { x: 0, scaleX: 1, duration: 1.5, ease: 'power2.inOut' })
    .to(nrBadgeL.value, { opacity: 0, duration: 0.3 }, '<0.6')
    .to(nrBadgeC.value, { opacity: 1, duration: 0.3 }, '<')
    .to(nrLblL.value,   { opacity: 0.35, duration: 0.3 }, '<')
  tl.to({}, { duration: 0.8 })
  tl.to(nrHead.value, { x: 30, scaleX: 0.75, duration: 1.5, ease: 'power2.inOut' })
    .to(nrBadgeC.value, { opacity: 0, duration: 0.3 }, '<0.8')
    .to(nrBadgeR.value, { opacity: 1, duration: 0.3 }, '<')
    .to(nrLblR.value,   { opacity: 1, duration: 0.3 }, '<')
  tl.to({}, { duration: 1.3 })
  tl.to(nrHead.value, { x: 0, scaleX: 1, duration: 1.5, ease: 'power2.inOut' })
    .to(nrBadgeR.value, { opacity: 0, duration: 0.3 }, '<0.6')
    .to(nrBadgeC.value, { opacity: 1, duration: 0.3 }, '<')
    .to(nrLblR.value,   { opacity: 0.35, duration: 0.3 }, '<')
  tl.to({}, { duration: 0.8 })
  gsapTimelines.push(tl)
}

function setupIsometrics() {
  if (!isoArm.value) return
  gsap.set(isoForce.value, { opacity: 0.2 })
  gsap.set(isoHold.value,  { opacity: 0.5 })

  const tl = gsap.timeline({ repeat: -1 })
  tl.to({}, { duration: 1 })
  tl.to(isoArm.value,   { x: -12, duration: 0.9, ease: 'power2.in' })
    .to(isoForce.value, { opacity: 1, duration: 0.4 }, '<')
    .to(isoHold.value,  { opacity: 1, duration: 0.4 }, '<')
  tl.to({}, { duration: 2 })
  tl.to(isoArm.value,   { x: 0, duration: 0.9, ease: 'power2.out' })
    .to(isoForce.value, { opacity: 0.2, duration: 0.4 }, '<')
    .to(isoHold.value,  { opacity: 0.5, duration: 0.4 }, '<')
  tl.to({}, { duration: 1 })
  gsapTimelines.push(tl)
}

// ── Streak, camera, rep logic (unchanged) ─────────────────────────────────────

function loadExerciseHistory() {
  const saved = localStorage.getItem('concovery_exercise_history')
  if (!saved) return
  const history: { date: string; completed: boolean }[] = JSON.parse(saved)
  const today = new Date()
  let streak = 0
  for (let i = 0; i < 30; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    if (history.find(h => h.date === dateStr)?.completed) streak++
    else if (i > 0) break
  }
  exerciseStreak.value = streak
  for (let i = 0; i < 7; i++) {
    const d = new Date(today); d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]
    weeklyCompletion.value[i] = history.find(h => h.date === dateStr)?.completed || false
  }
}

function saveExerciseCompletion() {
  const saved    = localStorage.getItem('concovery_exercise_history')
  const history: { date: string; completed: boolean }[] = saved ? JSON.parse(saved) : []
  const todayStr = new Date().toISOString().split('T')[0]
  const existing = history.findIndex(h => h.date === todayStr)
  if (existing >= 0) history[existing].completed = true
  else history.push({ date: todayStr, completed: true })
  localStorage.setItem('concovery_exercise_history', JSON.stringify(history))
  loadExerciseHistory()
}

function getInstructionalCue(exerciseIdx: number, phase: string, timerPct: number): string {
  const exercise = exerciseDefinitions[exerciseIdx]
  if (phase === 'holding') {
    if (timerPct < 30) return exercise.cue
    if (timerPct < 70) return 'Hold steady — do not move'
    return 'Almost done — keep holding'
  }
  if (phase === 'resting') return 'Rest — breathe normally'
  return 'Position yourself in the frame'
}

function startRep(idx: number) {
  const state     = exerciseState.value[idx]
  const def       = exerciseDefinitions[idx]
  state.phase     = 'holding'
  state.timer     = def.holdSeconds
  const totalTime = def.holdSeconds
  if (exerciseIntervals[idx]) clearInterval(exerciseIntervals[idx]!)
  exerciseIntervals[idx] = setInterval(() => {
    state.timer--
    const pct = ((totalTime - state.timer) / totalTime) * 100
    positionFeedback.value[idx] = getInstructionalCue(idx, 'holding', pct)
    if (state.timer <= 0) {
      clearInterval(exerciseIntervals[idx]!)
      state.currentRep++
      state.totalRepsCompleted++
      const setDone     = state.currentRep >= def.reps
      const allSetsDone = setDone && state.currentSet >= def.sets
      if (allSetsDone) {
        state.phase = 'complete'
        positionFeedback.value[idx] = 'Exercise complete'
        if (allExercisesDone.value) saveExerciseCompletion()
      } else if (setDone) {
        state.phase      = 'resting'
        state.timer      = def.restSeconds
        state.currentRep = 0
        state.currentSet++
        positionFeedback.value[idx] = 'Rest — next set coming up'
        exerciseIntervals[idx] = setInterval(() => {
          state.timer--
          positionFeedback.value[idx] = `Rest — next set in ${state.timer}s`
          if (state.timer <= 0) {
            clearInterval(exerciseIntervals[idx]!)
            state.phase = 'idle'
            positionFeedback.value[idx] = 'Ready for next set'
          }
        }, 1000)
      } else {
        state.phase = 'idle'
        positionFeedback.value[idx] = 'Good — tap Start Rep to continue'
      }
    }
  }, 1000)
}

function resetExercise(idx: number) {
  if (exerciseIntervals[idx]) clearInterval(exerciseIntervals[idx]!)
  exerciseState.value[idx] = { phase: 'idle', currentSet: 1, currentRep: 0, timer: 0, totalRepsCompleted: 0 }
  positionFeedback.value[idx] = ''
}

async function startCamera(idx: number) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } })
    cameraStreams.value[idx] = stream
    cameraActive.value[idx]  = true
    await new Promise(resolve => setTimeout(resolve, 100))
    const videoEl = videoRefs.value[idx]
    if (videoEl) { videoEl.srcObject = stream; videoEl.play() }
    positionFeedback.value[idx] = 'Camera ready — position yourself in the frame'
  } catch {
    positionFeedback.value[idx] = 'Camera access denied — please allow camera permissions'
  }
}

function stopCamera(idx: number) {
  const stream = cameraStreams.value[idx]
  if (stream) { stream.getTracks().forEach(t => t.stop()); cameraStreams.value[idx] = null }
  cameraActive.value[idx]     = false
  positionFeedback.value[idx] = ''
}

function stopAllCameras() { for (let i = 0; i < 3; i++) stopCamera(i) }

function getRepRingDasharray(idx: number): string {
  const state = exerciseState.value[idx]
  const def   = exerciseDefinitions[idx]
  if (state.phase === 'complete') return '251.2 251.2'
  if (state.phase === 'holding')  return `${((def.holdSeconds - state.timer) / def.holdSeconds) * 251.2} 251.2`
  if (state.phase === 'resting')  return `${((def.restSeconds - state.timer) / def.restSeconds) * 251.2} 251.2`
  return '0 251.2'
}

function getRepRingColor(idx: number): string {
  const phase = exerciseState.value[idx].phase
  if (phase === 'complete') return '#1B7C3D'
  if (phase === 'resting')  return '#E65100'
  return '#1A4FAB'
}

function finishAndReturn() {
  localStorage.setItem('concovery_return_modal', 'true')
  stopAllCameras()
  router.push('/iteration3/stagedrecovery')
}

function skipAndReturn() {
  localStorage.setItem('concovery_return_modal', 'true')
  stopAllCameras()
  router.push('/iteration3/stagedrecovery')
}

onMounted(() => {
  loadExerciseHistory()
  setTimeout(() => {
    setupChinTuck()
    setupNeckRotation()
    setupIsometrics()
  }, 100)
})

onUnmounted(() => {
  stopAllCameras()
  exerciseIntervals.forEach(i => { if (i) clearInterval(i) })
  gsapTimelines.forEach(tl => tl.kill())
})
</script>

<template>
  <div class="bg-white min-h-screen">

    <div style="background:#0A1628;" class="sticky top-0 z-40">
      <div class="max-w-[1200px] mx-auto px-8 py-5 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button @click="skipAndReturn" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div>
            <p class="text-white/50 text-sm font-semibold uppercase tracking-widest">Daily Check-in · Step 3 of 4</p>
            <h1 class="text-white text-2xl font-black">Neck Exercises</h1>
          </div>
        </div>
        <button @click="skipAndReturn" class="text-white/50 text-base hover:text-white transition-colors font-semibold">Skip for now</button>
      </div>
      <div class="h-1.5 bg-white/10">
        <div class="h-full bg-[#1A4FAB] transition-all duration-500" style="width: 75%" />
      </div>
    </div>

    <div class="bg-[#F7F9FC] border-b border-[#EBEBEB] py-5">
      <div class="max-w-[1200px] mx-auto px-8 flex items-center justify-between">
        <div>
          <p class="text-lg font-bold text-[#1A1A1A]">{{ exerciseStreak > 0 ? `${exerciseStreak} day streak` : 'Start your streak today' }}</p>
          <p class="text-base text-[#5A7A9B]">Complete all 3 exercises daily to maintain your streak</p>
        </div>
        <div class="flex gap-2">
          <div v-for="(done, i) in weeklyCompletion" :key="i" class="w-8 h-8 rounded-lg transition-colors" :class="done ? 'bg-[#1B7C3D]' : 'bg-[#EBEBEB]'"/>
        </div>
      </div>
    </div>

    <Transition name="fade-scale">
      <div v-if="allExercisesDone" class="bg-[#1B7C3D]/10 border-b-2 border-[#1B7C3D] py-8 text-center">
        <svg class="mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1B7C3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <p class="text-2xl font-bold text-[#1A1A1A] mb-2">All 3 exercises complete!</p>
        <p class="text-[#5A7A9B] text-lg mb-6">Great work. Return to finish your daily check-in.</p>
        <button @click="finishAndReturn" class="bg-[#1B7C3D] text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-[#166a33] transition-colors flex items-center gap-3 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Back to check-in — continue to journal
        </button>
      </div>
    </Transition>

    <div class="max-w-[1200px] mx-auto px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(def, idx) in exerciseDefinitions" :key="idx"
          class="bg-white rounded-3xl border-2 shadow-sm transition-all duration-300"
          :class="exerciseState[idx].phase === 'complete' ? 'border-[#1B7C3D]' : 'border-[#EBEBEB]'"
        >
          <div class="p-8 border-b border-[#EBEBEB]">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-2xl font-bold text-[#1A1A1A] mb-2">{{ def.name }}</h3>
                <span class="text-sm font-semibold bg-[#1A4FAB]/10 text-[#1A4FAB] px-4 py-1.5 rounded-full">{{ def.sets }} sets × {{ def.reps }} reps</span>
              </div>
              <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" :class="exerciseState[idx].phase === 'complete' ? 'bg-[#1B7C3D]' : 'bg-[#F7F9FC] border border-[#EBEBEB]'">
                <svg v-if="exerciseState[idx].phase === 'complete'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span v-else class="text-base font-bold text-[#5A7A9B]">{{ idx + 1 }}</span>
              </div>
            </div>
            <p class="text-base text-[#1A1A1A] leading-relaxed">{{ def.instructions }}</p>
          </div>

          <!-- ANIMATION -->
          <div class="px-8 pt-6 pb-3">
            <div class="flex items-center justify-between mb-3">
              <p class="text-sm font-semibold text-[#5A7A9B] uppercase tracking-wider">Watch &amp; follow</p>
              <span class="text-xs bg-[#1A4FAB]/10 text-[#1A4FAB] px-2.5 py-1 rounded-full font-semibold">Loops automatically</span>
            </div>

            <!--
              All three animations use the EXACT same design language
              as the football player on the homepage:
                Head  = <circle fill="#ffcc88">
                Hair  = bezier arc (same style as football player hair)
                Eyes  = <circle r="3" fill="#333"> (tiny dots)
                Body  = <rect rx="5"> with a colour fill
                Arms  = <line stroke-width="9" stroke-linecap="round">
              This keeps the visual style consistent across the whole app.
            -->

            <!-- CHIN TUCK: side profile, head slides back -->
            <div v-if="def.diagram === 'chin-tuck'" class="rounded-2xl overflow-hidden" style="background:#07090e; height:210px;">
              <svg viewBox="0 0 300 200" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Same background speed-lines as the homepage football section -->
                <rect width="300" height="200" fill="#07090e"/>
                <line x1="0" y1="60"  x2="120" y2="0"   stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="0" y1="120" x2="240" y2="0"   stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="0" y1="180" x2="300" y2="60"  stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="60" y1="200" x2="300" y2="120" stroke="rgba(56,191,255,0.04)" stroke-width="1"/>

                <!-- Phase badges -->
                <g ref="ctBadgeN">
                  <rect x="184" y="10" width="102" height="21" rx="10.5" fill="rgba(230,81,0,0.18)"/>
                  <text x="235" y="25" text-anchor="middle" font-size="10" fill="#E65100" font-family="sans-serif" font-weight="700">NEUTRAL</text>
                </g>
                <g ref="ctBadgeT">
                  <rect x="180" y="10" width="106" height="21" rx="10.5" fill="rgba(56,191,255,0.18)"/>
                  <text x="233" y="25" text-anchor="middle" font-size="10" fill="#38bfff" font-family="sans-serif" font-weight="700">TUCKED ✓</text>
                </g>

                <!-- Horizontal guide rail -->
                <line x1="10" y1="118" x2="290" y2="118" stroke="#38bfff" stroke-width="1" stroke-dasharray="6 4" opacity="0.25"/>
                <text x="216" y="111" font-size="8.5" fill="#38bfff" font-family="sans-serif" font-weight="700" opacity="0.8">← BACK</text>

                <!-- Ghost: dashed circle at neutral position (always fixed) -->
                <circle cx="128" cy="76" r="30" stroke="#38bfff" stroke-width="1.2" stroke-dasharray="4 3" fill="rgba(56,191,255,0.04)"/>

                <!-- Static body: shirt + shoulders.
                     Same exact approach as the football player jersey. -->
                <rect x="96" y="132" width="60" height="70" rx="8" fill="#1A4FAB"/>
                <ellipse cx="84"  cy="133" rx="24" ry="10" fill="#1A4FAB"/>
                <ellipse cx="168" cy="133" rx="24" ry="10" fill="#1A4FAB"/>

                <!-- Animated group: neck + head + hair + eye + nose + chin dot -->
                <g ref="ctHead">
                  <!-- Neck (thick line, same as football player limbs) -->
                  <line x1="116" y1="105" x2="116" y2="134" stroke="#ffcc88" stroke-width="22" stroke-linecap="butt"/>

                  <!-- Head circle — identical to the football player head -->
                  <circle cx="128" cy="76" r="30" fill="#ffcc88"/>

                  <!-- Hair — same bezier style as: M133 198 Q135 178 155 177 Q175 178 177 198 fill="#3a1a00"
                       For side profile: arc across top and back of skull -->
                  <path d="M 98 76 Q 100 42 128 40 Q 158 42 160 76 Z" fill="#3a1a00"/>

                  <!-- One eye on the face/right side — same dot as football player -->
                  <circle cx="148" cy="72" r="3" fill="#333"/>

                  <!-- Tiny nose bump on face side -->
                  <ellipse cx="158" cy="82" rx="3" ry="5.5" fill="#f0b87a"/>

                  <!-- Orange chin dot — tracks the guide rail as head slides back -->
                  <circle cx="158" cy="118" r="7" fill="#E65100" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
                </g>

                <text x="150" y="198" text-anchor="middle" font-size="9" fill="rgba(56,191,255,0.65)" font-family="sans-serif" font-weight="600">Not down — pull chin straight back</text>
              </svg>
            </div>

            <!-- NECK ROTATION: front-facing, same character as football player -->
            <div v-else-if="def.diagram === 'neck-rotation'" class="rounded-2xl overflow-hidden" style="background:#07090e; height:210px;">
              <svg viewBox="0 0 300 200" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="300" height="200" fill="#07090e"/>
                <line x1="0" y1="60"  x2="120" y2="0"   stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="0" y1="120" x2="240" y2="0"   stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="0" y1="180" x2="300" y2="60"  stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="60" y1="200" x2="300" y2="120" stroke="rgba(56,191,255,0.04)" stroke-width="1"/>

                <!-- Phase badges -->
                <g ref="nrBadgeC">
                  <rect x="105" y="10" width="90" height="21" rx="10.5" fill="rgba(56,191,255,0.15)"/>
                  <text x="150" y="25" text-anchor="middle" font-size="10" fill="#38bfff" font-family="sans-serif" font-weight="700">CENTRE</text>
                </g>
                <g ref="nrBadgeL">
                  <rect x="86" y="10" width="128" height="21" rx="10.5" fill="rgba(230,81,0,0.15)"/>
                  <text x="150" y="25" text-anchor="middle" font-size="10" fill="#E65100" font-family="sans-serif" font-weight="700">LOOKING LEFT</text>
                </g>
                <g ref="nrBadgeR">
                  <rect x="86" y="10" width="128" height="21" rx="10.5" fill="rgba(230,81,0,0.15)"/>
                  <text x="150" y="25" text-anchor="middle" font-size="10" fill="#E65100" font-family="sans-serif" font-weight="700">LOOKING RIGHT</text>
                </g>
                <text ref="nrLblL"  x="8"   y="100" font-size="10" fill="white" font-family="sans-serif" font-weight="700">← LEFT</text>
                <text ref="nrLblR"  x="228" y="100" font-size="10" fill="white" font-family="sans-serif" font-weight="700">RIGHT →</text>

                <!-- Static body: same jersey style as football player -->
                <rect x="112" y="136" width="76" height="64" rx="8" fill="#1A4FAB"/>
                <ellipse cx="98"  cy="137" rx="30" ry="12" fill="#1A4FAB"/>
                <ellipse cx="202" cy="137" rx="30" ry="12" fill="#1A4FAB"/>
                <!-- Collar — same as football player collar area -->
                <path d="M 130 136 Q 150 152 170 136" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" fill="none"/>

                <!-- Static neck base -->
                <line x1="150" y1="116" x2="150" y2="138" stroke="#ffcc88" stroke-width="22" stroke-linecap="butt"/>

                <!-- Animated head group — same face as football player -->
                <g ref="nrHead" class="nr-head-group">
                  <!-- Head: same circle size as football player (r=22 → scaled up slightly for clarity) -->
                  <circle cx="150" cy="78" r="36" fill="#ffcc88"/>
                  <!-- Hair: same Q-bezier style as fp-head hair -->
                  <path d="M 114 78 Q 116 44 150 42 Q 184 44 186 78 Z" fill="#3a1a00"/>
                  <!-- Two eyes — same r=3 dots as football player -->
                  <circle cx="138" cy="76" r="3.5" fill="#333"/>
                  <circle cx="162" cy="76" r="3.5" fill="#333"/>
                  <!-- Mouth — same style as fp-mouth -->
                  <path d="M 138 92 Q 150 100 162 92" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round"/>
                </g>

                <text x="150" y="198" text-anchor="middle" font-size="9" fill="rgba(56,191,255,0.65)" font-family="sans-serif" font-weight="600">Slow — stop before any pain</text>
              </svg>
            </div>

            <!-- ISOMETRICS: side profile (facing left), arm pressing from right -->
            <div v-else-if="def.diagram === 'isometric'" class="rounded-2xl overflow-hidden" style="background:#07090e; height:210px;">
              <svg viewBox="0 0 300 200" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="300" height="200" fill="#07090e"/>
                <line x1="0" y1="60"  x2="120" y2="0"   stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="0" y1="120" x2="240" y2="0"   stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="0" y1="180" x2="300" y2="60"  stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="60" y1="200" x2="300" y2="120" stroke="rgba(56,191,255,0.04)" stroke-width="1"/>

                <!-- HOLD STILL badge -->
                <g ref="isoHold">
                  <rect x="112" y="10" width="102" height="21" rx="10.5" fill="rgba(27,124,61,0.2)" stroke="rgba(56,191,255,0.3)" stroke-width="1"/>
                  <text x="163" y="25" text-anchor="middle" font-size="10" fill="#38bfff" font-family="sans-serif" font-weight="700">HOLD STILL</text>
                </g>

                <!-- Static body: green jersey this time (variety) -->
                <rect x="92" y="132" width="60" height="70" rx="8" fill="#1B7C3D"/>
                <ellipse cx="80"  cy="133" rx="24" ry="10" fill="#1B7C3D"/>
                <ellipse cx="164" cy="133" rx="24" ry="10" fill="#1B7C3D"/>

                <!-- Static head: facing LEFT (completely still, zero animation) -->
                <line x1="140" y1="105" x2="140" y2="134" stroke="#ffcc88" stroke-width="22" stroke-linecap="butt"/>
                <circle cx="128" cy="76" r="30" fill="#ffcc88"/>
                <!-- Hair same bezier style -->
                <path d="M 98 76 Q 100 42 128 40 Q 158 42 160 76 Z" fill="#3a1a00"/>
                <!-- Eye on LEFT/face side since facing left -->
                <circle cx="108" cy="72" r="3" fill="#333"/>
                <!-- Nose on left side -->
                <ellipse cx="98" cy="82" rx="3" ry="5.5" fill="#f0b87a"/>

                <!-- Blue resistance arrows: head pushes back (always visible, static) -->
                <g opacity="0.65">
                  <line x1="114" y1="68" x2="132" y2="68" stroke="#38bfff" stroke-width="2.5" stroke-linecap="round"/>
                  <line x1="114" y1="78" x2="132" y2="78" stroke="#38bfff" stroke-width="2.5" stroke-linecap="round"/>
                  <line x1="114" y1="88" x2="132" y2="88" stroke="#38bfff" stroke-width="2.5" stroke-linecap="round"/>
                  <path d="M 128 65 L 132 68 L 128 71" stroke="#38bfff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                  <path d="M 128 75 L 132 78 L 128 81" stroke="#38bfff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                  <path d="M 128 85 L 132 88 L 128 91" stroke="#38bfff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </g>

                <!-- Orange force arrows: GSAP pulses these on press -->
                <g ref="isoForce">
                  <line x1="166" y1="68" x2="148" y2="68" stroke="#E65100" stroke-width="3" stroke-linecap="round"/>
                  <line x1="166" y1="78" x2="148" y2="78" stroke="#E65100" stroke-width="3" stroke-linecap="round"/>
                  <line x1="166" y1="88" x2="148" y2="88" stroke="#E65100" stroke-width="3" stroke-linecap="round"/>
                  <path d="M 152 65 L 148 68 L 152 71" stroke="#E65100" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                  <path d="M 152 75 L 148 78 L 152 81" stroke="#E65100" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                  <path d="M 152 85 L 148 88 L 152 91" stroke="#E65100" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </g>

                <!-- Animated arm: GSAP moves this group x: -12 on press.
                     Built from lines + rect — same approach as football player arms/legs. -->
                <g ref="isoArm">
                  <!-- Green sleeve (shirt) on upper arm — same thick line approach as fp arms -->
                  <line x1="214" y1="130" x2="218" y2="96" stroke="#1B7C3D" stroke-width="28" stroke-linecap="round"/>
                  <!-- Skin tone arm -->
                  <line x1="214" y1="130" x2="220" y2="92" stroke="#ffcc88" stroke-width="18" stroke-linecap="round"/>
                  <!-- Forearm angling toward head -->
                  <line x1="220" y1="92"  x2="178" y2="66" stroke="#ffcc88" stroke-width="17" stroke-linecap="round"/>
                  <!-- Palm -->
                  <rect x="158" y="54" width="22" height="38" rx="9" fill="#ffcc88"/>
                  <!-- Fingers — three rects, same rx style as palm -->
                  <rect x="144" y="58" width="16" height="8" rx="4" fill="#ffcc88"/>
                  <rect x="144" y="69" width="16" height="8" rx="4" fill="#ffcc88"/>
                  <rect x="144" y="80" width="16" height="8" rx="4" fill="#ffcc88"/>
                </g>

                <text x="150" y="198" text-anchor="middle" font-size="9" fill="rgba(56,191,255,0.65)" font-family="sans-serif" font-weight="600">Head must not move at all</text>
              </svg>
            </div>
          </div>

          <div class="px-8 pb-5">
            <div class="bg-[#F7F9FC] rounded-xl px-4 py-3 flex gap-2">
              <svg class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A7A9B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span class="text-sm text-[#5A7A9B] italic">{{ def.cue }}</span>
            </div>
          </div>

          <div class="px-8">
            <div class="bg-[#0A1628] rounded-2xl overflow-hidden relative" style="aspect-ratio:4/3;">
              <video :ref="(el) => { videoRefs[idx] = el as HTMLVideoElement }" autoplay playsinline muted class="w-full h-full object-cover" :class="cameraActive[idx] ? 'opacity-100' : 'opacity-0'"/>
              <div v-if="!cameraActive[idx]" class="absolute inset-0 flex flex-col items-center justify-center text-white/40">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mb-3"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                <p class="text-base">Camera inactive</p>
              </div>
              <div v-if="cameraActive[idx] && positionFeedback[idx]" class="absolute bottom-0 left-0 right-0 bg-black/70 px-4 py-3 text-center">
                <p class="text-white text-base font-semibold">{{ positionFeedback[idx] }}</p>
              </div>
            </div>
            <p class="text-sm text-[#5A7A9B] text-center mt-2 mb-5">Live feed only. Nothing recorded or stored</p>
          </div>

          <div class="px-8 pb-5">
            <div class="flex items-center justify-between mb-5">
              <div class="flex gap-2">
                <div v-for="s in def.sets" :key="s" class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all" :class="s < exerciseState[idx].currentSet ? 'bg-[#1B7C3D] text-white' : s === exerciseState[idx].currentSet ? 'bg-[#1A4FAB] text-white' : 'bg-[#EBEBEB] text-[#5A7A9B]'">{{ s }}</div>
              </div>
              <span class="text-sm text-[#5A7A9B]">
                <span v-if="exerciseState[idx].phase !== 'complete'">Set {{ exerciseState[idx].currentSet }} of {{ def.sets }} — Rep {{ exerciseState[idx].currentRep }} of {{ def.reps }}</span>
                <span v-else class="text-[#1B7C3D] font-semibold">All sets complete</span>
              </span>
            </div>
            <div v-if="exerciseState[idx].phase !== 'complete'" class="mb-5">
              <div class="flex justify-between text-sm text-[#5A7A9B] mb-2"><span>Reps this set</span><span>{{ exerciseState[idx].currentRep }} / {{ def.reps }}</span></div>
              <div class="h-3 bg-[#EBEBEB] rounded-full overflow-hidden">
                <div class="h-full rounded-full bg-[#1A4FAB] transition-all duration-300" :style="{ width: `${(exerciseState[idx].currentRep / def.reps) * 100}%` }"/>
              </div>
            </div>
            <div v-if="exerciseState[idx].phase === 'holding' || exerciseState[idx].phase === 'resting'" class="flex flex-col items-center mb-5">
              <div class="relative w-28 h-28 mb-2">
                <svg class="w-28 h-28 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" stroke="#EBEBEB" stroke-width="6" fill="none"/>
                  <circle cx="40" cy="40" r="34" :stroke="getRepRingColor(idx)" stroke-width="6" fill="none" :stroke-dasharray="getRepRingDasharray(idx)" class="transition-all duration-1000"/>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-sm font-semibold uppercase" :style="{ color: getRepRingColor(idx) }">{{ exerciseState[idx].phase === 'resting' ? 'Rest' : 'Hold' }}</span>
                  <span class="text-3xl font-black text-[#1A1A1A]">{{ exerciseState[idx].timer }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="px-8 pb-8 space-y-3">
            <button v-if="!cameraActive[idx]" @click="startCamera(idx)" class="w-full py-5 rounded-full font-bold text-base bg-[#F7F9FC] text-[#1A4FAB] border-2 border-[#1A4FAB] hover:bg-[#1A4FAB] hover:text-white transition-all">Enable camera</button>
            <button v-else-if="exerciseState[idx].phase === 'idle'" @click="startRep(idx)" class="w-full py-5 rounded-full font-bold text-base bg-[#1A4FAB] text-white hover:bg-[#1440A0] transition-colors">{{ exerciseState[idx].currentRep === 0 && exerciseState[idx].currentSet === 1 ? 'Start exercise' : 'Start rep' }}</button>
            <div v-else-if="exerciseState[idx].phase === 'holding'" class="w-full py-5 rounded-full font-bold text-base bg-[#E65100] text-white text-center">Hold — {{ exerciseState[idx].timer }}s remaining</div>
            <div v-else-if="exerciseState[idx].phase === 'resting'" class="w-full py-5 rounded-full font-bold text-base bg-[#F7F9FC] text-[#E65100] border-2 border-[#E65100] text-center">Rest — next set in {{ exerciseState[idx].timer }}s</div>
            <div v-else-if="exerciseState[idx].phase === 'complete'" class="w-full py-5 rounded-full font-bold text-base bg-[#1B7C3D] text-white text-center">Done for today ✓</div>
            <div v-if="cameraActive[idx]" class="flex gap-3">
              <button @click="stopCamera(idx)" class="flex-1 py-3 text-sm text-[#5A7A9B] hover:text-[#C62828] transition-colors">Stop camera</button>
              <button v-if="exerciseState[idx].phase !== 'idle' && exerciseState[idx].phase !== 'complete'" @click="resetExercise(idx)" class="flex-1 py-3 text-sm text-[#5A7A9B] hover:text-[#1A4FAB] transition-colors">Reset</button>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-12">
        <button @click="allExercisesDone ? finishAndReturn() : skipAndReturn()" class="text-base text-[#5A7A9B] hover:text-[#1A1A1A] transition-colors font-semibold">
          {{ allExercisesDone ? 'All done — back to check-in' : 'Skip exercises and return' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-scale-enter-active, .fade-scale-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.fade-scale-enter-from, .fade-scale-leave-to { opacity: 0; transform: scale(0.97); }

/* Required for GSAP scaleX on neck rotation to compress from head's own centre */
.nr-head-group {
  transform-box: fill-box;
  transform-origin: center center;
}
</style>
