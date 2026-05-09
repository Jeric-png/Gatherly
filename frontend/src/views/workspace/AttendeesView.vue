<script setup>
const stats = [
  ['RSVPs', '128', '85% response rate'],
  ['Confirmed', '92', '+5 since yesterday'],
  ['Waitlist', '18', 'High demand'],
  ['Checked-in', '45', '49% progress'],
  ['VIPs', '24', '100% confirmed'],
  ['Pending Pay', '12', 'Requires action'],
]

const attendees = [
  ['Sarah Miller', 'sarah.m@designco.com', 'Confirmed', 'VIP'],
  ['Marcus Chen', 'm.chen@arch.edu', 'Confirmed', 'General'],
  ['Lydia White', 'lydia@curate.art', 'Waitlist', 'VIP'],
  ['Elena Rodriguez', 'elena.r@techventures.io', 'Confirmed', 'Press'],
]
</script>

<template>
  <section class="stitch-page attendee-stitch">
    <div class="stitch-topline">
      <div class="stitch-title-group">
        <h2>Operations Workspace</h2>
        <p>Summer Solstice Gala - Attendee operations and approved messaging</p>
      </div>
      <div class="stitch-actions">
        <button class="stitch-secondary" type="button">Export Logs</button>
        <button class="stitch-primary" type="button">Add Attendee</button>
      </div>
    </div>

    <div class="attendee-stat-grid">
      <article v-for="[label, value, detail] in stats" :key="label" class="stitch-panel stitch-kpi">
        <span>{{ label }}</span>
        <strong>{{ value }}</strong>
        <p>{{ detail }}</p>
      </article>
    </div>

    <div class="attendee-grid">
      <section class="stitch-panel pad">
        <span class="stitch-chip">auto_awesome AI Mailing List Builder</span>
        <h3>Suggesting segments based on activity</h3>
        <div class="stitch-card-list">
          <div class="stitch-row-card">
            <div><h4>Confirmed Attendees</h4><p>92 recipients</p></div>
            <button class="stitch-primary" type="button">Create List</button>
          </div>
          <div class="stitch-row-card">
            <div><h4>Waitlist Priority</h4><p>18 recipients</p></div>
            <button class="stitch-primary" type="button">Create List</button>
          </div>
          <div class="stitch-row-card">
            <div><h4>VIP Table Assignments</h4><p>24 recipients</p></div>
            <button class="stitch-primary" type="button">Create List</button>
          </div>
        </div>
      </section>

      <section class="stitch-panel pad">
        <h3>Reminder & Email Composer</h3>
        <div class="button-row">
          <button class="stitch-primary" type="button">Pre-event Template</button>
          <button class="stitch-secondary" type="button">Last-call Alert</button>
        </div>
        <div class="scheduled-card">
          <span class="material-symbols-outlined">schedule</span>
          <strong>Tomorrow, 9:00 AM</strong>
          <button class="stitch-secondary" type="button">Change</button>
          <button class="stitch-primary" type="button">Schedule Campaign</button>
        </div>
      </section>
    </div>

    <section class="stitch-panel attendee-table">
      <div v-for="[name, email, status, group] in attendees" :key="email" class="attendee-row">
        <div>
          <strong>{{ name }}</strong>
          <p>{{ email }}</p>
        </div>
        <span class="stitch-chip good">{{ status }}</span>
        <span class="stitch-chip neutral">{{ group }}</span>
      </div>
    </section>
  </section>
</template>
