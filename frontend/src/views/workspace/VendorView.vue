<script setup>
import { computed, ref } from 'vue'
import { generateVendorLead } from '../../services/workspaceData'

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

const tabs = ['Catering', 'AV & Lighting', 'Photography', 'Decor & Florals', 'Entertainment']
const vendors = computed(() => props.workspace?.vendors ?? [])
const event = computed(() => props.workspace?.event ?? null)
const topVendor = computed(() => vendors.value[0] ?? null)

function quoteLabel(vendor) {
  if (!vendor.estimated_price_min && !vendor.estimated_price_max) {
    return 'Quote TBD'
  }

  const min = vendor.estimated_price_min ?? vendor.estimated_price_max
  const max = vendor.estimated_price_max ?? vendor.estimated_price_min
  const currency = vendor.currency || 'USD'
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  })

  return min === max ? formatter.format(min) : `${formatter.format(min)} - ${formatter.format(max)}`
}

async function generateLead() {
  if (!event.value) return

  generating.value = true
  actionError.value = ''

  try {
    await generateVendorLead(event.value)
    emit('refresh-workspace')
  } catch (error) {
    actionError.value = error.message
  } finally {
    generating.value = false
  }
}
</script>

<template>
  <section class="stitch-page vendor-stitch">
    <div class="stitch-topline">
      <div class="stitch-title-group">
        <h2>Vendor Workspace</h2>
        <p>{{ event?.title || 'Source, compare, and prepare outreach with the AI Vendor Concierge.' }}</p>
      </div>
      <div class="stitch-actions">
        <button class="stitch-secondary" type="button">Compare All</button>
        <button class="stitch-primary" type="button" :disabled="generating || workspaceLoading" @click="generateLead">
          {{ generating ? 'Generating...' : 'Generate Vendor Lead' }}
        </button>
      </div>
    </div>

    <section class="stitch-panel pad vendor-concierge">
      <span class="material-symbols-outlined">auto_awesome</span>
      <div>
        <h3>AI Vendor Concierge</h3>
        <p>
          {{
            topVendor
              ? `${topVendor.name} has the strongest suitability score for this event brief.`
              : 'Generate a vendor lead to start comparing suppliers.'
          }}
        </p>
      </div>
      <button class="stitch-secondary" type="button">Draft Outreach</button>
      <button class="stitch-primary" type="button">View Analysis</button>
    </section>

    <p v-if="workspaceError || actionError" class="auth-error">{{ workspaceError || actionError }}</p>

    <div class="vendor-tabs">
      <button v-for="tab in tabs" :key="tab" class="stitch-secondary" type="button">{{ tab }}</button>
    </div>

    <div class="vendor-grid">
      <section class="stitch-card-list">
        <article v-for="vendor in vendors" :key="vendor.id" class="vendor-card stitch-panel pad">
          <div class="vendor-card-head">
            <h4>{{ vendor.name }}</h4>
            <span class="stitch-chip">{{ vendor.fit_score || 0 }}% suitability</span>
          </div>
          <p>{{ vendor.ai_rationale }}</p>
          <div class="stitch-grid-2">
            <div>
              <span class="source-line">Quote Placeholder</span>
              <strong>{{ quoteLabel(vendor) }}</strong>
            </div>
            <div>
              <span class="source-line">Lead Status</span>
              <strong>{{ vendor.status }}</strong>
            </div>
          </div>
          <button class="stitch-primary" type="button">Send AI Outreach</button>
        </article>
      </section>

      <aside class="stitch-panel pad outreach-panel">
        <span class="material-symbols-outlined">mail</span>
        <h3>AI Outreach Drafts</h3>
        <span class="stitch-chip neutral">For: {{ topVendor?.name || 'No vendor selected' }}</span>
        <p>
          Hi {{ topVendor?.name || 'team' }}, we are curating {{ event?.title || 'an event' }}
          and would like to explore service options for {{ event?.capacity || 'our' }} guests.
        </p>
        <button class="stitch-primary" type="button">Edit & Send</button>
      </aside>
    </div>
  </section>
</template>
