<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { Icon } from "@iconify/vue";
import { AnimatedBeam } from '../ui/animated-beam';

interface Props {
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

const containerRef = useTemplateRef("containerRef");
const div1Ref = useTemplateRef("div1Ref");
const div2Ref = useTemplateRef("div2Ref");
const div3Ref = useTemplateRef("div3Ref");
const div4Ref = useTemplateRef("div4Ref");
const div5Ref = useTemplateRef("div5Ref");
const div6Ref = useTemplateRef("div6Ref");
const div7Ref = useTemplateRef("div7Ref");
const ParietalRef = useTemplateRef("ParietalRef")
const OcipitalRef = useTemplateRef("OcipitalRef")
const Cerebellum = useTemplateRef("Cerebellum")
const Brainstem = useTemplateRef("Brainstem")


</script>

<template>
  <div ref="containerRef"
    class="bg-transparent relative gap-y-2 flex h-auto lg:h-[600px] items-center justify-center overflow-hidden rounded-lg p-10">
    <!-- Actual Brain and Region Icons -->
    <div class="flex size-full max-h-[600px] max-w-lg flex-col items-stretch justify-between gap-10 pb-5">
      <div class="flex flex-row items-center justify-between">
        <!-- Parietal Lobe -->
        <div ref="div1Ref"
          class="relative cursor-crosshair z-3 flex size-12 items-center justify-center rounded-full border-2 bg-yellow-500 p-2 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:text-black group">
          <div class="absolute cardAnimation bg-yellow-200 hidden top-0 left-0 w-[200px] border-2 rounded-md border-l-yellow-500 border-t-0 border-b-0 border-r-0 p-2 shadow-xl group-hover:flex flex-col space-y-1">
            <div>
              <span class="text-yellow-500 font-bold">Paritel Lobe</span>
            </div>
            <div>
              <span class="text-gray-400 text-[12px] tracking-tight">
                Sensory Processing & spatial awareness
              </span>
            </div>
            <div>
              <span class="text-[13px] font-bold">Concussion Symptoms</span>
              <ul class="list-disc marker:text-yellow-500 text-[11px]">
                <li class="ml-3">
                  Dizziness
                </li>
                <li class="ml-3">
                  Balance problems
                </li>
                <li class="ml-3">
                  Sensory issues
                </li>
                <li class="ml-3">
                  Spatial Confusion
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- Ocipital Lobe -->
        <div ref="div5Ref"
          class="z-4 relative flex size-12 items-center justify-center rounded-full border-2 bg-pink-500 p-2 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] group cursor-crosshair">
          <div class="absolute cardAnimation bg-pink-200 hidden top-0 right-0 w-[200px] border-2 rounded-md border-l-pink-500 border-t-0 border-b-0 border-r-0 p-2 shadow-xl group-hover:flex flex-col space-y-1">
            <div>
              <span class="text-pink-500 font-bold">Ocipital Lobe</span>
            </div>
            <div>
              <span class="text-gray-400 text-[12px] tracking-tight">
                Visual Processing
              </span>
            </div>
            <div>
              <span class="text-[13px] font-bold">Concussion Symptoms</span>
              <ul class="list-disc marker:text-pink-500 text-[11px]">
                <li class="ml-3">
                  Blurred Vision
                </li>
                <li class="ml-3">
                  Seeing starts
                </li>
                <li class="ml-3">
                  Light Sensitivity
                </li>
                <li class="ml-3">
                  Double Vision
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-row items-center justify-between">
        <!-- Frontal Lobe -->
        <div ref="div2Ref"
          class="z-2 relative flex size-12 items-center justify-center rounded-full border-2 bg-blue-500 p-2 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:text-black group cursor-crosshair">
          <div class="absolute cardAnimation bg-blue-200 hidden top-0 left-0 w-[200px] border-2 rounded-md border-l-blue-500 border-t-0 border-b-0 border-r-0 p-2 shadow-xl group-hover:flex flex-col space-y-1">
            <div>
              <span class="text-blue-500 font-bold">Frontal Lobe</span>
            </div>
            <div>
              <span class="text-gray-400 text-[12px] tracking-tight">
                Executive funtion & personality
              </span>
            </div>
            <div>
              <span class="text-[13px] font-bold">Concussion Symptoms</span>
              <ul class="list-disc marker:text-blue-500 text-[11px]">
                <li class="ml-3">
                  Poor planing
                </li>
                <li class="ml-3">
                  Irritability
                </li>
                <li class="ml-3">
                  Memory issues
                </li>
                <li class="ml-3">
                  Impulse control loss
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div ref="div4Ref"
          class="z-1 flex size-48 lg:size-68 items-center justify-center rounded-full bg-transparent p-2 text-black shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]">
          <div class="relative">
          <img src="/brainMain.png" class="w-40 lg:w-62.5" width="250px" height="150px" />
          <!-- Parietal Destination -->
            <div class="absolute top-[20%] right-[25%]" ref="ParietalRef">
            </div>
          <!-- Ocipital Destination -->  
            <div class="absolute top-[55%] right-[8%]" ref="OcipitalRef">
            </div>
          <!-- Cerebellum   -->
           <div class="absolute bottom-[7%] right-[20%]" ref="Cerebellum">
           </div>
          <!-- Brainstem   -->  
           <div class="absolute bottom-[5%] right-[38%]" ref="Brainstem">
           </div>
          </div>
        
