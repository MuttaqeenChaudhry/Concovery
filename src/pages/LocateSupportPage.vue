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

// ─── Mapbox internals (plain variables — not reactive) ────────────────────────
let map     = null
let markers = []  // each entry: { marker, popup, el, lngLat, spreadLngLat, color, index }

// ─── Colour per clinic type ───────────────────────────────────────────────────
const MARKER_COLORS = {
  'GP':              '#007aff',
  'Sports Medicine': '#34c759',
  'Hospital':        '#ff3b30',
  'Physiotherapy':   '#ff9500',
}

// ─── Build the SVG for a pin ──────────────────────────────────────────────────
// `active` = true → blue pin, larger size, glowing shadow
const makePinSVG = (label, color, active = false) => {
  const w  = active ? 48 : 36
  const h  = active ? 58 : 44
  const r  = active ? 14 : 10
  const fs = active ? 15 : 13
  const fill   = active ? '#007aff' : color
  const shadow = active
    ? 'drop-shadow(0 4px 12px rgba(0,122,255,0.60))'
    : 'drop-shadow(0 2px 4px rgba(0,0,0,0.30))'
  // The teardrop path scales with the pin size
  const half = w / 2
  return `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
         xmlns="http://www.w3.org/2000/svg"
         style="filter:${shadow};display:block;">
      <path d="M${half} 0C${w*0.224} 0 0 ${w*0.224} 0 ${half}
               c0 ${w*0.333} ${half} ${h-half} ${half} ${h-half}
               S${w} ${half+w*0.333} ${w} ${half} C${w} ${w*0.224} ${w*0.776} 0 ${half} 0z"
            fill="${fill}"
            ${active ? `stroke="white" stroke-width="2.5"` : ''}/>
      <circle cx="${half}" cy="${half}" r="${r}" fill="rgba(255,255,255,${active ? 0.35 : 0.25})"/>
      <text x="${half}" y="${half + fs*0.4}"
            text-anchor="middle" fill="white"
            font-family="system-ui,-apple-system,sans-serif"
            font-size="${fs}" font-weight="700">${label}</text>
    </svg>`
}

// ─── Spread markers that are geographically too close ─────────────────────────
//
// When several clinics share the same building (like 4 entries at 255 Clayton Rd)
// they all land on the exact same pixel and hide each other.
// We detect such groups and fan them out in a small circle so every pin is
// individually visible and clickable — similar to how Google Maps "spiders" pins.
//
const spreadOverlappingMarkers = () => {
  const CLUSTER_THRESHOLD = 0.0003   // degrees — ~30 metres; markers closer than this get spread
  const SPREAD_RADIUS     = 0.00045  // degrees — ~45 metres; radius of the fan-out circle

  const assigned = new Set()
  const groups   = []

  liveSuggestions.value.forEach((place, i) => {
    if (assigned.has(i)) return

    const group = [i]
    assigned.add(i)

    // Find all other markers within the threshold of this one
    liveSuggestions.value.forEach((other, j) => {
      if (i === j || assigned.has(j)) return
      const nearLat = Math.abs(parseFloat(place.lat) - parseFloat(other.lat)) < CLUSTER_THRESHOLD
      const nearLng = Math.abs(parseFloat(place.lng) - parseFloat(other.lng)) < CLUSTER_THRESHOLD
      if (nearLat && nearLng) { group.push(j); assigned.add(j) }
    })

    groups.push(group)
  })

  groups.forEach(group => {
    if (group.length === 1) return  // solo marker — nothing to spread

    // Centre of the cluster
    const centerLat = group.reduce((s, i) => s + parseFloat(liveSuggestions.value[i].lat), 0) / group.length
    const centerLng = group.reduce((s, i) => s + parseFloat(liveSuggestions.value[i].lng), 0) / group.length

    // Arrange each marker in the group evenly around the centre, starting from top
    group.forEach((placeIndex, pos) => {
      const angle  = (2 * Math.PI * pos) / group.length - Math.PI / 2
      const newLat = centerLat + SPREAD_RADIUS * Math.cos(angle)
      // Longitude degrees shrink as you move away from the equator, so compensate
      const newLng = centerLng + (SPREAD_RADIUS * Math.sin(angle)) / Math.cos(centerLat * Math.PI / 180)

      markers[placeIndex].marker.setLngLat([newLng, newLat])
      // Remember the new position so flyTo targets it correctly
      markers[placeIndex].spreadLngLat = [newLng, newLat]
    })
  })
}

