<script setup>
import SuggestionCard from '@/components/custom-components/SuggestionCard.vue'
import SuggestionCardSkeleton from '@/components/custom-components/SuggestionCardSkeleton.vue'
import BlurReveal from '@/components/ui/blur-reveal/BlurReveal.vue'
import { locateAddress } from '@/services/googleLocation'
import axios from 'axios'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const GoogleApiKey = import.meta.env.VITE_GOOGLE_API_KEY
const MapboxToken  = import.meta.env.VITE_MAPBOX_TOKEN

// ─── Reactive state ────────────────────────────────────────────────────────────
const userInput               = ref('')
const fetchedPredictions      = ref(null)
const selectedLocation        = ref(null)
const liveSuggestions         = ref(null)
const suggestionsLoading      = ref(false)
const errorsChest             = ref({})
const buttonsDisabled         = ref({ useMyLocation: false })
const originLocation          = ref(null)
const selectedSuggestionIndex = ref(null)
const mapDiv                  = ref(null)

// ─── Mapbox internals (non-reactive, no need to be refs) ──────────────────────
let map     = null
let markers = [] // stores { marker, popup, el } for each pin

// ─── Color map for each clinic type ───────────────────────────────────────────
const MARKER_COLORS = {
  'GP':              '#007aff',
  'Sports Medicine': '#34c759',
  'Hospital':        '#ff3b30',
  'Physiotherapy':   '#ff9500',
}

