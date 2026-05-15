<script setup>
import MapContainer from '@/components/custom-components/MapContainer.vue';
import SuggestionCard from '@/components/custom-components/SuggestionCard.vue';
import SuggestionCardSkeleton from '@/components/custom-components/SuggestionCardSkeleton.vue';
import BlurReveal from '@/components/ui/blur-reveal/BlurReveal.vue';
import { locateAddress } from '@/services/googleLocation';
import axios from 'axios';
import { ref } from 'vue';
const GoogleApiKey = import.meta.env.VITE_GOOGLE_API_KEY


const userInput = ref("")
const fetchedPredictions = ref(null)
const selectedLocation = ref(null)
const liveSuggestions = ref(null)
const suggestionsLoading = ref(false)
const errorsChest = ref({
})
const buttonsDisabled = ref({
    useMyLocation: false
})
const showRoute = ref(false)
const originLocation = ref(null)
const destinationLocation = ref(null)

const fetchPredictions = async () => {
    console.log("Fetch predications called :)")
    try {
        const response = await axios.get(`https://site--concovery-backend--gvxxw7q2vn57.code.run/google/fetchPredictions?address=${userInput.value}`)
        console.log("Response is: ", response)
        if (response.status == 200) {
            fetchedPredictions.value = response?.data?.predictions?.predictions ?? null
        } else {
            fetchedPredictions.value = null
        }
    } catch (error) {
        console.log("Error caught in fetchPredictions function  , ", error)
    }

}

const finalizePrediction = async (inputLocation) => {
    suggestionsLoading.value = true
    // User Location in string in this variable
    selectedLocation.value = inputLocation
    fetchedPredictions.value = null
    userInput.value = null
    try {
        const geoCodedValues = await locateAddress(GoogleApiKey, selectedLocation.value)
        originLocation.value = geoCodedValues
        await fetchLiveSuggestions(geoCodedValues)  
        suggestionsLoading.value = false
    } catch (error) {
        errorsChest.value = {
                ...errorsChest.value,
                error: "Unable to retrieve suggestions, try again"             
            }
        console.log(error)    
    } finally {
        suggestionsLoading.value = false
    }
}

const getGeoLocation = async () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            errorsChest.value = {
                ...errorsChest.value,
                error: "Geolocation is not supported by the browser"             
            }
            return reject(new Error('Geolocation is not supported by the browser'))
            
        }
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }

        navigator.geolocation.getCurrentPosition((position) => {
            errorsChest.value = {
                ...errorsChest.value,
                error: null             
            }
            resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })

        }, (error) => {
            errorsChest.value = {
                ...errorsChest.value,
                error: "Browser Geolocation error"             
            }
            reject(new Error(`Geolocation failed: ${error.message}`))
        }, options)
    })
}

const fetchLiveSuggestions = async (userLocation) => {  
    suggestionsLoading.value = true
    try {
        const response = await axios.get(`https://site--concovery-backend--gvxxw7q2vn57.code.run/google/nearbyplaces?lat=${userLocation.lat}&lng=${userLocation.lng}`)
        if(response?.status == 200) {
            liveSuggestions.value = response.data.nearbyplaces
            console.log("======================================= liveSuggestions are")
            console.log(liveSuggestions.value)
            suggestionsLoading.value = false
        }
        suggestionsLoading.value = false
        console.log("The response from backend is: ", response)   
    } catch (error) {
        suggestionsLoading.value = false
        console.log("Error occured in fetchLiveSuggestions", error)
    } finally {
        suggestionsLoading.value = false
    }
}

const getUserCurrentLocation = async () => {
    console.log("This 1 line of code was executed")
    buttonsDisabled.value.useMyLocation = true
    try {
        originLocation.value = await getGeoLocation()
        if (originLocation.value) {
            await fetchLiveSuggestions(originLocation.value)
            suggestionsLoading.value = false
            buttonsDisabled.value.useMyLocation = false
        }      
    } catch (error) {
        console.log("Error in proper getUCL function execution", error)
    }     
    suggestionsLoading.value = false
    buttonsDisabled.value.useMyLocation = false

}

const handleRoute = async (suggestionObject) => {
    destinationLocation.value = {
        ...destinationLocation.value,
        lat: suggestionObject.lat,
        lng: suggestionObject.lng
    }
    showRoute.value = true
}

</script>

