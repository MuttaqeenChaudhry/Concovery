<script setup>
// ============================================================
// FindSupport.vue
// Lets users search for nearby concussion-related medical help.
// Shows results on a Mapbox map and as a scrollable card list.
// ============================================================

import SuggestionCard         from '@/components/custom-components/SuggestionCard.vue'
import SuggestionCardSkeleton from '@/components/custom-components/SuggestionCardSkeleton.vue'
import BlurReveal             from '@/components/ui/blur-reveal/BlurReveal.vue'
import { locateAddress }      from '@/services/googleLocation'
import axios                  from 'axios'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import mapboxgl               from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

//Environment variables
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
const MAPBOX_TOKEN   = import.meta.env.VITE_MAPBOX_TOKEN
const BACKEND_URL    = 'https://site--concovery-backend--gvxxw7q2vn57.code.run'

//Marker colours by clinic type
const CLINIC_COLOURS = {
  'GP':              '#1A4FAB',
  'Sports Medicine': '#1B7C3D',
  'Hospital':        '#C62828',
  'Physiotherapy':   '#E65100',
}


// ============================================================
// STATE
// ============================================================

// Search input / autocomplete
const userInput          = ref('')
const fetchedPredictions = ref(null)
const selectedLocation   = ref(null)

// Results
const allResults   = ref(null)
const shownResults = ref(null)

// UI flags
const isLoading          = ref(false)
const errors             = ref({})
const isLocating         = ref(false)
const selectedCardIndex  = ref(null)
const radiusKm           = ref(5)
const mapDiv             = ref(null)

// Location concepts (kept separate on purpose):
//   gpsPosition   where the user physically IS (blue dot on map, GPS only)
//   searchCentre  where we search around (typed suburb OR gps position)
const gpsPosition   = ref(null)
const searchCentre  = ref(null)

// Mapbox objects - not reactive because Vue doesn't need to track them
let map        = null
let mapMarkers = []


// ============================================================
// HELPERS
// ============================================================

/**
 * Calculates straight-line distance in km between two lat/lng points.
 * Used for the radius slider (client-side filtering, no API call needed).
 */
