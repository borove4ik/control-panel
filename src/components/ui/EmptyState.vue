<template>
  <div class="empty-state text-center py-5">
    <div class="empty-icon mb-3">{{ icon }}</div>
    <p class="empty-title fw-semibold mb-1">{{ title }}</p>
    <p v-if="subtitle" class="text-muted small mb-0">{{ subtitle }}</p>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: '📭' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<style scoped>
.empty-state { color: #6c757d; }
.empty-icon { font-size: 2.5rem; }
.empty-title { font-size: 1rem; color: #495057; }
</style>
