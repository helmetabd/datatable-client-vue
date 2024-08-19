<script setup lang="ts">
import { defineProps } from 'vue'
defineProps({
  label: {
    type: [String, Number]
  },
  status: {
    type: String
  },
  arrow: {
    type: String
  }
})
</script>
<template>
  <span :class="`badge bg-${status}-subtle text-${status} float-end`">
    <i v-if="arrow" :class="`ri-arrow-${arrow}-s-fill align-middle me-1`"></i>{{ label }} %
  </span>
</template>
