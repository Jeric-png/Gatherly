<script setup>
import PublicChrome from '../../components/layout/PublicChrome.vue'

const emit = defineEmits(['navigate'])

const flow = [
  ['10:00 AM', 'Morning Coffee & Intention Setting', 'Start the day with a curated roast and a brief overview of our gathering philosophy.'],
  ['11:00 AM', 'The Sensory Workshop', 'A tactile exploration of materials, textures, and scents that define a premium host experience.'],
  ['12:15 PM', 'Communal Lunch & Q&A', 'We put our theories into practice over a light, locally-sourced lunch.'],
]
</script>

<template>
  <PublicChrome active="event" @navigate="emit('navigate', $event)">
    <main class="event-detail-stitch">
      <section class="event-detail-hero">
        <div>
          <div class="landing-tags">
            <span>Curated Workshop</span>
            <span>Lifestyle</span>
          </div>
          <h1>The Art of Mindful Hosting: A Sunday Morning Intensive</h1>
          <p class="event-host-line">Hosted by <strong>Elena Rodriguez</strong></p>
          <div class="event-meta-grid">
            <div class="stitch-panel pad">
              <span class="material-symbols-outlined">calendar_today</span>
              <p>Sunday, June 23</p>
              <strong>10:00 AM - 1:00 PM EST</strong>
            </div>
            <div class="stitch-panel pad">
              <span class="material-symbols-outlined">location_on</span>
              <p>The Glass Atelier</p>
              <strong>SoHo, New York, NY</strong>
            </div>
          </div>
        </div>

        <aside class="event-ticket-card stitch-panel pad">
          <p>Investment</p>
          <h3>$125</h3>
          <span class="stitch-chip warn">8 spots left</span>
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
          <p>
            Join us for an intimate, hands-on masterclass dedicated to the philosophy of
            Radical Hospitality. This is not just about planning an event; it is about
            designing a room where guests feel seen.
          </p>
          <p>
            Elena Rodriguez will guide you through her signature approach to creating spaces
            where memory, sensory detail, and community connection meet.
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
          <p>The Glass Atelier</p>
          <p>42 Greene St, New York, NY</p>
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
