<script setup>
import { computed } from 'vue'
import {
  getDateBadge,
  getEventImage,
  getEventTags,
  getLocationLine,
  getPriceLabel,
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

const statChips = [
  { icon: 'event_available', text: '120+ events planned', tone: 'primary' },
  { icon: 'timer', text: '10+ hours saved per organiser', tone: 'tertiary' },
  { icon: 'groups', text: '2,400+ attendees connected', tone: 'secondary' },
]

const heroHackathonImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAhmcTfrwcqiDURPdm1av2IyA5A0FObUlJWNe9CYQ_fI_iitaJ-e5f4QuwIEhBAkRk10CLX4gyCLKnYhURBvxzEgDBwjOroj0BFRbbye9BQ5PJ49DDQHMy2JygDeolrzIZ2PVSAxmvS2UvOUmUn3-ouqqtaZUZIuqZ3W_A9Ag_UbBpa_Wyz7QU8dULOfFMEKvfgjlc28E-H35lAD2E6PI1KMq9ENqym-s29zhJPt0tua3-qcKDPjk3_taTY1jgNdRj8lEwiUp3ygpM'

const fallbackTrendingEvents = [
  {
    date: 'OCT\n24',
    price: '$18',
    title: 'AI Founders Dinner',
    location: 'Marina Bay Sands, SG',
    host: 'Sarah J.',
    tags: ['TECH', 'DINNER'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDitVxLkW8HsvwZ8IvQHw7mDxrdxW22nfaxRK_YrHY1pK3RgK8EvamQkYwl4_wnK-rxWqNrZcOsvKNxMHf_tboPavTfxxpBN6QjXx0v4CPJP5Yq5KW8n8bwyvKXD4qH94rWQuZoFtTzixWcdfZub71HuJH6kZukBz3e9wbA7QRrkDX4U_mwKX9wX8UqY5Rzi1Qxmkm8XKEpMm71qgwOx_6Sr9aJsu8UMPPfdjrfVizoNEgF6YWB6WUO99WlGBMSxMnQrx0QIyjFLKg',
  },
  {
    date: 'NOV\n02',
    price: 'Free',
    title: 'Cybersecurity Hackathon',
    location: 'SMU Campus, SG',
    host: 'TechSoc',
    tags: ['EDUCATION', 'HACKATHON'],
    image: heroHackathonImage,
  },
  {
    date: 'NOV\n05',
    price: 'Free',
    title: 'Sunset Creator Walk',
    location: 'East Coast Park, SG',
    host: 'Mark L.',
    tags: ['OUTDOORS', 'SOCIAL'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAm085PI-uyokZepDP_mIXD5VH6lBe8HpGneCVfQefW41xIeqAmAWCkzhJ4fl3xX_Y--zdOtxVYucQVgMHCfPSJcSWtItK5j23hUyUI0JniJJeL3I4Abci_jy7jEQRidu6i9v4uphuklkIOuBJqEU0n7dKhFL0WSQgCg-a-9UaB-6OXy-hl0k5Hm3MDNJyGcLGdKxFk0ZVsFcsPs0m-0A32JufdPG7XDQmncRt_qfr74J-zsj1EqbWKbv8vfl_b9k2ngrj0UiFo5WI',
  },
  {
    date: 'NOV\n12',
    price: '$8',
    title: 'Coffee & Career Chats',
    location: 'Tiong Bahru Bakery',
    host: 'Elena R.',
    tags: ['NETWORKING'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhl5lwyhATb2MTErObUtdTr-M1kAY8871UjCx0QfcrQ8iltwaSQiQe9nYXPWEH4uRSdnpfSCR2z0j8M1FKEsGZvNAybV8lePbad7qLLYKcmwzvvxDhPCVh-mjzWzKwoa5nKuFlRESpSi50-8rp-OZndFxj_yEL5SQevRN9UaBuJtVUf8j11oxSrlBPxSdlgR-BH0bSykwV5X5fVJUUjiEnwiyaGT4BXM9ON91QW3PmjqbL30k_RVHiFF4P-0X0Qgc0Jtrwydl3Gr0',
  },
]

const trendingEvents = computed(() => {
  if (!props.publicEvents.length) {
    return fallbackTrendingEvents
  }

  return props.publicEvents.slice(0, 4).map((event, index) => ({
    date: getDateBadge(event),
    price: getPriceLabel(event),
    title: event.title,
    location: getLocationLine(event),
    host: event.host_name || 'Gatherly host',
    tags: getEventTags(event),
    image: getEventImage(event, index),
  }))
})

const aiFeatures = [
  {
    icon: 'search',
    title: 'Venue Matching',
    description: 'Instantly discover spaces that fit your vibe, capacity, and budget with smart recommendations.',
  },
  {
    icon: 'handshake',
    title: 'Vendor Outreach',
    description: 'Generate personalized negotiation emails and manage catering requests automatically.',
  },
  {
    icon: 'campaign',
    title: 'Marketing Gen',
    description: 'Create compelling event descriptions and social media posts tailored to your audience.',
  },
  {
    icon: 'group',
    title: 'Attendee Tracking',
    description: 'Keep a pulse on RSVPs, dietary requirements, and smart seating arrangements.',
  },
]
</script>

<template>
  <div class="stitch-landing">
    <header class="landing-nav">
      <button class="landing-logo" type="button" @click="emit('navigate', 'home')">Gatherly</button>

      <nav class="landing-links" aria-label="Landing navigation">
        <button class="landing-link is-active" type="button" @click="emit('navigate', 'explore')">Explore</button>
        <a class="landing-link" href="#how-it-works">How It Works</a>
        <button class="landing-link" type="button" @click="emit('navigate', 'auth')">Host an Event</button>
      </nav>

      <div class="landing-auth">
        <button class="landing-login" type="button" @click="emit('navigate', 'auth')">Login</button>
        <button class="landing-primary small" type="button" @click="emit('navigate', 'auth')">
          Get Started
        </button>
      </div>
    </header>

    <main>
      <section class="landing-hero">
        <div class="landing-hero-copy">
          <h1>Plan unforgettable events with your AI co-organiser.</h1>
          <p>
            Discover events around you, create your own, and let AI help with venues,
            vendors, marketing, and attendees.
          </p>

          <div class="landing-actions">
            <button class="landing-primary" type="button" @click="emit('navigate', 'auth')">
              Create an Event
            </button>
            <button class="landing-secondary" type="button" @click="emit('navigate', 'explore')">
              Explore Events
            </button>
          </div>

          <div class="landing-stats" aria-label="Gatherly platform statistics">
            <span
              v-for="chip in statChips"
              :key="chip.text"
              class="landing-stat-chip"
              :class="chip.tone"
            >
              <span class="material-symbols-outlined">{{ chip.icon }}</span>
              {{ chip.text }}
            </span>
          </div>
        </div>

        <div class="landing-hero-art" aria-label="AI co-organiser event preview">
          <div class="co-card ai-card">
            <span class="mini-icon gold">A</span>
            <strong>AI Co-organiser</strong>
            <p>Venue shortlisted</p>
            <p>Vendor email drafted</p>
          </div>

          <div class="co-card event-preview-card">
            <img class="preview-photo" :src="heroHackathonImage" alt="Hackathon" />
            <h3>Cybersecurity AI Hackathon</h3>
            <p>SMU Singapore - Sat 10 AM</p>
            <span>86 joined</span>
          </div>

          <div class="co-card match-card">
            <span class="mini-icon coral">P</span>
            <strong>Venue Match</strong>
            <p>Found 3 venues for 100 pax within budget.</p>
          </div>

          <div class="co-card promo-card">
            <span class="mini-icon neutral">C</span>
            <strong>Promo Ready</strong>
            <p>Instagram caption and poster generated.</p>
          </div>
        </div>
      </section>

      <section class="landing-section trending-section">
        <div class="landing-section-header">
          <div>
            <h2>Trending Events</h2>
            <p>
              Discover what's happening in your community.
              <span v-if="publicEventsLoading" class="data-note">Syncing events...</span>
              <span v-else-if="publicEventsSource === 'supabase'" class="data-note">Live from Supabase</span>
            </p>
          </div>
          <button class="landing-text-link" type="button" @click="emit('navigate', 'explore')">
            Explore all
          </button>
        </div>

        <div class="landing-event-grid">
          <article v-for="event in trendingEvents" :key="event.title" class="landing-event-card">
            <div class="landing-event-image">
              <img :src="event.image" :alt="event.title" />
              <span class="date-badge">{{ event.date }}</span>
              <span class="price-badge">{{ event.price }}</span>
            </div>
            <div class="landing-event-body">
              <div class="landing-tags">
                <span v-for="tag in event.tags" :key="tag">{{ tag }}</span>
              </div>
              <h3>{{ event.title }}</h3>
              <p class="event-location">{{ event.location }}</p>
              <div class="event-host">
                <span class="avatar"></span>
                <span>by {{ event.host }}</span>
                <span class="avatar-pair"></span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="how-it-works" class="landing-section how-section">
        <div class="how-copy">
          <h2>How AI helps you host</h2>
          <p>
            Your personal concierge for every step of the event lifecycle, designed to keep
            things simple and human.
          </p>
        </div>

        <div class="ai-feature-grid">
          <article v-for="feature in aiFeatures" :key="feature.title" class="ai-feature-card">
            <span class="feature-icon material-symbols-outlined">{{ feature.icon }}</span>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </article>
        </div>
      </section>

      <section class="landing-cta">
        <h2>From idea to launched event in minutes.</h2>
        <button class="landing-primary small" type="button" @click="emit('navigate', 'auth')">
          Start Planning
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </section>
    </main>

    <footer class="landing-footer">
      <span>Gatherly</span>
      <p>(c) 2024 Gatherly. Built for Radical Hospitality.</p>
      <nav aria-label="Footer navigation">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Contact</a>
      </nav>
    </footer>
  </div>
</template>