// ─── Initialise (or fly) the Mapbox map ───────────────────────────────────────
const initMap = async (lat, lng) => {
  mapboxgl.accessToken = MapboxToken
  await nextTick()
  if (!mapDiv.value) return

  // Map already created — just fly to the new location
  if (map) {
    map.flyTo({ center: [lng, lat], zoom: 14, speed: 1.4 })
    const src = map.getSource('user-location')
    if (src) {
      src.setData({ type: 'Feature', geometry: { type: 'Point', coordinates: [lng, lat] } })
    }
    return
  }

  // First-time setup
  map = new mapboxgl.Map({
    container: mapDiv.value,
    style:     'mapbox://styles/mapbox/streets-v12',
    center:    [lng, lat],
    zoom:      13,
  })

  map.addControl(new mapboxgl.NavigationControl(), 'top-right')
  map.addControl(new mapboxgl.ScaleControl(), 'bottom-left')

  // Animated pulsing dot to show the user's position
  const DOT_SIZE = 120
  const pulsingDot = {
    width: DOT_SIZE, height: DOT_SIZE, data: new Uint8Array(DOT_SIZE * DOT_SIZE * 4),

    onAdd() {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = DOT_SIZE
      this.context = canvas.getContext('2d')
    },

    render() {
      const t   = (performance.now() % 1200) / 1200  // 0 → 1 loop
      const r   = (DOT_SIZE / 2) * 0.3
      const ctx = this.context

      ctx.clearRect(0, 0, DOT_SIZE, DOT_SIZE)

      // Outer fading ring
      ctx.beginPath()
      ctx.arc(DOT_SIZE / 2, DOT_SIZE / 2, r * (1 + t * 1.4), 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0,122,255,${0.4 * (1 - t)})`
      ctx.fill()

      // Solid centre dot
      ctx.beginPath()
      ctx.arc(DOT_SIZE / 2, DOT_SIZE / 2, r, 0, Math.PI * 2)
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

    map.addSource('user-location', {
      type: 'geojson',
      data: { type: 'Feature', geometry: { type: 'Point', coordinates: [lng, lat] } },
    })
    map.addLayer({
      id:     'user-location-layer',
      type:   'symbol',
      source: 'user-location',
      layout: { 'icon-image': 'pulsing-dot', 'icon-allow-overlap': true },
    })

    // If suggestions arrived before the map finished loading, draw them now
    if (liveSuggestions.value?.length) renderMarkers()
  })
}

// ─── Draw numbered pin markers for every nearby place ─────────────────────────
//
// KEY FIX: mapboxgl.Marker is a DOM overlay — it does NOT depend on the map
// style being loaded. We can call addTo(map) at any time safely.
// The old code used map.once('load', ...) which never fires after the first load.
//
const renderMarkers = () => {
  // Remove every existing marker and its popup first
  markers.forEach(({ marker, popup }) => { popup.remove(); marker.remove() })
  markers = []

  if (!map || !liveSuggestions.value?.length) return

  liveSuggestions.value.forEach((place, index) => {
    const color = MARKER_COLORS[place.locationType] || '#007aff'

    // ── Build the teardrop pin element ──────────────────────────────────────
    // No SVG filter IDs here — they collide in the DOM when renderMarkers
    // is called more than once. A simple drop-shadow CSS filter is fine.
    const el = document.createElement('div')
    el.className = 'map-pin'
    el.innerHTML = `
      <svg width="36" height="44" viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg"
           style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.30));display:block;">
        <path d="M18 0C8.06 0 0 8.06 0 18c0 12 18 26 18 26S36 30 36 18C36 8.06 27.94 0 18 0z"
              fill="${color}"/>
        <circle cx="18" cy="18" r="10" fill="rgba(255,255,255,0.25)"/>
        <text x="18" y="23" text-anchor="middle" fill="white"
              font-family="system-ui,-apple-system,sans-serif"
              font-size="13" font-weight="700">${index + 1}</text>
      </svg>`

    // ── Hover popup ─────────────────────────────────────────────────────────
    const popup = new mapboxgl.Popup({
      closeButton:  false,
      closeOnClick: false,
      offset:       [0, -50],
      className:    'concovery-popup',
    }).setHTML(`
      <div style="background:white;border:1px solid #e5e7eb;border-radius:12px;
                  padding:10px 14px;min-width:180px;box-shadow:0 4px 16px rgba(0,0,0,0.12);">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px;">
          <span style="background:${color};color:white;font-size:10px;font-weight:700;
                       padding:2px 8px;border-radius:20px;">${place.locationType || 'CLINIC'}</span>
          <span style="color:${place.isOpen ? '#16a34a' : '#dc2626'};font-size:11px;font-weight:600;">
            ${place.isOpen ? '● Open' : '● Closed'}
          </span>
        </div>
        <div style="color:#111827;font-weight:600;font-size:13px;margin-bottom:2px;">${place.name}</div>
        <div style="color:#6b7280;font-size:11px;">${place.distance || ''}</div>
      </div>`)

    // Show popup on hover, hide when mouse leaves (unless this card is selected)
    el.addEventListener('mouseenter', () => popup.addTo(map))
    el.addEventListener('mouseleave', () => {
      if (selectedSuggestionIndex.value !== index) popup.remove()
    })

    // Place the marker on the map — anchor bottom so the pin tip sits on coords
    const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([parseFloat(place.lng), parseFloat(place.lat)])
      .addTo(map)

    markers.push({ marker, popup, el })
  })

  // Fit the viewport to include the user dot + all results
  if (originLocation.value) {
    const bounds = new mapboxgl.LngLatBounds()
    bounds.extend([parseFloat(originLocation.value.lng), parseFloat(originLocation.value.lat)])
    liveSuggestions.value.forEach(p => bounds.extend([parseFloat(p.lng), parseFloat(p.lat)]))
    map.fitBounds(bounds, { padding: 80, maxZoom: 15, duration: 1000 })
  }
}

// ─── Visually highlight the selected marker ───────────────────────────────────
const updateMarkerStyles = () => {
  markers.forEach(({ el, popup }, i) => {
    const active = selectedSuggestionIndex.value === i
    el.style.zIndex = active ? '10' : '1'
    el.classList.toggle('pin-selected', active)
    if (active) popup.addTo(map)
    else popup.remove()
  })
}

// ─── Address autocomplete ──────────────────────────────────────────────────────
const fetchPredictions = async () => {
  if (!userInput.value) { fetchedPredictions.value = null; return }
  try {
    const res = await axios.get(
      `https://site--concovery-backend--gvxxw7q2vn57.code.run/google/fetchPredictions?address=${userInput.value}`
    )
    fetchedPredictions.value = res.status === 200
      ? (res?.data?.predictions?.predictions ?? null)
      : null
  } catch (e) {
    console.error('fetchPredictions:', e)
  }
}

const finalizePrediction = async (inputLocation) => {
  suggestionsLoading.value = true
  selectedLocation.value   = inputLocation
  userInput.value          = inputLocation
  fetchedPredictions.value = null
  try {
    const geo            = await locateAddress(GoogleApiKey, selectedLocation.value)
    originLocation.value = geo
    await initMap(geo.lat, geo.lng)
    await fetchLiveSuggestions(geo)
  } catch {
    errorsChest.value = { ...errorsChest.value, error: 'Unable to retrieve suggestions, try again' }
  } finally {
    suggestionsLoading.value = false
  }
}

// ─── Browser geolocation helpers ─────────────────────────────────────────────
const getGeoLocation = () => new Promise((resolve, reject) => {
  if (!navigator.geolocation) {
    errorsChest.value = { ...errorsChest.value, error: 'Geolocation is not supported' }
    return reject(new Error('Geolocation not supported'))
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      errorsChest.value = { ...errorsChest.value, error: null }
      resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude })
    },
    err => {
      const reasons = {
        1: 'Location permission denied. Please allow location access in your browser settings.',
        2: 'Location unavailable. Please search manually above.',
        3: 'Location request timed out. Please search manually above.',
      }
      errorsChest.value = { ...errorsChest.value, error: reasons[err.code] || 'Location error. Please search manually.' }
      reject(new Error(err.message))
    },
    { enableHighAccuracy: false, timeout: 15000, maximumAge: 30000 }
  )
})

