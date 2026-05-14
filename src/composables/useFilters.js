import { ref, computed } from 'vue'

export function useFilters(items) {
  const search = ref('')
  const filterStatusId = ref(null)
  const filterObjectType = ref(null)

  const filtered = computed(() => {
    return items.value.filter(client => {
      const q = search.value.trim().toLowerCase()

      if (q) {
        const contractNum = client.latestContract?.contract_number?.toLowerCase() ?? ''
        const company = client.arendator_company_name?.toLowerCase() ?? ''
        const trade = client.trade_name_company?.toLowerCase() ?? ''
        const director = client.arendator_director_name?.toLowerCase() ?? ''
        const building = client.building?.name?.toLowerCase() ?? ''
        const match = company.includes(q) || trade.includes(q) ||
          director.includes(q) || contractNum.includes(q) || building.includes(q)
        if (!match) return false
      }

      if (filterStatusId.value !== null) {
        if (client.status?.id !== filterStatusId.value) return false
      }

      if (filterObjectType.value) {
        const hasType = client.objects.some(o => o.object_type === filterObjectType.value)
        if (!hasType) return false
      }

      return true
    })
  })

  function reset() {
    search.value = ''
    filterStatusId.value = null
    filterObjectType.value = null
  }

  return { search, filterStatusId, filterObjectType, filtered, reset }
}