<template>
    <div class="bg-white min-h-screen">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div class="text-center mb-12" style="opacity: 1; transform: none;">
                <BlurReveal :delay="0.2" :duration="0.75">
                    <h1 class="text-5xl sm:text-7xl font-semibold text-[#1d1d1f] mb-6 tracking-tight">Find Medical
                        Support</h1>
                    <p class="text-xl sm:text-2xl text-[#86868b] max-w-3xl mx-auto">Locate GPs, sports medicine clinics,
                        and hospitals near you for concussion
                        assessment and care.
                    </p>
                </BlurReveal>
            </div>
            <div class="bg-gradient-to-br from-[#ff3b30] to-[#ff2d55] rounded-3xl p-8 mb-12 shadow-2xl shadow-red-500/20"
                style="opacity: 1; transform: none;">
                <div class="flex items-start gap-4">
                    <div class="bg-white rounded-2xl p-4 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-circle-alert text-[#ff3b30]"
                            data-fg-cpmp12="33.112:33.12467:/src/app/pages/MedicalSupport.tsx:154:15:4428:68:e:AlertCircle::::::fAY"
                            data-fgid-cpmp12=":rs8:">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" x2="12" y1="8" y2="12"></line>
                            <line x1="12" x2="12.01" y1="16" y2="16"></line>
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-2xl font-semibold text-white mb-3">Experiencing Severe Symptoms? Call 000
                            Immediately</h2>
                        <p class="text-white/95 text-lg mb-4 leading-relaxed">If you or someone you know is experiencing
                            severe headache,
                            vomiting, seizures, loss of consciousness, slurred speech, or unusual behavior - call 000 or
                            go to the nearest emergency department immediately.
                        </p>
                        <a href="#">
                            <button data-slot="button"
                                class="inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-10 has-[&gt;svg]:px-4 bg-white text-[#ff3b30] hover:bg-white/90 px-10 py-6 text-lg rounded-full font-semibold shadow-lg transition-all hover:scale-105">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="lucide lucide-phone mr-2"
                                    data-fg-cpmp20="33.112:33.12467:/src/app/pages/MedicalSupport.tsx:169:19:5301:36:e:Phone::::::DmpI"
                                    data-fgid-cpmp20=":rsf:">
                                    <path
                                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                                    </path>
                                </svg>Call 000</button></a>
                    </div>
                </div>
            </div>
            <div class="bg-[#f5f5f7] rounded-3xl p-8 mb-12 shadow-lg" style="opacity: 1; transform: none;">
                <div class="flex items-center gap-3 mb-6">
                    <div class="bg-[#007aff] rounded-2xl p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-search text-white"
                            data-fg-cpmp26="33.112:33.12467:/src/app/pages/MedicalSupport.tsx:186:15:5848:59:e:Search::::::B9rK"
                            data-fgid-cpmp26=":rsj:">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </svg>
                    </div>
                    <h2 class="text-2xl font-semibold text-[#1d1d1f]">Find Nearby Support</h2>
                </div>
                <div class="flex flex-col sm:flex-row gap-4">
                    <div class="flex-1">
                        <input type="text"
                            :placeholder="selectedLocation ? selectedLocation : 'Enter your suburb or postcode...'"
                            v-model="userInput" @keyup="() => fetchPredictions()"
                            class="w-full bg-white border-2 border-[#d2d2d7] rounded-2xl px-6 py-4 text-[#1d1d1f] text-lg focus:outline-none focus:border-[#007aff] transition-colors"
                            value="">
                        <div v-if="fetchedPredictions" class="relative">
                            <ul
                                class="absolute top-0 z-2! min-w-[300px] lg:min-w-[600px] h-[200px] shadow-2xl p-6 bg-white overflow-y-auto">
                                <li @click="finalizePrediction(prediction?.description)"
                                    v-for="prediction in fetchedPredictions" :key="prediction.description"
                                    class="pt-2 pb-4 border-b-1 hover:bg-gray-100">{{ prediction?.description }}</li>
                            </ul>

                        </div>
                    </div>
                    <button @click="getUserCurrentLocation" :disabled="buttonsDisabled.useMyLocation"
                        class="inline-flex items-center justify-center gap-2 text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-10 has-[&gt;svg]:px-4 bg-[#007aff] hover:bg-[#0051d5] text-white px-8 py-4 rounded-2xl font-semibold whitespace-nowrap">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-map-pin mr-2">
                            <path
                                d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0">
                            </path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>Use My Location</button>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/5 border border-[#d2d2d7]/50"
                    style="opacity: 1; transform: none;">
                    <div class="bg-[#f5f5f7] p-6 border-b border-[#d2d2d7]/50">
                        <h3 class="text-xl font-semibold text-[#1d1d1f] flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-map-pin text-[#007aff]">
                                <path
                                    d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0">
                                </path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>Nearby Providers
                        </h3>
                    </div>
                    <!-- Google Maps Container Display -->
                    <div class="aspect-square bg-[#f5f5f7] relative">
                        <!-- Map Container to be displayed here -->
                        <div v-if="showRoute" class="h-[710px]! w-full overflow-hidden">
                            <MapContainer :api-key="GoogleApiKey" :origin-location="originLocation" :destination-location="destinationLocation" />
                        </div>
                        <div v-else class="flex items-center justify-center w-full h-full">
                            <h3>Please specify location and select the suggestion for shortest route</h3>
                        </div>
                        <!-- <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50425.66790326109!2d144.96798427832033!3d-37.71840799999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad6475a896b1e8b%3A0x5045675218ce7e0!2sReservoir%20VIC%203073!5e0!3m2!1sen!2sau!4v1234567890"
                            width="100%" height="100%" allowfullscreen="" loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade" title="Map of medical providers near Reservoir"
                            data-fg-cpmp45="33.112:33.12467:/src/app/pages/MedicalSupport.tsx:229:15:7816:589:e:iframe"
                            data-fgid-cpmp45=":rt1:" style="border: 0px;">
                        </iframe> -->
                    </div>
                </div>
                <div class="space-y-4 max-h-[600px] overflow-y-auto pr-2" style="opacity: 1; transform: none;">
                    <div v-if="liveSuggestions">
                         <SuggestionCard v-for="suggestion in liveSuggestions"
                     :location-type="suggestion.locationType" :is-open="suggestion.isOpen" :name="suggestion.name" :address="suggestion.address" :contact="suggestion.phoneNo" :distance="suggestion.distance" @get-directions="() => handleRoute(suggestion)"/>
                    </div>
                    <div v-if="!liveSuggestions & !suggestionsLoading" class="h-full">
                        <span class="text-xl font-bold">Live Suggestions</span>
                        <div class="flex flex-col items-center justify-center h-full" v-if="errorsChest?.error">
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-circle-alert text-red-600"
                            data-fg-bb446="33.56:33.1862:/src/app/components/Footer.tsx:11:15:484:68:e:AlertCircle::::::fAY"
                            data-fgid-bb446=":r7m:">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" x2="12" y1="8" y2="12"></line>
                            <line x1="12" x2="12.01" y1="16" y2="16"></line>
                                </svg>
                                <span>&nbsp; {{ errorsChest.error }}</span>
                            </div>
                            <div>
                                <span>Location permission required, pls try again</span>
                            </div>
                            
                        </div>
                    </div>
                    <div class="flex flex-col space-y-2" v-if="suggestionsLoading">
                        <SuggestionCardSkeleton/>
                        <SuggestionCardSkeleton/>
                    </div>
                    <!-- <SuggestionCard
                     location-type="GP" distance="1.2 km away" name="Reservoir Medical Clinic" address="123 Broadway, Reservoir VIC 3073" contact="(03) 9462 1234" timing="Mon-Fri 8am-6pm, Sat 9am-1pm"/>
                     <SuggestionCard
                     location-type="Sports Medicine" distance="3.8 km away" name="Reservoir Medical Clinic 2" address="123 Broadway, Reservoir VIC 3073" contact="(03) 9462 1234" timing="Mon-Fri 8am-6pm, Sat 9am-1pm"/>
                     <SuggestionCard
                     location-type="Sports Medicine" distance="3.8 km away" name="Reservoir Medical Clinic 3" address="123 Broadway, Reservoir VIC 3073" contact="(03) 9462 1234" timing="Mon-Fri 8am-6pm, Sat 9am-1pm"/> -->
                </div>
            </div>
            <div class="mt-12 bg-linear-to-br from-[#007aff]/10 to-[#5ac8fa]/10 rounded-3xl p-8 border border-[#007aff]/30"
                style="opacity: 1; transform: none;">
                <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div class="flex-1 text-center sm:text-left">
                        <h3 class="text-2xl font-semibold text-[#1d1d1f] mb-3">
                            Can't Find Nearby Support?
                        </h3>
                        <p class="text-[#86868b] text-lg">
                            Call Healthdirect for 24/7 health advice and help finding local
                            services
                        </p>
                    </div>
                    <a href="#">
                        <button data-slot="button"
                            class="inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-10 has-[&gt;svg]:px-4 bg-[#007aff] hover:bg-[#0051d5] text-white px-10 py-6 text-lg rounded-full font-semibold shadow-lg shadow-blue-500/25 transition-all hover:scale-105">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-phone mr-2">
                                <path
                                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                                </path>
                            </svg>
                            Call 1800 022 222
                        </button>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>