<script setup lang="ts">
import BrainAwareness from './components/custom-components/brainAwareness(legacy).vue';
import Footer from './components/custom-components/Footer.vue';
import NavBar from './components/custom-components/NavBar.vue';
import SmoothCursor from './components/ui/smooth-cursor/SmoothCursor.vue';



</script>
<template>
 <NavBar/> 
 <!-- <div class="flex items-center justify-center text-xl">
    <SmoothCursor/>
 </div> -->
 <router-view/>
 <Footer/>
</template>

<style scoped></style>
