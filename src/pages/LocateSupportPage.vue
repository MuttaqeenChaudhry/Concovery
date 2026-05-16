<script setup>
import SuggestionCard from '@/components/custom-components/SuggestionCard.vue'
import SuggestionCardSkeleton from '@/components/custom-components/SuggestionCardSkeleton.vue'
import BlurReveal from '@/components/ui/blur-reveal/BlurReveal.vue'
import { locateAddress } from '@/services/googleLocation'
import axios from 'axios'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const GoogleApiKey  = import.meta.env.VITE_GOOGLE_API_KEY
const MapboxToken   = import.meta.env.VITE_MAPBOX_TOKEN
mapboxgl.accessToken = MapboxToken

// ─── state ────────────────────────────────────────────────────────────────────
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

// ─── mapbox internals ─────────────────────────────────────────────────────────
let map       = null
let markers   = []
let userDot   = null

// ─── init map ────────────────────────────────────────────────────────────────
const initMap = async (lat, lng) => {
  await nextTick()
  if (!mapDiv.value) return

  if (map) {
    map.flyTo({ center: [lng, lat], zoom: 14, speed: 1.4 })
    return
  }

  map = new mapboxgl.Map({
    container:  mapDiv.value,
    style:      'mapbox://styles/mapbox/dark-v11',
    center:     [lng, lat],
    zoom:       14,
    pitch:      30,
    bearing:    0,
  })

  map.addControl(new mapboxgl.NavigationControl(), 'top-right')
  map.addControl(new mapboxgl.ScaleControl(), 'bottom-left')

  // Pulsing user location dot
  const size = 120
  const pulsingDot = {
    width: size, height: size, data: new Uint8Array(size * size * 4),
    onAdd() {
      const canvas    = document.createElement('canvas')
      canvas.width    = this.width
      canvas.height   = this.height
      this.context    = canvas.getContext('2d')
    },
    render() {
      const duration = 1200
      const t        = (performance.now() % duration) / duration
      const radius   = (size / 2) * 0.3
      const outerR   = radius * (1 + t * 1.4)
      const ctx      = this.context
      ctx.clearRect(0, 0, this.width, this.height)
      ctx.beginPath()
      ctx.arc(this.width / 2, this.height / 2, outerR, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0, 122, 255, ${0.4 * (1 - t)})`
      ctx.fill()
      ctx.beginPath()
      ctx.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0, 122, 255, 1)'
      ctx.strokeStyle = 'white'
      ctx.lineWidth   = 3 + 4 * (1 - t)
      ctx.fill()
      ctx.stroke()
      this.data = ctx.getImageData(0, 0, this.width, this.height).data
      map.triggerRepaint()
      return true
    }
  }

  map.on('load', () => {
    map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 })
    map.addSource('user-location', {
      type: 'geojson',
      data: { type: 'Feature', geometry: { type: 'Point', coordinates: [lng, lat] } }
    })
    map.addLayer({
      id:     'user-location-layer',
      type:   'symbol',
      source: 'user-location',
      layout: { 'icon-image': 'pulsing-dot', 'icon-allow-overlap': true }
    })
  })
}

// ─── render numbered pins ─────────────────────────────────────────────────────
const renderMarkers = () => {
  markers.forEach(({ marker, popup }) => { popup.remove(); marker.remove() })
  markers = []
  if (!liveSuggestions.value || !map) return

  const colors = {
    'GP':             '#007aff',
    'Sports Medicine':'#34c759',
    'Hospital':       '#ff3b30',
    'Physiotherapy':  '#ff9500',
  }

  liveSuggestions.value.forEach((s, i) => {
    const color = colors[s.locationType] || '#007aff'

    // Custom HTML marker
    const el         = document.createElement('div')
    el.style.cssText = `
      width: 36px; height: 44px; cursor: pointer; position: relative;
      transition: transform 0.2s ease;
    `
    el.innerHTML = `
      <svg width="36" height="44" viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg">
        <filter id="shadow-${i}">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.4)"/>
        </filter>
        <path d="M18 0C8.06 0 0 8.06 0 18c0 12 18 26 18 26S36 30 36 18C36 8.06 27.94 0 18 0z"
          fill="${color}" filter="url(#shadow-${i})"/>
        <circle cx="18" cy="18" r="11" fill="white" opacity="0.25"/>
        <text x="18" y="23" text-anchor="middle" fill="white"
          font-family="system-ui,-apple-system,sans-serif"
          font-size="13" font-weight="700">${i + 1}</text>
      </svg>
    `

    el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.2) translateY(-4px)' })
    el.addEventListener('mouseleave', () => {
      el.style.transform = selectedSuggestionIndex.value === i
        ? 'scale(1.2) translateY(-4px)'
        : 'scale(1) translateY(0)'
    })
    el.addEventListener('click', () => {
      selectedSuggestionIndex.value = i
      updateMarkerStyles()
      nextTick(() => {
        const card = document.getElementById(`suggestion-card-${i}`)
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
      map.flyTo({ center: [parseFloat(s.lng), parseFloat(s.lat)], zoom: 15, speed: 1.2 })
    })

    // Hover popup
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset:      [0, -44],
      className:   'concovery-popup',
    }).setHTML(`
      <div style="
        background: #1c1c1e;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
        padding: 12px 16px;
        min-width: 200px;
      ">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <span style="
            background: ${color};
            color: white;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 20px;
            letter-spacing: 0.5px;
          ">${s.locationType || 'CLINIC'}</span>
          <span style="color:${s.isOpen ? '#34c759' : '#ff3b30'};font-size:11px;font-weight:600;">
            ${s.isOpen ? '● Open' : '● Closed'}
          </span>
        </div>
        <div style="color:white;font-weight:600;font-size:13px;margin-bottom:4px;">${s.name}</div>
        <div style="color:rgba(255,255,255,0.5);font-size:11px;">${s.distance || ''}</div>
      </div>
    `)

    el.addEventListener('mouseenter', () => popup.addTo(map))
    el.addEventListener('mouseleave', () => {
      if (selectedSuggestionIndex.value !== i) popup.remove()
    })

    const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([parseFloat(s.lng), parseFloat(s.lat)])
      .addTo(map)

    markers.push({ marker, popup, el })
  })

  // Fit map to show all markers
  if (markers.length > 0 && originLocation.value) {
    const bounds = new mapboxgl.LngLatBounds()
    bounds.extend([parseFloat(originLocation.value.lng), parseFloat(originLocation.value.lat)])
    liveSuggestions.value.forEach(s => bounds.extend([parseFloat(s.lng), parseFloat(s.lat)]))
    map.fitBounds(bounds, { padding: 80, maxZoom: 15, duration: 1000 })
  }
}

const updateMarkerStyles = () => {
  markers.forEach(({ el, popup }, i) => {
    if (selectedSuggestionIndex.value === i) {
      el.style.transform = 'scale(1.2) translateY(-4px)'
      el.style.zIndex    = '10'
      popup.addTo(map)
    } else {
      el.style.transform = 'scale(1) translateY(0)'
      el.style.zIndex    = '1'
      popup.remove()
    }
  })
}

// ─── search predictions ───────────────────────────────────────────────────────
const fetchPredictions = async () => {
  if (!userInput.value) { fetchedPredictions.value = null; return }
  try {
    const res = await axios.get(
      `https://site--concovery-backend--gvxxw7q2vn57.code.run/google/fetchPredictions?address=${userInput.value}`
    )
    fetchedPredictions.value = res.status === 200
      ? (res?.data?.predictions?.predictions ?? null)
      : null
  } catch (e) { console.error('fetchPredictions', e) }
}

