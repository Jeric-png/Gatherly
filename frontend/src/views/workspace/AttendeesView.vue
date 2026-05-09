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
const attendees = computed(() => props.workspace?.attendees ?? [])

const confirmedCount = computed(
  () => attendees.value.filter((attendee) => attendee.status === 'confirmed').length,
)
const waitlistCount = computed(
  () => attendees.value.filter((attendee) => attendee.status === 'waitlist').length,
)
const checkedInCount = computed(
  () => attendees.value.filter((attendee) => attendee.status === 'checked_in').length,
)
const vipCount = computed(
  () => attendees.value.filter((attendee) => attendee.segment?.toLowerCase().includes('vip')).length,
)
const reminderReadyCount = computed(
  () => attendees.value.filter((attendee) => attendee.reminder_status === 'draft_ready').length,
)

const stats = computed(() => [
  ['RSVPs', String(attendees.value.length), event.value?.capacity ? `${event.value.capacity} capacity` : 'Live attendee table'],
  ['Confirmed', String(confirmedCount.value), 'Ready for mailing list'],
  ['Waitlist', String(waitlistCount.value), 'Priority follow-up segment'],
  ['Checked-in', String(checkedInCount.value), 'Live door status'],
  ['VIPs', String(vipCount.value), 'Segmented for tailored reminders'],
  ['Reminder Drafts', String(reminderReadyCount.value), 'AI-ready email queue'],
])

const segments = computed(() => [
  ['Confirmed Attendees', confirmedCount.value, 'confirmed'],
  ['Waitlist Priority', waitlistCount.value, 'waitlist'],
  ['VIP Table Assignments', vipCount.value, 'vip'],
])

function formatStatus(status) {
  return status.replaceAll('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase())
}
</script>

<template>
  <section class="stitch-page attendee-stitch">
    <div class="stitch-topline">
      <div class="stitch-title-group">
        <h2>Operations Workspace</h2>
        <p>{{ event?.title || 'Loading workspace' }} - attendee operations and approved messaging</p>
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
        <span class="stitch-chip">
          <span class="material-symbols-outlined">auto_awesome</span>
          AI Mailing List Builder
        </span>
        <h3>Suggesting segments based on activity</h3>
        <div class="stitch-card-list">
          <div v-for="[label, count, segment] in segments" :key="segment" class="stitch-row-card">
            <div><h4>{{ label }}</h4><p>{{ count }} recipients</p></div>
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
          <strong>{{ attendees.length ? 'Tomorrow, 9:00 AM' : 'Waiting for attendee data' }}</strong>
          <button class="stitch-secondary" type="button">Change</button>
          <button class="stitch-primary" type="button">Schedule Campaign</button>
        </div>
      </section>
    </div>

    <div v-if="workspaceLoading" class="stitch-panel pad auth-error">Loading attendee workspace...</div>
    <div v-else-if="workspaceError" class="stitch-panel pad auth-error">{{ workspaceError }}</div>

    <section class="stitch-panel attendee-table">
      <div v-if="!attendees.length" class="empty-state">
        <span class="material-symbols-outlined">groups</span>
        <h3>No attendees yet</h3>
        <p>Once RSVPs, imports, or AI-populated mailing lists are added, this table becomes the source for reminders, translated emails, and check-in operations.</p>
      </div>
      <div v-for="attendee in attendees" :key="attendee.id" class="attendee-row">
        <div>
          <strong>{{ attendee.full_name }}</strong>
          <p>{{ attendee.email }}</p>
        </div>
        <span class="stitch-chip good">{{ formatStatus(attendee.status) }}</span>
        <span class="stitch-chip neutral">{{ attendee.segment }}</span>
      </div>
    </section>
  </section>
</template>
