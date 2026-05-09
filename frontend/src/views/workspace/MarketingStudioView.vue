<script setup>
import { computed, ref } from 'vue'
import { generateMarketingAsset } from '../../services/workspaceData'

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

const event = computed(() => props.workspace?.event ?? null)
const campaign = computed(() => props.workspace?.campaigns?.[0] ?? null)
const assets = computed(() => props.workspace?.assets ?? [])
const venues = computed(() => props.workspace?.venues ?? [])
const vendors = computed(() => props.workspace?.vendors ?? [])
const videoScenes = computed(() => {
  const sourceAssets = assets.value.filter((asset) => ['video_prompt', 'campaign_plan'].includes(asset.asset_type))

  if (sourceAssets.length) {
    return sourceAssets.slice(0, 3).map((asset, index) => [`SCENE 0${index + 1}`, asset.content || asset.prompt])
  }

  return [
    ['SCENE 01', 'Open on the selected venue and event atmosphere.'],
    ['SCENE 02', 'Show vendor details, food, community, and host energy.'],
    ['SCENE 03', 'Close with RSVP and campaign call to action.'],
  ]
})

async function generateAsset() {
  if (!props.workspace) return

  generating.value = true
  actionError.value = ''

  try {
    await generateMarketingAsset(props.workspace)
    emit('refresh-workspace')
  } catch (error) {
    actionError.value = error.message
  } finally {
    generating.value = false
  }
}
</script>

<template>
  <section class="stitch-page campaign-stitch">
    <div class="stitch-topline">
      <div class="stitch-title-group">
        <h2>Campaign Studio</h2>
        <p>{{ campaign?.title || 'Full-funnel campaign orchestration' }}</p>
      </div>
      <div class="stitch-actions">
        <button class="stitch-secondary" type="button">{{ campaign?.status || 'Draft' }}</button>
        <button class="stitch-primary" type="button" :disabled="generating || workspaceLoading" @click="generateAsset">
          {{ generating ? 'Generating...' : 'Generate Campaign Plan' }}
        </button>
      </div>
    </div>

    <p v-if="workspaceError || actionError" class="auth-error">{{ workspaceError || actionError }}</p>

    <div class="campaign-layout">
      <section class="stitch-panel pad campaign-brief">
        <span class="stitch-chip">
          <span class="material-symbols-outlined">strategy</span>
          Campaign Inputs
        </span>
        <h3>{{ event?.title || 'Loading campaign brief...' }}</h3>
        <p>{{ venues[0]?.name || event?.venue_name || 'No venue selected yet' }}</p>
        <p>{{ campaign?.strategy_summary || event?.description }}</p>
        <div class="stitch-grid-2">
          <div><span>Audience</span><strong>{{ campaign?.audience || 'Audience pending' }}</strong></div>
          <div><span>Vendors</span><strong>{{ vendors.map((vendor) => vendor.name).join(', ') || 'No vendors selected' }}</strong></div>
          <div><span>Channels</span><strong>{{ campaign?.channels?.join(', ') || 'Channels pending' }}</strong></div>
          <div><span>Goal</span><strong>{{ campaign?.objective || 'Campaign objective pending' }}</strong></div>
        </div>
      </section>

      <aside class="stitch-panel pad launch-checklist">
        <span class="stitch-chip warn">READY TO LAUNCH</span>
        <h3>Launch Checklist</h3>
        <p><span class="material-symbols-outlined">check_circle</span>Campaign Strategy <strong>{{ campaign ? 'Ready' : 'Missing' }}</strong></p>
        <p><span class="material-symbols-outlined">check_circle</span>Generated Assets <strong>{{ assets.length }}</strong></p>
        <p><span class="material-symbols-outlined">error</span>Promo Video Export <strong>Needs Rendering</strong></p>
        <p><span class="material-symbols-outlined">check_circle</span>Venue/Vendor Context <strong>{{ venues.length + vendors.length }}</strong></p>
      </aside>
    </div>

    <section class="stitch-grid-2">
      <article class="stitch-panel pad">
        <span class="stitch-chip">
          <span class="material-symbols-outlined">photo_prints</span>
          Visual Asset Engine
        </span>
        <div class="poster-preview">
          <p>{{ event?.category || 'EVENT' }}</p>
          <h3>{{ event?.title || 'CAMPAIGN' }}</h3>
          <span>{{ venues[0]?.name || 'Venue pending' }}</span>
          <span>{{ campaign?.channels?.slice(0, 3)?.join(' - ') || 'Channels pending' }}</span>
        </div>
        <div class="stitch-actions">
          <button class="stitch-secondary" type="button">Poster Variants</button>
          <button class="stitch-primary" type="button" @click="generateAsset">Generate More</button>
        </div>
      </article>

      <article class="stitch-panel pad">
        <span class="stitch-chip">
          <span class="material-symbols-outlined">movie</span>
          Promo Video
        </span>
        <div class="video-tabs">
          <button class="stitch-primary" type="button">15S</button>
          <button class="stitch-secondary" type="button">30S</button>
          <button class="stitch-secondary" type="button">45S</button>
        </div>
        <div class="stitch-card-list">
          <div v-for="[label, caption] in videoScenes" :key="label" class="stitch-row-card">
            <span class="material-symbols-outlined">play_circle</span>
            <div>
              <h4>{{ label }}</h4>
              <p>Caption: "{{ caption }}"</p>
            </div>
          </div>
        </div>
      </article>
    </section>
  </section>
</template>