const finalizePrediction = async (inputLocation) => {
  suggestionsLoading.value = true
  selectedLocation.value   = inputLocation
  userInput.value          = inputLocation
  fetchedPredictions.value = null
  try {
    const geo            = await locateAddress(GoogleApiKey, selectedLocation.value)
    originLocation.value = geo
    await fetchLiveSuggestions(geo)
    await initMap(geo.lat, geo.lng)
  } catch (e) {
    errorsChest.value = { ...errorsChest.value, error: 'Unable to retrieve suggestions, try again' }
  } finally {
    suggestionsLoading.value = false
  }
}

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
    if (features?.length) return features[0].place_name
    return 'Your location'
  } catch (e) {
    return 'Your location'
  }
}

const fetchLiveSuggestions = async (userLocation) => {
  suggestionsLoading.value = true
  try {
    const res = await axios.get(
      `https://site--concovery-backend--gvxxw7q2vn57.code.run/google/nearbyplaces?lat=${userLocation.lat}&lng=${userLocation.lng}`
    )
    if (res?.status === 200) {
      liveSuggestions.value = res.data.nearbyplaces
      await nextTick()
      renderMarkers()
    }
  } catch (e) {
    console.error('fetchLiveSuggestions', e)
  } finally {
    suggestionsLoading.value = false
  }
}

