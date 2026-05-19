<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Line } from 'vue-chartjs'
import BlurReveal from '@/components/ui/blur-reveal/BlurReveal.vue'
import {
  Chart as ChartJS, Title, Tooltip, Legend,
  LineElement, PointElement,
  CategoryScale, LinearScale
} from 'chart.js'
import axios from 'axios'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

// Close dropdowns when clicking outside
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (e) => { if (!el.contains(e.target)) binding.value(e) }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
}

//
// BRAIN REGIONS
// Source: QBI, Mayo Clinic, CDC
//

const brainRegions = {
  frontal:    { id: 'frontal',    name: 'Frontal Lobe',   controls: 'Decision making, planning and emotions',    symptoms: ['Trouble concentrating or making decisions', 'Feeling confused or foggy', 'Mood changes, feeling angry, sad or anxious more easily', 'Problems with planning or organising your day', 'Difficulty controlling impulses or emotions'] },
  temporal:   { id: 'temporal',   name: 'Temporal Lobe',  controls: 'Memory, language and sound processing',     symptoms: ['Trouble understanding what people say', 'Difficulty remembering new information', 'Problems recognising familiar faces or places', 'Sensitivity to sounds, everything seems too loud', 'Feeling dizzy or having balance issues'] },
  parietal:   { id: 'parietal',   name: 'Parietal Lobe',  controls: 'Touch, spatial awareness and coordination', symptoms: ['Feeling clumsy or uncoordinated', 'Trouble judging distances or spatial relationships', 'Problems with hand-eye coordination', 'Numbness or tingling sensations', 'Difficulty with reading or doing maths'] },
  occipital:  { id: 'occipital',  name: 'Occipital Lobe', controls: 'Vision and visual processing',              symptoms: ['Blurred or double vision', 'Sensitivity to light, bright lights hurt', 'Seeing spots or flashing lights', 'Trouble reading or tracking moving objects', 'Problems recognising what you are looking at'] },
  brainstem:  { id: 'brainstem',  name: 'Brainstem',      controls: 'Breathing, heart rate and alertness',       symptoms: ['Feeling extremely drowsy or struggling to stay awake', 'Irregular breathing patterns', 'Problems with balance and coordination', 'Nausea and vomiting', 'Changes in heart rate'] },
  cerebellum: { id: 'cerebellum', name: 'Cerebellum',     controls: 'Balance, movement and coordination',        symptoms: ['Loss of balance, feeling wobbly or unsteady', 'Trouble with coordination, movements feel jerky', 'Difficulty with fine motor skills like writing', 'Problems with timing in movements', 'Feeling dizzy when you move your head'] },
}

const selectedRegion = ref(null)
const hoveredRegion  = ref(null)

function selectRegion(id) {
  selectedRegion.value = selectedRegion.value === id ? null : id
}
function getRegionFill(id) {
  const active = hoveredRegion.value === id || selectedRegion.value === id
  if (active) return '#1A4FAB'
  if (selectedRegion.value && selectedRegion.value !== id) return '#E8EDF5'
  return '#D6E0F5'
}
function getRegionOpacity(id) {
  if (!selectedRegion.value) return 1
  return selectedRegion.value === id ? 1 : 0.4
}

// Text inside brain regions flips to white when that region is active
// so it stays legible against the dark blue fill
function getRegionTextFill(id) {
  const isActive = hoveredRegion.value === id || selectedRegion.value === id
  return isActive ? '#ffffff' : '#1A1A1A'
}

// 
// DROPDOWN AND FILTER STATE
//

const sportsDropdown    = ref([])
const ageGroupDropdown  = ref([])
const sportsType        = ref('Australian Rules Football')
const ageGroup          = ref('15-24')
const filtersApplied    = ref(false)
const sportDropdownOpen = ref(false)

const loadingDropdowns  = ref(false)
const loadingSports     = ref(false)
const loadingAge        = ref(false)
const loadingTrend      = ref(false)
const loadingComparison = ref(false)

// 
// SPORT AND AGE RAW DATA
// Sport data  = hospitalisations for a specific sport, split by sex.
// Age data    = hospitalisations for a specific age group across ALL sports.
//

const sportMale   = ref(0)
const sportFemale = ref(0)
const ageMale     = ref(0)
const ageFemale   = ref(0)

const sportTotal = computed(() => sportMale.value + sportFemale.value)
const ageTotal   = computed(() => ageMale.value + ageFemale.value)

const animSportMale   = ref(0)
const animSportFemale = ref(0)
const animAgeMale     = ref(0)
const animAgeFemale   = ref(0)

const sportMaleFillPct   = computed(() => sportTotal.value ? (sportMale.value   / sportTotal.value) * 100 : 0)
const sportFemaleFillPct = computed(() => sportTotal.value ? (sportFemale.value / sportTotal.value) * 100 : 0)
const ageMaleFillPct     = computed(() => ageTotal.value   ? (ageMale.value     / ageTotal.value)   * 100 : 0)
const ageFemaleFillPct   = computed(() => ageTotal.value   ? (ageFemale.value   / ageTotal.value)   * 100 : 0)

