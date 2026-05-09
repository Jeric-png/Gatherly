<script setup>
import { computed, ref } from 'vue'
import PublicChrome from '../../components/layout/PublicChrome.vue'
import { authState, signInWithEmail, signUpWithEmail } from '../../services/auth'

const emit = defineEmits(['navigate'])

const mode = ref('signin')
const displayName = ref('')
const email = ref('')
const password = ref('')
const localMessage = ref('')

const isSignup = computed(() => mode.value === 'signup')
const title = computed(() => (isSignup.value ? 'Create your Gatherly workspace' : 'Sign in to Gatherly'))
const cta = computed(() => (isSignup.value ? 'Create Account' : 'Sign In'))
const passwordAutocomplete = computed(() => (isSignup.value ? 'new-password' : 'current-password'))

async function submitAuth() {
  localMessage.value = ''

  const result = isSignup.value
    ? await signUpWithEmail(email.value, password.value, displayName.value)
    : await signInWithEmail(email.value, password.value)

  if (result.error) {
    return
  }

  if (!result.session) {
    localMessage.value = 'Check your email to confirm the account, then sign in.'
    mode.value = 'signin'
    return
  }

  emit('navigate', 'dashboard')
}
</script>

<template>
  <PublicChrome active="auth" @navigate="emit('navigate', $event)">
    <main class="auth-stitch">
      <section class="auth-panel stitch-panel pad">
        <span class="stitch-chip">
          <span class="material-symbols-outlined">auto_awesome</span>
          Organiser access
        </span>
        <h1>{{ title }}</h1>
        <p>
          Sign in to manage AI-assisted venue sourcing, vendor outreach, campaign generation,
          and attendee operations from one workspace.
        </p>

        <form class="auth-form" @submit.prevent="submitAuth">
          <label v-if="isSignup">
            <span>Name</span>
            <input v-model="displayName" type="text" autocomplete="name" placeholder="Your name" />
          </label>

          <label>
            <span>Email</span>
            <input v-model="email" type="email" autocomplete="email" placeholder="you@example.com" required />
          </label>

          <label>
            <span>Password</span>
            <input
              v-model="password"
              type="password"
              :autocomplete="passwordAutocomplete"
              minlength="6"
              placeholder="At least 6 characters"
              required
            />
          </label>

          <button class="stitch-primary" type="submit" :disabled="authState.loading">
            {{ authState.loading ? 'Working...' : cta }}
          </button>
        </form>

        <p v-if="authState.error" class="auth-error">{{ authState.error }}</p>
        <p v-if="localMessage" class="auth-note">{{ localMessage }}</p>

        <button
          class="auth-switch"
          type="button"
          @click="mode = isSignup ? 'signin' : 'signup'"
        >
          {{ isSignup ? 'Already have an account? Sign in' : 'New to Gatherly? Create an account' }}
        </button>
      </section>

      <aside class="auth-context">
        <div class="auth-context-card">
          <span class="material-symbols-outlined">location_on</span>
          <strong>Venue management</strong>
          <p>Save ranked venue leads and generate outreach drafts.</p>
        </div>
        <div class="auth-context-card">
          <span class="material-symbols-outlined">storefront</span>
          <strong>Vendor management</strong>
          <p>Compare suppliers and keep follow-ups inside the event workspace.</p>
        </div>
        <div class="auth-context-card">
          <span class="material-symbols-outlined">campaign</span>
          <strong>Marketing studio</strong>
          <p>Turn event details, venues, and vendors into campaigns and promo assets.</p>
        </div>
      </aside>
    </main>
  </PublicChrome>
</template>
