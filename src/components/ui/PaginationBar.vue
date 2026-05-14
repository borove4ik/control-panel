<template>
  <nav v-if="totalPages > 1" class="d-flex justify-content-center align-items-center gap-2 mt-3 flex-wrap">
    <button class="btn btn-sm btn-outline-secondary" :disabled="page <= 1" @click="$emit('go', page - 1)">←</button>
    <template v-for="p in pages" :key="p">
      <span v-if="p === '...'" class="px-1 text-muted">…</span>
      <button
        v-else
        class="btn btn-sm"
        :class="p === page ? 'btn-primary' : 'btn-outline-secondary'"
        @click="$emit('go', p)"
      >{{ p }}</button>
    </template>
    <button class="btn btn-sm btn-outline-secondary" :disabled="page >= totalPages" @click="$emit('go', page + 1)">→</button>
    <span class="text-muted small ms-2">{{ page }} / {{ totalPages }}</span>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ page: Number, totalPages: Number })
defineEmits(['go'])

const pages = computed(() => {
  const total = props.totalPages
  const cur = props.page
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const p = []
  p.push(1)
  if (cur > 3) p.push('...')
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) p.push(i)
  if (cur < total - 2) p.push('...')
  p.push(total)
  return p
})
</script>