const getUserCurrentLocation = async () => {
  buttonsDisabled.value.useMyLocation = true
  try {
    originLocation.value = await getGeoLocation()
    if (originLocation.value) {
      const { lat, lng } = originLocation.value
      userInput.value        = await reverseGeocode(lat, lng)
      selectedLocation.value = userInput.value
      await initMap(lat, lng)
      await fetchLiveSuggestions(originLocation.value)
    }
  } catch (e) {
    console.error('getUserCurrentLocation', e)
  } finally {
    suggestionsLoading.value            = false
    buttonsDisabled.value.useMyLocation = false
  }
}

// Clicking a card highlights its pin and flies to it
const handleCardClick = (index) => {
  selectedSuggestionIndex.value = index
  updateMarkerStyles()
  const s = liveSuggestions.value[index]
  if (map && s) map.flyTo({ center: [parseFloat(s.lng), parseFloat(s.lat)], zoom: 15, speed: 1.2 })
}

// Get directions opens Google Maps in a new tab
const handleRoute = (suggestionObject, index) => {
  selectedSuggestionIndex.value = index
  updateMarkerStyles()
  if (!originLocation.value) return
  const { lat: oLat, lng: oLng } = originLocation.value
  const dLat = suggestionObject.lat
  const dLng = suggestionObject.lng
  window.open(
    `https://www.google.com/maps/dir/?api=1&origin=${oLat},${oLng}&destination=${dLat},${dLng}&travelmode=driving`,
    '_blank'
  )
}

