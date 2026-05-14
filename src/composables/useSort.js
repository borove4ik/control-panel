import { ref, computed } from 'vue'

export function useSort(items) {
  const sortKey = ref(null)
  const sortDir = ref('asc') // 'asc' | 'desc'

  function setSort(key) {
    if (sortKey.value === key) {
      sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortDir.value = 'asc'
    }
  }

  const sorted = computed(() => {
    if (!sortKey.value) return items.value
    return [...items.value].sort((a, b) => {
      const aVal = resolve(a, sortKey.value)
      const bVal = resolve(b, sortKey.value)
      const cmp = compare(aVal, bVal)
      return sortDir.value === 'asc' ? cmp : -cmp
    })
  })

  return { sortKey, sortDir, sorted, setSort }
}

function resolve(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

function compare(a, b) {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b, 'ru')
  return a < b ? -1 : a > b ? 1 : 0
}
