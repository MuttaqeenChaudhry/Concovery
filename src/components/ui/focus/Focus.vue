<script setup>
import { useIntervalFn } from '@vueuse/core';
import { computed, nextTick, onMounted, ref, watch } from 'vue';

const props = defineProps({
  sentence: { type: String, required: false, default: "Inspira Focus" },
  manualMode: { type: Boolean, required: false, default: false },
  blurAmount: { type: Number, required: false, default: 5 },
  borderColor: { type: String, required: false, default: "green" },
  animationDuration: { type: Number, required: false, default: 0.5 },
  pauseBetweenAnimations: { type: Number, required: false, default: 1 },
});

const words = computed(() => props.sentence.split(" "));
const containerRef = ref(null);
const wordRefs = ref({});
const currentIndex = ref(0);
const lastActiveIndex = ref(null);
const focusRect = ref({ x: 0, y: 0, width: 0, height: 0 });

function setRef(el, index) {
  if (!el) return;
  wordRefs.value[index] = el;
}

function handleMouseEnter(index) {
  if (props.manualMode) {
    lastActiveIndex.value = index;
    currentIndex.value = index;
  }
}
function handleMouseLeave() {
  if (props.manualMode) {
    currentIndex.value = 0;
  }
}

watch(
  currentIndex,
  async (newIndex) => {
    await nextTick();
    if (newIndex === null || newIndex === -1) return;
    if (!wordRefs.value[newIndex] || !containerRef.value) return;

    const parentRect = containerRef.value.getBoundingClientRect();
    const wordRect = wordRefs.value[newIndex].getBoundingClientRect();

    focusRect.value = {
      x: wordRect.left - parentRect.left,
      y: wordRect.top - parentRect.top,
      width: wordRect.width,
      height: wordRect.height,
    };
  },
  { immediate: true },
);

onMounted(() => {
  if (!props.manualMode) {
    useIntervalFn(
      () => {
        currentIndex.value = (currentIndex.value + 1) % words.value.length;
      },
      props.animationDuration * 1000 + props.pauseBetweenAnimations * 1000,
      {
        immediate: true,
      },
    );
  }
});
</script>

<template>
  <div ref="containerRef" class="focus-container">
    <span
      v-for="(word, index) in words"
      :key="`${word}_${index}`"
      :ref="(el) => setRef(el, index)"
      class="focus-word"
      :class="{
        manual: props.manualMode,
        active: index === currentIndex && !props.manualMode,
      }"
      :style="{
        filter: manualMode
          ? index === currentIndex
            ? `blur(0px)`
            : `blur(${blurAmount}px)`
          : index === currentIndex
            ? `blur(0px)`
            : `blur(${blurAmount}px)`,
        transition: `filter ${animationDuration}s ease`,
        '--border-color': borderColor,
      }"
      @mouseenter="handleMouseEnter(index)"
      @mouseleave="handleMouseLeave"
    >
      {{ word }}
    </span>
    <Motion
      as="div"
      class="focus-frame"
      :animate="{
        x: focusRect.x,
        y: focusRect.y,
        width: focusRect.width,
        height: focusRect.height,
        opacity: currentIndex >= 0 ? 1 : 0,
      }"
      :transition="{
        duration: animationDuration,
      }"
      :style="{
        '--border-color': borderColor,
      }"
    >
      <span class="corner top-left" />
      <span class="corner top-right" />
      <span class="corner bottom-left" />
      <span class="corner bottom-right" />
    </Motion>
  </div>
</template>

<style scoped>
.focus-container {
  position: relative;
  display: flex;
  gap: 1em;
  width: fit-content;
  align-items: center;
  flex-wrap: wrap;
}

/* Words */
.focus-word {
  position: relative;
  font-size: 3rem;
  font-weight: 900;
  cursor: pointer;
  transition:
    filter 0.3s ease,
    color 0.3s ease;
}

.focus-word.active {
  filter: blur(0);
}

.focus-frame {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  box-sizing: content-box;
  border: none;
}

.corner {
  position: absolute;
  width: 1rem;
  height: 1rem;
  border: 3px solid var(--border-color, #fff);
  filter: drop-shadow(0px 0px 4px var(--border-color, #fff));
  border-radius: 3px;
  transition: none;
}

.top-left {
  top: -10px;
  left: -10px;
  border-right: none;
  border-bottom: none;
}

.top-right {
  top: -10px;
  right: -10px;
  border-left: none;
  border-bottom: none;
}

.bottom-left {
  bottom: -10px;
  left: -10px;
  border-right: none;
  border-top: none;
}

.bottom-right {
  bottom: -10px;
  right: -10px;
  border-left: none;
  border-top: none;
}
</style>
