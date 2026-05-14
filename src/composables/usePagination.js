import { ref, computed } from 'vue'

export function usePagination(items, pageSize = 10) {
  const page = ref(1)

  const totalPages = computed(() => Math.max(1, Math.ceil(items.value.length / pageSize)))

  const paginated = computed(() => {
    const start = (page.value - 1) * pageSize
    return items.value.slice(start, start + pageSize)
  })

  function goTo(p) {
    page.value = Math.max(1, Math.min(p, totalPages.value))
  }

  function reset() {
    page.value = 1
  }

  return { page, totalPages, paginated, goTo, reset }
}
