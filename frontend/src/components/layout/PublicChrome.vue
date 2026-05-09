<script setup>
defineProps({
  active: {
    type: String,
    default: 'explore',
  },
})

const emit = defineEmits(['navigate'])
</script>

<template>
  <div class="public-shell">
    <header class="public-nav">
      <button class="public-logo" type="button" @click="emit('navigate', 'home')">Gatherly</button>
      <nav aria-label="Public navigation">
        <button
          class="public-link"
          :class="{ 'is-active': active === 'explore' }"
          type="button"
          @click="emit('navigate', 'explore')"
        >
          Explore
        </button>
        <a class="public-link" href="#how-it-works">How It Works</a>
      </nav>
      <div class="public-actions">
        <button class="public-login" type="button" @click="emit('navigate', 'auth')">Login</button>
        <button class="public-primary" type="button" @click="emit('navigate', 'auth')">Get Started</button>
      </div>
    </header>

    <slot />

    <footer class="landing-footer">
      <span>Gatherly</span>
      <p>(c) 2024 Gatherly. All rights reserved.</p>
      <nav aria-label="Footer navigation">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Contact Support</a>
      </nav>
    </footer>
  </div>
</template>
