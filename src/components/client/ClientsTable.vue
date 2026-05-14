<template>
  <div class="table-responsive">
    <table class="table table-hover align-middle mb-0 clients-table">
      <thead>
        <tr>
          <SortableHeader label="№" field="id" :sort-key="sortKey" :sort-dir="sortDir" @sort="setSort('id')" />
          <SortableHeader label="Компания" field="arendator_company_name" :sort-key="sortKey" :sort-dir="sortDir" @sort="setSort('arendator_company_name')" />
          <SortableHeader label="Директор" field="arendator_director_name" :sort-key="sortKey" :sort-dir="sortDir" @sort="setSort('arendator_director_name')" class="d-none d-md-table-cell" />
          <th class="d-none d-lg-table-cell">Телефон</th>
          <SortableHeader label="Статус" field="status.name" :sort-key="sortKey" :sort-dir="sortDir" @sort="setSort('status.name')" />
          <SortableHeader label="Здание" field="building.name" :sort-key="sortKey" :sort-dir="sortDir" @sort="setSort('building.name')" class="d-none d-md-table-cell" />
          <th class="d-none d-lg-table-cell">Объекты</th>
          <SortableHeader label="Договор" field="latestContract.contract_number" :sort-key="sortKey" :sort-dir="sortDir" @sort="setSort('latestContract.contract_number')" class="d-none d-sm-table-cell" />
          <SortableHeader label="Дата" field="latestContract.created_at" :sort-key="sortKey" :sort-dir="sortDir" @sort="setSort('latestContract.created_at')" class="d-none d-xl-table-cell" />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(client, idx) in clients"
          :key="client.id"
          @click="$emit('open', client)"
          class="client-row"
          :class="{ selected: selectedId === client.id }"
          style="cursor:pointer"
        >
          <td class="text-muted small">{{ idx + 1 }}</td>
          <td>
            <div class="fw-semibold">{{ client.trade_name_company }}</div>
            <div class="text-muted x-small">{{ client.arendator_company_name }}</div>
          </td>
          <td class="d-none d-md-table-cell small">{{ client.arendator_director_name }}</td>
          <td class="d-none d-lg-table-cell small text-nowrap">
            <a :href="`tel:${client.arendator_phone_number}`" @click.stop>{{ client.arendator_phone_number }}</a>
          </td>
          <td>
            <StatusBadge
              v-if="client.status"
              :name="client.status.name"
              :color="client.status.color"
            />
            <span v-else class="text-muted x-small">—</span>
          </td>
          <td class="d-none d-md-table-cell small">
            {{ client.building?.name ?? '—' }}
          </td>
          <td class="d-none d-lg-table-cell">
            <div class="d-flex flex-wrap gap-1">
              <span
                v-for="obj in client.objects"
                :key="obj.id"
                class="badge bg-light text-dark border"
                style="font-size:0.7rem; font-weight:500"
              >{{ obj.name }}</span>
            </div>
          </td>
          <td class="d-none d-sm-table-cell small text-nowrap">
            {{ client.latestContract?.contract_number ?? '—' }}
          </td>
          <td class="d-none d-xl-table-cell small text-muted text-nowrap">
            {{ formatDate(client.latestContract?.created_at) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import SortableHeader from '../ui/SortableHeader.vue'
import StatusBadge from '../ui/StatusBadge.vue'

defineProps({
  clients: { type: Array, required: true },
  sortKey: String,
  sortDir: String,
  selectedId: { type: Number, default: null },
})
const emit = defineEmits(['open', 'sort'])

function setSort(key) { emit('sort', key) }

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<style scoped>
.clients-table th { font-size: 0.78rem; font-weight: 600; padding: 10px 12px; }
.clients-table td { padding: 10px 12px; font-size: 0.85rem; }
.client-row { transition: background 0.1s; }
.client-row:hover td { background: #f0f7ff !important; }
.client-row.selected td { background: #e8f0fe !important; }
.x-small { font-size: 0.72rem; }
</style>
