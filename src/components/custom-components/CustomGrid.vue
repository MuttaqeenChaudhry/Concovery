
<script lang="ts" setup>
import AnimateGrid from "../ui/animate-grid/AnimateGrid.vue";
import cloudflare from "./sport.svg";

interface Props {
  textGlowStartColor: string;
  perspective: number;
  textGlowEndColor: string;
  rotateX: number;
  rotateY: number;
}

const props = defineProps<Props>();

const cards = ["AFL", "RUGBY", "BASKETBALL", "Tennis", "Squash", "Sportx", "SportY", "SportZ"]
// Array.from({ length: 16 }, () => ({
//   logo: cloudflare,
// }));
</script>

<template>
  <div class="flex items-center justify-center p-4">
    <AnimateGrid
      :cards
      v-bind="props"
    >
      <template #logo="{ logo }">
        <!-- <img
          class="logo mx-auto h-10 w-auto"
          :src="logo"
        /> -->
        <div class="">{{ logo }}</div>
      </template>
    </AnimateGrid>
  </div>
</template>

