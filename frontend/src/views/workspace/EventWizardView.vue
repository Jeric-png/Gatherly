<script setup>
import { computed } from 'vue'

defineEmits(['navigate'])

const props = defineProps({
  workspace: {
    type: Object,
    default: null,
  },
})

const event = computed(() => props.workspace?.event)

const suggestions = computed(() => [
  `${event.value?.category || 'Community event'} with warm hospitality`,
  `Find venues in ${event.value?.city || 'my city'} for ${event.value?.capacity || 100} guests`,
  'Generate vendor, marketing, and attendee reminder plan',
])

const fields = computed(() => [
  ['City / Location', [event.value?.city, event.value?.country].filter(Boolean).join(', ') || 'Not set', 'location_on'],
  ['Event Type', event.value?.category || 'Not set', 'palette'],
  ['Date & Time', event.value?.starts_at ? new Date(event.value.starts_at).toLocaleString('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Not set', 'calendar_month'],
  ['Budget', 'Planning mode', 'payments'],
  ['Capacity', event.value?.capacity ? `${event.value.capacity} guests` : 'Not set', 'groups'],
])
</script>

<template>
  <section class="stitch-page wizard-stitch">
    <div class="stitch-topline">
      <div class="stitch-title-group">
        <h1>New Event</h1>
        <p>Drafting mode</p>
      </div>
      <button class="stitch-secondary" type="button">Save Draft</button>
    </div>

    <section class="wizard-hero stitch-panel pad">
      <span class="material-symbols-outlined">magic_button</span>
      <h2>Let's build something beautiful.</h2>
      <p>
        I'm your AI Co-organiser. Tell me the event brief, and I'll turn it into venue
        sourcing, vendor outreach, marketing assets, and attendee operations.
      </p>
      <textarea class="textarea" :value="event?.description || ''" placeholder="Describe the event you want to create." />
      <div class="button-row">
        <button v-for="item in suggestions" :key="item" class="stitch-secondary" type="button">
          "{{ item }}"
        </button>
      </div>
    </section>

    <div class="stitch-grid-3 wizard-field-grid">
      <article v-for="[label, value, icon] in fields" :key="label" class="stitch-panel pad wizard-field">
        <span class="material-symbols-outlined">{{ icon }}</span>
        <p>{{ label }}</p>
        <strong>{{ value }}</strong>
      </article>
    </div>

    <aside class="wizard-side-note stitch-panel pad">
      <span class="material-symbols-outlined">auto_fix</span>
      <div>
        <h3>Need a venue?</h3>
        <p>I can suggest venue and vendor leads based on your event brief, then pass the selected context into the marketing studio.</p>
      </div>
      <button class="stitch-primary" type="button" @click="$emit('navigate', 'venues')">Generate Plan</button>
    </aside>
  </section>
</template>