function distanceKm(lat1, lng1, lat2, lng2) {
  const R    = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a    = Math.sin(dLat / 2) ** 2
              + Math.cos(lat1 * Math.PI / 180)
              * Math.cos(lat2 * Math.PI / 180)
              * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Filters allResults by the current radiusKm and re-draws map pins.
 * Called on slider drag - instant, no network request.
 */
function applyRadiusFilter() {
  if (!allResults.value || !searchCentre.value) return
  const { lat, lng } = searchCentre.value
  shownResults.value = allResults.value.filter(place =>
    distanceKm(lat, lng, parseFloat(place.lat), parseFloat(place.lng)) <= radiusKm.value
  )
  selectedCardIndex.value = null
  renderMapPins()
}

/**
 * Builds the SVG for a map pin.
 * Selected pins are CIRCLES. Unselected pins are teardrops by clinic type.
 */
function buildPinSVG(number, colour, isSelected = false) {
  if (isSelected) {
    return `
      <svg width="46" height="46" viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg"
           style="filter:drop-shadow(0 4px 14px rgba(26,79,171,0.65));display:block;">
        <circle cx="23" cy="23" r="21" fill="#1A4FAB" stroke="white" stroke-width="3.5"/>
        <text x="23" y="28" text-anchor="middle" fill="white"
              font-family="system-ui,-apple-system,sans-serif"
              font-size="16" font-weight="700">${number}</text>
      </svg>`
  }
  return `
    <svg width="36" height="44" viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg"
         style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.28));display:block;">
      <path d="M18 0C8.06 0 0 8.06 0 18c0 12 18 26 18 26S36 30 36 18C36 8.06 27.94 0 18 0z"
            fill="${colour}"/>
      <circle cx="18" cy="18" r="10" fill="rgba(255,255,255,0.25)"/>
      <text x="18" y="23" text-anchor="middle" fill="white"
            font-family="system-ui,-apple-system,sans-serif"
            font-size="13" font-weight="700">${number}</text>
    </svg>`
}

/**
 * When multiple clinics share the same building they stack on a single pixel.
 * This fans them out in a small circle so all pins are individually visible.
 */
function spreadStackedPins() {
  const STACK_THRESHOLD = 0.0003
  const FAN_RADIUS      = 0.00045
  const assigned = new Set()

  shownResults.value.forEach((place, i) => {
    if (assigned.has(i)) return
    const cluster = [i]
    assigned.add(i)

    shownResults.value.forEach((other, j) => {
      if (i === j || assigned.has(j)) return
      const sameLat = Math.abs(parseFloat(place.lat) - parseFloat(other.lat)) < STACK_THRESHOLD
      const sameLng = Math.abs(parseFloat(place.lng) - parseFloat(other.lng)) < STACK_THRESHOLD
      if (sameLat && sameLng) { cluster.push(j); assigned.add(j) }
    })

    if (cluster.length === 1) return

    const cLat = cluster.reduce((sum, idx) => sum + parseFloat(shownResults.value[idx].lat), 0) / cluster.length
    const cLng = cluster.reduce((sum, idx) => sum + parseFloat(shownResults.value[idx].lng), 0) / cluster.length

    cluster.forEach((pinIndex, position) => {
      const angle  = (2 * Math.PI * position) / cluster.length - Math.PI / 2
      const newLat = cLat + FAN_RADIUS * Math.cos(angle)
      const newLng = cLng + (FAN_RADIUS * Math.sin(angle)) / Math.cos(cLat * Math.PI / 180)
      mapMarkers[pinIndex].marker.setLngLat([newLng, newLat])
      mapMarkers[pinIndex].spreadPosition = [newLng, newLat]
    })
  })
}


// ============================================================
// MAP SETUP
// ============================================================

function updateGpsDot() {
  if (!map || !gpsPosition.value) return
  const { lat, lng } = gpsPosition.value
  map.getSource('gps-dot')?.setData({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [lng, lat] },
  })
}

async function initMap(lat, lng) {
  mapboxgl.accessToken = MAPBOX_TOKEN
  await nextTick()
  if (!mapDiv.value) return

  if (map) {
    map.flyTo({ center: [lng, lat], zoom: 14, speed: 1.4 })
    updateGpsDot()
    return
  }

  map = new mapboxgl.Map({
    container: mapDiv.value,
    style:     'mapbox://styles/mapbox/streets-v12',
    center:    [lng, lat],
    zoom:      13,
  })

  map.addControl(new mapboxgl.NavigationControl(), 'top-right')
  map.addControl(new mapboxgl.ScaleControl(), 'bottom-left')

  const DOT_SIZE = 120
  const pulsingDot = {
    width: DOT_SIZE, height: DOT_SIZE, data: new Uint8Array(DOT_SIZE * DOT_SIZE * 4),

    onAdd() {
      const canvas  = document.createElement('canvas')
      canvas.width  = canvas.height = DOT_SIZE
      this.context  = canvas.getContext('2d')
    },

    render() {
      const progress = (performance.now() % 1200) / 1200
      const radius   = (DOT_SIZE / 2) * 0.3
      const ctx      = this.context

      ctx.clearRect(0, 0, DOT_SIZE, DOT_SIZE)

      ctx.beginPath()
      ctx.arc(DOT_SIZE / 2, DOT_SIZE / 2, radius * (1 + progress * 1.4), 0, Math.PI * 2)
      ctx.fillStyle = `rgba(26,79,171,${0.4 * (1 - progress)})`
      ctx.fill()

      ctx.beginPath()
      ctx.arc(DOT_SIZE / 2, DOT_SIZE / 2, radius, 0, Math.PI * 2)
      ctx.fillStyle   = '#1A4FAB'
      ctx.strokeStyle = 'white'
      ctx.lineWidth   = 3
      ctx.fill()
      ctx.stroke()

      this.data = ctx.getImageData(0, 0, DOT_SIZE, DOT_SIZE).data
      map.triggerRepaint()
      return true
    },
  }

  map.on('load', () => {
    map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 })
    map.addSource('gps-dot', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    })
    map.addLayer({
      id:     'gps-dot-layer',
      type:   'symbol',
      source: 'gps-dot',
      layout: { 'icon-image': 'pulsing-dot', 'icon-allow-overlap': true },
    })
    updateGpsDot()
    if (shownResults.value?.length) renderMapPins()
  })
}

