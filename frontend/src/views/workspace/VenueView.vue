<script setup>
import { computed, ref } from 'vue'
import { generateVenueLead } from '../../services/workspaceData'

const props = defineProps({
  workspace: {
    type: Object,
    default: null,
  },
  workspaceLoading: {
    type: Boolean,
    default: false,
  },
  workspaceError: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['refresh-workspace'])
const generating = ref(false)
const actionError = ref('')

const venues = computed(() => props.workspace?.venues ?? [])
const event = computed(() => props.workspace?.event ?? null)

function priceLabel(venue) {
  if (!venue.estimated_price) {
    return 'Price TBD'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: venue.currency || 'USD',
    maximumFractionDigits: 0,
  }).format(venue.estimated_price)
}

async function generateLead() {
  if (!event.value) return

  generating.value = true
  actionError.value = ''

  try {
    await generateVenueLead(event.value)
    emit('refresh-workspace')
  } catch (error) {
    actionError.value = error.message
  } finally {
    generating.value = false
  }
}
</script>

<template>
  <section class="stitch-page venue-stitch">
    <div class="stitch-topline">
      <div class="stitch-title-group">
        <h2>Venue Management</h2>
        <p>{{ event?.title || 'Loading workspace event...' }}</p>
      </div>
      <div class="stitch-actions">
        <button class="stitch-secondary" type="button">Filter</button>
        <button class="stitch-primary" type="button" :disabled="generating || workspaceLoading" @click="generateLead">
          {{ generating ? 'Generating...' : 'Generate Venue Lead' }}
        </button>
      </div>
    </div>

    <p v-if="workspaceError || actionError" class="auth-error">{{ workspaceError || actionError }}</p>

    <div class="stitch-grid-3">
      <article v-for="venue in venues" :key="venue.id" class="venue-card stitch-panel pad">
        <div class="venue-card-top">
          <span class="stitch-chip"><span class="material-symbols-outlined">star</span>{{ venue.fit_score || 0 }}% Match</span>
          <span class="stitch-chip neutral">{{ venue.status }}</span>
        </div>
        <h3>{{ venue.name }}</h3>
        <p>{{ [venue.address, venue.city].filter(Boolean).join(', ') }}</p>
        <div class="venue-meta">
          <span>{{ priceLabel(venue) }}</span>
          <span>{{ venue.capacity_min || '?' }}-{{ venue.capacity_max || '?' }}</span>
          <span>{{ venue.source_provider }}</span>
        </div>
        <div class="venue-notes">
          <p><span class="material-symbols-outlined">check_circle</span>{{ venue.ai_rationale }}</p>
          <p><span class="material-symbols-outlined">error</span>{{ venue.missing_info || 'Ready for source validation.' }}</p>
        </div>
        <div class="stitch-actions">
          <button class="stitch-secondary" type="button">View Details</button>
          <button class="stitch-primary" type="button">Draft Outreach</button>
        </div>
      </article>
    </div>

    <section v-if="!workspaceLoading && !venues.length" class="empty-state stitch-panel pad">
      <span class="material-symbols-outlined">location_searching</span>
      <h3>No venue leads yet</h3>
      <p>Generate AI venue leads from the active event brief.</p>
      <button class="stitch-primary" type="button" @click="generateLead">Generate Venue Lead</button>
    </section>
  </section>
</template>