// ─── Initialise (or fly) the Mapbox map ──────────────────────────────────────
const initMap = async (lat, lng) => {
  mapboxgl.accessToken = MapboxToken
  await nextTick()
  if (!mapDiv.value) return

  // Already created — just reposition
  if (map) {
    map.flyTo({ center: [lng, lat], zoom: 14, speed: 1.4 })
    map.getSource('user-location')?.setData({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [lng, lat] },
    })
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

  // Animated pulsing dot for the user's own position
  const DOT = 120
  const pulsingDot = {
    width: DOT, height: DOT, data: new Uint8Array(DOT * DOT * 4),
    onAdd() {
      const c = document.createElement('canvas')
      c.width = c.height = DOT
      this.context = c.getContext('2d')
    },
    render() {
      const t   = (performance.now() % 1200) / 1200
      const r   = (DOT / 2) * 0.3
      const ctx = this.context
      ctx.clearRect(0, 0, DOT, DOT)
      ctx.beginPath()
      ctx.arc(DOT / 2, DOT / 2, r * (1 + t * 1.4), 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0,122,255,${0.4 * (1 - t)})`
      ctx.fill()
      ctx.beginPath()
      ctx.arc(DOT / 2, DOT / 2, r, 0, Math.PI * 2)
      ctx.fillStyle   = '#007aff'
      ctx.strokeStyle = 'white'
      ctx.lineWidth   = 3
      ctx.fill()
      ctx.stroke()
      this.data = ctx.getImageData(0, 0, DOT, DOT).data
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
      id: 'user-location-layer', type: 'symbol', source: 'user-location',
      layout: { 'icon-image': 'pulsing-dot', 'icon-allow-overlap': true },
    })
    if (liveSuggestions.value?.length) renderMarkers()
  })
}

// ─── Draw all result pins on the map ─────────────────────────────────────────
const renderMarkers = () => {
  markers.forEach(({ marker, popup }) => { popup.remove(); marker.remove() })
  markers = []

  if (!map || !liveSuggestions.value?.length) return

  liveSuggestions.value.forEach((place, index) => {
    const color  = MARKER_COLORS[place.locationType] || '#007aff'
    const lngLat = [parseFloat(place.lng), parseFloat(place.lat)]

    const el = document.createElement('div')
    el.className = 'map-pin'
    el.innerHTML = makePinSVG(index + 1, color, false)

    const popup = new mapboxgl.Popup({
      closeButton:  false,
      closeOnClick: false,
      offset:       [0, -56],
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

    el.addEventListener('mouseenter', () => popup.addTo(map))
    el.addEventListener('mouseleave', () => {
      if (selectedSuggestionIndex.value !== index) popup.remove()
    })

    const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat(lngLat)
      .addTo(map)

    markers.push({ marker, popup, el, lngLat, spreadLngLat: null, color, index })
  })

  // Fan out any markers that landed on the same spot
  spreadOverlappingMarkers()

  // Fit all markers + user dot into the viewport
  if (originLocation.value) {
    const bounds = new mapboxgl.LngLatBounds()
    bounds.extend([parseFloat(originLocation.value.lng), parseFloat(originLocation.value.lat)])
    markers.forEach(({ marker }) => bounds.extend(marker.getLngLat()))
    map.fitBounds(bounds, { padding: 80, maxZoom: 15, duration: 1000 })
  }
}

// ─── Visually highlight the active marker ────────────────────────────────────
//
// Three things change for the selected pin:
//   1. Its SVG swaps to the larger blue version
//   2. Its wrapper element gets z-index 20 so it renders on top of all others
//   3. Its popup stays visible
//
const updateMarkerStyles = (activeIndex) => {
  markers.forEach(({ el, popup, color, index }) => {
    const active = index === activeIndex

    // Swap SVG inline — avoids any CSS transform / filter conflicts
    el.innerHTML = makePinSVG(index + 1, color, active)

    // The Mapbox SDK wraps `el` in an extra div — we need to set z-index on both
    el.style.zIndex = active ? '20' : '1'
    if (el.parentElement) el.parentElement.style.zIndex = active ? '20' : '1'

    if (active) popup.addTo(map)
    else popup.remove()
  })
}

// ─── Address autocomplete ─────────────────────────────────────────────────────
const fetchPredictions = async () => {
  if (!userInput.value) { fetchedPredictions.value = null; return }
  try {
    const res = await axios.get(
      `https://site--concovery-backend--gvxxw7q2vn57.code.run/google/fetchPredictions?address=${userInput.value}`
    )
    fetchedPredictions.value = res.status === 200
      ? (res?.data?.predictions?.predictions ?? null) : null
  } catch (e) { console.error('fetchPredictions:', e) }
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

// ─── Geolocation helpers ──────────────────────────────────────────────────────
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
      errorsChest.value = { ...errorsChest.value, error: reasons[err.code] || 'Location error.' }
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
  } catch { return 'Your location' }
}

