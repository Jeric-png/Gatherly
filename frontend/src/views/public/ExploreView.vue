<script setup>
import PublicChrome from '../../components/layout/PublicChrome.vue'

const emit = defineEmits(['navigate'])

const heroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAhmcTfrwcqiDURPdm1av2IyA5A0FObUlJWNe9CYQ_fI_iitaJ-e5f4QuwIEhBAkRk10CLX4gyCLKnYhURBvxzEgDBwjOroj0BFRbbye9BQ5PJ49DDQHMy2JygDeolrzIZ2PVSAxmvS2UvOUmUn3-ouqqtaZUZIuqZ3W_A9Ag_UbBpa_Wyz7QU8dULOfFMEKvfgjlc28E-H35lAD2E6PI1KMq9ENqym-s29zhJPt0tua3-qcKDPjk3_taTY1jgNdRj8lEwiUp3ygpM'

const cards = [
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
</script>

<template>
  <PublicChrome active="explore" @navigate="emit('navigate', $event)">
    <main class="explore-stitch">
      <section class="explore-hero">
        <div class="explore-copy">
          <span class="stitch-chip">near_me Nearby spotlight</span>
          <h2>Cybersecurity AI Hackathon</h2>
          <p>
            Join top developers and security experts for a 48-hour sprint building AI-driven
            defense systems. Hosted by Cyber Builders Collective.
          </p>
          <div class="explore-filter-row">
            <span class="filter-pill">computer Technology</span>
            <span class="filter-pill">restaurant Food</span>
            <span class="filter-pill">handshake Networking</span>
            <span class="filter-pill">palette Design</span>
          </div>
          <button class="stitch-primary" type="button" @click="emit('navigate', 'event')">
            View Event
          </button>
        </div>

        <div class="explore-visual">
          <img :src="heroImage" alt="Cybersecurity AI Hackathon" />
          <div class="explore-spot-card">
            <span class="stitch-chip good">100 Spots Left</span>
            <strong>SMU Campus, SG</strong>
            <p>Sat 10 AM - Team formation and demos</p>
          </div>
        </div>
      </section>

      <section class="explore-content">
        <div class="explore-list">
          <div class="stitch-topline">
            <div class="stitch-title-group">
              <h2>Explore Events</h2>
              <p>Curated happenings, workshops, dinners, and social gatherings.</p>
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
            <div class="stitch-row-card">
              <div>
                <h4>UX/UI Design Thinking Workshop</h4>
                <p>This Friday - 12 Spots left</p>
              </div>
            </div>
            <div class="stitch-row-card">
              <div>
                <h4>Future of AI Interfaces Panel</h4>
                <p>Next Week - Waitlist</p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  </PublicChrome>
</template>
