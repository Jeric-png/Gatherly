<script setup>
defineProps({
  activeView: {
    type: String,
    required: true,
  },
  workspacePages: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['navigate'])
</script>

<template>
  <div class="workspace-shell">
    <nav class="workspace-mobile-tabs" aria-label="Mobile page navigation">
      <button
        v-for="page in workspacePages"
        :key="page.id"
        class="btn small"
        :class="page.id === activeView ? 'primary' : 'secondary'"
        type="button"
        @click="emit('navigate', page.id)"
      >
        {{ page.label }}
      </button>
    </nav>

    <aside class="workspace-sidebar" aria-label="Workspace navigation">
      <div class="workspace-brand">
        <button class="workspace-logo" type="button" @click="emit('navigate', 'dashboard')">G</button>
        <div>
          <h1>Gatherly Workspace</h1>
          <p>Event Organiser</p>
        </div>
      </div>

      <div class="workspace-nav-block">
        <div class="workspace-nav-stack">
            <button
              v-for="page in workspacePages"
              :key="page.id"
              class="workspace-nav-item"
              :class="{ 'is-active': page.id === activeView }"
              type="button"
              @click="emit('navigate', page.id)"
            >
              <span class="material-symbols-outlined">{{ page.icon }}</span>
              <span>{{ page.label }}</span>
            </button>
        </div>

        <button class="workspace-nav-item" type="button">
          <span class="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </button>
      </div>

      <div class="workspace-ai-card">
        <span class="material-symbols-outlined">auto_awesome</span>
        <strong>AI Co-organiser</strong>
        <p>Drafting, ranking, and campaign support ready.</p>
      </div>

      <div class="workspace-profile">
        <span class="workspace-avatar">JT</span>
        <div>
          <strong>Julian Thorne</strong>
          <p>Premium Host</p>
        </div>
      </div>
    </aside>

    <main class="workspace-main">
      <slot />
    </main>
  </div>
</template>