const reverseGeocode = async (lat, lng) => {
  try {
    const res = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MapboxToken}&types=locality,postcode&limit=1`
    )
    const features = res.data?.features
    return features?.length ? features[0].place_name : 'Your location'
  } catch {
    return 'Your location'
  }
}

// ─── Fetch nearby medical places from the backend ─────────────────────────────
const fetchLiveSuggestions = async (userLocation) => {
  suggestionsLoading.value = true
  try {
    const res = await axios.get(
      `https://site--concovery-backend--gvxxw7q2vn57.code.run/google/nearbyplaces?lat=${userLocation.lat}&lng=${userLocation.lng}`
    )
    if (res?.status === 200) {
      liveSuggestions.value = res.data.nearbyplaces
      await nextTick()

      // FIX: Markers are DOM overlays — no need to wait for style.load.
      // Just call renderMarkers() whenever map exists.
      if (map) {
        if (map.loaded()) {
          renderMarkers()
        } else {
          // Edge case: map still initialising on very first load
          map.once('load', renderMarkers)
        }
      }
    }
  } catch (e) {
    console.error('fetchLiveSuggestions:', e)
  } finally {
    suggestionsLoading.value = false
  }
}

const getUserCurrentLocation = async () => {
  buttonsDisabled.value.useMyLocation = true
  try {
    originLocation.value = await getGeoLocation()
    if (originLocation.value) {
      const { lat, lng }     = originLocation.value
      userInput.value        = await reverseGeocode(lat, lng)
      selectedLocation.value = userInput.value
      await initMap(lat, lng)
      await fetchLiveSuggestions(originLocation.value)
    }
  } catch (e) {
    console.error('getUserCurrentLocation:', e)
  } finally {
    suggestionsLoading.value            = false
    buttonsDisabled.value.useMyLocation = false
  }
}

// ─── Card / marker interaction ────────────────────────────────────────────────
const handleCardClick = (index) => {
  selectedSuggestionIndex.value = index
  updateMarkerStyles()
  const place = liveSuggestions.value[index]
  if (map && place) {
    map.flyTo({ center: [parseFloat(place.lng), parseFloat(place.lat)], zoom: 15, speed: 1.2 })
  }
}

const handleRoute = (place, index) => {
  selectedSuggestionIndex.value = index
  updateMarkerStyles()
  if (!originLocation.value) return
  const { lat: oLat, lng: oLng } = originLocation.value
  window.open(
    `https://www.google.com/maps/dir/?api=1&origin=${oLat},${oLng}&destination=${place.lat},${place.lng}&travelmode=driving`,
    '_blank'
  )
}

