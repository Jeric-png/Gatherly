<script setup>
import { computed } from 'vue'
import PublicChrome from '../../components/layout/PublicChrome.vue'
import {
  getDateLine,
  getEventTags,
  getLocationLine,
  getPriceLabel,
  getSpotsLabel,
  getTimeLine,
} from '../../services/publicEvents'

const emit = defineEmits(['navigate'])
const props = defineProps({
  publicEvents: {
    type: Array,
    default: () => [],
  },
  publicEventsLoading: {
    type: Boolean,
    default: false,
  },
  publicEventsSource: {
    type: String,
    default: 'fallback',
  },
})

const activeEvent = computed(() => props.publicEvents[0] ?? null)

const flow = [
  ['10:00 AM', 'Morning Coffee & Intention Setting', 'Start the day with a curated roast and a brief overview of our gathering philosophy.'],
  ['11:00 AM', 'The Sensory Workshop', 'A tactile exploration of materials, textures, and scents that define a premium host experience.'],
  ['12:15 PM', 'Communal Lunch & Q&A', 'We put our theories into practice over a light, locally-sourced lunch.'],
]

const eventTitle = computed(() => activeEvent.value?.title || 'The Art of Mindful Hosting: A Sunday Morning Intensive')
const eventDescription = computed(() => {
  return (
    activeEvent.value?.description ||
    'Join us for an intimate, hands-on masterclass dedicated to the philosophy of Radical Hospitality. This is not just about planning an event; it is about designing a room where guests feel seen.'
  )
})
const eventTags = computed(() => activeEvent.value ? getEventTags(activeEvent.value) : ['Curated Workshop', 'Lifestyle'])
const hostName = computed(() => activeEvent.value?.host_name || 'Elena Rodriguez')
const eventDate = computed(() => activeEvent.value ? getDateLine(activeEvent.value) : 'Sunday, June 23')
const eventTime = computed(() => activeEvent.value ? getTimeLine(activeEvent.value) : '10:00 AM - 1:00 PM EST')
const locationName = computed(() => activeEvent.value?.venue_name || 'The Glass Atelier')
const locationLine = computed(() => activeEvent.value ? getLocationLine(activeEvent.value) : 'SoHo, New York, NY')
const priceLabel = computed(() => activeEvent.value ? getPriceLabel(activeEvent.value) : '$125')
const spotsLabel = computed(() => getSpotsLabel(activeEvent.value, '8 spots left'))
</script>

<template>
  <PublicChrome active="event" @navigate="emit('navigate', $event)">
    <main class="event-detail-stitch">
      <section class="event-detail-hero">
        <div>
          <div class="landing-tags">
            <span v-for="tag in eventTags" :key="tag">{{ tag }}</span>
          </div>
          <h1>{{ eventTitle }}</h1>
          <p class="event-host-line">
            Hosted by <strong>{{ hostName }}</strong>
            <span v-if="publicEventsLoading" class="data-note">Syncing event...</span>
            <span v-else-if="publicEventsSource === 'supabase'" class="data-note">Live from Supabase</span>
          </p>
          <div class="event-meta-grid">
            <div class="stitch-panel pad">
              <span class="material-symbols-outlined">calendar_today</span>
              <p>{{ eventDate }}</p>
              <strong>{{ eventTime }}</strong>
            </div>
            <div class="stitch-panel pad">
              <span class="material-symbols-outlined">location_on</span>
              <p>{{ locationName }}</p>
              <strong>{{ locationLine }}</strong>
            </div>
          </div>
        </div>

        <aside class="event-ticket-card stitch-panel pad">
          <p>Investment</p>
          <h3>{{ priceLabel }}</h3>
          <span class="stitch-chip warn">{{ spotsLabel }}</span>
          <ul>
            <li><span class="material-symbols-outlined">check_circle</span> All workshop materials included</li>
            <li><span class="material-symbols-outlined">restaurant</span> Gourmet seasonal lunch</li>
          </ul>
          <button class="stitch-primary" type="button">Reserve Your Seat</button>
          <small>Cancellation policy: 48h notice</small>
        </aside>
      </section>

      <section class="event-body-grid">
        <article class="stitch-panel pad event-copy-block">
          <h2>About the Gathering</h2>
          <p>{{ eventDescription }}</p>
          <p>
            Gatherly keeps the operational layer close by, from venue and vendor prep to
            reminders, community updates, and marketing assets.
          </p>
        </article>

        <article class="stitch-panel pad event-copy-block">
          <h2>The Flow</h2>
          <div class="stitch-card-list">
            <div v-for="[time, title, detail] in flow" :key="time" class="stitch-row-card">
              <strong>{{ time }}</strong>
              <div>
                <h3>{{ title }}</h3>
                <p>{{ detail }}</p>
              </div>
            </div>
          </div>
        </article>

        <article class="stitch-panel pad event-copy-block">
          <h2>Location</h2>
          <p>{{ locationName }}</p>
          <p>{{ activeEvent?.venue_address || locationLine }}</p>
          <button class="stitch-secondary" type="button">Open Maps</button>
        </article>

        <article class="stitch-panel pad event-copy-block community-unlock">
          <span class="material-symbols-outlined">auto_awesome</span>
          <h2>Join the Community</h2>
          <p>
            Attend this event to unlock access to our exclusive host network. Share tips,
            find co-hosts, and get early access to future gatherings.
          </p>
        </article>
      </section>
    </main>
  </PublicChrome>
</template>
