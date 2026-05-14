<template>
  <th
    class="sortable-th"
    :class="{ active: sortKey === field }"
    v-bind="filteredAttrs"
    @click="$emit('sort')"
    style="cursor:pointer; user-select:none; white-space:nowrap"
  >
    <span>{{ label }}</span>
    <span class="ms-1">
      <template v-if="sortKey === field">{{ sortDir === 'asc' ? '↑' : '↓' }}</template>
      <span v-else style="opacity:0.25">↕</span>
    </span>
  </th>
</template>

<script setup>
import { useAttrs, computed } from 'vue'
defineOptions({ inheritAttrs: false })

const props = defineProps({
  label: String,
  field: String,
  sortKey: String,
  sortDir: String,
})
defineEmits(['sort'])

const attrs = useAttrs()
const filteredAttrs = computed(() => {
  const { class: _, ...rest } = attrs
  return rest
})
</script>

<style scoped>
.sortable-th { background: #f8f9fa; color: #6c757d; transition: background 0.15s; }
.sortable-th:hover { background: #e9ecef; color: #212529; }
.sortable-th.active { color: #0d6efd; background: #f0f7ff; }
</style>
