<script setup></script>

<template>
    <section class="relative py-28 lg:py-36 overflow-hidden" style="background: rgb(10, 10, 15);">
    <div class="absolute inset-0 pointer-events-none"
      style="background: radial-gradient(50% 60%, rgba(0, 122, 255, 0.1) 0%, transparent 70%);"></div>
    <div class="relative max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 text-center">
      <div style="opacity: 1; transform: none;">
        <h2 class="font-black tracking-tight leading-none mb-6 text-white"
          style="font-size: clamp(40px, 7vw, 100px); letter-spacing: -0.03em;">THE COMEBACK<br><span
            style="color: rgb(0, 122, 255);">STARTS HERE.</span></h2>
        <p class="text-lg mb-12 max-w-md mx-auto leading-relaxed" style="color: rgba(255, 255, 255, 0.4);">Free. No sign
          up. Built for Australian community sport players.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center"><router-link to="/exploredata" data-discover="true"><button
              class="relative bg-[#007aff] text-white px-10 py-5 text-lg rounded-full font-semibold flex items-center gap-2 shadow-2xl shadow-[#007aff]/35 overflow-hidden">
              <div class="absolute inset-0 -skew-x-12"
                style="background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent); transform: translateX(77.197%);">
              </div>Check My Sport
            </button></router-link><router-link to="/" ><button
              class="border border-white/20 text-white/70 hover:border-white/40 hover:text-white px-10 py-5 text-lg rounded-full font-semibold flex items-center gap-2 transition-all duration-300">Start
              Recovery Plan<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-arrow-right">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg></button></router-link></div>
      </div>
    </div>
  </section>
    <!-- <section class="relative py-28 lg:py-40 overflow-hidden bg-[#1d1d1f]">
        <div class="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full pointer-events-none blur-3xl"
            style="background: radial-gradient(circle, rgba(0, 122, 255, 0.15) 0%, transparent 70%); transform: translateX(19.5846px) scale(1.09792);">
        </div>
        <div class="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full pointer-events-none blur-3xl"
            style="background: radial-gradient(circle, rgba(88, 86, 214, 0.12) 0%, transparent 70%); transform: translateX(-9.39242px) scale(1.07044);">
        </div>
        <div class="relative max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 text-center">
            <div style="opacity: 1; transform: none;">
                <h2 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                    Don't let Branden<br><span class="text-[#007aff]">become a statistic.</span></h2>
                <p class="text-xl text-white/60 mb-14 max-w-2xl mx-auto leading-relaxed">Concovery is free. It takes 5
                    minutes to understand what could prevent permanent brain damage.</p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center"><a href="/science"
                        data-discover="true"><button
                            class="relative bg-[#007aff] text-white px-12 py-5 text-lg rounded-full font-semibold flex items-center gap-2 shadow-xl shadow-[#007aff]/30 hover:shadow-2xl hover:shadow-[#007aff]/40 transition-shadow duration-300 overflow-hidden"
                            tabindex="0">
                            <div class="absolute inset-0 -skew-x-12"
                                style="background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.14) 50%, transparent 100%); transform: translateX(220%);">
                            </div><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-brain">
                                <path
                                    d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z">
                                </path>
                                <path
                                    d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z">
                                </path>
                                <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path>
                                <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path>
                                <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path>
                                <path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path>
                                <path d="M19.938 10.5a4 4 0 0 1 .585.396"></path>
                                <path d="M6 18a4 4 0 0 1-1.967-.516"></path>
                                <path d="M19.967 17.484A4 4 0 0 1 18 18"></path>
                            </svg>Start with the Science
                        </button></a>
                        <router-link to="/exploredata">
                            <button
                            class="border-2 border-white/20 text-white hover:border-white/40 hover:bg-white/5 px-12 py-5 text-lg rounded-full font-semibold flex items-center gap-2 transition-all duration-300"
                            tabindex="0" style="transform: none;"><svg xmlns="http://www.w3.org/2000/svg" width="20"
                                height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-column">
                                <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                                <path d="M18 17V9"></path>
                                <path d="M13 17V5"></path>
                                <path d="M8 17v-3"></path>
                            </svg>Explore the Data
                            </button>
                        </router-link>
                    </div>
            </div>
        </div>
    </section> -->

</template>

<style scoped></style>