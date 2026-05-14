<template>
  <span
    class="status-badge"
    :style="{ backgroundColor: color + '22', color: color, borderColor: color + '55' }"
  >
    <span class="status-dot" :style="{ backgroundColor: color }"></span>
    {{ name }}
  </span>
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  color: { type: String, default: '#888' },
})
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  border: 1px solid;
  white-space: nowrap;
  letter-spacing: 0.01em;
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
