import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as repo from '../repository/index.js'

export const useDataStore = defineStore('data', () => {
  // State
  const loading = ref(false)
  const error = ref(null)
  const loaded = ref(false)

  const statuses = ref([])
  const buildings = ref([])
  const clients = ref([])
  const objects = ref([])
  const contracts = ref([])
  const comments = ref([])
  const analytics = ref(null)

  // Load all data
  async function init() {
    loading.value = true
    error.value = null
    try {
      const result = await repo.loadData()
      if (!result.success) throw new Error(result.error)
      statuses.value = repo.getStatuses()
      buildings.value = repo.getBuildings()
      clients.value = repo.getClients()
      objects.value = repo.getObjects()
      contracts.value = repo.getContracts()
      comments.value = repo.getComments()
      analytics.value = repo.getAnalytics()
      loaded.value = true
    } catch (e) {
      error.value = e.message || 'Ошибка загрузки данных'
    } finally {
      loading.value = false
    }
  }

  // Normalized selectors
  const statusMap = computed(() => Object.fromEntries(statuses.value.map(s => [s.id, s])))
  const buildingMap = computed(() => Object.fromEntries(buildings.value.map(b => [b.id, b])))
  const clientMap = computed(() => Object.fromEntries(clients.value.map(c => [c.id, c])))

  // Enriched clients with joined data
  const enrichedClients = computed(() => {
    return clients.value.map(client => {
      const clientContracts = contracts.value.filter(c => c.client_id === client.id)
      const clientObjects = objects.value.filter(o => o.client_id === client.id)
      const latestContract = clientContracts[clientContracts.length - 1] ?? null
      const status = latestContract ? statusMap.value[latestContract.status_id] : null
      const building = latestContract ? buildingMap.value[latestContract.building_id] : null

      return {
        ...client,
        contracts: clientContracts,
        objects: clientObjects,
        latestContract,
        status,
        building,
      }
    })
  })

  // Update object (floor change etc)
  function updateObject(id, patch) {
    const updated = repo.updateObject(id, patch)
    const idx = objects.value.findIndex(o => o.id === id)
    if (idx !== -1) objects.value[idx] = { ...objects.value[idx], ...patch }
    return updated
  }

  // Get enriched client by id
  function getEnrichedClientById(id) {
    return enrichedClients.value.find(c => c.id === id) ?? null
  }

  // Get objects by client
  function getObjectsByClient(clientId) {
    return objects.value.filter(o => o.client_id === clientId)
  }

  // Get contracts by client
  function getContractsByClient(clientId) {
    return contracts.value.filter(c => c.client_id === clientId)
  }

  // Get comments by client
  function getCommentsByClient(clientId) {
    return comments.value.filter(c => c.client_id === clientId)
  }

  // Get building floors (reactive, recalculated after object edit)
  function getBuildingFloors(buildingId) {
    const buildingObjects = objects.value.filter(o => o.building_id === buildingId)
    const floors = [...new Set(buildingObjects.map(o => o.floor))].sort((a, b) => a - b)
    return floors
  }

  return {
    loading, error, loaded,
    statuses, buildings, clients, objects, contracts, comments, analytics,
    statusMap, buildingMap, clientMap,
    enrichedClients,
    init, updateObject,
    getEnrichedClientById, getObjectsByClient, getContractsByClient,
    getCommentsByClient, getBuildingFloors,
  }
})
