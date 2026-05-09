<script setup>
const venues = [
  ['The Glass House', 'Beachfront, Barcelona', '94% Match', 'Shortlisted', 'Natural lighting perfect for keynote sessions.', 'Strict acoustic limits after 11:00 PM.'],
  ['Antiguo Courtyard', 'Gothic Quarter, Barcelona', '89% Match', 'Draft Ready', 'Exceptional heritage atmosphere for brand story.', 'Limited accessibility for heavy stage equipment.'],
  ['North Wing Atrium', 'Design District, Barcelona', '82% Match', 'New Lead', 'Flexible floor plan, modern facilities, and strong AV baseline.', 'Confirm weekend buyout pricing.'],
]
</script>

<template>
  <section class="stitch-page venue-stitch">
    <div class="stitch-topline">
      <div class="stitch-title-group">
        <h2>Venue Management</h2>
        <p>Annual Founders Retreat 2024 - Barcelona, Spain</p>
      </div>
      <div class="stitch-actions">
        <button class="stitch-secondary" type="button">Filter</button>
        <button class="stitch-primary" type="button">Add New Venue</button>
      </div>
    </div>

    <div class="stitch-grid-3">
      <article v-for="[name, place, score, status, pro, risk] in venues" :key="name" class="venue-card stitch-panel pad">
        <div class="venue-card-top">
          <span class="stitch-chip"><span class="material-symbols-outlined">star</span>{{ score }}</span>
          <span class="stitch-chip neutral">{{ status }}</span>
        </div>
        <h3>{{ name }}</h3>
        <p>{{ place }}</p>
        <div class="venue-meta">
          <span>EUR 12,500</span>
          <span>150-200</span>
          <span>Fiber Optic</span>
        </div>
        <div class="venue-notes">
          <p><span class="material-symbols-outlined">check_circle</span>{{ pro }}</p>
          <p><span class="material-symbols-outlined">error</span>{{ risk }}</p>
        </div>
        <div class="stitch-actions">
          <button class="stitch-secondary" type="button">View Details</button>
          <button class="stitch-primary" type="button">Draft Outreach</button>
        </div>
      </article>
    </div>
  </section>
</template>
