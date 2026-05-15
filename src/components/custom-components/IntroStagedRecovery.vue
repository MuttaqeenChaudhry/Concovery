<script setup>
const emit = defineEmits(['begin-journey'])

const handleClick = () => {
    emit('begin-journey')
}
</script>

<template>
    <div class="max-w-2xl mx-auto" style="opacity: 1; transform: none;">
        <div
            class="bg-gradient-to-br from-[#007aff]/10 to-[#5ac8fa]/10 border-2 border-[#007aff] rounded-3xl p-12 text-center shadow-xl">
            <div class="bg-white rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-circle-play text-[#007aff]">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
            </div>
            <h2 class="text-3xl font-semibold text-[#1d1d1f] mb-4">Ready to Begin?</h2>
            <p class="text-[#86868b] text-lg mb-8 leading-relaxed">This interactive guide will walk you
                through each stage of concussion recovery. You'll learn what activities are safe, what to
                avoid, and what's happening in your brain at each phase.</p>
                <button @click="() => handleClick()" data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-10 has-[&gt;svg]:px-4 bg-[#007aff] hover:bg-[#0051d5] text-white px-12 py-7 text-xl rounded-full shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 font-semibold cursor-pointer">
                    Begin Recovery Journey
                </button>
            <div class="mt-8 bg-white rounded-2xl p-6 border border-[#d2d2d7]/50">
                <div class="flex items-start gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" class="lucide lucide-triangle-alert text-[#ff9500] flex-shrink-0 mt-1">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3">
                        </path>
                        <path d="M12 9v4"></path>
                        <path d="M12 17h.01"></path>
                    </svg>
                    <p class="text-[#86868b] text-sm text-left"><strong class="text-[#1d1d1f]">Important:</strong> This
                        tool is for educational purposes
                        only. Always follow the advice of your doctor or sports physician. No data is stored
                        between sessions.</p>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped></style>