          <!-- <Icon
            icon="simple-icons:openai"
            width="190px important"
          /> -->
        </div>
        <!-- Cerebellum -->
        <div ref="div6Ref"
          class="z-3 relative flex size-12 items-center justify-center rounded-full border-2 bg-purple-500 p-2 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] cursor-crosshair group">
         <div class="absolute cardAnimation bg-purple-200 hidden top-0 right-0 w-[200px] border-2 rounded-md border-l-purple-500 border-t-0 border-b-0 border-r-0 p-2 shadow-xl group-hover:flex flex-col space-y-1">
            <div>
              <span class="text-purple-500 font-bold">Cerebellum</span>
            </div>
            <div>
              <span class="text-gray-400 text-[12px] tracking-tight">
                Balance & Motor Coordination
              </span>
            </div>
            <div>
              <span class="text-[13px] font-bold">Concussion Symptoms</span>
              <ul class="list-disc marker:text-purple-500 text-[11px]">
                <li class="ml-3">
                  Unsteadiness
                </li>
                <li class="ml-3">
                  Incoordination
                </li>
                <li class="ml-3">
                  Dizziness
                </li>
                <li class="ml-3">
                  Balance loss
                </li>
              </ul>
            </div>
          </div> 
        </div>
      </div>
      <div class="flex flex-row items-center justify-between">
        <!-- Temporal Lobe -->
        <div ref="div3Ref"
          class="z-1 relative flex size-12 items-center justify-center rounded-full border-2 bg-green-500 p-2 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:text-black cursor-crosshair group">
          <div class="absolute cardAnimation bg-green-200 hidden bottom-0 left-0 w-[200px] border-2 rounded-md border-l-green-500 border-t-0 border-b-0 border-r-0 p-2 shadow-xl group-hover:flex flex-col space-y-1">
            <div>
              <span class="text-green-500 font-bold">Temporal Lobe</span>
            </div>
            <div>
              <span class="text-gray-400 text-[12px] tracking-tight">
                Memory & Language processing
              </span>
            </div>
            <div>
              <span class="text-[13px] font-bold">Concussion Symptoms</span>
              <ul class="list-disc marker:text-green-500 text-[11px]">
                <li class="ml-3">
                  Memory loss
                </li>
                <li class="ml-3">
                  Word-finding problems
                </li>
                <li class="ml-3">
                  Anxiety
                </li>
                <li class="ml-3">
                  Hearing issues
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- Brainstem -->
        <div ref="div7Ref"
          class="z-2 relative flex size-12 items-center justify-center rounded-full border-2 bg-red-500 p-2 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] cursor-crosshair group">
          <div class="absolute cardAnimation bg-red-200 hidden bottom-0 right-0 w-[200px] border-2 rounded-md border-l-red-500 border-t-0 border-b-0 border-r-0 p-2 shadow-xl group-hover:flex flex-col space-y-1">
            <div>
              <span class="text-red-500 font-bold">Brainstem</span>
            </div>
            <div>
              <span class="text-gray-400 text-[12px] tracking-tight">
                Alertness & Vital functions
              </span>
            </div>
            <div>
              <span class="text-[13px] font-bold">Concussion Symptoms</span>
              <ul class="list-disc marker:text-red-500 text-[11px]">
                <li class="ml-3">
                  Loss of consciousness
                </li>
                <li class="ml-3">
                  Extreme fatigue
                </li>
                <li class="ml-3">
                  Nausea
                </li>
                <li class="ml-3">
                  Vomiting
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom informative information -->
    <div class="absolute bottom-7 left-1/2 -translate-x-1/2 pointer-events-none" style="opacity: 1;">
      <div class="text-[11px] text-[#86868b] font-medium tracking-wide">Hover over a <span class="font-bold! text-black">-</span> coloured globe <span class="font-bold! text-black">-</span> to see concussion symptoms</div>
    </div>
    <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-3 flex-wrap pointer-events-none">
      <div class="flex items-center gap-1.5">
        <div class="w-2 h-2 rounded-full bg-blue-500"></div>
        <span class="text-[10px] text-[#86868b] font-medium">Frontal Lobe</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
        <span
          class="text-[10px] text-[#86868b] font-medium">Parietal Lobe</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-2 h-2 rounded-full bg-green-500"></div><span
          class="text-[10px] text-[#86868b] font-medium">Temporal Lobe</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-2 h-2 rounded-full bg-pink-500"></div><span
          class="text-[10px] text-[#86868b] font-medium">Occipital Lobe</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-2 h-2 rounded-full bg-purple-500"></div><span
          class="text-[10px] text-[#86868b] font-medium">Cerebellum</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-2 h-2 rounded-full bg-red-500"></div><span
          class="text-[10px] text-[#86868b] font-medium">Brainstem</span>
      </div>
    </div>