function renderMapPins() {
  mapMarkers.forEach(({ marker, popup }) => { popup.remove(); marker.remove() })
  mapMarkers = []

  if (!map || !shownResults.value?.length) return

  shownResults.value.forEach((place, index) => {
    const colour = CLINIC_COLOURS[place.locationType] || '#1A4FAB'
    const coords = [parseFloat(place.lng), parseFloat(place.lat)]

    const el       = document.createElement('div')
    el.className   = 'map-pin'
    el.innerHTML   = buildPinSVG(index + 1, colour, false)

    const popup = new mapboxgl.Popup({
      closeButton:  false,
      closeOnClick: false,
      offset:       [0, -56],
      className:    'concovery-popup',
    }).setHTML(`
      <div style="background:white;border:1px solid #EBEBEB;border-radius:14px;
                  padding:12px 16px;min-width:190px;box-shadow:0 6px 24px rgba(0,0,0,0.10);">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
          <span style="background:${colour};color:white;font-size:10px;font-weight:700;
                       padding:2px 10px;border-radius:20px;">${place.locationType || 'CLINIC'}</span>
          <span style="color:${place.isOpen ? '#1B7C3D' : '#C62828'};font-size:11px;font-weight:600;">
            ${place.isOpen ? '● Open' : '● Closed'}
          </span>
        </div>
        <div style="color:#1A1A1A;font-weight:700;font-size:13px;margin-bottom:2px;">${place.name}</div>
        <div style="color:#5A7A9B;font-size:11px;">${place.distance || ''}</div>
      </div>`)

    el.addEventListener('mouseenter', () => popup.addTo(map))
    el.addEventListener('mouseleave', () => {
      if (selectedCardIndex.value !== index) popup.remove()
    })
    el.addEventListener('click', () => selectCard(index))

    const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat(coords)
      .addTo(map)

    mapMarkers.push({ marker, popup, el, coords, spreadPosition: null, colour, index })
  })

  spreadStackedPins()

  if (searchCentre.value) {
    const bounds = new mapboxgl.LngLatBounds()
    bounds.extend([parseFloat(searchCentre.value.lng), parseFloat(searchCentre.value.lat)])
    mapMarkers.forEach(({ marker }) => bounds.extend(marker.getLngLat()))
    map.fitBounds(bounds, { padding: 80, maxZoom: 15, duration: 1000 })
  }
}

function refreshPinStyles(activeIndex) {
  mapMarkers.forEach(({ el, popup, colour, index }) => {
    const isActive = index === activeIndex
    el.innerHTML = buildPinSVG(index + 1, colour, isActive)
    el.style.zIndex = isActive ? '20' : '1'
    if (el.parentElement) el.parentElement.style.zIndex = isActive ? '20' : '1'
    if (isActive) popup.addTo(map)
    else          popup.remove()
  })
}


// ============================================================
// DATA FETCHING
// ============================================================

async function fetchAddressPredictions() {
  if (!userInput.value) {
    fetchedPredictions.value = null
    return
  }
  try {
    const res = await axios.get(`${BACKEND_URL}/google/fetchPredictions?address=${userInput.value}`)
    fetchedPredictions.value = res.status === 200
      ? (res.data?.predictions?.predictions ?? null)
      : null
  } catch (err) {
    console.error('Address prediction failed:', err)
  }
}