// ─── Fetch nearby medical places from the backend ────────────────────────────
const fetchLiveSuggestions = async (userLocation) => {
  suggestionsLoading.value = true
  try {
    const res = await axios.get(
      `https://site--concovery-backend--gvxxw7q2vn57.code.run/google/nearbyplaces?lat=${userLocation.lat}&lng=${userLocation.lng}`
    )
    if (res?.status === 200) {
      liveSuggestions.value = res.data.nearbyplaces
      await nextTick()
      // mapboxgl.Marker is a DOM overlay — no need to wait for style.load
      if (map) {
        if (map.loaded()) renderMarkers()
        else map.once('load', renderMarkers)
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

// ─── Card click → highlight matching map pin + zoom in like Google Maps ───────
const handleCardClick = (index) => {
  selectedSuggestionIndex.value = index
  updateMarkerStyles(index)

  const m = markers[index]
  if (!map || !m) return

  // Fly to the spread position (post-fan-out) so the exact pin is centred
  const dest = m.spreadLngLat ?? m.lngLat

  // Zoom to 16 so nearby markers separate clearly; offset upward so the
  // popup is not clipped by the top edge of the map container
  map.flyTo({ center: dest, zoom: 16, speed: 1.2, offset: [0, -60] })
}

const handleRoute = (place, index) => {
  selectedSuggestionIndex.value = index
  updateMarkerStyles(index)
  if (!originLocation.value) return
  const { lat: oLat, lng: oLng } = originLocation.value
  window.open(
    `https://www.google.com/maps/dir/?api=1&origin=${oLat},${oLng}&destination=${place.lat},${place.lng}&travelmode=driving`,
    '_blank'
  )
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(async () => {
  await nextTick()
  await initMap(-37.8136, 144.9631)   // Default: Melbourne CBD
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
          <div class="flex-1 relative">
            <input
              type="text"
              placeholder="Enter your suburb or postcode..."
              v-model="userInput"
              @keyup="fetchPredictions"
              class="w-full bg-white border-2 border-[#d2d2d7] rounded-2xl px-6 py-4 text-[#1d1d1f] text-lg
                     focus:outline-none focus:border-[#007aff] transition-colors"
            />
            <ul v-if="fetchedPredictions"
              class="absolute top-full left-0 z-50 min-w-full lg:min-w-[600px] max-h-[200px]
                     shadow-2xl bg-white rounded-2xl mt-1 overflow-y-auto border border-[#d2d2d7]">
              <li
                v-for="prediction in fetchedPredictions"
                :key="prediction.description"
                @click="finalizePrediction(prediction?.description)"
                class="px-6 py-3 border-b border-[#f0f0f0] hover:bg-[#f5f5f7] cursor-pointer text-[#1d1d1f]"
              >{{ prediction?.description }}</li>
            </ul>
          </div>

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

        <!-- Legend — only shown once results are loaded -->
        <div v-if="liveSuggestions" class="flex flex-wrap gap-4 mt-6 pt-6 border-t border-[#d2d2d7]/50">
          <div
            v-for="(color, type) in { 'GP': '#007aff', 'Sports Medicine': '#34c759', 'Hospital': '#ff3b30', 'Physiotherapy': '#ff9500' }"
            :key="type" class="flex items-center gap-2"
          >
            <div class="w-3 h-3 rounded-full" :style="{ background: color }"/>
            <span class="text-sm text-[#86868b] font-medium">{{ type }}</span>
          </div>
        </div>
      </div>

      <!-- Map + results grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <!-- Map panel -->
        <div class="bg-white rounded-3xl overflow-hidden shadow-xl border border-[#e5e7eb]">
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
          <div ref="mapDiv" style="width:100%;height:580px;" />
        </div>

        <!-- Results list -->
        <!--
          overflow-x-visible so the 2px selected border is not clipped
          by the scroll container's overflow boundary.
        -->
        <div class="max-h-[640px] overflow-y-auto overflow-x-visible px-2 py-2">
          <div class="space-y-2">

            <div v-if="suggestionsLoading" class="flex flex-col space-y-2">
              <SuggestionCardSkeleton/>
              <SuggestionCardSkeleton/>
              <SuggestionCardSkeleton/>
            </div>

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
            <p class="text-[#86868b] text-lg">Call Healthdirect for 24/7 health advice and help finding local services</p>
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
/* Mapbox popup wrapper — strip default styling so our custom HTML shows cleanly */
.concovery-popup .mapboxgl-popup-content {
  background: transparent !important;
  padding: 0 !important;
  box-shadow: none !important;
}
.concovery-popup .mapboxgl-popup-tip { display: none !important; }
.mapboxgl-ctrl-logo { display: none !important; }

/* Pin base styles — size comes from the SVG inside, not the wrapper */
.map-pin {
  cursor: pointer;
  transform-origin: bottom center;
  transition: transform 0.15s ease;
}

.map-pin:hover {
  transform: scale(1.12);
}
</style>
