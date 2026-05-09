<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  tone: {
    type: String,
    default: 'neutral',
  },
})
</script>

<template>
  <span class="pill" :class="tone">{{ label }}</span>
</template>