// Body fill animation - smooth ease-out cubic
function animateTo(startVal, endVal, setter) {
  const duration  = 700
  const startTime = performance.now()
  const diff      = endVal - startVal
  function step(now) {
    const elapsed  = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased    = 1 - Math.pow(1 - progress, 3)
    setter(startVal + diff * eased)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

// 
// COUNT-UP ANIMATION
// Used by Beat 1, Beat 2 detail card, and Beat 3
//

const displaySportMale      = ref(0)
const displaySportFemale    = ref(0)
const displayAgeMale        = ref(0)
const displayAgeFemale      = ref(0)
const displayComparisonRate = ref(0)

function countUp(from, to, setter) {
  const duration = 900
  const start    = performance.now()
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1)
    const eased    = 1 - Math.pow(1 - progress, 3)
    setter(Math.round(from + (to - from) * eased))
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

watch(sportMale,   (next, prev) => countUp(prev, next, v => displaySportMale.value   = v))
watch(sportFemale, (next, prev) => countUp(prev, next, v => displaySportFemale.value = v))
watch(ageMale,     (next, prev) => countUp(prev, next, v => displayAgeMale.value     = v))
watch(ageFemale,   (next, prev) => countUp(prev, next, v => displayAgeFemale.value   = v))

watch(sportMaleFillPct,   val => animateTo(animSportMale.value,   val, v => animSportMale.value   = v))
watch(sportFemaleFillPct, val => animateTo(animSportFemale.value, val, v => animSportFemale.value = v))
watch(ageMaleFillPct,     val => animateTo(animAgeMale.value,     val, v => animAgeMale.value     = v))
watch(ageFemaleFillPct,   val => animateTo(animAgeFemale.value,   val, v => animAgeFemale.value   = v))

// 
// SPORT ICON + COLOUR MAP
// Shared helper functions used by Beat 1 and Beat 2 detail card
// 

function getSportIconBg(name) {
  const n = (name || '').toLowerCase()
  if (n.includes('australian') || n.includes('touch football')) return '#1A4FAB'
  if (n.includes('rugby'))       return '#7C3D9E'
  if (n.includes('soccer'))      return '#1B7C3D'
  if (n.includes('basketball'))  return '#E65100'
  if (n.includes('cricket'))     return '#92400E'
  if (n.includes('swimming') || n.includes('diving') || n.includes('water')) return '#0891B2'
  if (n.includes('wheeled') || n.includes('motor') || n.includes('cycling')) return '#0369A1'
  if (n.includes('hockey') || n.includes('ice')) return '#0E7490'
  if (n.includes('tennis') || n.includes('racquet')) return '#CA8A04'
  if (n.includes('gymnastics') || n.includes('netball')) return '#DB2777'
  if (n.includes('combative'))   return '#991B1B'
  if (n.includes('equestrian'))  return '#92400E'
  if (n.includes('roller'))      return '#7C3AED'
  if (n.includes('fishing'))     return '#0891B2'
  if (n.includes('golf'))        return '#1B7C3D'
  if (n.includes('running') || n.includes('athletics')) return '#E65100'
  if (n.includes('walking'))     return '#5A7A9B'
  return '#1A4FAB'
}

function getSportIconSvgPath(name) {
  const n = (name || '').toLowerCase()
  if (n.includes('australian') || n.includes('touch football'))
    return `<ellipse cx="12" cy="12" rx="9" ry="6" fill="none" stroke="white" stroke-width="2"/><line x1="3" y1="12" x2="21" y2="12" stroke="white" stroke-width="1.5"/><path d="M12 6 Q15 9 15 12 Q15 15 12 18" fill="none" stroke="white" stroke-width="1.5"/>`
  if (n.includes('rugby'))
    return `<ellipse cx="12" cy="12" rx="9" ry="6" fill="none" stroke="white" stroke-width="2"/><line x1="3" y1="12" x2="21" y2="12" stroke="white" stroke-width="1.5"/><line x1="12" y1="6" x2="12" y2="18" stroke="white" stroke-width="1.5"/>`
  if (n.includes('soccer'))
    return `<circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/><path d="M12 3 L14 8 L19 8 L15 12 L17 17 L12 14 L7 17 L9 12 L5 8 L10 8 Z" fill="none" stroke="white" stroke-width="1.5"/>`
  if (n.includes('basketball'))
    return `<circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/><path d="M3 12 Q7 7 12 12 Q17 17 21 12" fill="none" stroke="white" stroke-width="1.5"/><path d="M12 3 Q8 7 12 12 Q16 17 12 21" fill="none" stroke="white" stroke-width="1.5"/>`
  if (n.includes('cricket'))
    return `<rect x="10" y="3" width="5" height="13" rx="2.5" fill="none" stroke="white" stroke-width="2"/><circle cx="12" cy="20" r="2" fill="white"/>`
  if (n.includes('swimming') || n.includes('diving') || n.includes('water'))
    return `<circle cx="12" cy="5" r="2.5" fill="white"/><path d="M3 11 Q6 8 9 11 Q12 14 15 11 Q18 8 21 11" fill="none" stroke="white" stroke-width="2"/><path d="M3 16 Q6 13 9 16 Q12 19 15 16 Q18 13 21 16" fill="none" stroke="white" stroke-width="2"/>`
  if (n.includes('wheeled') || n.includes('motor') || n.includes('cycling'))
    return `<circle cx="6" cy="15" r="4" fill="none" stroke="white" stroke-width="2"/><circle cx="18" cy="15" r="4" fill="none" stroke="white" stroke-width="2"/><path d="M6 15 L12 6 L18 15" fill="none" stroke="white" stroke-width="2"/><circle cx="12" cy="6" r="1.5" fill="white"/>`
  if (n.includes('hockey'))
    return `<path d="M8 3 L8 15 Q8 19 12 19 L15 19" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/><circle cx="17" cy="17" r="3" fill="none" stroke="white" stroke-width="2"/>`
  if (n.includes('tennis') || n.includes('racquet'))
    return `<ellipse cx="12" cy="10" rx="7" ry="8" fill="none" stroke="white" stroke-width="2"/><line x1="5" y1="10" x2="19" y2="10" stroke="white" stroke-width="1.5"/><line x1="12" y1="2" x2="12" y2="18" stroke="white" stroke-width="1.5"/><path d="M12 18 L15 22" stroke="white" stroke-width="2" stroke-linecap="round"/>`
  if (n.includes('gymnastics') || n.includes('netball'))
    return `<circle cx="12" cy="4" r="2.5" fill="white"/><path d="M12 7 L8 13 L5 18" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M12 7 L16 13 L19 18" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="13" x2="16" y2="13" stroke="white" stroke-width="2"/>`
  if (n.includes('combative'))
    return `<path d="M5 5 L19 19" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M19 5 L5 19" stroke="white" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="5" fill="none" stroke="white" stroke-width="2"/>`
  if (n.includes('equestrian'))
    return `<path d="M5 18 Q8 10 12 8 Q16 6 19 8 L18 12 Q15 10 12 12 Q9 14 8 18 Z" fill="none" stroke="white" stroke-width="2"/><circle cx="18" cy="7" r="2" fill="white"/>`
  if (n.includes('fishing'))
    return `<path d="M4 4 Q12 8 20 4" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M12 8 L12 20" stroke="white" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="20" r="2" fill="white"/>`
  if (n.includes('golf'))
    return `<circle cx="12" cy="6" r="3" fill="none" stroke="white" stroke-width="2"/><path d="M12 9 L12 20" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M8 20 L16 20" stroke="white" stroke-width="2" stroke-linecap="round"/>`
  if (n.includes('running') || n.includes('athletics'))
    return `<circle cx="12" cy="4" r="2.5" fill="white"/><path d="M12 7 L10 14 L7 20" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M10 14 L15 18" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>`
  if (n.includes('walking'))
    return `<circle cx="12" cy="4" r="2.5" fill="white"/><path d="M12 7 L11 14 L8 20" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M11 14 L14 18" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>`
  return `<circle cx="12" cy="7" r="3" fill="none" stroke="white" stroke-width="2"/><path d="M5 20 Q5 14 12 14 Q19 14 19 20" fill="none" stroke="white" stroke-width="2"/>`
}

// Beat 1 - reads from sportsType
const sportIconBg  = computed(() => getSportIconBg(sportsType.value))
const sportIconSvg = computed(() => getSportIconSvgPath(sportsType.value))

// Beat 2 - reads from selectedComparisonSport
const comparisonSportIconBg  = computed(() => getSportIconBg(selectedComparisonSport.value?.name))
const comparisonSportIconSvg = computed(() => getSportIconSvgPath(selectedComparisonSport.value?.name))

// 
// AGE GROUP ICON ROW
// 

const heightMap = {
  '0-4':   20,
  '5-14':  38,
  '15-24': 100,
  '25-44': 58,
  '45-64': 28,
  '65+':   12,
}

const ageGroupBuckets = computed(() =>
  ageGroupDropdown.value
    .filter(a => a.age_group_label !== 'All ages')
    .map(a => ({
      label: a.age_group_label,
      relativeHeight: heightMap[a.age_group_label] ?? 30
    }))
)

async function selectAgeGroup(label) {
  ageGroup.value = label
  await fetchAgeData()
}

// 
// SPORT COMPARISON DATA
// 

const comparisonSports        = ref([])
const selectedComparisonSport = ref(null)

const maxComparisonRate = computed(() =>
  comparisonSports.value.length ? Math.max(...comparisonSports.value.map(s => s.rate)) : 1
)

function selectComparisonSport(sport) {
  selectedComparisonSport.value = sport
}

function getComparisonRank(sport) {
  const sorted = [...comparisonSports.value].sort((a, b) => b.rate - a.rate)
  return sorted.findIndex(s => s.name === sport.name) + 1
}

// Count-up for Beat 2 rate number
watch(selectedComparisonSport, (next, prev) => {
  const from = prev ? prev.rate : 0
  const to   = next ? next.rate : 0
  countUp(from, to, v => displayComparisonRate.value = v)
})

//
// TREND CHART DATA
// 

const trendLabels            = ref([])
const trendMaleData          = ref([])
const trendFemaleData        = ref([])
const percentageChangeMale   = ref(null)
const percentageChangeFemale = ref(null)

const trendChartData = computed(() => ({
  labels: trendLabels.value,
  datasets: [
    { label: 'Male',   data: trendMaleData.value,   borderColor: '#1A4FAB', tension: 0.4, pointRadius: 5, pointBackgroundColor: '#1A4FAB' },
    { label: 'Female', data: trendFemaleData.value, borderColor: '#E65100', tension: 0.4, pointRadius: 5, pointBackgroundColor: '#E65100' },
  ],
}))

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { color: '#1A1A1A', font: { size: 13 }, padding: 20 } },
    tooltip: { enabled: true },
  },
  scales: {
    x: { ticks: { color: '#1A1A1A', font: { size: 12 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
    y: { beginAtZero: false, ticks: { color: '#1A1A1A' }, grid: { color: 'rgba(0,0,0,0.05)' } },
  },
}

// 
// API CALLS
// 

const BASE = 'https://site--concovery-backend--gvxxw7q2vn57.code.run/postgres'

async function fetchDropdowns() {
  loadingDropdowns.value = true
  try {
    const res = await axios.get(`${BASE}/fetchdropdownsdata`)
    if (res.status === 200) {
      ageGroupDropdown.value = res.data.age_group_results.rows
      sportsDropdown.value   = res.data.sports_result.rows
    }
  } catch (e) { console.error('Dropdowns failed', e) }
  finally { loadingDropdowns.value = false }
}

async function fetchSportsData() {
  loadingSports.value = true
  try {
    const res = await axios.get(`${BASE}/sportsFilter?sportsType=${sportsType.value}`)
    if (res.status === 200) {
      sportMale.value   = parseFloat(res.data[0]?.measure_value || 0)
      sportFemale.value = parseFloat(res.data[1]?.measure_value || 0)
    }
  } catch (e) { console.error('Sports filter failed', e) }
  finally { loadingSports.value = false }
}

async function fetchAgeData() {
  loadingAge.value = true
  try {
    const res = await axios.get(`${BASE}/ageFilter?ageGroup=${ageGroup.value}`)
    if (res.status === 200) {
      ageMale.value   = parseFloat(res.data[0]?.measure_value || 0)
      ageFemale.value = parseFloat(res.data[1]?.measure_value || 0)
    }
  } catch (e) { console.error('Age filter failed', e) }
  finally { loadingAge.value = false }
}

async function fetchTrendData() {
  loadingTrend.value = true
  try {
    const res = await axios.get(`${BASE}/trendAnalysis`)
    if (res.status === 200) {
      const maleRows   = res.data.MaleTrendAnalysis.rows
      const femaleRows = res.data.FemaleTrendAnalysis.rows
      trendLabels.value     = maleRows.map(r => r.year_start)
      trendMaleData.value   = maleRows.map(r => r.hospitalisation_count)
      trendFemaleData.value = femaleRows.map(r => r.hospitalisation_count)
      const m = trendMaleData.value
      const f = trendFemaleData.value
      percentageChangeMale.value   = (((m[m.length-1] - m[0]) / m[0]) * 100).toFixed(1)
      percentageChangeFemale.value = (((f[f.length-1] - f[0]) / f[0]) * 100).toFixed(1)
    }
  } catch (e) { console.error('Trend failed', e) }
  finally { loadingTrend.value = false }
}

async function fetchComparisonData() {
  loadingComparison.value = true
  try {
    const res = await axios.get(`${BASE}/sportComparison`)
    if (res.status === 200) {
      comparisonSports.value = res.data.map(d => ({
        name: d.sport_name,
        rate: parseFloat(d.rate_per_100000),
      }))
      selectedComparisonSport.value = comparisonSports.value[0] || null
    }
  } catch (e) { console.error('Comparison failed', e) }
  finally { loadingComparison.value = false }
}

async function applyFilters() {
  await fetchSportsData()
  filtersApplied.value = true
}

onMounted(async () => {
  await fetchDropdowns()
  await fetchSportsData()
  await fetchAgeData()
  await fetchTrendData()
  await fetchComparisonData()
  filtersApplied.value = true
})
</script>

<template>
  <div class="bg-white min-h-screen">

    <!-- 
      HERO SECTION
    -->
    <section class="kyr-hero text-white">
      <div class="kyr-hero-lines"></div>
      <div class="kyr-hero-edge"></div>

      <div class="w-full py-24 relative z-10" style="padding-left:80px; padding-right:80px;">
        <BlurReveal :delay="0.1" :duration="0.75">
          <div class="inline-flex items-center border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span class="w-1.5 h-1.5 rounded-full bg-[#38bfff] mr-2 animate-pulse"></span>
            <span class="text-white/50 text-xs font-medium tracking-widest uppercase">Know Your Risk</span>
          </div>
          <h1 class="kyr-hero-title text-white mb-6">
            SMART ATHLETES<br>
            KNOW THEIR <span style="color:#38bfff;">RISKS.</span>
          </h1>
          <p class="text-white/55 text-lg font-light max-w-lg leading-relaxed">
            You tape your ankles. You warm up. You train hard. Concussion is the one risk you cannot see coming. Understanding it is what separates good athletes from great ones.
          </p>
        </BlurReveal>
      </div>

      <!-- EKG heartbeat line - full width, flush to hero bottom -->
      <div class="kyr-ekg">
        <svg class="kyr-ekg-svg" viewBox="0 0 1200 56" fill="none"
          xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <polyline
            points="0,28
                    60,28  80,28  95,4  110,52  125,8  140,28
                    340,28 360,28 375,4 390,52  405,8  420,28
                    620,28 640,28 655,4 670,52  685,8  700,28
                    900,28 920,28 935,4 950,52  965,8  980,28
                    1200,28"
            stroke="#38bfff" stroke-width="1.5" fill="none"/>
        </svg>
      </div>
    </section>

    <!-- STATS STRIP -->
    <section class="kyr-stats-section">
      <div class="max-w-[1200px] mx-auto px-10">
        <div class="kyr-stats-grid">
          <div class="kyr-stat-card">
            <span class="kyr-stat-big">1 in 3</span>
            <span class="kyr-stat-title">Young Australians</span>
            <span class="kyr-stat-desc">Hospitalisations involve someone aged 15 to 24 as the highest risk age group in Australian community sport.</span>
          </div>
          <div class="kyr-stat-card">
            <span class="kyr-stat-big" style="color:#38bfff;">10 yrs</span>
            <span class="kyr-stat-title">Of real data</span>
            <span class="kyr-stat-desc">Every chart on this page is built from a decade of Australian hospital records - not estimates, not surveys.</span>
          </div>
          <div class="kyr-stat-card">
            <span class="kyr-stat-big">21 days</span>
            <span class="kyr-stat-title">Mandatory protocol</span>
            <span class="kyr-stat-desc">The minimum recovery window adopted by AFL, NRL and Rugby Australia. The same standard professionals follow.</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 
      BEAT 1 - YOUR SPORT
    -->
    <section class="py-24" style="background:#EBF3FF;">
      <div class="max-w-[1200px] mx-auto px-10">

        <div class="mb-3">
          <span class="text-[#1A4FAB] text-xs font-semibold tracking-widest uppercase">Your sport</span>
        </div>
        <div class="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-4">
          <h2 class="text-4xl font-bold text-[#1A1A1A] tracking-tight">What sport do you play?</h2>
          <span class="text-[#5A7A9B] text-xs">AIHW Sports Injury in Australia 2023-24</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <!-- Left: selector + context -->
          <div class="flex flex-col justify-between">
            <div>
              <p class="text-[#5A7A9B] text-lg leading-relaxed mb-8">Select your sport and the body diagram on the right updates immediately to show the real hospitalisation split between male and female players in Australian community sport.</p>

              <div class="bg-white rounded-3xl p-8 shadow-sm border border-[#EBEBEB]">

                <!-- Custom sport dropdown -->
                <div class="relative mb-8" v-click-outside="() => sportDropdownOpen = false">
                  <button
                    type="button"
                    @click="sportDropdownOpen = !sportDropdownOpen"
                    class="w-full flex items-center justify-between bg-white border-2 rounded-2xl px-6 py-5 text-left transition-colors focus:outline-none"
                    :class="sportDropdownOpen ? 'border-[#1A4FAB]' : 'border-[#EBEBEB] hover:border-[#1A4FAB]'"
                  >
                    <span v-if="loadingDropdowns" class="text-[#5A7A9B] text-lg animate-pulse">Loading sports...</span>
                    <span v-else class="text-[#1A1A1A] text-lg font-semibold">{{ sportsType }}</span>
                    <svg class="flex-shrink-0 transition-transform duration-200" :class="sportDropdownOpen ? 'rotate-180' : ''" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </button>
                  <div v-show="sportDropdownOpen && sportsDropdown.length" class="absolute z-50 w-full mt-2 bg-white border border-[#EBEBEB] rounded-2xl shadow-xl overflow-hidden">
                    <ul class="max-h-64 overflow-y-auto py-2">
                      <li
                        v-for="s in sportsDropdown" :key="s.sport_name"
                        @click="sportsType = s.sport_name; sportDropdownOpen = false; applyFilters()"
                        class="flex items-center justify-between px-6 py-3 cursor-pointer transition-colors text-sm font-medium"
                        :class="sportsType === s.sport_name ? 'bg-[#EBF3FF] text-[#1A4FAB] font-semibold' : 'text-[#1A1A1A] hover:bg-[#F7F9FC]'"
                      >
                        <span>{{ s.sport_name }}</span>
                        <svg v-if="sportsType === s.sport_name" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Context callouts -->
                <div class="space-y-4">
                  <div class="flex items-start gap-4 bg-[#F7F9FC] rounded-2xl p-5 border border-[#EBEBEB]">
                    <div class="w-10 h-10 rounded-xl bg-[#1A4FAB]/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    </div>
                    <p class="text-sm text-[#1A1A1A] leading-relaxed">These numbers are raw hospitalisation counts. To understand relative risk per player, scroll down to the sport risk ladder below.</p>
                  </div>
                  <div class="flex items-start gap-4 bg-[#F7F9FC] rounded-2xl p-5 border border-[#EBEBEB]">
                    <div class="w-10 h-10 rounded-xl bg-[#E65100]/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E65100" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <p class="text-sm text-[#1A1A1A] leading-relaxed">Male players are hospitalised more often across almost every sport. But female rates have been rising every year for a decade.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- Right: interactive sport breakdown card -->
          <div class="bg-[#0A1628] rounded-3xl p-8 text-white relative overflow-hidden">
            <div class="absolute inset-0 opacity-[0.04] pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="white"/></pattern>
                <rect width="100%" height="100%" fill="url(#dots)"/>
              </svg>
            </div>
            <div class="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-10 transition-all duration-700 pointer-events-none" :style="{ background: sportMale >= sportFemale ? '#1A4FAB' : '#E65100', transform: 'translate(30%, -30%)' }"/>
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 shadow-lg" :style="{ background: sportIconBg }">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" v-html="sportIconSvg" />
                </div>
                <p class="text-white/40 text-xs font-semibold uppercase tracking-widest">Sport Breakdown</p>
              </div>
              <transition name="sport-name" mode="out-in">
                <h3 :key="sportsType" class="text-2xl font-bold text-white mb-1">{{ sportsType }}</h3>
              </transition>
              <p class="text-white/40 text-sm mb-6">Concussion hospitalisations · Most recent year</p>
              <div class="mb-8">
                <div class="flex justify-between text-xs mb-2 font-semibold">
                  <span class="text-[#4D9FFF]">Male {{ sportTotal ? Math.round((sportMale / sportTotal) * 100) : 0 }}%</span>
                  <span class="text-[#E65100]">{{ sportTotal ? Math.round((sportFemale / sportTotal) * 100) : 0 }}% Female</span>
                </div>
                <div class="h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-700 ease-out" :style="{ width: sportTotal ? `${(sportMale / sportTotal) * 100}%` : '50%', background: 'linear-gradient(90deg, #1A4FAB, #4D9FFF)' }"/>
                </div>
              </div>
              <div class="flex items-end justify-center gap-10">
                <!-- Male body -->
                <div class="flex flex-col items-center gap-2">
                  <div class="relative flex items-center justify-center mb-1">
                    <div v-if="sportMale >= sportFemale" class="absolute rounded-full animate-ping opacity-20" style="background:#1A4FAB; width:56px; height:56px;"/>
                    <span class="text-4xl font-black text-white relative z-10" style="letter-spacing:-0.03em;">{{ displaySportMale }}</span>
                  </div>
                  <div style="width:70px;height:150px;">
                    <svg viewBox="0 0 56 120" width="70" height="150" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <clipPath id="male-sport-clip"><rect x="0" :y="120 - (animSportMale / 100) * 120" width="56" :height="(animSportMale / 100) * 120" /></clipPath>
                        <filter id="male-glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                      </defs>
                      <g clip-path="url(#male-sport-clip)" :filter="sportMale >= sportFemale ? 'url(#male-glow)' : ''">
                        <circle cx="28" cy="12" r="10" fill="#1A4FAB"/><rect x="18" y="25" width="20" height="38" rx="4" fill="#1A4FAB"/><rect x="5" y="27" width="12" height="28" rx="4" fill="#1A4FAB"/><rect x="39" y="27" width="12" height="28" rx="4" fill="#1A4FAB"/><rect x="17" y="61" width="10" height="38" rx="4" fill="#1A4FAB"/><rect x="29" y="61" width="10" height="38" rx="4" fill="#1A4FAB"/>
                      </g>
                      <circle cx="28" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><rect x="18" y="25" width="20" height="38" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><rect x="5" y="27" width="12" height="28" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><rect x="39" y="27" width="12" height="28" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><rect x="17" y="61" width="10" height="38" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><rect x="29" y="61" width="10" height="38" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
                    </svg>
                  </div>
                  <span class="text-white/60 text-xs font-semibold uppercase tracking-wider">Male</span>
                  <span v-if="sportMale >= sportFemale" class="text-xs px-2 py-0.5 rounded-full font-semibold" style="background: rgba(26,79,171,0.3); color: #4D9FFF; border: 1px solid rgba(77,159,255,0.3);">Majority</span>
                </div>
                <div class="text-white/20 text-xl font-black pb-14">vs</div>
                <!-- Female body -->
                <div class="flex flex-col items-center gap-2">
                  <div class="relative flex items-center justify-center mb-1">
                    <div v-if="sportFemale > sportMale" class="absolute rounded-full animate-ping opacity-20" style="background:#E65100; width:56px; height:56px;"/>
                    <span class="text-4xl font-black text-[#E65100] relative z-10" style="letter-spacing:-0.03em;">{{ displaySportFemale }}</span>
                  </div>
                  <div style="width:70px;height:150px;">
                    <svg viewBox="0 0 56 120" width="70" height="150" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <clipPath id="female-sport-clip"><rect x="0" :y="120 - (animSportFemale / 100) * 120" width="56" :height="(animSportFemale / 100) * 120" /></clipPath>
                        <filter id="female-glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                      </defs>
                      <g clip-path="url(#female-sport-clip)" :filter="sportFemale > sportMale ? 'url(#female-glow)' : ''">
                        <circle cx="28" cy="12" r="10" fill="#E65100"/><path d="M14 25 Q14 35 10 63 L22 63 L22 99 L34 99 L34 63 L46 63 Q42 35 42 25 Z" fill="#E65100"/><rect x="5" y="27" width="10" height="26" rx="4" fill="#E65100"/><rect x="41" y="27" width="10" height="26" rx="4" fill="#E65100"/>
                      </g>
                      <circle cx="28" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><path d="M14 25 Q14 35 10 63 L22 63 L22 99 L34 99 L34 63 L46 63 Q42 35 42 25 Z" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><rect x="5" y="27" width="10" height="26" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><rect x="41" y="27" width="10" height="26" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
                    </svg>
                  </div>
                  <span class="text-[#E65100] text-xs font-semibold uppercase tracking-wider">Female</span>
                  <span v-if="sportFemale > sportMale" class="text-xs px-2 py-0.5 rounded-full font-semibold" style="background: rgba(230,81,0,0.3); color: #FF9500; border: 1px solid rgba(255,149,0,0.3);">Majority</span>
                </div>
              </div>
              <transition name="sport-name" mode="out-in">
                <div :key="sportsType" class="mt-6 bg-white/5 rounded-2xl p-5 border border-white/10">
                  <p class="text-white/80 text-sm leading-relaxed">
                    <span class="font-bold text-white">{{ sportTotal }} total hospitalisations</span> for {{ sportsType }}.
                    {{ sportMale > sportFemale ? 'Male players made up the majority.' : 'Female players made up the majority.' }}
                  </p>
                </div>
              </transition>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- 
      BEAT 2 - SPORT RISK LADDER
   -->
    <section class="py-24" style="background: linear-gradient(160deg, #EBF3FF 0%, #DEF0FF 50%, #EBF3FF 100%);">
      <div class="max-w-[1200px] mx-auto px-10">

        <div class="mb-3">
          <span class="text-[#1A4FAB] text-xs font-semibold tracking-widest uppercase">Sport risk ladder</span>
        </div>
        <div class="flex flex-col lg:flex-row lg:items-end justify-between mb-6 gap-4">
          <h2 class="text-4xl font-bold text-[#1A1A1A] tracking-tight">Where does your sport sit?</h2>
          <span class="text-[#5A7A9B] text-xs">AIHW Sports Injury in Australia 2023-24 and AusPlay 2024-25</span>
        </div>
        <p class="text-[#5A7A9B] text-lg max-w-2xl mb-10">AFL has more total concussions than Rugby, but millions more people play AFL. When you adjust for participation, Rugby is twice as dangerous per player. Rate per participant is the honest number.</p>

        <div v-if="loadingComparison" class="text-center py-20 text-[#5A7A9B] animate-pulse">Loading sport data...</div>

        <div v-else-if="comparisonSports.length" class="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <!-- Dark bar list -->
          <div class="bg-[#0A1628] rounded-2xl p-6 shadow-2xl">
            <div class="flex justify-between items-center mb-6">
              <span class="text-white/40 text-xs font-medium uppercase tracking-wider">Rate per 100,000 participants</span>
              <span class="text-white/40 text-xs">AIHW 2023-24</span>
            </div>
            <div class="space-y-3">
              <div
                v-for="sport in comparisonSports" :key="sport.name"
                class="flex items-center gap-3 cursor-pointer group"
                @click="selectComparisonSport(sport)"
              >
                <div class="text-xs w-36 truncate transition-colors flex-shrink-0" :class="selectedComparisonSport && selectedComparisonSport.name === sport.name ? 'text-white font-semibold' : 'text-white/50 group-hover:text-white'">{{ sport.name }}</div>
                <div class="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500" :style="{ width: `${(sport.rate / maxComparisonRate) * 100}%`, background: selectedComparisonSport && selectedComparisonSport.name === sport.name ? '#1A4FAB' : 'rgba(255,255,255,0.2)' }"/>
                </div>
                <div class="text-xs w-10 text-right transition-colors flex-shrink-0" :class="selectedComparisonSport && selectedComparisonSport.name === sport.name ? 'text-white font-semibold' : 'text-white/60'">{{ Math.round(sport.rate) }}</div>
              </div>
            </div>
          </div>

          <!-- Detail card - interactive with icon, count-up and risk bar -->
          <transition name="sport-name" mode="out-in">
            <div v-if="selectedComparisonSport" :key="selectedComparisonSport.name" class="bg-white rounded-2xl p-8 border border-[#EBEBEB] shadow-xl relative overflow-hidden">
              <div class="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-5 pointer-events-none transition-all duration-700" :style="{ background: comparisonSportIconBg, transform: 'translate(30%, -30%)' }"/>
              <div class="relative z-10">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md transition-all duration-500" :style="{ background: comparisonSportIconBg }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" v-html="comparisonSportIconSvg" />
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-[#F5F8FF] flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                    </div>
                    <span class="text-[#5A7A9B] text-xs font-medium">#{{ getComparisonRank(selectedComparisonSport) }} of {{ comparisonSports.length }} sports ranked by rate</span>
                  </div>
                </div>
                <h3 class="text-xl font-bold text-[#1A1A1A] mb-4">{{ selectedComparisonSport.name }}</h3>
                <div class="text-6xl font-black mb-1 transition-colors duration-500" :style="{ color: comparisonSportIconBg, letterSpacing: '-0.03em' }">{{ Math.round(displayComparisonRate) }}</div>
                <p class="text-[#5A7A9B] text-sm mb-6">hospitalisations per 100,000 participants</p>
                <!-- Relative risk bar -->
                <div class="mb-6">
                  <div class="flex justify-between text-xs mb-1.5 text-[#5A7A9B]">
                    <span>Risk relative to highest rated sport</span>
                    <span class="font-semibold" :style="{ color: comparisonSportIconBg }">{{ Math.round((selectedComparisonSport.rate / maxComparisonRate) * 100) }}%</span>
                  </div>
                  <div class="h-2 bg-[#F0F4FF] rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-700 ease-out" :style="{ width: `${(selectedComparisonSport.rate / maxComparisonRate) * 100}%`, background: `linear-gradient(90deg, ${comparisonSportIconBg}, ${comparisonSportIconBg}99)` }"/>
                  </div>
                </div>
                <div class="bg-[#F5F8FF] rounded-xl p-5 mb-6 border border-[#1A4FAB]/20">
                  <p class="text-sm text-[#1A1A1A] leading-relaxed"><span class="font-bold text-[#1A4FAB]">Why rate and not raw count?</span> Raw numbers favour big sports. Rate levels the field. It tells you your actual personal risk based on how many people play your sport.</p>
                </div>
                <div class="border-t border-[#EBEBEB] pt-6">
                  <div class="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-3">What smart players do</div>
                  <div class="space-y-2">
                    <div v-for="tip in ['Come off immediately after any head knock', 'See a GP or sports doctor within 24 hours', 'Follow the full 21-day graduated return to play protocol', 'Get medical clearance, no exceptions']" :key="tip" class="flex items-start gap-3">
                      <div class="w-4 h-4 rounded-full bg-[#1B7C3D] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                      </div>
                      <span class="text-[#5A7A9B] text-xs leading-relaxed">{{ tip }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>

        </div>
      </div>
    </section>

    <!-- 
      BEAT 3 - WHO GETS HURT MOST
    -->
    <section class="py-24" style="background: linear-gradient(135deg, #F0F7FF 0%, #DEF0FF 40%, #EBF3FF 70%, #F5F9FF 100%);">
      <div class="max-w-[1200px] mx-auto px-10">

        <div class="text-center mb-14">
          <span class="inline-block bg-[#1A4FAB]/10 text-[#1A4FAB] text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">Who gets hurt most</span>
          <h2 class="text-4xl font-bold text-[#1A1A1A] mb-4">Your age is the biggest risk factor.</h2>
          <p class="text-[#5A7A9B] text-lg max-w-2xl mx-auto">Not because you are weaker. Because you play harder, more often, with more to prove. The 15 to 24 age group accounts for 39% of all concussion hospitalisations in Victoria.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <!-- Left: icon row as selector + context -->
          <div class="flex flex-col justify-between">
            <div>
              <p class="text-[#5A7A9B] text-lg leading-relaxed mb-8">Tap any age group below to see the exact hospitalisation numbers for that bracket across all Australian community sport.</p>

              <div class="bg-[#F7F9FC] rounded-3xl p-8 border border-[#EBEBEB] mb-6">
                <div class="flex items-end justify-center gap-4 flex-wrap">
                  <button
                    v-for="bucket in ageGroupBuckets" :key="bucket.label"
                    @click="selectAgeGroup(bucket.label)"
                    class="flex flex-col items-center gap-2 group focus:outline-none"
                  >
                    <div class="flex flex-col items-center justify-end" :style="{ height: `${bucket.relativeHeight * 1.2}px` }">
                      <svg viewBox="0 0 40 80" xmlns="http://www.w3.org/2000/svg" class="transition-all duration-300" :style="{ width: bucket.label === ageGroup ? '40px' : '26px', height: 'auto', filter: bucket.label === ageGroup ? 'drop-shadow(0 4px 12px rgba(26,79,171,0.4))' : 'none' }">
                        <circle cx="20" cy="10" r="8"  :fill="bucket.label === ageGroup ? '#1A4FAB' : '#D6E0F5'"/>
                        <rect x="12" y="20" width="16" height="26" rx="4" :fill="bucket.label === ageGroup ? '#1A4FAB' : '#D6E0F5'"/>
                        <rect x="4"  y="22" width="8"  height="18" rx="3" :fill="bucket.label === ageGroup ? '#1A4FAB' : '#D6E0F5'"/>
                        <rect x="28" y="22" width="8"  height="18" rx="3" :fill="bucket.label === ageGroup ? '#1A4FAB' : '#D6E0F5'"/>
                        <rect x="12" y="44" width="7"  height="28" rx="3" :fill="bucket.label === ageGroup ? '#1A4FAB' : '#D6E0F5'"/>
                        <rect x="21" y="44" width="7"  height="28" rx="3" :fill="bucket.label === ageGroup ? '#1A4FAB' : '#D6E0F5'"/>
                      </svg>
                    </div>
                    <div class="text-center">
                      <div class="text-xs font-bold transition-colors" :class="bucket.label === ageGroup ? 'text-[#1A4FAB]' : 'text-[#5A7A9B] group-hover:text-[#1A1A1A]'">{{ bucket.label }}</div>
                      <div v-if="bucket.label === ageGroup" class="text-xs text-[#1A4FAB] font-semibold mt-0.5">Selected</div>
                      <div v-else-if="bucket.label === '15-24'" class="text-xs text-[#C62828] font-bold mt-0.5">Highest</div>
                    </div>
                  </button>
                </div>
                <p class="text-xs text-[#5A7A9B] text-center mt-6">Approximate proportions based on AIHW Australian data 2023-24</p>
              </div>

              <div class="bg-[#F7F9FC] rounded-2xl p-6 border border-[#EBEBEB]">
                <div class="text-4xl font-black text-[#1A4FAB] mb-1" style="letter-spacing:-0.03em;">{{ ageTotal }}</div>
                <p class="text-[#5A7A9B] text-sm">total hospitalisations across all Australian community sport for the {{ ageGroup }} age bracket</p>
              </div>
            </div>
          </div>

          <!-- Right: interactive age breakdown card -->
          <div class="bg-[#0A1628] rounded-3xl p-8 text-white relative overflow-hidden">
            <!-- Dot grid -->
            <div class="absolute inset-0 opacity-[0.04] pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="dots-age" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="white"/></pattern>
                <rect width="100%" height="100%" fill="url(#dots-age)"/>
              </svg>
            </div>
            <!-- Glow blob -->
            <div class="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-10 transition-all duration-700 pointer-events-none" :style="{ background: ageMale >= ageFemale ? '#4D9FFF' : '#FF9500', transform: 'translate(30%, -30%)' }"/>

            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-11 h-11 rounded-2xl bg-[#1B7C3D] flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <p class="text-white/40 text-xs font-semibold uppercase tracking-widest">Age Group Breakdown</p>
              </div>

              <!-- Age group label transition -->
              <transition name="sport-name" mode="out-in">
                <h3 :key="ageGroup" class="text-2xl font-bold text-white mb-1">Age group {{ ageGroup }}</h3>
              </transition>
              <p class="text-white/40 text-sm mb-6">Hospitalisations across all sports in this bracket</p>

              <!-- Split bar -->
              <div class="mb-8">
                <div class="flex justify-between text-xs mb-2 font-semibold">
                  <span class="text-[#4D9FFF]">Male {{ ageTotal ? Math.round((ageMale / ageTotal) * 100) : 0 }}%</span>
                  <span class="text-[#FF9500]">{{ ageTotal ? Math.round((ageFemale / ageTotal) * 100) : 0 }}% Female</span>
                </div>
                <div class="h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-700 ease-out" :style="{ width: ageTotal ? `${(ageMale / ageTotal) * 100}%` : '50%', background: 'linear-gradient(90deg, #1A4FAB, #4D9FFF)' }"/>
                </div>
              </div>

              <!-- Bodies -->
              <div class="flex items-end justify-center gap-10">
                <!-- Male -->
                <div class="flex flex-col items-center gap-2">
                  <div class="relative flex items-center justify-center mb-1">
                    <div v-if="ageMale >= ageFemale" class="absolute rounded-full animate-ping opacity-20" style="background:#4D9FFF; width:56px; height:56px;"/>
                    <span class="text-4xl font-black text-[#4D9FFF] relative z-10" style="letter-spacing:-0.03em;">{{ displayAgeMale }}</span>
                  </div>
                  <div style="width:70px;height:150px;">
                    <svg viewBox="0 0 56 120" width="70" height="150" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <clipPath id="male-age-clip"><rect x="0" :y="120 - (animAgeMale / 100) * 120" width="56" :height="(animAgeMale / 100) * 120" /></clipPath>
                        <filter id="male-age-glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                      </defs>
                      <g clip-path="url(#male-age-clip)" :filter="ageMale >= ageFemale ? 'url(#male-age-glow)' : ''">
                        <circle cx="28" cy="12" r="10" fill="#4D9FFF"/><rect x="18" y="25" width="20" height="38" rx="4" fill="#4D9FFF"/><rect x="5" y="27" width="12" height="28" rx="4" fill="#4D9FFF"/><rect x="39" y="27" width="12" height="28" rx="4" fill="#4D9FFF"/><rect x="17" y="61" width="10" height="38" rx="4" fill="#4D9FFF"/><rect x="29" y="61" width="10" height="38" rx="4" fill="#4D9FFF"/>
                      </g>
                      <circle cx="28" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><rect x="18" y="25" width="20" height="38" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><rect x="5" y="27" width="12" height="28" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><rect x="39" y="27" width="12" height="28" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><rect x="17" y="61" width="10" height="38" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><rect x="29" y="61" width="10" height="38" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
                    </svg>
                  </div>
                  <span class="text-[#4D9FFF] text-xs font-semibold uppercase tracking-wider">Male</span>
                  <span v-if="ageMale >= ageFemale" class="text-xs px-2 py-0.5 rounded-full font-semibold" style="background: rgba(77,159,255,0.2); color: #4D9FFF; border: 1px solid rgba(77,159,255,0.3);">Majority</span>
                </div>

                <div class="text-white/20 text-xl font-black pb-14">vs</div>

                <!-- Female -->
                <div class="flex flex-col items-center gap-2">
                  <div class="relative flex items-center justify-center mb-1">
                    <div v-if="ageFemale > ageMale" class="absolute rounded-full animate-ping opacity-20" style="background:#FF9500; width:56px; height:56px;"/>
                    <span class="text-4xl font-black text-[#FF9500] relative z-10" style="letter-spacing:-0.03em;">{{ displayAgeFemale }}</span>
                  </div>
                  <div style="width:70px;height:150px;">
                    <svg viewBox="0 0 56 120" width="70" height="150" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <clipPath id="female-age-clip"><rect x="0" :y="120 - (animAgeFemale / 100) * 120" width="56" :height="(animAgeFemale / 100) * 120" /></clipPath>
                        <filter id="female-age-glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                      </defs>
                      <g clip-path="url(#female-age-clip)" :filter="ageFemale > ageMale ? 'url(#female-age-glow)' : ''">
                        <circle cx="28" cy="12" r="10" fill="#FF9500"/><path d="M14 25 Q14 35 10 63 L22 63 L22 99 L34 99 L34 63 L46 63 Q42 35 42 25 Z" fill="#FF9500"/><rect x="5" y="27" width="10" height="26" rx="4" fill="#FF9500"/><rect x="41" y="27" width="10" height="26" rx="4" fill="#FF9500"/>
                      </g>
                      <circle cx="28" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><path d="M14 25 Q14 35 10 63 L22 63 L22 99 L34 99 L34 63 L46 63 Q42 35 42 25 Z" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><rect x="5" y="27" width="10" height="26" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><rect x="41" y="27" width="10" height="26" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
                    </svg>
                  </div>
                  <span class="text-[#FF9500] text-xs font-semibold uppercase tracking-wider">Female</span>
                  <span v-if="ageFemale > ageMale" class="text-xs px-2 py-0.5 rounded-full font-semibold" style="background: rgba(255,149,0,0.2); color: #FF9500; border: 1px solid rgba(255,149,0,0.3);">Majority</span>
                </div>
              </div>

              <!-- Summary footer with transition -->
              <transition name="sport-name" mode="out-in">
                <div :key="ageGroup" class="mt-6 bg-white/5 rounded-2xl p-5 border border-white/10">
                  <p class="text-white/80 text-sm leading-relaxed">
                    {{ ageMale > ageFemale ? 'Males were more commonly affected in this bracket.' : 'Females were more commonly affected in this bracket.' }}
                    <span v-if="ageGroup === '0-4'"> Very young children are still concussed during sport and play. Even at this age, the protocol applies.</span>
                    <span v-else-if="ageGroup === '5-14'"> School age players are developing fast and their brains are particularly vulnerable to repeated impacts.</span>
                    <span v-else-if="ageGroup === '15-24'"> This is the highest risk age group in Australian community sport, accounting for 39% of all hospitalisations.</span>
                    <span v-else-if="ageGroup === '25-44'"> Peak competition years. Players in this bracket often push through symptoms due to work and family pressure.</span>
                    <span v-else-if="ageGroup === '45-64'"> Recreational players. Less frequent but the recovery window is just as important at this age.</span>
                    <span v-else-if="ageGroup === '65+'"> Older players have longer recovery times. The 21-day protocol is especially important in this bracket.</span>
                  </p>
                </div>
              </transition>

            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- 
      BEAT 4 - THIS IS WHY THE RULES EXIST
     -->
    <section class="py-24" style="background: linear-gradient(180deg, #EBF3FF 0%, #D6EAFF 35%, #E8F2FF 65%, #F0F6FF 100%);">
      <div class="max-w-[1200px] mx-auto px-10">

        <div class="text-center mb-12">
          <span class="inline-block bg-[#1A4FAB]/10 text-[#1A4FAB] text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">10-year trend</span>
          <h2 class="text-4xl font-bold text-[#1A1A1A] mb-4">This is why the 2024 rules exist.</h2>
          <p class="text-[#5A7A9B] text-lg max-w-2xl mx-auto">A decade of rising hospitalisations led to a national protocol. Here is what the data looked like on the way there.</p>
        </div>

        <div class="bg-white rounded-3xl p-10 border border-[#EBEBEB] shadow-sm">
          <div class="h-80 mb-8">
            <div v-if="loadingTrend" class="h-full flex items-center justify-center text-[#5A7A9B] animate-pulse">Loading trend data...</div>
            <Line v-else :data="trendChartData" :options="lineOptions" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div class="bg-[#F5F8FF] border border-[#1A4FAB]/30 rounded-2xl p-6">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-8 h-8 rounded-lg bg-[#1A4FAB] flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                </div>
                <span class="text-sm font-bold text-[#1A4FAB]">2014 to 2019: rising</span>
              </div>
              <p class="text-sm text-[#1A1A1A]">Participation in contact sport was growing and the hospitalisation numbers followed. The problem was visible in the data well before any rules existed.</p>
            </div>
            <div class="bg-[#FFF8E7] border border-[#E65100]/30 rounded-2xl p-6">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-8 h-8 rounded-lg bg-[#E65100] flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <span class="text-sm font-bold text-[#E65100]">2020 to 2021: COVID dip</span>
              </div>
              <p class="text-sm text-[#1A1A1A]">Sport stopped during lockdowns so numbers dropped sharply. Then play resumed and they bounced straight back. The underlying risk never went away.</p>
            </div>
            <div class="bg-[#F5FFF7] border border-[#1B7C3D]/30 rounded-2xl p-6">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-8 h-8 rounded-lg bg-[#1B7C3D] flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <span class="text-sm font-bold text-[#1B7C3D]">2024: AIS protocol</span>
              </div>
              <p class="text-sm text-[#1A1A1A]">National concussion protocols introduced. AFL, NRL and Rugby Australia all adopted the mandatory 21-day minimum. You follow the same standard as the professionals.</p>
            </div>
          </div>

          <div v-if="percentageChangeFemale" class="bg-[#0A1628] rounded-2xl p-6 flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-[#E65100] flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            </div>
            <div>
              <p class="text-white font-bold mb-1">Female rates rose by {{ percentageChangeFemale }}% over 10 years.</p>
              <p class="text-white/60 text-sm">Concussion is not a male-only issue. Female participation in contact sport has grown significantly and the data reflects that. Every player deserves the same protection.</p>
            </div>
          </div>

          <p class="text-sm text-[#5A7A9B] mt-6">Source: Australian Institute of Health and Welfare (AIHW), Sports Injury in Australia 2014 to 2024</p>
        </div>
      </div>
    </section>

    <!-- 
      BEAT 5 - BRAIN SCIENCE
 -->
    <section class="py-24" style="background: linear-gradient(145deg, #F5F9FF 0%, #E8F2FF 30%, #D8ECFF 55%, #EBF3FF 100%);">
      <div class="max-w-[1200px] mx-auto px-10">

        <div class="text-center mb-14">
          <span class="inline-block bg-[#1A4FAB]/10 text-[#1A4FAB] text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">Brain science</span>
          <h2 class="text-4xl font-bold text-[#1A1A1A] mb-4">What actually happens when you get hit</h2>
          <p class="text-[#5A7A9B] text-lg max-w-2xl mx-auto">The data tells you the scale. The biology tells you the why. Once you understand what a hit does to your brain at the cellular level, the 21-day protocol makes complete sense.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          <!-- Brain SVG -->
          <div class="flex flex-col items-center bg-[#F7F9FC] rounded-3xl p-8 border border-[#EBEBEB]">
            <svg viewBox="0 0 400 560" class="w-full max-w-[420px]">
              <path d="M 200 40 Q 290 40 340 120 Q 360 180 350 240 L 350 280 Q 355 320 340 360 Q 320 400 280 420 L 260 460 Q 240 510 200 530 Q 160 510 140 460 L 120 420 Q 80 400 60 360 Q 45 320 50 280 L 50 240 Q 40 180 60 120 Q 110 40 200 40 Z" fill="white" stroke="#EBEBEB" stroke-width="2"/>
              <g @click="selectRegion('frontal')" @mouseenter="hoveredRegion = 'frontal'" @mouseleave="hoveredRegion = null" class="cursor-pointer">
                <path d="M 200 60 Q 280 60 320 140 L 280 180 L 220 200 L 180 200 L 120 180 L 80 140 Q 120 60 200 60" :fill="getRegionFill('frontal')" :stroke="selectedRegion === 'frontal' || hoveredRegion === 'frontal' ? '#1A4FAB' : '#EBEBEB'" stroke-width="2" :opacity="getRegionOpacity('frontal')" style="transition:all 0.25s ease"/>
                <text x="200" y="138" text-anchor="middle" :fill="getRegionTextFill('frontal')" font-size="14" font-weight="600" class="pointer-events-none" font-family="sans-serif" style="transition: fill 0.25s ease;">Frontal Lobe</text>
              </g>
              <g @click="selectRegion('parietal')" @mouseenter="hoveredRegion = 'parietal'" @mouseleave="hoveredRegion = null" class="cursor-pointer">
                <path d="M 180 200 L 220 200 L 280 180 L 320 220 L 300 280 L 220 300 L 180 300 L 100 280 L 80 220 L 120 180 Z" :fill="getRegionFill('parietal')" :stroke="selectedRegion === 'parietal' || hoveredRegion === 'parietal' ? '#1A4FAB' : '#EBEBEB'" stroke-width="2" :opacity="getRegionOpacity('parietal')" style="transition:all 0.25s ease"/>
                <text x="200" y="250" text-anchor="middle" :fill="getRegionTextFill('parietal')" font-size="14" font-weight="600" class="pointer-events-none" font-family="sans-serif" style="transition: fill 0.25s ease;">Parietal Lobe</text>
              </g>
              <g @click="selectRegion('temporal')" @mouseenter="hoveredRegion = 'temporal'" @mouseleave="hoveredRegion = null" class="cursor-pointer">
                <ellipse cx="90" cy="260" rx="50" ry="65" :fill="getRegionFill('temporal')" :stroke="selectedRegion === 'temporal' || hoveredRegion === 'temporal' ? '#1A4FAB' : '#EBEBEB'" stroke-width="2" :opacity="getRegionOpacity('temporal')" style="transition:all 0.25s ease"/>
                <text x="90" y="253" text-anchor="middle" :fill="getRegionTextFill('temporal')" font-size="13" font-weight="600" class="pointer-events-none" font-family="sans-serif" style="transition: fill 0.25s ease;">Temporal</text>
                <text x="90" y="270" text-anchor="middle" :fill="getRegionTextFill('temporal')" font-size="13" font-weight="600" class="pointer-events-none" font-family="sans-serif" style="transition: fill 0.25s ease;">Lobe</text>
              </g>
              <g @click="selectRegion('temporal')" @mouseenter="hoveredRegion = 'temporal'" @mouseleave="hoveredRegion = null" class="cursor-pointer">
                <ellipse cx="310" cy="260" rx="50" ry="65" :fill="getRegionFill('temporal')" :stroke="selectedRegion === 'temporal' || hoveredRegion === 'temporal' ? '#1A4FAB' : '#EBEBEB'" stroke-width="2" :opacity="getRegionOpacity('temporal')" style="transition:all 0.25s ease"/>
                <text x="310" y="253" text-anchor="middle" :fill="getRegionTextFill('temporal')" font-size="13" font-weight="600" class="pointer-events-none" font-family="sans-serif" style="transition: fill 0.25s ease;">Temporal</text>
                <text x="310" y="270" text-anchor="middle" :fill="getRegionTextFill('temporal')" font-size="13" font-weight="600" class="pointer-events-none" font-family="sans-serif" style="transition: fill 0.25s ease;">Lobe</text>
              </g>
              <g @click="selectRegion('occipital')" @mouseenter="hoveredRegion = 'occipital'" @mouseleave="hoveredRegion = null" class="cursor-pointer">
                <path d="M 180 300 L 220 300 L 260 340 L 240 380 L 200 395 L 160 380 L 140 340 Z" :fill="getRegionFill('occipital')" :stroke="selectedRegion === 'occipital' || hoveredRegion === 'occipital' ? '#1A4FAB' : '#EBEBEB'" stroke-width="2" :opacity="getRegionOpacity('occipital')" style="transition:all 0.25s ease"/>
                <text x="200" y="353" text-anchor="middle" :fill="getRegionTextFill('occipital')" font-size="13" font-weight="600" class="pointer-events-none" font-family="sans-serif" style="transition: fill 0.25s ease;">Occipital Lobe</text>
              </g>
              <g @click="selectRegion('brainstem')" @mouseenter="hoveredRegion = 'brainstem'" @mouseleave="hoveredRegion = null" class="cursor-pointer">
                <rect x="170" y="405" width="60" height="40" rx="8" :fill="getRegionFill('brainstem')" :stroke="selectedRegion === 'brainstem' || hoveredRegion === 'brainstem' ? '#1A4FAB' : '#EBEBEB'" stroke-width="2" :opacity="getRegionOpacity('brainstem')" style="transition:all 0.25s ease"/>
                <text x="200" y="430" text-anchor="middle" :fill="getRegionTextFill('brainstem')" font-size="12" font-weight="600" class="pointer-events-none" font-family="sans-serif" style="transition: fill 0.25s ease;">Brainstem</text>
              </g>
              <g @click="selectRegion('cerebellum')" @mouseenter="hoveredRegion = 'cerebellum'" @mouseleave="hoveredRegion = null" class="cursor-pointer">
                <ellipse cx="200" cy="490" rx="80" ry="40" :fill="getRegionFill('cerebellum')" :stroke="selectedRegion === 'cerebellum' || hoveredRegion === 'cerebellum' ? '#1A4FAB' : '#EBEBEB'" stroke-width="2" :opacity="getRegionOpacity('cerebellum')" style="transition:all 0.25s ease"/>
                <text x="200" y="496" text-anchor="middle" :fill="getRegionTextFill('cerebellum')" font-size="14" font-weight="600" class="pointer-events-none" font-family="sans-serif" style="transition: fill 0.25s ease;">Cerebellum</text>
              </g>
            </svg>
            <p class="text-[#5A7A9B] text-sm text-center mt-4">Click any region to see what symptoms it causes</p>
            <div class="flex flex-wrap gap-2 justify-center mt-4">
              <button
                v-for="(region, key) in brainRegions" :key="key"
                @click="selectRegion(key)"
                class="px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-colors"
                :class="selectedRegion === key ? 'bg-[#1A4FAB] border-[#1A4FAB] text-white' : 'border-[#1A4FAB]/20 text-[#1A4FAB] hover:bg-[#1A4FAB] hover:text-white'"
              >{{ region.name }}</button>
            </div>
          </div>

          <!-- Symptom panel -->
          <div class="lg:sticky lg:top-24">
            <transition name="fade-up" mode="out-in">
              <div v-if="!selectedRegion" key="placeholder" class="bg-[#F7F9FC] rounded-3xl p-10 text-center border border-[#EBEBEB]">
                <div class="w-20 h-20 rounded-full bg-[#1A4FAB]/10 flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
                </div>
                <h3 class="text-2xl font-bold text-[#1A1A1A] mb-3">Select a brain region</h3>
                <p class="text-[#5A7A9B] text-base leading-relaxed">Click any part of the brain to learn what that area controls and what symptoms appear when it is injured in a concussion.</p>
              </div>
              <div v-else :key="selectedRegion" class="bg-white rounded-3xl p-10 border-2 border-[#1A4FAB] shadow-sm">
                <div class="flex items-start justify-between mb-6">
                  <div>
                    <h3 class="text-3xl font-bold text-[#1A1A1A] mb-3">{{ brainRegions[selectedRegion].name }}</h3>
                    <span class="inline-block bg-[#1A4FAB]/10 text-[#1A4FAB] text-sm font-semibold px-4 py-2 rounded-full">Controls: {{ brainRegions[selectedRegion].controls }}</span>
                  </div>
                  <button @click="selectedRegion = null" class="w-9 h-9 rounded-full bg-[#F7F9FC] flex items-center justify-center hover:bg-[#EBEBEB] transition-colors flex-shrink-0 ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A7A9B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
                <p class="text-xs font-bold text-[#5A7A9B] uppercase tracking-widest mb-5">Symptoms when this area is concussed</p>
                <ul class="space-y-4">
                  <li v-for="(symptom, i) in brainRegions[selectedRegion].symptoms" :key="i" class="flex items-start gap-4 symptom-item" :style="{ animationDelay: `${i * 70}ms` }">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#1A4FAB] flex-shrink-0 mt-1.5"/>
                    <span class="text-[#1A1A1A] text-base leading-relaxed">{{ symptom }}</span>
                  </li>
                </ul>
              </div>
            </transition>
          </div>

        </div>
      </div>
    </section>

    <!--
      BEAT 6 - END WITH CONTROL
   -->
    <section style="background:#0A1628;" class="py-24">
      <div class="max-w-[1200px] mx-auto px-10">
        <div class="text-center mb-14">
          <h2 class="text-4xl font-bold text-white mb-4">You are already ahead of most players.</h2>
          <p class="text-white/60 text-lg max-w-xl mx-auto">Most players do not think about concussion until it happens. You now understand your sport's risk, your age group's risk, and what a hit actually does to your brain. That knowledge matters.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <router-link to="/iteration3/stagedrecovery" class="block">
            <div class="bg-[#1A4FAB] rounded-3xl p-10 h-full hover:bg-[#1440A0] transition-colors group">
              <div class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-3">If it happens, here is exactly what to do</h3>
              <p class="text-white/70 text-base leading-relaxed mb-6">The same 21-day protocol used by AFL, NRL and Rugby Australia professionals. Day by day guidance built from the AIS 2024 standard.</p>
              <div class="flex items-center gap-2 text-white font-semibold">
                <span>Start your recovery plan</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </div>
          </router-link>
          <router-link to="/locatesupport" class="block">
            <div class="bg-white/5 border border-white/10 rounded-3xl p-10 h-full hover:bg-white/10 transition-colors group">
              <div class="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-3">Bookmark your nearest clinic now</h3>
              <p class="text-white/60 text-base leading-relaxed mb-6">Find it before you need it. Looking for a GP or sports medicine clinic in a panic after a knock is the worst possible time to search.</p>
              <div class="flex items-center gap-2 text-white font-semibold">
                <span>Find a clinic near me</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </div>
          </router-link>
        </div>
        <p class="text-center text-white/30 text-sm">Data source: Australian Institute of Health and Welfare (AIHW), Sports Injury in Australia 2014 to 2024</p>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* TRANSITIONS */
.fade-up-enter-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.fade-up-leave-active { transition: opacity 0.2s ease; }
.fade-up-enter-from   { opacity: 0; transform: translateY(14px); }
.fade-up-leave-to     { opacity: 0; }

.sport-name-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.sport-name-leave-active { transition: opacity 0.15s ease; }
.sport-name-enter-from   { opacity: 0; transform: translateY(8px); }
.sport-name-leave-to     { opacity: 0; }

.symptom-item {
  opacity: 0;
  animation: fadeInUp 0.35s ease forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

/* HERO */
.kyr-hero {
  position: relative;
  background: #07090e;
  overflow: hidden;
  min-height: 520px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.kyr-hero-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(48px, 8vw, 96px);
  line-height: 1.02;
  letter-spacing: 2px;
}

.kyr-hero-lines {
  position: absolute; inset: 0;
  overflow: hidden; pointer-events: none; z-index: 1;
}
.kyr-hero-lines::before {
  content: '';
  position: absolute; top: -200%; left: -50%; width: 200%; height: 400%;
  background-image: repeating-linear-gradient(
    -65deg, transparent, transparent 80px,
    rgba(56,191,255,0.025) 80px, rgba(56,191,255,0.025) 81px
  );
  animation: kyrLinesDrift 22s linear infinite;
}
@keyframes kyrLinesDrift {
  from { transform: translateX(0); }
  to   { transform: translateX(81px); }
}

.kyr-hero-edge {
  position: absolute; left: 0; top: 15%; bottom: 15%;
  width: 3px; z-index: 2;
  background: linear-gradient(to bottom, transparent, #38bfff 40%, #38bfff 60%, transparent);
}

/* STATS SECTION */
.kyr-stats-section { background: #e8f3ff; padding: 40px 0; }
.kyr-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  background: rgba(56,191,255,0.1);
  border-radius: 24px;
  overflow: hidden;
}
.kyr-stat-card { background: #e8f3ff; display: flex; flex-direction: column; padding: 28px 40px; gap: 6px; }
.kyr-stat-big  { font-family: 'Bebas Neue', sans-serif; font-size: clamp(52px, 6vw, 80px); color: #0a1628; line-height: 1; letter-spacing: 1px; }
.kyr-stat-title { font-size: 15px; font-weight: 700; color: #1A1A1A; }
.kyr-stat-desc  { font-size: 13px; color: #5A7A9B; line-height: 1.6; max-width: 260px; }

/*  EKG LINE */
.kyr-ekg { position: absolute; bottom: 0; left: 0; right: 0; z-index: 2; height: 56px; overflow: hidden; opacity: 0.18; }
.kyr-ekg-svg { width: 200%; height: 100%; animation: kyrEkgScroll 3s linear infinite; }
@keyframes kyrEkgScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
</style>
