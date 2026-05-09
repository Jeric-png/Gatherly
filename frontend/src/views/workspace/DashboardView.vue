<script setup>
const emit = defineEmits(['navigate'])

const metrics = [
  ['Attendees', '86/100', '86% capacity'],
  ['Budget', '$3.2k/$5k', 'Healthy runway'],
  ['Messages', '12', 'Unread vendor replies'],
]

const tasks = [
  ['Venue shortlist', 'Review Exa-ranked leads and approve outreach.', 'Review Now'],
  ['Marketing assets', 'Campaign Studio has poster and email drafts ready.', 'Open Studio'],
  ['Attendee reminders', '24-hour logistics email is ready to schedule.', 'Schedule'],
]
</script>

<template>
  <section class="stitch-page dashboard-stitch">
    <div class="stitch-topline">
      <div class="stitch-title-group">
        <h1>Cybersecurity AI Hackathon</h1>
        <p>October 24-26 - SMU Campus - Draft event workspace</p>
      </div>
      <div class="stitch-actions">
        <button class="stitch-secondary" type="button">Create Event</button>
        <button class="stitch-primary" type="button">Publish Event</button>
      </div>
    </div>

    <div class="stitch-grid-3">
      <article v-for="[label, value, detail] in metrics" :key="label" class="stitch-panel stitch-kpi">
        <span>{{ label }}</span>
        <strong>{{ value }}</strong>
        <p>{{ detail }}</p>
      </article>
    </div>

    <div class="dashboard-grid">
      <section class="stitch-panel pad">
        <div class="dashboard-progress">
          <div>
            <span class="stitch-chip">calendar_month Event setup</span>
            <h2>Launch progress</h2>
            <p>Gatherly has prepared the event structure, vendor queue, and marketing sequence.</p>
          </div>
          <strong>72%</strong>
        </div>
        <div class="progress-track"><div class="progress-bar" style="--progress: 72%"></div></div>
        <div class="stitch-card-list">
          <div v-for="[title, copy, cta] in tasks" :key="title" class="stitch-row-card">
            <div>
              <h3>{{ title }}</h3>
              <p>{{ copy }}</p>
            </div>
            <button class="stitch-secondary" type="button" @click="emit('navigate', cta === 'Open Studio' ? 'marketing' : 'venues')">
              {{ cta }}
            </button>
          </div>
        </div>
      </section>

      <aside class="stitch-panel pad dashboard-ai">
        <span class="material-symbols-outlined">smart_toy</span>
        <h3>AI Co-organiser</h3>
        <p>Ready to help with outreach, publishing, reminder drafts, and source-backed lead review.</p>
        <div class="ai-chat-input">
          <span>Ask what to do next...</span>
          <button class="material-symbols-outlined" type="button">send</button>
        </div>
      </aside>
    </div>
  </section>
</template>
