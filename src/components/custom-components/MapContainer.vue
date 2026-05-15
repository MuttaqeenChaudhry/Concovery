<script setup>
import { onMounted, ref, watch } from 'vue';
const locationError = ref(null)
const mapCenter = ref({
    lat: 46.8182,
    lng: 8.2275
})
const zoom = ref(12)
const routePath = ref([])
import axios from 'axios'


const props = defineProps({
    apiKey: {
        type: String,
        default: () => ''
    },
    originLocation: {
        type: Object,
        default: () => ({lat: 0, lng: 0})   
    },
    destinationLocation: {
        type: Object,
        default: () => ({lat: 0, lng: 0})   
    }
})

watch(() => props.destinationLocation, async (newVal) => {
    if (!newVal || !newVal.lat) return
    console.log("Destination changed:", newVal)
    await getRoute(newVal)
    mapCenter.value = newVal
    zoom.value = 15
}, {deep: true} )

const getRoute = async (destination) => {
    if (!destination || !props.apiKey) return
    try {
        const response = await axios.get(`https://site--concovery-backend--gvxxw7q2vn57.code.run/google/fetchRoute?userLat=${props.originLocation.lat}&userLng=${props.originLocation.lng}&destLat=${destination.lat}&destLng=${destination.lng}`)
        if(response.status == 200) {
            console.log("Route response is", response)
            routePath.value = response?.data?.routePath ?? null
            console.log(routePath.value)
        } else {
            console.log("Route response is", response)
            routePath.value = null
        }
    } catch (error) {
        console.log("Route response is, error", error)
        routePath.value = null      
    }
}

onMounted(async () => {
    try {
       await getRoute(props.destinationLocation)
       mapCenter.value = props.destinationLocation
       zoom.value = 15

    } catch (error) {
        console.log("Error caught in getRoute Function ", error)      
    }
})

</script>
<template>
    <div v-if="routePath.length" class="w-full! h-full!">
        <!-- <div>
            <GMapAutocomplete
             placeholder="Search for a place of interest here .."
             @place_changed="handlePlaceChanged"
             :options="{ fields: ['geometry', 'name'], strictBounds: true}"
             class="w-full h-full rounded border-b-2 p-2 cursor-pointer">
             
            </GMapAutocomplete>
        </div> -->
        <GMapMap :center="mapCenter" :zoom="zoom" map-type-id="roadmap" style="height: 666px;">
            <GMapMarker :position="mapCenter" :clickable="true"></GMapMarker>
            <GMapMarker :position="originLocation" :clickable="true" :options="{ icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'}"></GMapMarker>
            <GMapPolyline
            v-if="routePath.length"
            :path="routePath"
            :options="{
                strokeColor: '#0000FF',
                strokeOpacity: 0.8,
                strokeWeight: 4 
            }">

            </GMapPolyline>
        </GMapMap>
    </div>
    <div v-else class="h-10 flex items-center">
        <span class="flex items-center space-x-2 text-[#222633] font-bold">
            <i class="pi pi-info-circle text-red-600"></i> <span>{{ locationError }}</span>
        </span>
    </div>
   

</template>
<style scoped></style>