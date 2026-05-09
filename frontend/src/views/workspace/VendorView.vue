<script setup>
const vendors = [
  ['Artisan Plates', '98%', 'Specializing in organic, locally-sourced molecular gastronomy. Perfect for high-end corporate galas.', '$12,500 - $18,000', 'Negotiation'],
  ['Velvet Mixology', '84%', 'Bespoke bar service with theatrical cocktail presentations.', '$4,800 - $6,200', 'Follow-up in 2 days'],
  ['Harvest Hearth', '92%', 'Seasonal family-style dinner service with strong sustainability credentials.', '$9,000 - $12,000', 'Quote ready'],
]

const tabs = ['Catering', 'AV & Lighting', 'Photography', 'Decor & Florals', 'Entertainment']
</script>

<template>
  <section class="stitch-page vendor-stitch">
    <div class="stitch-topline">
      <div class="stitch-title-group">
        <h2>Vendor Workspace</h2>
        <p>Source, compare, and prepare outreach with the AI Vendor Concierge.</p>
      </div>
      <div class="stitch-actions">
        <button class="stitch-secondary" type="button">Compare All</button>
        <button class="stitch-primary" type="button">Add Vendor</button>
      </div>
    </div>

    <section class="stitch-panel pad vendor-concierge">
      <span class="material-symbols-outlined">auto_awesome</span>
      <div>
        <h3>AI Vendor Concierge</h3>
        <p>Artisan Plates has the strongest suitability score for the gala brief.</p>
      </div>
      <button class="stitch-secondary" type="button">Draft Outreach</button>
      <button class="stitch-primary" type="button">View Analysis</button>
    </section>

    <div class="vendor-tabs">
      <button v-for="tab in tabs" :key="tab" class="stitch-secondary" type="button">{{ tab }}</button>
    </div>

    <div class="vendor-grid">
      <section class="stitch-card-list">
        <article v-for="[name, score, copy, quote, status] in vendors" :key="name" class="vendor-card stitch-panel pad">
          <div class="vendor-card-head">
            <h4>{{ name }}</h4>
            <span class="stitch-chip">{{ score }} suitability</span>
          </div>
          <p>{{ copy }}</p>
          <div class="stitch-grid-2">
            <div>
              <span class="source-line">Quote Placeholder</span>
              <strong>{{ quote }}</strong>
            </div>
            <div>
              <span class="source-line">Lead Status</span>
              <strong>{{ status }}</strong>
            </div>
          </div>
          <button class="stitch-primary" type="button">Send AI Outreach</button>
        </article>
      </section>

      <aside class="stitch-panel pad outreach-panel">
        <span class="material-symbols-outlined">mail</span>
        <h3>AI Outreach Drafts</h3>
        <span class="stitch-chip neutral">For: Artisan Plates</span>
        <p>
          Hi Artisan Plates team, we are curating a premium garden gala and would like to
          explore seasonal catering options for 150 guests.
        </p>
        <button class="stitch-primary" type="button">Edit & Send</button>
      </aside>
    </div>
  </section>
</template>
