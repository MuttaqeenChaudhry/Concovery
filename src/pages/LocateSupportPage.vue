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

// ─── Environment variables ────────────────────────────────────────────────────
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
const MAPBOX_TOKEN   = import.meta.env.VITE_MAPBOX_TOKEN
const BACKEND_URL    = 'https://site--concovery-backend--gvxxw7q2vn57.code.run'

// ─── Marker colours by clinic type ───────────────────────────────────────────
const CLINIC_COLOURS = {
  'GP':              '#007aff',
  'Sports Medicine': '#34c759',
  'Hospital':        '#ff3b30',
  'Physiotherapy':   '#ff9500',
}


// ============================================================
// STATE
// ============================================================

// Search input / autocomplete
const userInput          = ref('')
const fetchedPredictions = ref(null)
const selectedLocation   = ref(null)

// Results
// allResults holds everything from the API.
// shownResults is filtered by the current radius — what actually displays.
const allResults  = ref(null)
const shownResults = ref(null)

// UI flags
const isLoading          = ref(false)
const errors             = ref({})
const isLocating         = ref(false)   // true while GPS is resolving
const selectedCardIndex  = ref(null)
const radiusKm           = ref(5)
const mapDiv             = ref(null)

// Location concepts (kept separate on purpose):
//   gpsPosition  → where the user physically IS (blue dot on map, GPS only)
//   searchCentre → where we search around (typed suburb OR gps position)
const gpsPosition   = ref(null)
const searchCentre  = ref(null)

// Mapbox objects — not reactive because Vue doesn't need to track them
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
 * Called on slider drag — instant, no network request.
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
 *
 * Selected pins are CIRCLES so they're never confused with unselected
 * GP pins, which are also blue teardrops.
 * Unselected pins are teardrops coloured by clinic type.
 */
