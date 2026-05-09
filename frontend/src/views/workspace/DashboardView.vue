<script setup>
import { computed } from 'vue'

const emit = defineEmits(['navigate'])

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

const event = computed(() => props.workspace?.event ?? null)
const metrics = computed(() => [
  ['Venue leads', String(props.workspace?.venues?.length ?? 0), 'Ranked venue candidates'],
  ['Vendor leads', String(props.workspace?.vendors?.length ?? 0), 'Supplier options saved'],
  ['Campaign assets', String(props.workspace?.assets?.length ?? 0), 'Generated marketing outputs'],
])

const progress = computed(() => {
  const venueReady = props.workspace?.venues?.length ? 25 : 0
  const vendorReady = props.workspace?.vendors?.length ? 25 : 0
  const campaignReady = props.workspace?.campaigns?.length ? 20 : 0
  const assetReady = props.workspace?.assets?.length ? 20 : 0
  const attendeeReady = props.workspace?.attendees?.length ? 10 : 0
  return venueReady + vendorReady + campaignReady + assetReady + attendeeReady
})

const tasks = computed(() => props.workspace?.tasks?.length
  ? props.workspace.tasks.map((task) => [
      task.title,
      task.description,
      task.category === 'marketing' ? 'Open Studio' : 'Review Now',
    ])
  : [
      ['Venue shortlist', 'Generate ranked venue leads and approve outreach.', 'Review Now'],
      ['Marketing assets', 'Generate poster, campaign, and video direction assets.', 'Open Studio'],
    ])
</script>

<template>
  <section class="stitch-page dashboard-stitch">
    <div class="stitch-topline">
      <div class="stitch-title-group">
        <h1>{{ event?.title || 'Loading workspace...' }}</h1>
        <p>{{ event ? `${event.venue_name || 'Venue pending'} - ${event.status} event workspace` : 'Preparing organiser workspace' }}</p>
      </div>
      <div class="stitch-actions">
        <button class="stitch-secondary" type="button" @click="emit('navigate', 'wizard')">Create Event</button>
        <button class="stitch-primary" type="button">Publish Event</button>
      </div>
    </div>

    <div class="stitch-grid-3">
      <article v-for="[label, value, detail] in metrics" :key="label" class="stitch-panel stitch-kpi">
        <span>{{ label }}</span>
        <strong>{{ value }}</strong>
        <p>{{ detail }}</p>
      </article>
    </div>

    <div class="dashboard-grid">
      <section class="stitch-panel pad">
        <div class="dashboard-progress">
          <div>
            <span class="stitch-chip">
              <span class="material-symbols-outlined">calendar_month</span>
              Event setup
            </span>
            <h2>Launch progress</h2>
            <p>{{ event?.ai_summary || 'Gatherly is preparing the event structure, vendor queue, and marketing sequence.' }}</p>
          </div>
          <strong>{{ workspaceLoading ? '...' : `${progress}%` }}</strong>
        </div>
        <div class="progress-track"><div class="progress-bar" :style="{ '--progress': `${progress}%` }"></div></div>
        <p v-if="workspaceError" class="auth-error">{{ workspaceError }}</p>
        <div class="stitch-card-list">
          <div v-for="[title, copy, cta] in tasks" :key="title" class="stitch-row-card">
            <div>
              <h3>{{ title }}</h3>
              <p>{{ copy }}</p>
            </div>
            <button class="stitch-secondary" type="button" @click="emit('navigate', cta === 'Open Studio' ? 'marketing' : 'venues')">
              {{ cta }}
            </button>
          </div>
        </div>
      </section>

      <aside class="stitch-panel pad dashboard-ai">
        <span class="material-symbols-outlined">smart_toy</span>
        <h3>AI Co-organiser</h3>
        <p>Ready to help with outreach, publishing, reminder drafts, and source-backed lead review.</p>
        <div class="ai-chat-input">
          <span>Ask what to do next...</span>
          <button class="material-symbols-outlined" type="button">send</button>
        </div>
      </aside>
    </div>
  </section>
</template>
