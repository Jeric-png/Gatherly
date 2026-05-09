<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import AppShell from './components/layout/AppShell.vue'
import HomeView from './views/public/HomeView.vue'
import ExploreView from './views/public/ExploreView.vue'
import EventDetailView from './views/public/EventDetailView.vue'
import DashboardView from './views/workspace/DashboardView.vue'
import EventWizardView from './views/workspace/EventWizardView.vue'
import VenueView from './views/workspace/VenueView.vue'
import VendorView from './views/workspace/VendorView.vue'
import MarketingStudioView from './views/workspace/MarketingStudioView.vue'
import AttendeesView from './views/workspace/AttendeesView.vue'
import CommunityView from './views/workspace/CommunityView.vue'

const publicPages = [
  { id: 'home', label: 'Home', component: HomeView },
  { id: 'explore', label: 'Explore', component: ExploreView },
  { id: 'event', label: 'Event page', component: EventDetailView },
]

const workspacePages = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', component: DashboardView },
  { id: 'wizard', label: 'AI event wizard', icon: 'auto_awesome', component: EventWizardView },
  { id: 'venues', label: 'Venue', icon: 'location_on', component: VenueView },
  { id: 'vendors', label: 'Vendors', icon: 'storefront', component: VendorView },
  { id: 'marketing', label: 'Marketing', icon: 'campaign', component: MarketingStudioView },
  { id: 'attendees', label: 'Attendees', icon: 'groups', component: AttendeesView },
  { id: 'community', label: 'Community', icon: 'forum', component: CommunityView },
]

const allPages = [...publicPages, ...workspacePages]
const activeView = ref('home')

const activeComponent = computed(() => {
  return allPages.find((page) => page.id === activeView.value)?.component ?? DashboardView
})

const isPublicPage = computed(() => ['home', 'explore', 'event'].includes(activeView.value))

watch(activeView, async () => {
  await nextTick()
  window.scrollTo({ top: 0, left: 0 })
})
</script>

<template>
  <component v-if="isPublicPage" :is="activeComponent" @navigate="activeView = $event" />

  <AppShell
    v-else
    :active-view="activeView"
    :workspace-pages="workspacePages"
    @navigate="activeView = $event"
  >
    <component :is="activeComponent" @navigate="activeView = $event" />
  </AppShell>
</template>
