<template>
  <div class="spinner" v-show="loading">
    <!-- <div>Loading</div> -->
    <span class="sync p-1 font-monospace" v-bind:style="[state.spinnerStyle, state.spinnerDelay1]"
      >LO</span
    >
    <span class="sync p-1 font-monospace" v-bind:style="[state.spinnerStyle, state.spinnerDelay2]"
      >AD</span
    >
    <span class="sync p-1 font-monospace" v-bind:style="[state.spinnerStyle, state.spinnerDelay3]"
      >ING</span
    >
    <span class="sync p-1 font-monospace" v-bind:style="[state.spinnerStyle, state.spinnerDelay4]"
      >...</span
    >
  </div>
</template>
<script setup lang="ts">
import { defineProps, reactive } from 'vue'
const props = defineProps({
  loading: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: '#405189'
  },
  size: {
    type: String,
    default: '30px'
  },
  margin: {
    type: String,
    default: '1px'
  },
  radius: {
    type: String,
    default: '100%'
  }
})
const state = reactive({
  spinnerStyle: {
    backgroundColor: props.color,
    height: props.size,
    width: props.size,
    borderRadius: props.radius,
    margin: props.margin,
    display: 'inline-block',
    animationName: 'spinerAnimation',
    animationDuration: '1.25s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-in-out',
    animationFillMode: 'both',
    color: 'white'
  },
  spinnerDelay1: {
    animationDelay: '0.07s'
  },
  spinnerDelay2: {
    animationDelay: '0.14s'
  },
  spinnerDelay3: {
    animationDelay: '0.21s'
  },
  spinnerDelay4: {
    animationDelay: '0.28s'
  },
  loadingLocal: props.loading
})
const start = () => {
  state.loadingLocal = true
}
const end = () => {
  state.loadingLocal = false
}
</script>
<style>
.spinner {
  width: 100%;
  /* height: 100vh; */
  display: flex;
  align-items: center;
  justify-content: center;
}
@keyframes spinerAnimation {
  33% {
    transform: translateY(10px);
  }
  66% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