// Initialize map on mount with Melbourne as default center
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
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20">

      <!-- Header -->
      <div class="text-center mb-12">
        <BlurReveal :delay="0.2" :duration="0.75">
          <h1 class="text-5xl sm:text-7xl font-semibold text-[#1d1d1f] mb-6 tracking-tight">Find Medical Support</h1>
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
              <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-semibold text-white mb-3">Experiencing Severe Symptoms? Call 000 Immediately</h2>
            <p class="text-white/95 text-lg mb-4 leading-relaxed">
              If you or someone you know is experiencing severe headache, vomiting, seizures, loss of consciousness,
              slurred speech, or unusual behavior — call 000 or go to the nearest emergency department immediately.
            </p>
            <a href="tel:000">
              <button class="inline-flex items-center gap-2 bg-white text-[#ff3b30] hover:bg-white/90 px-10 py-4 text-lg rounded-full font-semibold shadow-lg transition-all hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
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
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
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
              class="w-full bg-white border-2 border-[#d2d2d7] rounded-2xl px-6 py-4 text-[#1d1d1f] text-lg focus:outline-none focus:border-[#007aff] transition-colors"
            />
            <ul v-if="fetchedPredictions"
              class="absolute top-full left-0 z-50 min-w-full lg:min-w-[600px] max-h-[200px] shadow-2xl bg-white rounded-2xl mt-1 overflow-y-auto border border-[#d2d2d7]">
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
            class="inline-flex items-center justify-center gap-2 bg-[#007aff] hover:bg-[#0051d5] text-white px-8 py-4 rounded-2xl font-semibold whitespace-nowrap transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {{ buttonsDisabled.useMyLocation ? 'Locating...' : 'Use My Location' }}
          </button>
        </div>

        <!-- Legend -->
        <div v-if="liveSuggestions" class="flex flex-wrap gap-4 mt-6 pt-6 border-t border-[#d2d2d7]/50">
          <div v-for="(color, type) in { 'GP': '#007aff', 'Sports Medicine': '#34c759', 'Hospital': '#ff3b30', 'Physiotherapy': '#ff9500' }"
            :key="type" class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" :style="{ background: color }"/>
            <span class="text-sm text-[#86868b] font-medium">{{ type }}</span>
          </div>
        </div>
      </div>

      <!-- Map + suggestions grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <!-- Map panel -->
        <div class="bg-[#1c1c1e] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          <div class="bg-[#2c2c2e] px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#007aff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Nearby Providers
            </h3>
            <span v-if="liveSuggestions" class="text-xs text-white/40 font-medium">
              {{ liveSuggestions.length }} locations found
            </span>
          </div>

          <div style="height: 580px; position: relative;">

            <!-- Mapbox container — always mounted -->
            <div ref="mapDiv" style="width:100%;height:100%;" />

            <!-- Placeholder overlay before location -->
            <div v-if="!originLocation"
              class="absolute inset-0 flex flex-col items-center justify-center gap-4"
              style="background: #1c1c1e;">
              <div style="
                width: 80px; height: 80px; border-radius: 50%;
                background: rgba(0,122,255,0.15);
                display: flex; align-items: center; justify-content: center;
              ">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
                  stroke="#007aff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <p class="text-white/40 text-base font-medium text-center px-8">
                Enter a location or use My Location<br>to see nearby providers on the map
              </p>
            </div>

          </div>
        </div>

        <!-- Suggestions list -->
        <div class="space-y-3 max-h-[680px] overflow-y-auto pr-2">

          <div v-if="suggestionsLoading" class="flex flex-col space-y-3">
            <SuggestionCardSkeleton/>
            <SuggestionCardSkeleton/>
            <SuggestionCardSkeleton/>
          </div>

          <div v-else-if="liveSuggestions">
            <div
              v-for="(suggestion, index) in liveSuggestions"
              :key="suggestion.name"
              :id="`suggestion-card-${index}`"
              class="rounded-3xl transition-all duration-200 cursor-pointer mb-3"
              :class="selectedSuggestionIndex === index
                ? 'ring-2 ring-[#007aff] ring-offset-2 shadow-lg shadow-blue-500/20 scale-[1.01]'
                : 'ring-1 ring-transparent hover:ring-[#d2d2d7]'"
              @click="handleCardClick(index)"
            >
              <!-- Index badge -->
              <div class="relative">
                <div class="absolute top-4 right-4 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  :style="{ background: selectedSuggestionIndex === index ? '#007aff' : '#86868b' }">
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
          </div>

          <div v-else class="h-full flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div v-if="errorsChest?.error" class="flex flex-col items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500">
                <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
              </svg>
              <span class="text-red-500 font-medium">{{ errorsChest.error }}</span>
              <span class="text-[#86868b] text-sm">Location permission required, please try again</span>
            </div>
            <div v-else class="text-[#86868b]">
              <p class="font-medium">Enter a suburb or use your location to find nearby support</p>
            </div>
          </div>

        </div>
      </div>

      <!-- Healthdirect footer -->
      <div class="mt-12 bg-gradient-to-br from-[#007aff]/10 to-[#5ac8fa]/10 rounded-3xl p-8 border border-[#007aff]/30">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div class="flex-1 text-center sm:text-left">
            <h3 class="text-2xl font-semibold text-[#1d1d1f] mb-3">Can't Find Nearby Support?</h3>
            <p class="text-[#86868b] text-lg">Call Healthdirect for 24/7 health advice and help finding local services</p>
          </div>
          <a href="tel:1800022222">
            <button class="inline-flex items-center gap-2 bg-[#007aff] hover:bg-[#0051d5] text-white px-10 py-4 text-lg rounded-full font-semibold shadow-lg shadow-blue-500/25 transition-all hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
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
/* Mapbox popup dark theme */
.concovery-popup .mapboxgl-popup-content {
  background: transparent !important;
  padding: 0 !important;
  box-shadow: none !important;
}
.concovery-popup .mapboxgl-popup-tip {
  display: none !important;
}
.mapboxgl-ctrl-logo { display: none !important; }
</style>