async function fetchNearbyPlaces(centre) {
  isLoading.value         = true
  selectedCardIndex.value = null
  try {
    const res = await axios.get(
      `${BACKEND_URL}/google/nearbyplaces?lat=${centre.lat}&lng=${centre.lng}`
    )
    if (res.status === 200) {
      allResults.value = res.data.nearbyplaces
      applyRadiusFilter()
      await nextTick()
      if (map) {
        if (map.loaded()) renderMapPins()
        else              map.once('load', renderMapPins)
      }
    }
  } catch (err) {
    console.error('Nearby places fetch failed:', err)
  } finally {
    isLoading.value = false
  }
}

async function reverseGeocode(lat, lng) {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`
              + `?access_token=${MAPBOX_TOKEN}&types=locality,postcode&limit=1`
    const res = await axios.get(url)
    return res.data?.features?.[0]?.place_name ?? 'Your location'
  } catch {
    return 'Your location'
  }
}


// ============================================================
// USER INTERACTIONS
// ============================================================

async function selectPrediction(address) {
  isLoading.value          = true
  selectedLocation.value   = address
  userInput.value          = address
  fetchedPredictions.value = null
  try {
    const geo      = await locateAddress(GOOGLE_API_KEY, address)
    searchCentre.value = geo
    await initMap(geo.lat, geo.lng)
    await fetchNearbyPlaces(geo)
  } catch {
    errors.value = { ...errors.value, general: 'Unable to retrieve suggestions, please try again.' }
  } finally {
    isLoading.value = false
  }
}

async function useMyLocation() {
  isLocating.value = true
  try {
    const coords = await getBrowserLocation()
    gpsPosition.value  = coords
    searchCentre.value = coords
    const { lat, lng } = coords
    userInput.value    = await reverseGeocode(lat, lng)
    selectedLocation.value = userInput.value
    await initMap(lat, lng)
    await fetchNearbyPlaces(coords)
  } catch (err) {
    console.error('GPS failed:', err)
  } finally {
    isLocating.value = false
  }
}

function getBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      errors.value = { ...errors.value, general: 'Geolocation is not supported by your browser.' }
      return reject(new Error('Geolocation not supported'))
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        errors.value = { ...errors.value, general: null }
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      (err) => {
        const messages = {
          1: 'Location permission denied. Please allow location access in your browser settings.',
          2: 'Location unavailable. Please search manually above.',
          3: 'Location request timed out. Please search manually above.',
        }
        errors.value = { ...errors.value, general: messages[err.code] || 'Location error. Please search manually.' }
        reject(new Error(err.message))
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 30000 }
    )
  })
}

function selectCard(index) {
  selectedCardIndex.value = index
  refreshPinStyles(index)
  const pin = mapMarkers[index]
  if (map && pin) {
    const dest = pin.spreadPosition ?? pin.coords
    map.flyTo({ center: dest, zoom: 16, speed: 1.2, offset: [0, -60] })
  }
  nextTick(() => {
    document.getElementById(`card-${index}`)?.scrollIntoView({
      behavior: 'smooth',
      block:    'nearest',
    })
  })
}

function openDirections(place, index) {
  selectCard(index)
  if (!searchCentre.value) return
  const { lat: fromLat, lng: fromLng } = searchCentre.value
  const directionsUrl = `https://www.google.com/maps/dir/?api=1`
                      + `&origin=${fromLat},${fromLng}`
                      + `&destination=${place.lat},${place.lng}`
                      + `&travelmode=driving`
  window.open(directionsUrl, '_blank')
}


// ============================================================
// LIFECYCLE
// ============================================================

onMounted(async () => {
  await nextTick()
  await initMap(-37.8136, 144.9631)
})

onUnmounted(() => {
  if (map) { map.remove(); map = null }
})
</script>


