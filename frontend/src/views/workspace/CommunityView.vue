<script setup>
import { computed } from 'vue'

const props = defineProps({
  workspace: {
    type: Object,
    default: null,
  },
  workspaceLoading: {
    type: Boolean,
    default: false,
  },
  workspaceError: {
    type: String,
    default: null,
  },
})

const event = computed(() => props.workspace?.event)
const messages = computed(() => props.workspace?.messages ?? [])
const attendees = computed(() => props.workspace?.attendees ?? [])
const pinnedMessage = computed(() => messages.value.find((message) => message.is_pinned))
const online = computed(() => attendees.value.slice(0, 6))

const schedule = computed(() => {
  if (!event.value) {
    return []
  }

  return [
    [formatTime(event.value.starts_at), 'Guest arrival'],
    [formatTime(event.value.ends_at), 'Event close'],
  ]
})

function formatTime(value) {
  if (!value) {
    return 'TBD'
  }

  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}
</script>

<template>
  <section class="stitch-page community-stitch">
    <div class="community-layout">
      <aside class="stitch-panel pad community-event-card">
        <span class="stitch-chip">{{ event?.starts_at ? new Date(event.starts_at).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : 'Draft' }}</span>
        <h2>{{ event?.title || 'Loading event' }}</h2>
        <p>{{ event?.description || 'Community chat will activate once the workspace is loaded.' }}</p>
        <span class="stitch-chip neutral">Hosted by {{ event?.host_name || 'Gatherly' }}</span>

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
            <p>Event discussion, pinned updates, AI summaries, and translated attendee messages.</p>
          </div>
          <div class="stitch-actions">
            <button class="stitch-secondary" type="button">Summarize</button>
            <button class="stitch-secondary" type="button">Pin</button>
          </div>
        </div>

        <div v-if="pinnedMessage" class="pinned-message">
          <span class="material-symbols-outlined">push_pin</span>
          <div>
            <strong>Pinned by Host</strong>
            <p>{{ pinnedMessage.body }}</p>
          </div>
        </div>

        <div v-if="workspaceLoading" class="auth-error">Loading community workspace...</div>
        <div v-else-if="workspaceError" class="auth-error">{{ workspaceError }}</div>

        <div class="stitch-card-list">
          <div v-if="!messages.length" class="empty-state">
            <span class="material-symbols-outlined">forum</span>
            <h3>No community messages yet</h3>
            <p>Messages, host announcements, AI summaries, and real-time translations will appear here once participants start posting.</p>
          </div>
          <article v-for="message in messages" :key="message.id" class="chat-bubble">
            <div>
              <strong>{{ message.author_name }}</strong>
              <span>{{ formatTime(message.created_at) }}</span>
            </div>
            <p>{{ message.body }}</p>
          </article>
        </div>

        <div class="chat-input">
          <span>Message the event community...</span>
          <button class="material-symbols-outlined" type="button">send</button>
        </div>
      </main>

      <aside class="stitch-panel pad online-panel">
        <span class="stitch-chip good">{{ attendees.length }} Attendees</span>
        <div v-if="!online.length" class="empty-state compact">
          <p>No attendee roster yet.</p>
        </div>
        <div v-for="person in online" :key="person.id" class="online-person">
          <span class="workspace-avatar">{{ person.full_name.slice(0, 1) }}</span>
          <div>
            <strong>{{ person.full_name }}</strong>
            <p>{{ person.segment }}</p>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>
