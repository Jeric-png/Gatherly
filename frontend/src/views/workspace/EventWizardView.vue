<script setup>
const suggestions = [
  'A candlelit rooftop gala in Lisbon',
  'Sustainable tech summit for 200 people',
  'Bohemian garden wedding with live jazz',
]

const fields = [
  ['City / Location', 'Barcelona, Spain', 'location_on'],
  ['Event Vibe', 'Organic Garden Soiree', 'palette'],
  ['Date & Time', 'October 24, 6:00 PM', 'calendar_month'],
  ['Budget', '$25,000', 'payments'],
  ['Capacity', '150 guests', 'groups'],
]
</script>

<template>
  <section class="stitch-page wizard-stitch">
    <div class="stitch-topline">
      <div class="stitch-title-group">
        <h1>New Event</h1>
        <p>Drafting mode</p>
      </div>
      <button class="stitch-secondary" type="button">Save Draft</button>
    </div>

    <section class="wizard-hero stitch-panel pad">
      <span class="material-symbols-outlined">magic_button</span>
      <h2>Let's build something beautiful.</h2>
      <p>
        I'm your AI Co-organiser. Tell me the vibe you're dreaming of, and I'll handle
        the logistics, sourcing, and planning.
      </p>
      <textarea class="textarea">A sophisticated garden gala under the harvest moon, blending sustainable luxury with artisanal craftsmanship.</textarea>
      <div class="button-row">
        <button v-for="item in suggestions" :key="item" class="stitch-secondary" type="button">
          "{{ item }}"
        </button>
      </div>
    </section>

    <div class="stitch-grid-3 wizard-field-grid">
      <article v-for="[label, value, icon] in fields" :key="label" class="stitch-panel pad wizard-field">
        <span class="material-symbols-outlined">{{ icon }}</span>
        <p>{{ label }}</p>
        <strong>{{ value }}</strong>
      </article>
    </div>

    <aside class="wizard-side-note stitch-panel pad">
      <span class="material-symbols-outlined">auto_fix</span>
      <div>
        <h3>Need a venue?</h3>
        <p>I can suggest hidden gems based on your vibe. Takes about 30 seconds to dream up.</p>
      </div>
      <button class="stitch-primary" type="button">Generate Plan</button>
    </aside>
  </section>
</template>
