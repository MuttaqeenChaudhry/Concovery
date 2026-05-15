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
    instructions: 'Gently pull your chin straight back — like you are making a double chin. Hold the position, then release slowly.',
    cue: 'Pull chin straight back — not down',
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
// INSTRUCTIONAL CAMERA CUE
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
        // When all 3 exercises done save completion
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
// RETURN TO RECOVERY PAGE
// When all done: save a flag so StagedRecovery2 knows to reopen modal at step 4
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function finishAndReturn() {
  // Save flag so the recovery page re-opens the modal at the journal step
  localStorage.setItem('concovery_return_modal', 'true')
  stopAllCameras()
  router.push('/iteration3/stagedrecovery')
}

function skipAndReturn() {
  localStorage.setItem('concovery_return_modal', 'true')
  stopAllCameras()
  router.push('/iteration3/stagedrecovery')
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LIFECYCLE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
        <button @click="skipAndReturn" class="text-white/50 text-base hover:text-white transition-colors font-semibold">
          Skip for now
        </button>
      </div>
      <!-- Progress bar -->
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
          <div
            v-for="(done, i) in weeklyCompletion" :key="i"
            class="w-8 h-8 rounded-lg transition-colors"
            :class="done ? 'bg-[#1B7C3D]' : 'bg-[#EBEBEB]'"
            :title="done ? 'Completed' : 'Not completed'"
          />
        </div>
      </div>
    </div>

    <!-- ── ALL DONE BANNER ────────────────────────────────────────────────── -->
    <Transition name="fade-scale">
      <div v-if="allExercisesDone" class="bg-[#1B7C3D]/10 border-b-2 border-[#1B7C3D] py-8 text-center">
        <svg class="mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1B7C3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <p class="text-2xl font-bold text-[#1A1A1A] mb-2">All 3 exercises complete!</p>
        <p class="text-[#5A7A9B] text-lg mb-6">Great work. Return to finish your daily check-in.</p>
        <button
          @click="finishAndReturn"
          class="bg-[#1B7C3D] text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-[#166a33] transition-colors flex items-center gap-3 mx-auto"
        >
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

          <!-- Diagram -->
          <div class="px-8 pt-6 pb-4">
            <p class="text-sm font-semibold text-[#5A7A9B] uppercase tracking-wider mb-4">Correct position</p>

            <svg v-if="def.diagram === 'chin-tuck'" viewBox="0 0 200 120" class="w-full h-28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="80" cy="45" rx="28" ry="32" stroke="#1A1A1A" stroke-width="2" fill="#F7F9FC"/>
              <rect x="65" y="74" width="22" height="30" rx="4" fill="#F7F9FC" stroke="#1A1A1A" stroke-width="2"/>
              <circle cx="68" cy="40" r="3" fill="#1A1A1A"/>
              <path d="M 90 68 L 130 68" stroke="#1A4FAB" stroke-width="2.5" stroke-dasharray="4 2"/>
              <path d="M 90 68 L 98 63 M 90 68 L 98 73" stroke="#1A4FAB" stroke-width="2.5" stroke-linecap="round"/>
              <text x="132" y="72" font-size="11" fill="#1A4FAB" font-family="sans-serif">Pull back</text>
              <text x="48" y="115" font-size="10" fill="#1B7C3D" font-family="sans-serif" font-weight="600">Not down — straight back</text>
            </svg>

            <svg v-else-if="def.diagram === 'neck-rotation'" viewBox="0 0 200 120" class="w-full h-28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="100" cy="55" rx="35" ry="40" stroke="#1A1A1A" stroke-width="2" fill="#F7F9FC"/>
              <path d="M100 25 L100 35" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
              <path d="M65 55 Q50 30 75 20" stroke="#1A4FAB" stroke-width="2.5" stroke-dasharray="4 2"/>
              <path d="M 75 20 L 68 28 M 75 20 L 83 22" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round"/>
              <path d="M135 55 Q150 30 125 20" stroke="#1A4FAB" stroke-width="2.5" stroke-dasharray="4 2"/>
              <path d="M 125 20 L 132 28 M 125 20 L 117 22" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round"/>
              <text x="45" y="110" font-size="10" fill="#1B7C3D" font-family="sans-serif" font-weight="600">Slow — stop before pain</text>
            </svg>

            <svg v-else-if="def.diagram === 'isometric'" viewBox="0 0 200 120" class="w-full h-28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="100" cy="45" rx="30" ry="35" stroke="#1A1A1A" stroke-width="2" fill="#F7F9FC"/>
              <circle cx="88" cy="40" r="3" fill="#1A1A1A"/>
              <circle cx="112" cy="40" r="3" fill="#1A1A1A"/>
              <rect x="88" y="77" width="24" height="25" rx="4" fill="#F7F9FC" stroke="#1A1A1A" stroke-width="2"/>
              <rect x="55" y="20" width="32" height="18" rx="6" fill="#E65100" fill-opacity="0.15" stroke="#E65100" stroke-width="2"/>
              <text x="58" y="32" font-size="9" fill="#E65100" font-family="sans-serif" font-weight="600">Palm</text>
              <path d="M 87 29 L 73 29" stroke="#E65100" stroke-width="2.5"/>
              <path d="M 87 29 L 80 24 M 87 29 L 80 34" stroke="#E65100" stroke-width="2" stroke-linecap="round"/>
              <text x="42" y="110" font-size="10" fill="#1B7C3D" font-family="sans-serif" font-weight="600">Head must not move at all</text>
            </svg>
          </div>

          <!-- Cue tip -->
          <div class="px-8 pb-5">
            <div class="bg-[#F7F9FC] rounded-xl px-4 py-3 flex gap-2">
              <svg class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A7A9B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span class="text-sm text-[#5A7A9B] italic">{{ def.cue }}</span>
            </div>
          </div>

          <!-- Camera feed — large -->
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
              <div v-if="cameraActive[idx]" class="absolute inset-0 pointer-events-none flex items-center justify-center">
                <svg viewBox="0 0 120 160" class="w-28 opacity-25" fill="none">
                  <ellipse cx="60" cy="45" rx="30" ry="36" stroke="#1A4FAB" stroke-width="2" stroke-dasharray="4 2"/>
                  <line x1="60" y1="81" x2="60" y2="130" stroke="#1A4FAB" stroke-width="2" stroke-dasharray="4 2"/>
                  <line x1="30" y1="100" x2="90" y2="100" stroke="#1A4FAB" stroke-width="2" stroke-dasharray="4 2"/>
                </svg>
              </div>
            </div>
            <p class="text-sm text-[#5A7A9B] text-center mt-2 mb-5">Live feed only — nothing recorded or stored</p>
          </div>

          <!-- Set and rep tracker -->
          <div class="px-8 pb-5">
            <div class="flex items-center justify-between mb-5">
              <div class="flex gap-2">
                <div
                  v-for="s in def.sets" :key="s"
                  class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  :class="s < exerciseState[idx].currentSet ? 'bg-[#1B7C3D] text-white' : s === exerciseState[idx].currentSet ? 'bg-[#1A4FAB] text-white' : 'bg-[#EBEBEB] text-[#5A7A9B]'"
                >{{ s }}</div>
              </div>
              <span class="text-sm text-[#5A7A9B]">
                <span v-if="exerciseState[idx].phase !== 'complete'">Set {{ exerciseState[idx].currentSet }} of {{ def.sets }} — Rep {{ exerciseState[idx].currentRep }} of {{ def.reps }}</span>
                <span v-else class="text-[#1B7C3D] font-semibold">All sets complete</span>
              </span>
            </div>

            <div v-if="exerciseState[idx].phase !== 'complete'" class="mb-5">
              <div class="flex justify-between text-sm text-[#5A7A9B] mb-2">
                <span>Reps this set</span>
                <span>{{ exerciseState[idx].currentRep }} / {{ def.reps }}</span>
              </div>
              <div class="h-3 bg-[#EBEBEB] rounded-full overflow-hidden">
                <div class="h-full rounded-full bg-[#1A4FAB] transition-all duration-300" :style="{ width: `${(exerciseState[idx].currentRep / def.reps) * 100}%` }" />
              </div>
            </div>

            <!-- Hold / rest timer ring -->
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
            <button
              v-if="!cameraActive[idx]"
              @click="startCamera(idx)"
              class="w-full py-5 rounded-full font-bold text-base bg-[#F7F9FC] text-[#1A4FAB] border-2 border-[#1A4FAB] hover:bg-[#1A4FAB] hover:text-white transition-all"
            >Enable camera</button>

            <button
              v-else-if="exerciseState[idx].phase === 'idle'"
              @click="startRep(idx)"
              class="w-full py-5 rounded-full font-bold text-base bg-[#1A4FAB] text-white hover:bg-[#1440A0] transition-colors"
            >{{ exerciseState[idx].currentRep === 0 && exerciseState[idx].currentSet === 1 ? 'Start exercise' : 'Start rep' }}</button>

            <div v-else-if="exerciseState[idx].phase === 'holding'" class="w-full py-5 rounded-full font-bold text-base bg-[#E65100] text-white text-center">
              Hold — {{ exerciseState[idx].timer }}s remaining
            </div>

            <div v-else-if="exerciseState[idx].phase === 'resting'" class="w-full py-5 rounded-full font-bold text-base bg-[#F7F9FC] text-[#E65100] border-2 border-[#E65100] text-center">
              Rest — next set in {{ exerciseState[idx].timer }}s
            </div>

            <div v-else-if="exerciseState[idx].phase === 'complete'" class="w-full py-5 rounded-full font-bold text-base bg-[#1B7C3D] text-white text-center">
              Done for today ✓
            </div>

            <div v-if="cameraActive[idx]" class="flex gap-3">
              <button @click="stopCamera(idx)" class="flex-1 py-3 text-sm text-[#5A7A9B] hover:text-[#C62828] transition-colors">Stop camera</button>
              <button
                v-if="exerciseState[idx].phase !== 'idle' && exerciseState[idx].phase !== 'complete'"
                @click="resetExercise(idx)"
                class="flex-1 py-3 text-sm text-[#5A7A9B] hover:text-[#1A4FAB] transition-colors"
              >Reset</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom return button always visible -->
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
</style>