function buildPinSVG(number, colour, isSelected = false) {
  if (isSelected) {
    return `
      <svg width="46" height="46" viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg"
           style="filter:drop-shadow(0 4px 14px rgba(0,122,255,0.65));display:block;">
        <circle cx="23" cy="23" r="21" fill="#007aff" stroke="white" stroke-width="3.5"/>
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
  const STACK_THRESHOLD = 0.0003   // degrees (~30 m) — "same spot" tolerance
  const FAN_RADIUS      = 0.00045  // degrees (~45 m) — how far to push them apart

  const assigned = new Set()

  shownResults.value.forEach((place, i) => {
    if (assigned.has(i)) return

    // Find every other pin within the threshold of this one
    const cluster = [i]
    assigned.add(i)

    shownResults.value.forEach((other, j) => {
      if (i === j || assigned.has(j)) return
      const sameLat = Math.abs(parseFloat(place.lat) - parseFloat(other.lat)) < STACK_THRESHOLD
      const sameLng = Math.abs(parseFloat(place.lng) - parseFloat(other.lng)) < STACK_THRESHOLD
      if (sameLat && sameLng) { cluster.push(j); assigned.add(j) }
    })

    if (cluster.length === 1) return  // nothing to spread

    // Centroid of the cluster
    const cLat = cluster.reduce((sum, idx) => sum + parseFloat(shownResults.value[idx].lat), 0) / cluster.length
    const cLng = cluster.reduce((sum, idx) => sum + parseFloat(shownResults.value[idx].lng), 0) / cluster.length

    // Place each pin evenly around the centroid (like a clock face)
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

/**
 * Moves the pulsing blue dot to the user's actual GPS position.
 * Only called after the user clicks "Use My Location".
 */
function updateGpsDot() {
  if (!map || !gpsPosition.value) return
  const { lat, lng } = gpsPosition.value
  map.getSource('gps-dot')?.setData({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [lng, lat] },
  })
}

/**
 * Creates the map on first call, or just flies the camera on subsequent calls.
 * The GPS dot is kept separate from the camera position.
 */
async function initMap(lat, lng) {
  mapboxgl.accessToken = MAPBOX_TOKEN
  await nextTick()
  if (!mapDiv.value) return

  // Map already exists — just move the camera
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

  // Animated pulsing dot — drawn frame by frame using the Canvas API
  const DOT_SIZE = 120
  const pulsingDot = {
    width: DOT_SIZE, height: DOT_SIZE, data: new Uint8Array(DOT_SIZE * DOT_SIZE * 4),

    onAdd() {
      const canvas  = document.createElement('canvas')
      canvas.width  = canvas.height = DOT_SIZE
      this.context  = canvas.getContext('2d')
    },

    render() {
      const progress = (performance.now() % 1200) / 1200   // 0 → 1, loops every 1.2s
      const radius   = (DOT_SIZE / 2) * 0.3
      const ctx      = this.context

      ctx.clearRect(0, 0, DOT_SIZE, DOT_SIZE)

      // Outer fading ring
      ctx.beginPath()
      ctx.arc(DOT_SIZE / 2, DOT_SIZE / 2, radius * (1 + progress * 1.4), 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0,122,255,${0.4 * (1 - progress)})`
      ctx.fill()

      // Solid inner dot
      ctx.beginPath()
      ctx.arc(DOT_SIZE / 2, DOT_SIZE / 2, radius, 0, Math.PI * 2)
      ctx.fillStyle   = '#007aff'
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

    // Start with an empty source — dot only appears after GPS is granted
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

/**
 * Removes old pins and places fresh ones for the current shownResults.
 * Also spreads any stacked pins and fits the viewport.
 */
function renderMapPins() {
  // Remove old pins
  mapMarkers.forEach(({ marker, popup }) => { popup.remove(); marker.remove() })
  mapMarkers = []

  if (!map || !shownResults.value?.length) return

  shownResults.value.forEach((place, index) => {
    const colour = CLINIC_COLOURS[place.locationType] || '#007aff'
    const coords = [parseFloat(place.lng), parseFloat(place.lat)]

    // Build the pin element
    const el       = document.createElement('div')
    el.className   = 'map-pin'
    el.innerHTML   = buildPinSVG(index + 1, colour, false)

    // Hover tooltip
    const popup = new mapboxgl.Popup({
      closeButton:  false,
      closeOnClick: false,
      offset:       [0, -56],
      className:    'concovery-popup',
    }).setHTML(`
      <div style="background:white;border:1px solid #e5e7eb;border-radius:12px;
                  padding:10px 14px;min-width:180px;box-shadow:0 4px 16px rgba(0,0,0,0.12);">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px;">
          <span style="background:${colour};color:white;font-size:10px;font-weight:700;
                       padding:2px 8px;border-radius:20px;">${place.locationType || 'CLINIC'}</span>
          <span style="color:${place.isOpen ? '#16a34a' : '#dc2626'};font-size:11px;font-weight:600;">
            ${place.isOpen ? '● Open' : '● Closed'}
          </span>
        </div>
        <div style="color:#111827;font-weight:600;font-size:13px;margin-bottom:2px;">${place.name}</div>
        <div style="color:#6b7280;font-size:11px;">${place.distance || ''}</div>
      </div>`)

    el.addEventListener('mouseenter', () => popup.addTo(map))
    el.addEventListener('mouseleave', () => {
      if (selectedCardIndex.value !== index) popup.remove()
    })

    // Clicking a pin on the map selects the matching card in the list
    el.addEventListener('click', () => selectCard(index))

    const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat(coords)
      .addTo(map)

    mapMarkers.push({ marker, popup, el, coords, spreadPosition: null, colour, index })
  })

  spreadStackedPins()

  // Zoom the map to fit all visible pins
  if (searchCentre.value) {
    const bounds = new mapboxgl.LngLatBounds()
    bounds.extend([parseFloat(searchCentre.value.lng), parseFloat(searchCentre.value.lat)])
    mapMarkers.forEach(({ marker }) => bounds.extend(marker.getLngLat()))
    map.fitBounds(bounds, { padding: 80, maxZoom: 15, duration: 1000 })
  }
}

/**
 * Swaps each pin's SVG so the selected one shows as a circle,
 * all others revert to their coloured teardrops.
 * Also fixes z-index so the selected pin always sits on top.
 */
function refreshPinStyles(activeIndex) {
  mapMarkers.forEach(({ el, popup, colour, index }) => {
    const isActive = index === activeIndex

    el.innerHTML = buildPinSVG(index + 1, colour, isActive)

    // Mapbox wraps our element in an extra div — set z-index on both
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

/**
 * Fetches all nearby places from the backend (no radius param —
 * we filter on the client with applyRadiusFilter so the slider
 * works instantly without extra API calls).
 */
async function fetchNearbyPlaces(centre) {
  isLoading.value         = true
  selectedCardIndex.value = null

  try {
    const res = await axios.get(
      `${BACKEND_URL}/google/nearbyplaces?lat=${centre.lat}&lng=${centre.lng}`
    )
    if (res.status === 200) {
      allResults.value = res.data.nearbyplaces
      applyRadiusFilter()   // sets shownResults and draws pins

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

/** Called when the user picks a suggestion from the autocomplete dropdown. */
async function selectPrediction(address) {
  isLoading.value          = true
  selectedLocation.value   = address
  userInput.value          = address
  fetchedPredictions.value = null

  try {
    const geo      = await locateAddress(GOOGLE_API_KEY, address)
    searchCentre.value = geo   // this is the search origin — NOT the GPS dot

    await initMap(geo.lat, geo.lng)
    await fetchNearbyPlaces(geo)
  } catch {
    errors.value = { ...errors.value, general: 'Unable to retrieve suggestions, please try again.' }
  } finally {
    isLoading.value = false
  }
}

/** Uses the browser's GPS to find the user's current position. */
async function useMyLocation() {
  isLocating.value = true

  try {
    const coords = await getBrowserLocation()

    // Both the GPS dot AND the search centre point to the user's real position
    gpsPosition.value  = coords
    searchCentre.value = coords

    const { lat, lng }   = coords
    userInput.value      = await reverseGeocode(lat, lng)
    selectedLocation.value = userInput.value

    await initMap(lat, lng)
    await fetchNearbyPlaces(coords)
  } catch (err) {
    console.error('GPS failed:', err)
  } finally {
    isLocating.value = false
  }
}

/**
 * Wraps navigator.geolocation in a Promise so we can use async/await.
 * Sets a user-friendly error message if the user denies permission.
 */
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

/**
 * Handles selecting a card — shared by both card clicks and map pin clicks.
 * Updates the selected index, refreshes pin styles, flies the camera,
 * and scrolls the card into view.
 */
function selectCard(index) {
  selectedCardIndex.value = index
  refreshPinStyles(index)

  const pin = mapMarkers[index]
  if (map && pin) {
    const dest = pin.spreadPosition ?? pin.coords
    map.flyTo({ center: dest, zoom: 16, speed: 1.2, offset: [0, -60] })
  }

  // Scroll the right-hand card into view
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
  await initMap(-37.8136, 144.9631)   // Default view: Melbourne CBD
})

onUnmounted(() => {
  if (map) { map.remove(); map = null }
})
</script>


<template>
  <div class="bg-white min-h-screen">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20">

      <!-- Page heading -->
      <div class="text-center mb-12">
        <BlurReveal :delay="0.2" :duration="0.75">
          <h1 class="text-5xl sm:text-7xl font-semibold text-[#1d1d1f] mb-6 tracking-tight">
            Find Medical Support
          </h1>
          <p class="text-xl sm:text-2xl text-[#86868b] max-w-3xl mx-auto">
            Locate GPs, sports medicine clinics, and hospitals near you for concussion assessment and care.
          </p>
        </BlurReveal>
      </div>

      <!-- Emergency banner -->
      <div class="bg-gradient-to-br from-[#ff3b30] to-[#ff2d55] rounded-3xl p-8 mb-12 shadow-2xl shadow-red-500/20">
        <div class="flex items-start gap-4">
          <div class="bg-white rounded-2xl p-4 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#ff3b30]">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" x2="12" y1="8" y2="12"/>
              <line x1="12" x2="12.01" y1="16" y2="16"/>
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-semibold text-white mb-3">
              Experiencing Severe Symptoms? Call 000 Immediately
            </h2>
            <p class="text-white/95 text-lg mb-4 leading-relaxed">
              If you or someone you know is experiencing severe headache, vomiting, seizures,
              loss of consciousness, slurred speech, or unusual behaviour — call 000 or go to
              the nearest emergency department immediately.
            </p>
            <a href="tel:000">
              <button class="inline-flex items-center gap-2 bg-white text-[#ff3b30] hover:bg-white/90
                             px-10 py-4 text-lg rounded-full font-semibold shadow-lg
                             transition-all hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6
                           19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72
                           12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6
                           l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Call 000
              </button>
            </a>
          </div>
        </div>
      </div>

      <!-- Search bar -->
      <div class="bg-[#f5f5f7] rounded-3xl p-8 mb-12 shadow-lg">
        <div class="flex items-center gap-3 mb-6">
          <div class="bg-[#007aff] rounded-2xl p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <h2 class="text-2xl font-semibold text-[#1d1d1f]">Find Nearby Support</h2>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">

          <!-- Address input with autocomplete dropdown -->
          <div class="flex-1 relative">
            <input
              type="text"
              placeholder="Enter your suburb or postcode..."
              v-model="userInput"
              @keyup="fetchAddressPredictions"
              class="w-full bg-white border-2 border-[#d2d2d7] rounded-2xl px-6 py-4
                     text-[#1d1d1f] text-lg focus:outline-none focus:border-[#007aff] transition-colors"
            />
            <ul
              v-if="fetchedPredictions"
              class="absolute top-full left-0 z-50 min-w-full lg:min-w-[600px] max-h-[200px]
                     shadow-2xl bg-white rounded-2xl mt-1 overflow-y-auto border border-[#d2d2d7]"
            >
              <li
                v-for="prediction in fetchedPredictions"
                :key="prediction.description"
                @click="selectPrediction(prediction.description)"
                class="px-6 py-3 border-b border-[#f0f0f0] hover:bg-[#f5f5f7] cursor-pointer text-[#1d1d1f]"
              >
                {{ prediction.description }}
              </li>
            </ul>
          </div>

          <button
            @click="useMyLocation"
            :disabled="isLocating"
            class="inline-flex items-center justify-center gap-2 bg-[#007aff] hover:bg-[#0051d5]
                   text-white px-8 py-4 rounded-2xl font-semibold whitespace-nowrap transition-all
                   disabled:opacity-50 disabled:pointer-events-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {{ isLocating ? 'Locating...' : 'Use My Location' }}
          </button>
        </div>

        <!-- Colour legend — appears once results are loaded -->
        <div v-if="shownResults" class="flex flex-wrap gap-4 mt-6 pt-6 border-t border-[#d2d2d7]/50">
          <div
            v-for="(colour, type) in CLINIC_COLOURS"
            :key="type"
            class="flex items-center gap-2"
          >
            <div class="w-3 h-3 rounded-full" :style="{ background: colour }"/>
            <span class="text-sm text-[#86868b] font-medium">{{ type }}</span>
          </div>
        </div>
      </div>

      <!-- Map + results grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <!-- Map panel -->
        <div class="bg-white rounded-3xl overflow-hidden shadow-xl border border-[#e5e7eb]">

          <!-- Map header -->
          <div class="bg-[#f9fafb] px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between">
            <h3 class="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#007aff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Nearby Providers
            </h3>
            <span class="text-xs text-[#86868b] font-medium">
              <template v-if="shownResults">
                {{ shownResults.length }} of {{ allResults?.length ?? 0 }} within {{ radiusKm }} km
              </template>
              <template v-else>Melbourne, VIC</template>
            </span>
          </div>

          <!-- Map canvas -->
          <div class="relative">
            <div ref="mapDiv" style="width:100%;height:540px;" />

            <!-- Radius slider — floats over the bottom of the map -->
            <div class="absolute bottom-5 left-4 right-4 z-10
                        bg-white/88 backdrop-blur-md rounded-2xl px-5 py-3
                        shadow-lg border border-white/60">
              <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                     fill="none" stroke="#007aff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                     class="flex-shrink-0">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span class="text-xs font-semibold text-[#1d1d1f] whitespace-nowrap flex-shrink-0">
                  Search radius
                </span>
                <input
                  type="range"
                  min="1" max="20" step="1"
                  v-model.number="radiusKm"
                  @input="applyRadiusFilter"
                  class="flex-1 accent-[#007aff] cursor-pointer"
                />
                <span class="text-sm font-bold text-[#007aff] w-14 text-right flex-shrink-0">
                  {{ radiusKm }} km
                </span>
              </div>
              <div class="flex justify-between mt-1 px-6">
                <span class="text-[10px] text-[#86868b]">1 km</span>
                <span class="text-[10px] text-[#86868b]">20 km</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Results list -->
        <!--
          overflow-x-visible ensures the selected card's 2px blue border
          isn't clipped by the scroll container edge.
        -->
        <div class="max-h-[640px] overflow-y-auto overflow-x-visible px-2 py-2">
          <div class="space-y-2">

            <!-- Loading skeletons -->
            <div v-if="isLoading" class="flex flex-col space-y-2">
              <SuggestionCardSkeleton/>
              <SuggestionCardSkeleton/>
              <SuggestionCardSkeleton/>
            </div>

            <!-- Results -->
            <template v-else-if="shownResults">

              <!-- Shown when radius is too tight -->
              <div
                v-if="shownResults.length === 0"
                class="flex flex-col items-center gap-3 py-16 text-center text-[#86868b]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-30">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                </svg>
                <p class="font-medium text-sm">
                  No providers within {{ radiusKm }} km.<br>Try increasing the search radius.
                </p>
              </div>

              <!-- Individual result cards -->
              <div
                v-else
                v-for="(place, index) in shownResults"
                :key="place.name"
                :id="`card-${index}`"
                class="rounded-2xl transition-all duration-200 cursor-pointer bg-white"
                :class="selectedCardIndex === index
                  ? 'border-2 border-[#007aff] shadow-lg shadow-blue-500/20 scale-[1.01]'
                  : 'border border-[#e5e7eb] hover:border-[#c7c7cc] hover:shadow-sm'"
                @click="selectCard(index)"
              >
                <div class="relative">
                  <!-- Number badge in the top-right corner -->
                  <div
                    class="absolute top-3 right-3 z-10 w-6 h-6 rounded-full flex items-center
                           justify-center text-xs font-bold text-white shadow-sm transition-colors"
                    :style="{ background: selectedCardIndex === index ? '#007aff' : '#9ca3af' }"
                  >
                    {{ index + 1 }}
                  </div>

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

            <!-- Empty state — before any search has been done -->
            <div v-else class="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div v-if="errors.general" class="flex flex-col items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" x2="12" y1="8" y2="12"/>
                  <line x1="12" x2="12.01" y1="16" y2="16"/>
                </svg>
                <span class="text-red-500 font-medium text-sm max-w-xs">{{ errors.general }}</span>
              </div>
              <div v-else class="flex flex-col items-center gap-3 text-[#86868b]">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-30">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <p class="font-medium">Enter a suburb or use your location<br>to find nearby support</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Healthdirect footer -->
      <div class="mt-12 bg-gradient-to-br from-[#007aff]/10 to-[#5ac8fa]/10 rounded-3xl p-8 border border-[#007aff]/30">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div class="flex-1 text-center sm:text-left">
            <h3 class="text-2xl font-semibold text-[#1d1d1f] mb-3">Can't Find Nearby Support?</h3>
            <p class="text-[#86868b] text-lg">
              Call Healthdirect for 24/7 health advice and help finding local services
            </p>
          </div>
          <a href="tel:1800022222">
            <button class="inline-flex items-center gap-2 bg-[#007aff] hover:bg-[#0051d5] text-white
                           px-10 py-4 text-lg rounded-full font-semibold shadow-lg shadow-blue-500/25
                           transition-all hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6
                         19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72
                         12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6
                         l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Call 1800 022 222
            </button>
          </a>
        </div>
      </div>

    </div>
  </div>
</template>


<style>
/* Mapbox popup — strip default styles so our custom HTML shows cleanly */
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

/* Range slider — styled consistently across Chrome and Firefox */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  height: 6px;
}
input[type="range"]::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 9999px;
  background: #e5e7eb;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #007aff;
  border: 3px solid white;
  box-shadow: 0 1px 6px rgba(0,122,255,0.45);
  margin-top: -8px;
  cursor: pointer;
  transition: box-shadow 0.15s;
}
input[type="range"]::-webkit-slider-thumb:hover {
  box-shadow: 0 2px 10px rgba(0,122,255,0.60);
}
input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #007aff;
  border: 3px solid white;
  box-shadow: 0 1px 6px rgba(0,122,255,0.45);
  cursor: pointer;
}
input[type="range"]::-moz-range-track {
  height: 4px;
  border-radius: 9999px;
  background: #e5e7eb;
}
</style>
