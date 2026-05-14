<template>
  <div class="clients-view">
    <!-- Loading -->
    <div v-if="store.loading" class="d-flex justify-content-center align-items-center py-5">
      <div class="spinner-border text-primary me-3" role="status"></div>
      <span class="text-muted">Загружаем данные...</span>
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="alert alert-danger d-flex align-items-center gap-3 m-4">
      <i class="bi bi-exclamation-triangle-fill fs-4"></i>
      <div>
        <strong>Ошибка чтения данных</strong><br>
        <span class="small">{{ store.error }}</span>
      </div>
      <button class="btn btn-sm btn-outline-danger ms-auto" @click="store.init()">Повторить</button>
    </div>

    <!-- Content -->
    <template v-else-if="store.loaded">
      <div class="page-header d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 px-3 pt-3">
        <div>
          <h5 class="mb-0 fw-bold">Клиенты</h5>
          <span class="text-muted small">{{ store.clients.length }} арендаторов</span>
        </div>
      </div>

      <!-- Filters -->
      <div class="px-3 mb-3">
        <FiltersBar
          v-model:search="search"
          v-model:statusFilter="filterStatusId"
          v-model:typeFilter="filterObjectType"
          :count="filtered.length"
          @reset-page="pagination.reset()"
          @reset-all="resetAll"
        />
      </div>

      <!-- Table -->
      <div class="table-card mx-3 mb-2 border rounded overflow-hidden">
        <ClientsTable
          v-if="paginated.length > 0"
          :clients="paginated"
          :sort-key="sortKey"
          :sort-dir="sortDir"
          :selected-id="selectedClient?.id ?? null"
          @open="openClient"
          @sort="setSort"
        />
        <EmptyState
          v-else
          icon="🔍"
          title="Ничего не найдено"
          subtitle="Попробуйте изменить поисковый запрос или сбросить фильтры"
        >
          <button class="btn btn-sm btn-outline-secondary mt-3" @click="resetAll">Сбросить фильтры</button>
        </EmptyState>
      </div>

      <!-- Pagination -->
      <div class="px-3">
        <PaginationBar
          :page="pagination.page.value"
          :total-pages="pagination.totalPages.value"
          @go="pagination.goTo"
        />
      </div>
    </template>

    <!-- Client Drawer -->
    <ClientDrawer :client="selectedClient" @close="selectedClient = null" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useDataStore } from '../stores/dataStore.js'
import { useSort } from '../composables/useSort.js'
import { useFilters } from '../composables/useFilters.js'
import { usePagination } from '../composables/usePagination.js'
import FiltersBar from '../components/client/FiltersBar.vue'
import ClientsTable from '../components/client/ClientsTable.vue'
import ClientDrawer from '../components/client/ClientDrawer.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import PaginationBar from '../components/ui/PaginationBar.vue'

const store = useDataStore()
const selectedClient = ref(null)

onMounted(() => {
  if (!store.loaded) store.init()
})

const { search, filterStatusId, filterObjectType, filtered, reset: resetFilters } = useFilters(
  computed(() => store.enrichedClients)
)
const { sortKey, sortDir, sorted, setSort } = useSort(filtered)
const pagination = usePagination(sorted, 10)
const paginated = pagination.paginated

// Reset page on filter change
watch([search, filterStatusId, filterObjectType], () => pagination.reset())

function resetAll() {
  resetFilters()
  pagination.reset()
}

function openClient(client) {
  selectedClient.value = selectedClient.value?.id === client.id ? null : client
}
</script>

<style scoped>
.clients-view { min-height: 100%; }
.table-card { background: #fff; }
.page-header h5 { font-size: 1.1rem; }
</style>
