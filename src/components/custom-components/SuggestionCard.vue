<script setup>
const props = defineProps({
    locationType: String,
    isOpen: String,
    name: String,
    address: String,
    contact: String,
    distance: String
})

const isOpenFormatter = (input) => {
    console.log("The input was", input)
    if(input == false) {
        return 'Closed'
    }
    else if(input == true) {
        return 'Open'
    }
    else return "Call to verify timings"
}

</script>

<template>
    <div class="bg-white rounded-2xl p-6 shadow-lg shadow-black/5 border border-[#d2d2d7]/50 hover:shadow-xl transition-all"
        style="opacity: 1; transform: none;">
        <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold border bg-[#34c759]/10 text-[#34c759] border-[#34c759]/30">
                        {{ locationType }}
                    </span>
                    <span class="text-[#86868b] text-sm font-medium">
                        {{ `${distance} km away` }}
                    </span>
                </div>
                <h4 class="text-xl font-semibold text-[#1d1d1f] mb-2">
                    {{ name }}
                </h4>
            </div>
        </div>
        <div class="space-y-3 mb-4">
            <div class="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-map-pin text-[#007aff] flex-shrink-0 mt-0.5">
                    <path
                        d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0">
                    </path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span class="text-[#1d1d1f]">{{ address }}</span>
            </div>
            <div class="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-phone text-[#34c759] flex-shrink-0 mt-0.5">
                    <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                    </path>
                </svg>
                <a href="tel:(03) 9462 1234" class="text-[#007aff] hover:underline">
                    {{ contact }}
                </a>
            </div>
            <div class="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-clock text-[#ff9500] flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span class="text-[#1d1d1f]">
                    {{ isOpenFormatter(isOpen) }}
                </span>
            </div>
        </div>
        <button data-slot="button" @click="$emit('get-directions')"
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 px-4 has-[&gt;svg]:px-3 w-full bg-[#007aff] hover:bg-[#0051d5] text-white py-3 rounded-xl font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-navigation mr-2">
                <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
            Get Directions
        </button>
    </div>

</template>

<style scoped></style>