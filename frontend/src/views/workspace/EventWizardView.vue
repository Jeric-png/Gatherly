<script setup>
import { computed, ref, watch } from 'vue'
import { runEventWorkflow } from '../../services/workspaceData'

const emit = defineEmits(['navigate', 'refresh-workspace'])

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

const event = computed(() => props.workspace?.event)
const brief = ref('')
const generating = ref(false)
const actionError = ref('')
const resultSummary = ref('')

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

const agentSteps = computed(() => [
  {
    icon: 'travel_explore',
    title: 'EXA venue agent',
    detail: 'Searches the web for venue leads, source links, and fit signals.',
  },
  {
    icon: 'storefront',
    title: 'EXA vendor agent',
    detail: 'Finds suppliers for catering, AV, photography, and operational support.',
  },
  {
    icon: 'auto_awesome',
    title: 'GPT planning agent',
    detail: 'Ranks leads, writes rationale, drafts tasks, and builds the campaign plan.',
  },
  {
    icon: 'image',
    title: 'GPT Image agent',
    detail: 'Creates a campaign infographic concept from the event, venue, and vendor context.',
  },
])

watch(
  event,
  (nextEvent) => {
    if (nextEvent && !brief.value) {
      brief.value = nextEvent.description || ''
    }
  },
  { immediate: true },
)

function useSuggestion(suggestion) {
  brief.value = `${brief.value ? `${brief.value}\n\n` : ''}${suggestion}`
}

async function generatePlan() {
  if (!event.value) return

  generating.value = true
  actionError.value = ''
  resultSummary.value = ''

  try {
    const result = await runEventWorkflow(event.value, brief.value)
    resultSummary.value = `Generated ${result.counts?.venues ?? 0} venue leads, ${result.counts?.vendors ?? 0} vendor leads, and ${result.counts?.assets ?? 0} marketing assets.`
    emit('refresh-workspace')
  } catch (error) {
    actionError.value = error.message
  } finally {
    generating.value = false
  }
}
</script>

<template>
  <section class="stitch-page wizard-stitch">
    <div class="stitch-topline">
      <div class="stitch-title-group">
        <h1>New Event</h1>
        <p>Multi-agent generation mode</p>
      </div>
      <button class="stitch-secondary" type="button" @click="emit('navigate', 'dashboard')">Back to Dashboard</button>
    </div>

    <section class="wizard-hero stitch-panel pad">
      <span class="material-symbols-outlined">magic_button</span>
      <h2>Describe the event. Gatherly will populate the workspace.</h2>
      <p>
        The AI Co-organiser will run venue discovery, vendor discovery, campaign planning,
        and image generation, then save the outputs into the Venue, Vendor, and Marketing pages.
      </p>
      <textarea
        v-model="brief"
        class="textarea"
        placeholder="Example: I want to host a 120-person founder dinner in Singapore with a warm, premium feel, halal-friendly catering, AV support, and a marketing campaign for LinkedIn and Instagram."
      />
      <div class="button-row">
        <button v-for="item in suggestions" :key="item" class="stitch-secondary" type="button" @click="useSuggestion(item)">
          "{{ item }}"
        </button>
      </div>
      <div class="stitch-actions">
        <button class="stitch-primary" type="button" :disabled="generating || workspaceLoading" @click="generatePlan">
          {{ generating ? 'Running agents...' : 'Generate Workspace Plan' }}
        </button>
        <button class="stitch-secondary" type="button" @click="emit('navigate', 'marketing')">Open Marketing Studio</button>
      </div>
      <p v-if="workspaceError || actionError" class="auth-error">{{ workspaceError || actionError }}</p>
      <p v-if="resultSummary" class="auth-note">{{ resultSummary }}</p>
    </section>

    <div class="stitch-grid-4 agent-step-grid">
      <article v-for="step in agentSteps" :key="step.title" class="stitch-panel pad agent-step-card">
        <span class="material-symbols-outlined">{{ step.icon }}</span>
        <h3>{{ step.title }}</h3>
        <p>{{ step.detail }}</p>
        <span class="stitch-chip" :class="{ good: resultSummary, warn: generating }">
          {{ generating ? 'Running' : resultSummary ? 'Complete' : 'Queued' }}
        </span>
      </article>
    </div>

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
        <h3>After generation</h3>
        <p>Review the EXA-sourced venue and vendor candidates, then use the generated image, caption, and video prompt in Marketing Studio.</p>
      </div>
      <button class="stitch-primary" type="button" @click="emit('navigate', 'venues')">Review Leads</button>
    </aside>
  </section>
</template>
