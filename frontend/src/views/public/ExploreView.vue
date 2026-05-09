<script setup>
import { computed } from 'vue'
import PublicChrome from '../../components/layout/PublicChrome.vue'
import {
  getDateLine,
  getEventImage,
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

const heroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAhmcTfrwcqiDURPdm1av2IyA5A0FObUlJWNe9CYQ_fI_iitaJ-e5f4QuwIEhBAkRk10CLX4gyCLKnYhURBvxzEgDBwjOroj0BFRbbye9BQ5PJ49DDQHMy2JygDeolrzIZ2PVSAxmvS2UvOUmUn3-ouqqtaZUZIuqZ3W_A9Ag_UbBpa_Wyz7QU8dULOfFMEKvfgjlc28E-H35lAD2E6PI1KMq9ENqym-s29zhJPt0tua3-qcKDPjk3_taTY1jgNdRj8lEwiUp3ygpM'

const fallbackCards = [
  {
    tag: 'NETWORKING',
    title: 'Founders & Funders Mixer',
    place: 'The Hive, Carpenter St',
    time: 'Tonight - 42 Spots left',
  },
  {
    tag: 'FOOD & DRINK',
    title: 'Omakase & Natural Wine Pairing',
    place: 'Keong Saik Road',
    time: 'Friday - 8 seats',
  },
  {
    tag: 'TECHNOLOGY',
    title: 'UX/UI Design Thinking Workshop',
    place: 'Design Campus',
    time: 'This Friday - 12 Spots left',
  },
  {
    tag: 'DESIGN',
    title: 'Future of AI Interfaces Panel',
    place: 'Innovation Loft',
    time: 'Next Week - Waitlist',
  },
]

const spotlightEvent = computed(() => props.publicEvents[0] ?? null)

const cards = computed(() => {
  if (!props.publicEvents.length) {
    return fallbackCards
  }

  return props.publicEvents.map((event) => ({
    tag: getEventTags(event)[0] || 'EVENT',
    title: event.title,
    place: getLocationLine(event),
    time: `${getDateLine(event)} - ${getTimeLine(event)} - ${getPriceLabel(event)}`,
  }))
})

const conciergeEvents = computed(() => cards.value.slice(1, 3))
</script>

<template>
  <PublicChrome active="explore" @navigate="emit('navigate', $event)">
    <main class="explore-stitch">
      <section class="explore-hero">
        <div class="explore-copy">
          <span class="stitch-chip">
            <span class="material-symbols-outlined">near_me</span>
            Nearby spotlight
          </span>
          <h2>{{ spotlightEvent?.title || 'Cybersecurity AI Hackathon' }}</h2>
          <p>
            {{
              spotlightEvent?.description ||
              'Join top developers and security experts for a 48-hour sprint building AI-driven defense systems. Hosted by Cyber Builders Collective.'
            }}
          </p>
          <div class="explore-filter-row">
            <span
              v-for="tag in (spotlightEvent ? getEventTags(spotlightEvent) : ['Technology', 'Food', 'Networking', 'Design'])"
              :key="tag"
              class="filter-pill"
            >
              {{ tag }}
            </span>
          </div>
          <button class="stitch-primary" type="button" @click="emit('navigate', 'event')">
            View Event
          </button>
        </div>

        <div class="explore-visual">
          <img :src="spotlightEvent ? getEventImage(spotlightEvent, 1) : heroImage" :alt="spotlightEvent?.title || 'Cybersecurity AI Hackathon'" />
          <div class="explore-spot-card">
            <span class="stitch-chip good">{{ getSpotsLabel(spotlightEvent, '100 Spots Left') }}</span>
            <strong>{{ spotlightEvent ? getLocationLine(spotlightEvent) : 'SMU Campus, SG' }}</strong>
            <p>{{ spotlightEvent ? `${getDateLine(spotlightEvent)} - ${getTimeLine(spotlightEvent)}` : 'Sat 10 AM - Team formation and demos' }}</p>
          </div>
        </div>
      </section>

      <section class="explore-content">
        <div class="explore-list">
          <div class="stitch-topline">
            <div class="stitch-title-group">
              <h2>Explore Events</h2>
              <p>
                Curated happenings, workshops, dinners, and social gatherings.
                <span v-if="publicEventsLoading" class="data-note">Syncing events...</span>
                <span v-else-if="publicEventsSource === 'supabase'" class="data-note">Live from Supabase</span>
              </p>
            </div>
          </div>

          <article v-for="card in cards" :key="card.title" class="explore-event-card stitch-panel">
            <span class="stitch-chip neutral">{{ card.tag }}</span>
            <h3>{{ card.title }}</h3>
            <p>{{ card.place }}</p>
            <span class="source-line">{{ card.time }}</span>
          </article>
        </div>

        <aside class="stitch-panel pad explore-ai">
          <span class="material-symbols-outlined">auto_awesome</span>
          <h3>AI Concierge</h3>
          <p>Tell Gatherly what kind of evening you want and it will surface events, communities, and hosts that fit.</p>
          <div class="stitch-card-list">
            <div v-for="event in conciergeEvents" :key="event.title" class="stitch-row-card">
              <div>
                <h4>{{ event.title }}</h4>
                <p>{{ event.time }}</p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  </PublicChrome>
</template>
