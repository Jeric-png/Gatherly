<script setup>
const scenes = [
  ['SCENE 01', 'Where craftsmanship meets the moon...'],
  ['SCENE 02', 'Artisanal textures and sustainable luxury.'],
  ['SCENE 03', 'Reserve your seat at the table.'],
]
</script>

<template>
  <section class="stitch-page campaign-stitch">
    <div class="stitch-topline">
      <div class="stitch-title-group">
        <h2>Campaign Studio</h2>
        <p>Full-funnel campaign orchestration</p>
      </div>
      <div class="stitch-actions">
        <button class="stitch-secondary" type="button">Draft Saved</button>
        <button class="stitch-primary" type="button">Launch Campaign</button>
      </div>
    </div>

    <div class="campaign-layout">
      <section class="stitch-panel pad campaign-brief">
        <span class="stitch-chip">strategy Campaign Inputs</span>
        <h3>Harvest Moon Garden Gala</h3>
        <p>The Heritage Gardens, North Wing</p>
        <p>
          A sophisticated garden gala under the harvest moon, blending sustainable luxury
          with artisanal craftsmanship.
        </p>
        <div class="stitch-grid-2">
          <div><span>Audience</span><strong>Eco-conscious luxury enthusiasts</strong></div>
          <div><span>Vendors</span><strong>Roots & Shoots, Artisan Clay Co.</strong></div>
          <div><span>Vibe</span><strong>Warm Coral, Sustainable</strong></div>
          <div><span>Goal</span><strong>Sell 250 tickets</strong></div>
        </div>
      </section>

      <aside class="stitch-panel pad launch-checklist">
        <span class="stitch-chip warn">READY TO LAUNCH</span>
        <h3>Launch Checklist</h3>
        <p><span class="material-symbols-outlined">check_circle</span>Email Invitation Sequence <strong>Ready</strong></p>
        <p><span class="material-symbols-outlined">check_circle</span>Social Media Assets <strong>Ready</strong></p>
        <p><span class="material-symbols-outlined">error</span>Promo Video Export <strong>Missing Rendering</strong></p>
        <p><span class="material-symbols-outlined">check_circle</span>Search Ad Landing Page <strong>Ready</strong></p>
      </aside>
    </div>

    <section class="stitch-grid-2">
      <article class="stitch-panel pad">
        <span class="stitch-chip">photo_prints Visual Asset Engine</span>
        <div class="poster-preview">
          <p>HARVEST MOON</p>
          <h3>GARDEN GALA 2024</h3>
          <span>Sustainable - Artisanal - Communal</span>
          <span>October 24th | 6:00 PM</span>
        </div>
        <div class="stitch-actions">
          <button class="stitch-secondary" type="button">Poster Variants</button>
          <button class="stitch-primary" type="button">Generate More</button>
        </div>
      </article>

      <article class="stitch-panel pad">
        <span class="stitch-chip">movie Promo Video</span>
        <div class="video-tabs">
          <button class="stitch-primary" type="button">15S</button>
          <button class="stitch-secondary" type="button">30S</button>
          <button class="stitch-secondary" type="button">45S</button>
        </div>
        <div class="stitch-card-list">
          <div v-for="[label, caption] in scenes" :key="label" class="stitch-row-card">
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
