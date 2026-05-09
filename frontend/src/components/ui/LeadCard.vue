<script setup>
import StatusPill from './StatusPill.vue'

defineProps({
  lead: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="lead-card">
    <div class="lead-header">
      <div>
        <StatusPill :label="lead.category" tone="neutral" />
        <h3>{{ lead.name }}</h3>
        <p>{{ lead.summary }}</p>
      </div>
      <div class="lead-score" aria-label="Fit score">{{ lead.score }}</div>
    </div>

    <div class="inline-row">
      <StatusPill :label="lead.price" tone="warn" />
      <StatusPill v-if="lead.capacity" :label="lead.capacity" tone="good" />
    </div>

    <p class="source-line">{{ lead.source }}</p>
    <p v-if="lead.missing" class="source-line">Missing: {{ lead.missing }}</p>

    <div class="button-row">
      <button class="btn primary small" type="button">Save lead</button>
      <button class="btn secondary small" type="button">Draft outreach</button>
      <button class="btn secondary small" type="button">Hide</button>
    </div>
  </article>
</template>