    <AnimatedBeam :container-ref="containerRef" path-color="yellow" :from-ref="div1Ref" :to-ref="ParietalRef" :curvature="100"
      :end-y-offset="-10" />
    <AnimatedBeam path-color="blue" :container-ref="containerRef" :from-ref="div2Ref" :to-ref="div4Ref" />
    <AnimatedBeam path-color="green" :container-ref="containerRef" :from-ref="div3Ref" :to-ref="div4Ref" :curvature="10"
      :end-y-offset="10" />
    <AnimatedBeam path-color="pink" :container-ref="containerRef" :from-ref="div5Ref" :to-ref="OcipitalRef"
      :end-y-offset="-10" />
    <AnimatedBeam path-color="purple" :container-ref="containerRef" :from-ref="div6Ref" :to-ref="Cerebellum" />
    <AnimatedBeam path-color="red" :container-ref="containerRef" :from-ref="div7Ref" :to-ref="Brainstem"
      :end-y-offset="10" />
  </div>
  <div class="relative">
   
  </div>
</template>

<style scoped>

.cardAnimation {
  animation-name: cardAnimation;
  animation-duration: 0.3s;
  animation-timing-function: ease-in;
  animation-iteration-count: 1;
}

@keyframes cardAnimation {
  0% {
    transform: translateX(15px);
    opacity: 0;

  }
  100% {
    transform: translateX(0px);
    opacity: 1;
  }
}

</style>
