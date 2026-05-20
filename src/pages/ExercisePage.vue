<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXERCISE DEFINITIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXERCISE STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STREAK FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function loadExerciseHistory() {
  const saved = localStorage.getItem('concovery_exercise_history')
  if (!saved) return
  const history: { date: string; completed: boolean }[] = JSON.parse(saved)
  const today = new Date()
  let streak = 0
  for (let i = 0; i < 30; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const entry   = history.find(h => h.date === dateStr)
    if (entry?.completed) { streak++ }
    else if (i > 0)       { break }
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
  if (existing >= 0) { history[existing].completed = true }
  else               { history.push({ date: todayStr, completed: true }) }
  localStorage.setItem('concovery_exercise_history', JSON.stringify(history))
  loadExerciseHistory()
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CAMERA CUE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REP LOGIC
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CAMERA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RING HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NAVIGATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

onMounted(() => { loadExerciseHistory() })
onUnmounted(() => {
  stopAllCameras()
  exerciseIntervals.forEach(i => { if (i) clearInterval(i) })
})
</script>

<template>
  <div class="bg-white min-h-screen">

    <!-- ── HEADER ─────────────────────────────────────────────────────────── -->
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

    <!-- ── STREAK BAR ─────────────────────────────────────────────────────── -->
    <div class="bg-[#F7F9FC] border-b border-[#EBEBEB] py-5">
      <div class="max-w-[1200px] mx-auto px-8 flex items-center justify-between">
        <div>
          <p class="text-lg font-bold text-[#1A1A1A]">{{ exerciseStreak > 0 ? `${exerciseStreak} day streak` : 'Start your streak today' }}</p>
          <p class="text-base text-[#5A7A9B]">Complete all 3 exercises daily to maintain your streak</p>
        </div>
        <div class="flex gap-2">
          <div v-for="(done, i) in weeklyCompletion" :key="i" class="w-8 h-8 rounded-lg transition-colors" :class="done ? 'bg-[#1B7C3D]' : 'bg-[#EBEBEB]'" :title="done ? 'Completed' : 'Not completed'"/>
        </div>
      </div>
    </div>

    <!-- ── ALL DONE BANNER ────────────────────────────────────────────────── -->
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

    <!-- ── EXERCISE CARDS ─────────────────────────────────────────────────── -->
    <div class="max-w-[1200px] mx-auto px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(def, idx) in exerciseDefinitions" :key="idx"
          class="bg-white rounded-3xl border-2 shadow-sm transition-all duration-300"
          :class="exerciseState[idx].phase === 'complete' ? 'border-[#1B7C3D]' : 'border-[#EBEBEB]'"
        >

          <!-- Card header -->
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

          <!-- ── ANIMATION ────────────────────────────────────────────────── -->
          <div class="px-8 pt-6 pb-3">
            <div class="flex items-center justify-between mb-3">
              <p class="text-sm font-semibold text-[#5A7A9B] uppercase tracking-wider">Watch &amp; follow</p>
              <span class="text-xs bg-[#1A4FAB]/10 text-[#1A4FAB] px-2.5 py-1 rounded-full font-semibold">Loops automatically</span>
            </div>

            <!-- ═══════════════════════════════════════════════════════════
              CHIN TUCK
              Dark background, same visual language as the homepage football
              animation. Geometric person in side profile. The head+neck
              group slides backward. A ghost outline shows where neutral is.
              An ice-blue rail shows the chin must stay at the same height.
              The orange dot is the chin reference point to watch.
            ═══════════════════════════════════════════════════════════════ -->
            <div v-if="def.diagram === 'chin-tuck'" class="rounded-2xl overflow-hidden" style="background:#07090e; height:200px;">
              <svg viewBox="0 0 300 200" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">

                <!-- Subtle background diagonal lines — same as hero section -->
                <rect width="300" height="200" fill="#07090e"/>
                <line x1="0" y1="50"  x2="100" y2="0"   stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="0" y1="100" x2="200" y2="0"   stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="0" y1="150" x2="300" y2="0"   stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="0" y1="200" x2="300" y2="50"  stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="50" y1="200" x2="300" y2="100" stroke="rgba(56,191,255,0.04)" stroke-width="1"/>

                <!-- Phase labels -->
                <g class="ct-phase-neutral">
                  <rect x="195" y="10" width="90" height="20" rx="10" fill="rgba(230,81,0,0.18)"/>
                  <text x="240" y="24" text-anchor="middle" font-size="10" fill="#E65100" font-family="sans-serif" font-weight="700" letter-spacing="0.5">NEUTRAL</text>
                </g>
                <g class="ct-phase-tucked">
                  <rect x="195" y="10" width="90" height="20" rx="10" fill="rgba(56,191,255,0.18)"/>
                  <text x="240" y="24" text-anchor="middle" font-size="10" fill="#38bfff" font-family="sans-serif" font-weight="700" letter-spacing="0.5">TUCKED ✓</text>
                </g>

                <!-- Horizontal chin-level guide rail -->
                <line x1="20" y1="112" x2="285" y2="112" stroke="#38bfff" stroke-width="1" stroke-dasharray="6 4" opacity="0.35"/>
                <!-- Back direction label -->
                <text x="218" y="104" font-size="9.5" fill="#38bfff" font-family="sans-serif" font-weight="700" opacity="0.8">← BACK</text>

                <!-- Ghost outline showing neutral start position (fixed) -->
                <circle cx="162" cy="76" r="44" stroke="#38bfff" stroke-width="1.2" stroke-dasharray="4 3" fill="rgba(56,191,255,0.04)" opacity="0.5"/>

                <!-- Static body: shoulders -->
                <path d="M 32 192 C 52 164 90 156 150 154 L 180 154 C 240 156 278 164 298 192 Z"
                  fill="#1A4FAB" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
                <!-- Shirt collar line -->
                <path d="M 138 154 Q 150 166 162 154" stroke="rgba(255,255,255,0.2)" stroke-width="1.2" fill="none"/>

                <!-- ── ANIMATED GROUP: neck + head slide backward ── -->
                <g class="ct-head">

                  <!-- Neck -->
                  <rect x="140" y="118" width="32" height="38" rx="10" fill="#FFCC88" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>

                  <!-- Head circle (the main element) -->
                  <circle cx="162" cy="76" r="44" fill="#FFCC88" stroke="rgba(255,255,255,0.25)" stroke-width="2.5"/>

                  <!-- Hair — thick stroke covers top/back of skull -->
                  <path d="M 120 80 C 118 52 134 32 162 30 C 186 30 200 46 202 64"
                    stroke="#3D2B1A" stroke-width="14" fill="none" stroke-linecap="round"/>

                  <!-- Ear (left side, visible from right-facing profile) -->
                  <circle cx="120" cy="80" r="11" fill="#F4C88A" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
                  <circle cx="122" cy="80" r="5" fill="rgba(0,0,0,0.12)"/>

                  <!-- Eyebrow -->
                  <path d="M 172 60 Q 182 55 192 59" stroke="#3D2B1A" stroke-width="2.5" stroke-linecap="round" fill="none"/>

                  <!-- Eye -->
                  <circle cx="182" cy="68" r="8" fill="white"/>
                  <circle cx="182" cy="68" r="5" fill="#1A1A1A"/>
                  <circle cx="184" cy="66" r="2" fill="white"/>

                  <!-- Nose bump (protrudes right) -->
                  <ellipse cx="200" cy="80" rx="5" ry="8" fill="#F4C88A" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>

                  <!-- Mouth -->
                  <path d="M 192 98 Q 200 105 208 98" stroke="#C9956A" stroke-width="2.2" fill="none" stroke-linecap="round"/>

                  <!-- Chin reference dot — tracks along the guide rail -->
                  <circle cx="208" cy="112" r="7" fill="#E65100" stroke="white" stroke-width="2"/>
                  <circle cx="208" cy="112" r="3" fill="white" opacity="0.5"/>

                </g>

                <!-- Bottom label -->
                <text x="150" y="197" text-anchor="middle" font-size="9.5" fill="rgba(56,191,255,0.7)" font-family="sans-serif" font-weight="600">Not down — pull chin straight back</text>

              </svg>
            </div>

            <!-- ═══════════════════════════════════════════════════════════
              NECK ROTATION
              Front-facing person on dark background. The head circle and
              hair stay fixed (the skull doesn't deform). Only the face
              FEATURES (both eyes, nose-direction line, mouth) rotate as a
              group around the head centre (150, 80). The orange nose line
              acts like a compass needle — it's the single clearest indicator
              of where the face is pointing. 5.5s cycle: left → centre → right.
            ═══════════════════════════════════════════════════════════════ -->
            <div v-else-if="def.diagram === 'neck-rotation'" class="rounded-2xl overflow-hidden" style="background:#07090e; height:200px;">
              <svg viewBox="0 0 300 200" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">

                <rect width="300" height="200" fill="#07090e"/>
                <!-- Background lines -->
                <line x1="0" y1="50"  x2="100" y2="0"   stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="0" y1="100" x2="200" y2="0"   stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="0" y1="150" x2="300" y2="0"   stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="0" y1="200" x2="300" y2="50"  stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="50" y1="200" x2="300" y2="100" stroke="rgba(56,191,255,0.04)" stroke-width="1"/>

                <!-- Range-of-motion arc guide -->
                <path d="M 60 162 A 100 100 0 0 1 240 162" stroke="#38bfff" stroke-width="1" stroke-dasharray="5 4" opacity="0.22" fill="none"/>

                <!-- Phase labels -->
                <g class="nr-phase-centre">
                  <rect x="105" y="10" width="90" height="20" rx="10" fill="rgba(56,191,255,0.15)"/>
                  <text x="150" y="24" text-anchor="middle" font-size="10" fill="#38bfff" font-family="sans-serif" font-weight="700">CENTRE</text>
                </g>
                <g class="nr-phase-left">
                  <rect x="87" y="10" width="126" height="20" rx="10" fill="rgba(230,81,0,0.15)"/>
                  <text x="150" y="24" text-anchor="middle" font-size="10" fill="#E65100" font-family="sans-serif" font-weight="700">LOOKING LEFT</text>
                </g>
                <g class="nr-phase-right">
                  <rect x="87" y="10" width="126" height="20" rx="10" fill="rgba(230,81,0,0.15)"/>
                  <text x="150" y="24" text-anchor="middle" font-size="10" fill="#E65100" font-family="sans-serif" font-weight="700">LOOKING RIGHT</text>
                </g>

                <!-- Direction labels -->
                <text class="nr-lbl-l" x="12" y="96" font-size="11" fill="white" font-family="sans-serif" font-weight="700">← LEFT</text>
                <text class="nr-lbl-r" x="232" y="96" font-size="11" fill="white" font-family="sans-serif" font-weight="700">RIGHT →</text>

                <!-- Static body: shoulders + neck base -->
                <path d="M 44 192 C 66 164 106 156 150 154 C 194 156 234 164 256 192 Z"
                  fill="#1A4FAB" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
                <path d="M 135 154 Q 150 167 165 154" stroke="rgba(255,255,255,0.18)" stroke-width="1.2" fill="none"/>
                <!-- Neck -->
                <rect x="134" y="132" width="32" height="24" rx="10" fill="#FFCC88" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>

                <!-- Static elements: head circle, hair cap, ears -->
                <!-- Head circle -->
                <circle cx="150" cy="80" r="52" fill="#FFCC88" stroke="rgba(255,255,255,0.25)" stroke-width="2.5"/>
                <!-- Hair cap (filled area at top/back of skull) -->
                <path d="M 100 78 C 102 36 122 24 150 22 C 178 24 198 36 200 78 L 196 86 C 190 44 172 30 150 30 C 128 30 110 44 104 86 Z" fill="#3D2B1A"/>
                <!-- Left ear -->
                <circle cx="98" cy="82" r="11" fill="#F4C88A" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>
                <circle cx="100" cy="82" r="5" fill="rgba(0,0,0,0.12)"/>
                <!-- Right ear -->
                <circle cx="202" cy="82" r="11" fill="#F4C88A" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>
                <circle cx="200" cy="82" r="5" fill="rgba(0,0,0,0.12)"/>

                <!-- ── ANIMATED: face features rotate around head centre (150,80) ── -->
                <!-- Only the eyes, nose-line, and mouth rotate.
                     The skull, hair, ears stay perfectly still.
                     transform-origin is set to the absolute SVG coordinate
                     of the head centre so the rotation is perfectly centred. -->
                <g class="nr-face">
                  <!-- Left eyebrow -->
                  <path d="M 126 66 Q 136 60 144 65" stroke="#3D2B1A" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                  <!-- Right eyebrow -->
                  <path d="M 156 65 Q 164 60 174 66" stroke="#3D2B1A" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                  <!-- Left eye -->
                  <circle cx="135" cy="76" r="8" fill="white"/>
                  <circle cx="135" cy="76" r="5.5" fill="#1A1A1A"/>
                  <circle cx="137" cy="74" r="2.2" fill="white"/>
                  <!-- Right eye -->
                  <circle cx="165" cy="76" r="8" fill="white"/>
                  <circle cx="165" cy="76" r="5.5" fill="#1A1A1A"/>
                  <circle cx="167" cy="74" r="2.2" fill="white"/>
                  <!-- Nose direction line — the compass needle showing where face points -->
                  <line x1="150" y1="86" x2="150" y2="124" stroke="#E65100" stroke-width="5" stroke-linecap="round"/>
                  <circle cx="150" cy="128" r="6.5" fill="#E65100" stroke="white" stroke-width="2"/>
                  <!-- Mouth -->
                  <path d="M 136 106 Q 150 116 164 106" stroke="#C9956A" stroke-width="2.2" fill="none" stroke-linecap="round"/>
                </g>

                <!-- Bottom label -->
                <text x="150" y="197" text-anchor="middle" font-size="9.5" fill="rgba(56,191,255,0.7)" font-family="sans-serif" font-weight="600">Slow — stop before any pain</text>

              </svg>
            </div>

            <!-- ═══════════════════════════════════════════════════════════
              NECK ISOMETRICS
              Dark background. Person in side profile (facing left). Head is
              completely static. A stylised palm presses in from the right
              with a pushing motion. Orange force arrows show the push direction.
              Blue resistance arrows show the neck pushing back (equal force).
              The ice-blue HOLD STILL badge pulses to reinforce zero movement.
              2.6s press cycle — feels urgent and active.
            ═══════════════════════════════════════════════════════════════ -->
            <div v-else-if="def.diagram === 'isometric'" class="rounded-2xl overflow-hidden" style="background:#07090e; height:200px;">
              <svg viewBox="0 0 300 200" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">

                <rect width="300" height="200" fill="#07090e"/>
                <!-- Background lines -->
                <line x1="0" y1="50"  x2="100" y2="0"   stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="0" y1="100" x2="200" y2="0"   stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="0" y1="150" x2="300" y2="0"   stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="0" y1="200" x2="300" y2="50"  stroke="rgba(56,191,255,0.04)" stroke-width="1"/>
                <line x1="50" y1="200" x2="300" y2="100" stroke="rgba(56,191,255,0.04)" stroke-width="1"/>

                <!-- Static body: shoulders (green shirt, different from chin tuck) -->
                <path d="M 30 192 C 50 164 88 156 136 154 L 166 154 C 214 156 252 164 272 192 Z"
                  fill="#1B7C3D" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
                <path d="M 122 154 Q 136 167 150 154" stroke="rgba(255,255,255,0.18)" stroke-width="1.2" fill="none"/>

                <!-- Static neck -->
                <rect x="122" y="122" width="32" height="34" rx="10" fill="#FFCC88" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>

                <!-- Static head (facing LEFT — completely still, no animation) -->
                <circle cx="138" cy="76" r="46" fill="#FFCC88" stroke="rgba(255,255,255,0.25)" stroke-width="2.5"/>
                <!-- Hair (on right/back of head since facing left) -->
                <path d="M 178 80 C 180 52 166 32 138 30 C 114 30 98 48 98 66"
                  stroke="#3D2B1A" stroke-width="14" fill="none" stroke-linecap="round"/>
                <!-- Right ear (skull side, visible when facing left) -->
                <circle cx="182" cy="80" r="11" fill="#F4C88A" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>
                <circle cx="180" cy="80" r="5" fill="rgba(0,0,0,0.12)"/>
                <!-- Eyebrow (face/left side) -->
                <path d="M 108 62 Q 118 57 128 61" stroke="#3D2B1A" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                <!-- Eye -->
                <circle cx="118" cy="70" r="8" fill="white"/>
                <circle cx="118" cy="70" r="5.5" fill="#1A1A1A"/>
                <circle cx="120" cy="68" r="2.2" fill="white"/>
                <!-- Nose (protrudes left) -->
                <ellipse cx="97" cy="80" rx="5.5" ry="8.5" fill="#F4C88A" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
                <!-- Mouth -->
                <path d="M 96 100 Q 108 108 120 100" stroke="#C9956A" stroke-width="2.2" fill="none" stroke-linecap="round"/>

                <!-- HOLD STILL badge (ice blue, pulses) -->
                <g class="iso-hold">
                  <rect x="118" y="30" width="82" height="22" rx="11" fill="rgba(56,191,255,0.14)" stroke="rgba(56,191,255,0.35)" stroke-width="1"/>
                  <text x="159" y="45" text-anchor="middle" font-size="10" fill="#38bfff" font-family="sans-serif" font-weight="700" letter-spacing="0.3">HOLD STILL</text>
                </g>

                <!-- Blue resistance arrows: neck/head pushes BACK against the hand (pointing right) -->
                <g opacity="0.7">
                  <line x1="118" y1="68" x2="136" y2="68" stroke="#38bfff" stroke-width="2.5" stroke-linecap="round"/>
                  <line x1="118" y1="78" x2="136" y2="78" stroke="#38bfff" stroke-width="2.5" stroke-linecap="round"/>
                  <line x1="118" y1="88" x2="136" y2="88" stroke="#38bfff" stroke-width="2.5" stroke-linecap="round"/>
                  <path d="M 132 65 L 136 68 L 132 71" stroke="#38bfff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                  <path d="M 132 75 L 136 78 L 132 81" stroke="#38bfff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                  <path d="M 132 85 L 136 88 L 132 91" stroke="#38bfff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </g>

                <!-- Orange force arrows: hand pushes LEFT toward forehead (pulse with palm) -->
                <g class="iso-force">
                  <line x1="166" y1="68" x2="148" y2="68" stroke="#E65100" stroke-width="3" stroke-linecap="round"/>
                  <line x1="166" y1="78" x2="148" y2="78" stroke="#E65100" stroke-width="3" stroke-linecap="round"/>
                  <line x1="166" y1="88" x2="148" y2="88" stroke="#E65100" stroke-width="3" stroke-linecap="round"/>
                  <path d="M 152 65 L 148 68 L 152 71" stroke="#E65100" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                  <path d="M 152 75 L 148 78 L 152 81" stroke="#E65100" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                  <path d="M 152 85 L 148 88 L 152 91" stroke="#E65100" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </g>

                <!-- Animated palm presses from the right -->
                <g class="iso-palm">
                  <!-- Wrist/forearm -->
                  <rect x="240" y="62" width="36" height="36" rx="8" fill="#FFCC88" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
                  <!-- Palm body -->
                  <rect x="174" y="56" width="68" height="48" rx="14" fill="#FFCC88" stroke="rgba(255,255,255,0.3)" stroke-width="2.5"/>
                  <!-- Knuckle line -->
                  <path d="M 178 80 Q 208 76 240 80" stroke="rgba(0,0,0,0.12)" stroke-width="1.5" fill="none"/>
                  <!-- Finger tips at left/pressing edge -->
                  <rect x="163" y="60" width="14" height="11" rx="6" fill="#FFCC88" stroke="rgba(255,255,255,0.25)" stroke-width="1.8"/>
                  <rect x="163" y="73" width="14" height="11" rx="6" fill="#FFCC88" stroke="rgba(255,255,255,0.25)" stroke-width="1.8"/>
                  <rect x="163" y="86" width="14" height="11" rx="6" fill="#FFCC88" stroke="rgba(255,255,255,0.25)" stroke-width="1.8"/>
                  <!-- Thumb -->
                  <rect x="186" y="103" width="30" height="14" rx="7" fill="#FFCC88" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
                  <!-- PUSH label -->
                  <text x="208" y="83" text-anchor="middle" font-size="10" fill="#E65100" font-family="sans-serif" font-weight="700">PUSH</text>
                </g>

                <!-- Bottom label -->
                <text x="150" y="197" text-anchor="middle" font-size="9.5" fill="rgba(56,191,255,0.7)" font-family="sans-serif" font-weight="600">Head must not move at all</text>

              </svg>
            </div>
          </div>

          <!-- Cue tip -->
          <div class="px-8 pb-5">
            <div class="bg-[#F7F9FC] rounded-xl px-4 py-3 flex gap-2">
              <svg class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A7A9B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span class="text-sm text-[#5A7A9B] italic">{{ def.cue }}</span>
            </div>
          </div>

          <!-- Camera feed -->
          <div class="px-8">
            <div class="bg-[#0A1628] rounded-2xl overflow-hidden relative" style="aspect-ratio:4/3;">
              <video
                :ref="(el) => { videoRefs[idx] = el as HTMLVideoElement }"
                autoplay playsinline muted
                class="w-full h-full object-cover"
                :class="cameraActive[idx] ? 'opacity-100' : 'opacity-0'"
              />
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

          <!-- Set and rep tracker -->
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
                <div class="h-full rounded-full bg-[#1A4FAB] transition-all duration-300" :style="{ width: `${(exerciseState[idx].currentRep / def.reps) * 100}%` }" />
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

          <!-- Action buttons -->
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
/* ━━ PAGE TRANSITIONS ━━ */
.fade-scale-enter-active, .fade-scale-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.fade-scale-enter-from, .fade-scale-leave-to { opacity: 0; transform: scale(0.97); }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CHIN TUCK
   Head+neck group slides -24px backward, holds, returns.
   Phase labels alternate. 4.5s cycle.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
@keyframes ctSlide {
  0%,  10%  { transform: translateX(0px); }
  28%, 58%  { transform: translateX(-24px); }
  76%, 100% { transform: translateX(0px); }
}
.ct-head { animation: ctSlide 4.5s ease-in-out infinite; }

@keyframes ctPhaseN {
  0%,  10%  { opacity: 1; }
  24%, 66%  { opacity: 0; }
  78%, 100% { opacity: 1; }
}
.ct-phase-neutral { animation: ctPhaseN 4.5s ease-in-out infinite; }

@keyframes ctPhaseT {
  0%,  23%  { opacity: 0; }
  33%, 55%  { opacity: 1; }
  70%, 100% { opacity: 0; }
}
.ct-phase-tucked { animation: ctPhaseT 4.5s ease-in-out infinite; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NECK ROTATION
   Only the face features (eyes, nose line, mouth) rotate.
   The skull circle, hair, and ears stay perfectly fixed.
   transform-origin is the absolute SVG coordinate of the head centre
   so the rotation pivots exactly at the right point.
   5.5s cycle: forward → left (hold) → forward → right (hold).
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
@keyframes nrFaceRotate {
  0%,  8%   { transform: rotate(0deg); }
  22%, 38%  { transform: rotate(-42deg); }
  48%, 52%  { transform: rotate(0deg); }
  66%, 82%  { transform: rotate(42deg); }
  92%, 100% { transform: rotate(0deg); }
}
.nr-face {
  transform-origin: 150px 80px;
  animation: nrFaceRotate 5.5s ease-in-out infinite;
}

@keyframes nrCentre {
  0%,  8%   { opacity: 1; }
  16%, 44%  { opacity: 0; }
  52%, 60%  { opacity: 1; }
  68%, 92%  { opacity: 0; }
  100%      { opacity: 1; }
}
.nr-phase-centre { animation: nrCentre 5.5s ease-in-out infinite; }

@keyframes nrPLeft {
  0%,  12%  { opacity: 0; }
  20%, 40%  { opacity: 1; }
  48%, 100% { opacity: 0; }
}
.nr-phase-left { animation: nrPLeft 5.5s ease-in-out infinite; }

@keyframes nrPRight {
  0%,  60%  { opacity: 0; }
  68%, 88%  { opacity: 1; }
  96%, 100% { opacity: 0; }
}
.nr-phase-right { animation: nrPRight 5.5s ease-in-out infinite; }

@keyframes nrLblLeft {
  0%,  12%  { opacity: 0.3; }
  20%, 38%  { opacity: 1; }
  48%, 100% { opacity: 0.3; }
}
.nr-lbl-l { animation: nrLblLeft 5.5s ease-in-out infinite; }

@keyframes nrLblRight {
  0%,  60%  { opacity: 0.3; }
  68%, 88%  { opacity: 1; }
  96%, 100% { opacity: 0.3; }
}
.nr-lbl-r { animation: nrLblRight 5.5s ease-in-out infinite; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ISOMETRICS
   Palm presses -12px toward the forehead. 2.6s cycle.
   Force arrows and HOLD STILL badge pulse in sync.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
@keyframes isoPress {
  0%,  100% { transform: translateX(0px); }
  35%,  65% { transform: translateX(-12px); }
}
.iso-palm { animation: isoPress 2.6s ease-in-out infinite; }

@keyframes isoForce {
  0%,  100% { opacity: 0.18; }
  35%,  65% { opacity: 1; }
}
.iso-force { animation: isoForce 2.6s ease-in-out infinite; }

@keyframes isoHold {
  0%,  100% { opacity: 0.45; }
  50%       { opacity: 1; }
}
.iso-hold { animation: isoHold 2.6s ease-in-out infinite; }
</style>
