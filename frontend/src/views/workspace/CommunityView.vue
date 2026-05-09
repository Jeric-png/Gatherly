<script setup>
const schedule = [
  ['09:00 AM', 'Registration & Coffee'],
  ['10:00 AM', 'Opening Brief'],
  ['11:00 AM', 'Team Formation'],
  ['12:30 PM', 'Hacking Begins'],
]

const messages = [
  ['Amanda', '10:42 AM', 'Does anyone have a spare USB-C adapter for the demo table?'],
  ['Jeric', '10:45 AM', 'Backend API skeleton is ready. I pushed the schema notes into the group doc.'],
  ['Ryan', '10:50 AM', 'Can we confirm team formation rules before the opening brief?'],
  ['Event Helper AI', '10:51 AM', 'Summary: attendees are asking about setup equipment and team formation rules.'],
]

const online = ['Amanda C.', 'Jeric T.', 'Ryan M.', 'Sarah K.']
</script>

<template>
  <section class="stitch-page community-stitch">
    <div class="community-layout">
      <aside class="stitch-panel pad community-event-card">
        <span class="stitch-chip">Oct 24-26</span>
        <h2>Cybersecurity AI Hackathon</h2>
        <p>Building next-gen threat detection with LLMs.</p>
        <span class="stitch-chip neutral">Hosted by TechHub</span>

        <h3>Event Schedule</h3>
        <div class="stitch-card-list">
          <div v-for="[time, title] in schedule" :key="time" class="schedule-row">
            <strong>{{ time }}</strong>
            <span>{{ title }}</span>
          </div>
        </div>
      </aside>

      <main class="stitch-panel pad chat-panel">
        <div class="stitch-topline">
          <div class="stitch-title-group">
            <h2>General Chat</h2>
            <p>Event discussion, pinned updates, and AI summaries.</p>
          </div>
          <div class="stitch-actions">
            <button class="stitch-secondary" type="button">Summarize</button>
            <button class="stitch-secondary" type="button">Pin</button>
          </div>
        </div>

        <div class="pinned-message">
          <span class="material-symbols-outlined">push_pin</span>
          <div>
            <strong>Pinned by Host</strong>
            <p>Welcome! Ensure you have Docker installed before the opening brief.</p>
          </div>
        </div>

        <div class="stitch-card-list">
          <article v-for="[author, time, body] in messages" :key="author + time" class="chat-bubble">
            <div>
              <strong>{{ author }}</strong>
              <span>{{ time }}</span>
            </div>
            <p>{{ body }}</p>
          </article>
        </div>

        <div class="chat-input">
          <span>Message the event community...</span>
          <button class="material-symbols-outlined" type="button">send</button>
        </div>
      </main>

      <aside class="stitch-panel pad online-panel">
        <span class="stitch-chip good">142 Online</span>
        <div v-for="person in online" :key="person" class="online-person">
          <span class="workspace-avatar">{{ person.slice(0, 1) }}</span>
          <div>
            <strong>{{ person }}</strong>
            <p>Frontend - Product</p>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>