// ─── Lifecycle hooks ──────────────────────────────────────────────────────────
onMounted(async () => {
  await nextTick()
  // Show Melbourne CBD as the default map view before any search
  await initMap(-37.8136, 144.9631)
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
            <h2 class="text-2xl font-semibold text-white mb-3">Experiencing Severe Symptoms? Call 000 Immediately</h2>
            <p class="text-white/95 text-lg mb-4 leading-relaxed">
              If you or someone you know is experiencing severe headache, vomiting, seizures, loss of
              consciousness, slurred speech, or unusual behaviour — call 000 or go to the nearest
              emergency department immediately.
            </p>
            <a href="tel:000">
              <button class="inline-flex items-center gap-2 bg-white text-[#ff3b30] hover:bg-white/90
                             px-10 py-4 text-lg rounded-full font-semibold shadow-lg transition-all hover:scale-105">
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
          <!-- Text input + autocomplete dropdown -->
          <div class="flex-1 relative">
            <input
              type="text"
              placeholder="Enter your suburb or postcode..."
              v-model="userInput"
              @keyup="fetchPredictions"
              class="w-full bg-white border-2 border-[#d2d2d7] rounded-2xl px-6 py-4 text-[#1d1d1f] text-lg
                     focus:outline-none focus:border-[#007aff] transition-colors"
            />
            <ul
              v-if="fetchedPredictions"
              class="absolute top-full left-0 z-50 min-w-full lg:min-w-[600px] max-h-[200px]
                     shadow-2xl bg-white rounded-2xl mt-1 overflow-y-auto border border-[#d2d2d7]"
            >
              <li
                v-for="prediction in fetchedPredictions"
                :key="prediction.description"
                @click="finalizePrediction(prediction?.description)"
                class="px-6 py-3 border-b border-[#f0f0f0] hover:bg-[#f5f5f7] cursor-pointer text-[#1d1d1f]"
              >
                {{ prediction?.description }}
              </li>
            </ul>
          </div>

          <!-- Use My Location button -->
          <button
            @click="getUserCurrentLocation"
            :disabled="buttonsDisabled.useMyLocation"
            class="inline-flex items-center justify-center gap-2 bg-[#007aff] hover:bg-[#0051d5] text-white
                   px-8 py-4 rounded-2xl font-semibold whitespace-nowrap transition-all
                   disabled:opacity-50 disabled:pointer-events-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {{ buttonsDisabled.useMyLocation ? 'Locating...' : 'Use My Location' }}
          </button>
        </div>

        <!-- Map legend — only shown once results are loaded -->
        <div v-if="liveSuggestions" class="flex flex-wrap gap-4 mt-6 pt-6 border-t border-[#d2d2d7]/50">
          <div
            v-for="(color, type) in { 'GP': '#007aff', 'Sports Medicine': '#34c759', 'Hospital': '#ff3b30', 'Physiotherapy': '#ff9500' }"
            :key="type"
            class="flex items-center gap-2"
          >
            <div class="w-3 h-3 rounded-full" :style="{ background: color }"/>
            <span class="text-sm text-[#86868b] font-medium">{{ type }}</span>
          </div>
        </div>
      </div>

      <!-- Map + results side by side -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <!-- ── Map panel ──────────────────────────────────────────────────── -->
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
              {{ liveSuggestions ? `${liveSuggestions.length} locations found` : 'Melbourne, VIC' }}
            </span>
          </div>
          <!-- Map canvas -->
          <div ref="mapDiv" style="width:100%;height:580px;" />
        </div>

        <!-- ── Results list ────────────────────────────────────────────────── -->
        <!--
          FIX: overflow-x-visible + px-2 py-2 gives the border room so
          the 2px selected border isn't clipped by the scroll container.
        -->
        <div class="max-h-[640px] overflow-y-auto overflow-x-visible px-2 py-2">
          <div class="space-y-2">

            <!-- Skeleton placeholders while loading -->
            <div v-if="suggestionsLoading" class="flex flex-col space-y-2">
              <SuggestionCardSkeleton/>
              <SuggestionCardSkeleton/>
              <SuggestionCardSkeleton/>
            </div>

            <!-- Actual result cards -->
            <template v-else-if="liveSuggestions">
              <div
                v-for="(suggestion, index) in liveSuggestions"
                :key="suggestion.name"
                :id="`suggestion-card-${index}`"
                class="rounded-2xl transition-all duration-200 cursor-pointer bg-white"
                :class="selectedSuggestionIndex === index
                  ? 'border-2 border-[#007aff] shadow-lg shadow-blue-500/20 scale-[1.01]'
                  : 'border border-[#e5e7eb] hover:border-[#c7c7cc] hover:shadow-sm'"
                @click="handleCardClick(index)"
              >
                <div class="relative">
                  <!-- Numbered badge — blue when selected, grey otherwise -->
                  <div
                    class="absolute top-3 right-3 z-10 w-6 h-6 rounded-full flex items-center
                           justify-center text-xs font-bold text-white shadow-sm transition-colors duration-200"
                    :style="{ background: selectedSuggestionIndex === index ? '#007aff' : '#9ca3af' }"
                  >
                    {{ index + 1 }}
                  </div>

                  <SuggestionCard
                    :location-type="suggestion.locationType"
                    :is-open="suggestion.isOpen"
                    :name="suggestion.name"
                    :address="suggestion.address"
                    :contact="suggestion.phoneNo"
                    :distance="suggestion.distance"
                    @get-directions="() => handleRoute(suggestion, index)"
                  />
                </div>
              </div>
            </template>

            <!-- Empty / error state -->
            <div v-else class="h-full flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div v-if="errorsChest?.error" class="flex flex-col items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" x2="12" y1="8" y2="12"/>
                  <line x1="12" x2="12.01" y1="16" y2="16"/>
                </svg>
                <span class="text-red-500 font-medium text-sm max-w-xs">{{ errorsChest.error }}</span>
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

      <!-- Healthdirect footer banner -->
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
/* ── Mapbox popup: transparent wrapper so our custom HTML shows cleanly ── */
.concovery-popup .mapboxgl-popup-content {
  background: transparent !important;
  padding: 0 !important;
  box-shadow: none !important;
}
.concovery-popup .mapboxgl-popup-tip { display: none !important; }
.mapboxgl-ctrl-logo { display: none !important; }

/* ── Map pin marker animations ─────────────────────────────────────────── */
.map-pin {
  width: 36px;
  height: 44px;
  cursor: pointer;
  transform-origin: bottom center;
  transition: transform 0.15s ease;
}

.map-pin:hover {
  transform: scale(1.25);
}

/* Scale up + brighten when the matching card is selected */
.map-pin.pin-selected {
  transform: scale(1.3);
  filter: drop-shadow(0 4px 8px rgba(0, 122, 255, 0.5)) !important;
}
</style>
