import rawData from '../data/mock-data.json'

// Simulate async data loading
let _data = null
let _loadError = null

export async function loadData() {
  await new Promise(resolve => setTimeout(resolve, 400)) // simulate IO
  try {
    _data = rawData
    return { success: true }
  } catch (e) {
    _loadError = e
    return { success: false, error: e.message }
  }
}

function ensureLoaded() {
  if (!_data) throw new Error('Data not loaded yet')
}

// --- Statuses ---
export function getStatuses() {
  ensureLoaded()
  return _data.statuses
}

export function getStatusById(id) {
  ensureLoaded()
  return _data.statuses.find(s => s.id === id) ?? null
}

// --- Buildings ---
export function getBuildings() {
  ensureLoaded()
  return _data.buildings
}

export function getBuildingById(id) {
  ensureLoaded()
  return _data.buildings.find(b => b.id === id) ?? null
}

// --- Clients ---
export function getClients() {
  ensureLoaded()
  return _data.clients
}

export function getClientById(id) {
  ensureLoaded()
  return _data.clients.find(c => c.id === id) ?? null
}

// --- Objects ---
export function getObjects() {
  ensureLoaded()
  return _data.objects
}

export function getObjectById(id) {
  ensureLoaded()
  return _data.objects.find(o => o.id === id) ?? null
}

export function getObjectsByClientId(clientId) {
  ensureLoaded()
  return _data.objects.filter(o => o.client_id === clientId)
}

export function updateObject(id, patch) {
  ensureLoaded()
  const idx = _data.objects.findIndex(o => o.id === id)
  if (idx === -1) throw new Error(`Object ${id} not found`)
  _data.objects[idx] = { ..._data.objects[idx], ...patch }
  return _data.objects[idx]
}

// --- Contracts ---
export function getContracts() {
  ensureLoaded()
  return _data.contracts
}

export function getContractById(id) {
  ensureLoaded()
  return _data.contracts.find(c => c.id === id) ?? null
}

export function getContractsByClientId(clientId) {
  ensureLoaded()
  return _data.contracts.filter(c => c.client_id === clientId)
}

// --- Comments ---
export function getComments() {
  ensureLoaded()
  return _data.comments
}

export function getCommentsByClientId(clientId) {
  ensureLoaded()
  return _data.comments.filter(c => c.client_id === clientId)
}

// --- Analytics ---
export function getAnalytics() {
  ensureLoaded()
  return _data.analytics
}
