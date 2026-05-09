<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import AppShell from './components/layout/AppShell.vue'
import HomeView from './views/public/HomeView.vue'
import ExploreView from './views/public/ExploreView.vue'
import EventDetailView from './views/public/EventDetailView.vue'
import AuthView from './views/public/AuthView.vue'
import DashboardView from './views/workspace/DashboardView.vue'
import EventWizardView from './views/workspace/EventWizardView.vue'
import VenueView from './views/workspace/VenueView.vue'
import VendorView from './views/workspace/VendorView.vue'
import MarketingStudioView from './views/workspace/MarketingStudioView.vue'
import AttendeesView from './views/workspace/AttendeesView.vue'
import CommunityView from './views/workspace/CommunityView.vue'
import { fetchPublicEvents } from './services/publicEvents'
import { authState, initAuth, signOut } from './services/auth'
import { ensureWorkspace } from './services/workspaceData'

const publicPages = [
  { id: 'home', label: 'Home', component: HomeView },
  { id: 'explore', label: 'Explore', component: ExploreView },
  { id: 'event', label: 'Event page', component: EventDetailView },
  { id: 'auth', label: 'Sign in', component: AuthView },
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
const publicEvents = ref([])
const publicEventsLoading = ref(true)
const publicEventsSource = ref('fallback')
const publicEventsError = ref(null)
const workspaceBundle = ref(null)
const workspaceLoading = ref(false)
const workspaceError = ref(null)

const activeComponent = computed(() => {
  return allPages.find((page) => page.id === activeView.value)?.component ?? DashboardView
})

const isPublicPage = computed(() => ['home', 'explore', 'event', 'auth'].includes(activeView.value))
const shouldShowAuthGate = computed(() => !isPublicPage.value && authState.ready && !authState.session)

async function loadWorkspace() {
  if (!authState.user) {
    workspaceBundle.value = null
    return
  }

  workspaceLoading.value = true
  workspaceError.value = null

  try {
    workspaceBundle.value = await ensureWorkspace(authState.user)
  } catch (error) {
    workspaceError.value = error.message
  } finally {
    workspaceLoading.value = false
  }
}

async function handleSignOut() {
  await signOut()
  workspaceBundle.value = null
  activeView.value = 'home'
}

watch(activeView, async () => {
  await nextTick()
  window.scrollTo({ top: 0, left: 0 })
})

onMounted(async () => {
  await initAuth()

  const result = await fetchPublicEvents()

  publicEvents.value = result.events
  publicEventsSource.value = result.source
  publicEventsError.value = result.error
  publicEventsLoading.value = false

  if (authState.session) {
    await loadWorkspace()
  }
})

watch(
  () => authState.session,
  async (session) => {
    if (session) {
      await loadWorkspace()
    } else {
      workspaceBundle.value = null
    }
  },
)
</script>

<template>
  <component
    v-if="isPublicPage"
    :is="activeComponent"
    :public-events="publicEvents"
    :public-events-loading="publicEventsLoading"
    :public-events-source="publicEventsSource"
    :public-events-error="publicEventsError"
    :session="authState.session"
    @navigate="activeView = $event"
  />

  <AuthView v-else-if="shouldShowAuthGate" @navigate="activeView = $event" />

  <AppShell
    v-else
    :active-view="activeView"
    :workspace-pages="workspacePages"
    :user="authState.user"
    :workspace="workspaceBundle"
    @navigate="activeView = $event"
    @sign-out="handleSignOut"
  >
    <component
      :is="activeComponent"
      :workspace="workspaceBundle"
      :workspace-loading="workspaceLoading"
      :workspace-error="workspaceError"
      @navigate="activeView = $event"
      @refresh-workspace="loadWorkspace"
    />
  </AppShell>
</template>
