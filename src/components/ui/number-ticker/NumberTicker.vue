<script setup>
import { cn } from "@inspira-ui/plugins";
import {
  TransitionPresets,
  useElementVisibility,
  useTransition,
} from "@vueuse/core";
import { computed, ref, watch } from "vue";

const props = defineProps({
  value: { type: Number, required: false, default: 0 },
  direction: { type: String, required: false, default: "up" },
  duration: { type: Number, required: false, default: 1000 },
  delay: { type: Number, required: false, default: 0 },
  decimalPlaces: { type: Number, required: false, default: 2 },
  class: { type: String, required: false },
  transition: { type: null, required: false, default: "easeOutCubic" },
});

const spanRef = ref();

const transitionValue = ref(props.direction === "down" ? props.value : 0);

const transitionOutput = useTransition(transitionValue, {
  delay: props.delay,
  duration: props.duration,
  transition: TransitionPresets[props.transition],
});

const output = computed(() => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: props.decimalPlaces,
    maximumFractionDigits: props.decimalPlaces,
  }).format(Number(transitionOutput.value.toFixed(props.decimalPlaces)));
});

const isInView = useElementVisibility(spanRef, {
  threshold: 0,
});

const hasBeenInView = ref(false);

const stopIsInViewWatcher = watch(
  isInView,
  (isVisible) => {
    if (isVisible && !hasBeenInView.value) {
      hasBeenInView.value = true;
      transitionValue.value = props.direction === "down" ? 0 : props.value;
      stopIsInViewWatcher();
    }
  },
  { immediate: true },
);

watch(
  () => props.value,
  (newVal) => {
    if (hasBeenInView.value) {
      transitionValue.value = props.direction === "down" ? 0 : newVal;
    }
  },
);
</script>

<template>
  <span
    ref="spanRef"
    :class="
      cn(
        `inline-block tracking-wider text-black tabular-nums dark:text-white`,
        props.class,
      )
    "
  >
    {{ output }}
  </span>
</template>
