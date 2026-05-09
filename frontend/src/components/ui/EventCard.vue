<script setup>
import StatusPill from './StatusPill.vue'

defineProps({
  event: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="event-card">
    <div class="event-visual" :style="{ '--event-gradient': event.gradient }"></div>
    <div class="event-card-body">
      <StatusPill :label="event.category" tone="primary" />
      <div>
        <h3>{{ event.title }}</h3>
        <p>{{ event.host }}</p>
      </div>
      <div class="event-meta">
        <span>{{ event.date }}</span>
        <span>{{ event.city }}</span>
        <span>{{ event.price }}</span>
      </div>
      <div>
        <div class="progress-track" aria-hidden="true">
          <div
            class="progress-bar"
            :style="{ '--progress': `${Math.round((event.attendees / event.capacity) * 100)}%` }"
          ></div>
        </div>
        <p class="metric-label">{{ event.attendees }} attending of {{ event.capacity }}</p>
      </div>
    </div>
  </article>
</template>