<template>
  <div class="bg-white min-h-screen">

    <!--
      HERO SECTION
    -->
    <section class="fs-hero text-white">
      <div class="fs-hero-lines"></div>
      <div class="fs-hero-edge"></div>

      <div class="w-full py-24 relative z-10" style="padding-left:80px; padding-right:80px;">
        <BlurReveal :delay="0.1" :duration="0.75">
          <div class="inline-flex items-center border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span class="w-1.5 h-1.5 rounded-full bg-[#38bfff] mr-2 animate-pulse"></span>
            <span class="text-white/50 text-xs font-medium tracking-widest uppercase">Locate Support</span>
          </div>
          <h1 class="fs-hero-title text-white mb-6">
            FIND THE RIGHT<br>
            HELP <span style="color:#38bfff;">NEAR YOU.</span>
          </h1>
          <p class="text-white/55 text-lg font-light max-w-lg leading-relaxed">
            A concussion needs a real doctor, not a search engine. Use this tool to find GPs, sports medicine clinics and hospitals within reach - before you need them in a hurry.
          </p>
        </BlurReveal>
      </div>

      <!-- EKG heartbeat line -->
      <div class="fs-ekg">
        <svg class="fs-ekg-svg" viewBox="0 0 1200 56" fill="none"
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





    <!-- 
      FULL-SCREEN MAP WITH FLOATING PANEL
     -->
    <section class="relative p-3" style="height:calc(100vh - 80px); min-height:680px; background: linear-gradient(160deg, #EBF3FF 0%, #DEF0FF 50%, #EBF3FF 100%);">

      <!-- Map - inset with rounded corners -->
      <div class="relative w-full h-full rounded-3xl overflow-hidden shadow-xl">
        <div ref="mapDiv" style="width:100%;height:100%;" />

        <!-- Recenter button - bottom right of the map -->
        <button
          v-if="searchCentre"
          @click="initMap(searchCentre.lat, searchCentre.lng)"
          title="Return to your location"
          class="absolute bottom-5 right-5 z-20 w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-all hover:scale-105"
          style="background: white; border: 1.5px solid #EBEBEB;"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v3m0 14v3M2 12h3m14 0h3"/>
            <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" opacity="0.3" fill="#1A4FAB"/>
          </svg>
        </button>

      </div>

      <!-- Floating panel - overlays on left, contains search + results -->
      <div class="absolute top-5 left-5 bottom-5 z-20 flex flex-col rounded-3xl overflow-hidden shadow-2xl" style="width:420px; background: rgba(255,255,255,0.96); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);">

        <!-- Panel top: label + search -->
        <div class="flex-shrink-0 px-6 pt-6 pb-4">

          <!-- Label row -->
          <div class="flex items-center justify-between mb-4">
            <span class="text-[#1A4FAB] text-xs font-bold tracking-widest uppercase">Locate Support</span>
            <span v-if="shownResults" class="text-xs text-[#5A7A9B] font-medium bg-[#EBF3FF] px-3 py-1 rounded-full">
              {{ shownResults.length }} found
            </span>
          </div>

          <!-- Search input -->
          <div class="relative mb-3">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A7A9B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input
              type="text"
              placeholder="Suburb or postcode..."
              v-model="userInput"
              @keyup="fetchAddressPredictions"
              class="w-full bg-[#F7F9FC] border-2 border-[#EBEBEB] rounded-2xl pl-10 pr-4 py-3.5 text-[#1A1A1A] text-sm font-medium focus:outline-none focus:border-[#1A4FAB] focus:bg-white transition-colors"
            />
            <!-- Autocomplete dropdown -->
            <ul
              v-if="fetchedPredictions"
              class="absolute top-full left-0 z-50 w-full shadow-xl bg-white rounded-2xl mt-1.5 overflow-hidden border border-[#EBEBEB]"
            >
              <li
                v-for="prediction in fetchedPredictions"
                :key="prediction.description"
                @click="selectPrediction(prediction.description)"
                class="flex items-center gap-3 px-4 py-3 border-b border-[#F7F9FC] hover:bg-[#EBF3FF] cursor-pointer text-[#1A1A1A] text-sm font-medium transition-colors last:border-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                {{ prediction.description }}
              </li>
            </ul>
          </div>

          <!-- Use My Location button -->
          <button
            @click="useMyLocation"
            :disabled="isLocating"
            class="w-full inline-flex items-center justify-center gap-2 bg-[#1A4FAB] hover:bg-[#1440A0] text-white px-4 py-3.5 rounded-2xl font-semibold text-sm transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {{ isLocating ? 'Locating...' : 'Use My Location' }}
          </button>

          <!-- Error -->
          <div v-if="errors.general" class="mt-3 flex items-center gap-2 bg-[#FFF5F5] border border-[#C62828]/20 rounded-xl px-4 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C62828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span class="text-[#C62828] text-xs font-medium">{{ errors.general }}</span>
          </div>

          <!-- Legend ~ appears once results are loaded -->
          <div v-if="shownResults" class="flex flex-wrap gap-3 mt-4 pt-4 border-t border-[#EBEBEB]">
            <div v-for="(colour, type) in CLINIC_COLOURS" :key="type" class="flex items-center gap-1.5">
              <div class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ background: colour }"/>
              <span class="text-xs text-[#5A7A9B] font-medium">{{ type }}</span>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="h-px bg-[#EBEBEB] flex-shrink-0 mx-4"/>

        <!-- Scrollable results -->
        <div class="flex-1 overflow-y-auto px-4 py-4">
          <div class="space-y-2">

            <!-- Loading -->
            <div v-if="isLoading" class="flex flex-col space-y-2">
              <SuggestionCardSkeleton/>
              <SuggestionCardSkeleton/>
              <SuggestionCardSkeleton/>
            </div>

            <!-- Results -->
            <template v-else-if="shownResults">
              <div v-if="shownResults.length === 0" class="flex flex-col items-center gap-3 py-12 text-center">
                <div class="w-12 h-12 rounded-full bg-[#EBF3FF] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <p class="text-[#5A7A9B] text-sm">No providers found in this area.</p>
              </div>

              <div
                v-else
                v-for="(place, index) in shownResults"
                :key="place.name"
                :id="`card-${index}`"
                class="rounded-2xl transition-all duration-200 cursor-pointer bg-white"
                :class="selectedCardIndex === index
                  ? 'border-2 border-[#1A4FAB] shadow-md shadow-blue-500/15'
                  : 'border border-[#EBEBEB] hover:border-[#1A4FAB]/30 hover:shadow-sm'"
                @click="selectCard(index)"
              >
                <div class="relative">
                  <div
                    class="absolute top-3 right-3 z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm transition-colors"
                    :style="{ background: selectedCardIndex === index ? '#1A4FAB' : '#9ca3af' }"
                  >{{ index + 1 }}</div>
                  <SuggestionCard
                    :location-type="place.locationType"
                    :is-open="place.isOpen"
                    :name="place.name"
                    :address="place.address"
                    :contact="place.phoneNo"
                    :distance="place.distance"
                    @get-directions="() => openDirections(place, index)"
                  />
                </div>
              </div>
            </template>

            <!-- Pre-search empty state -->
            <div v-else class="flex flex-col items-center justify-center py-12 gap-4 text-center">
              <div class="w-14 h-14 rounded-full bg-[#EBF3FF] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p class="text-[#1A1A1A] font-semibold text-sm mb-1">No location selected</p>
                <p class="text-[#5A7A9B] text-xs leading-relaxed">Search a suburb or tap<br>Use My Location above.</p>
              </div>
            </div>

          </div>
        </div>

      </div><!-- end rounded map wrapper -->
    </section>

    <!-- 
      FOOTER CTA
    -->
    <section style="background:#0A1628;" class="py-12">
      <div class="max-w-[1200px] mx-auto px-10">

        <a href="tel:1800022222" class="block">
          <div class="bg-[#1A4FAB] hover:bg-[#1440A0] transition-colors rounded-3xl px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 group">
            <div class="flex items-center gap-6">
              <div class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white mb-1">Can't find a nearby clinic? Call Healthdirect.</h3>
                <p class="text-white/70 text-sm">Free 24/7 health advice - a nurse or GP will help you find local support after a concussion.</p>
              </div>
            </div>
            <div class="flex items-center gap-2 text-white font-bold text-lg whitespace-nowrap flex-shrink-0">
              <span>1800 022 222</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </div>
        </a>

        <p class="text-center text-white/30 text-xs mt-6">Clinic data sourced from Google Places API · Always verify opening hours before visiting</p>
      </div>
    </section>

  </div>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

/* TRANSITIONS */
.fade-up-enter-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.fade-up-leave-active { transition: opacity 0.2s ease; }
.fade-up-enter-from   { opacity: 0; transform: translateY(14px); }
.fade-up-leave-to     { opacity: 0; }

/* HERO */
.fs-hero {
  position: relative;
  background: #07090e;
  overflow: hidden;
  min-height: 520px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.fs-hero-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(48px, 8vw, 96px);
  line-height: 1.02;
  letter-spacing: 2px;
}

/* Diagonal speed lines */
.fs-hero-lines {
  position: absolute; inset: 0;
  overflow: hidden; pointer-events: none; z-index: 1;
}
.fs-hero-lines::before {
  content: '';
  position: absolute; top: -200%; left: -50%; width: 200%; height: 400%;
  background-image: repeating-linear-gradient(
    -65deg, transparent, transparent 80px,
    rgba(56,191,255,0.025) 80px, rgba(56,191,255,0.025) 81px
  );
  animation: fsLinesDrift 22s linear infinite;
}
@keyframes fsLinesDrift {
  from { transform: translateX(0); }
  to   { transform: translateX(81px); }
}

/* Left ice-blue edge bar */
.fs-hero-edge {
  position: absolute; left: 0; top: 15%; bottom: 15%;
  width: 3px; z-index: 2;
  background: linear-gradient(to bottom, transparent, #38bfff 40%, #38bfff 60%, transparent);
}

/* EKG */
.fs-ekg {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  z-index: 2; height: 56px; overflow: hidden; opacity: 0.18;
}
.fs-ekg-svg {
  width: 200%; height: 100%;
  animation: fsEkgScroll 3s linear infinite;
}
@keyframes fsEkgScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* RANGE SLIDER */
.fs-range {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  height: 6px;
}
.fs-range::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 9999px;
  background: #EBEBEB;
}
.fs-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: #1A4FAB;
  border: 3px solid white;
  box-shadow: 0 1px 6px rgba(26,79,171,0.4);
  margin-top: -8px;
  cursor: pointer;
  transition: box-shadow 0.15s;
}
.fs-range::-webkit-slider-thumb:hover { box-shadow: 0 2px 10px rgba(26,79,171,0.55); }
.fs-range::-moz-range-thumb {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: #1A4FAB;
  border: 3px solid white;
  box-shadow: 0 1px 6px rgba(26,79,171,0.4);
  cursor: pointer;
}
.fs-range::-moz-range-track { height: 4px; border-radius: 9999px; background: #EBEBEB; }
</style>

<style>
/* Mapbox popup - strip default styles */
.concovery-popup .mapboxgl-popup-content {
  background: transparent !important;
  padding: 0 !important;
  box-shadow: none !important;
}
.concovery-popup .mapboxgl-popup-tip { display: none !important; }
.mapboxgl-ctrl-logo { display: none !important; }

/* Map pin hover */
.map-pin {
  cursor: pointer;
  transform-origin: bottom center;
  transition: transform 0.15s ease;
}
.map-pin:hover { transform: scale(1.12); }
</style>
