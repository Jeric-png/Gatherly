<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <article class="card">
    <p class="metric-value">{{ value }}</p>
    <p class="metric-label">{{ label }}</p>
  </article>
</template>
