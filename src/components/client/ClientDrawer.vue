<template>
  <Teleport to="body">
    <transition name="drawer">
      <div v-if="client" class="drawer-overlay" @click.self="$emit('close')">
        <div class="drawer-panel" role="dialog" aria-modal="true">
          <!-- Header -->
          <div class="drawer-header d-flex align-items-start justify-content-between">
            <div>
              <div class="fw-bold fs-6">{{ client.trade_name_company }}</div>
              <div class="text-muted small">{{ client.arendator_company_name }}</div>
            </div>
            <button class="btn-close" @click="$emit('close')" aria-label="Закрыть" />
          </div>

          <div class="drawer-body">
            <!-- Contact info -->
            <section class="section-block">
              <h6 class="section-title">Контакты</h6>
              <div class="info-grid">
                <div class="info-row"><span class="info-label">Директор</span><span>{{ client.arendator_director_name }}</span></div>
                <div class="info-row"><span class="info-label">Телефон</span><a :href="`tel:${client.arendator_phone_number}`">{{ client.arendator_phone_number }}</a></div>
                <div class="info-row"><span class="info-label">Email</span><a :href="`mailto:${client.email}`">{{ client.email }}</a></div>
                <div class="info-row"><span class="info-label">БИН</span><span>{{ client.arendator_bin }}</span></div>
                <div class="info-row" v-if="client.notification_telagram"><span class="info-label">Telegram</span><span>{{ client.notification_telagram }}</span></div>
              </div>
              <div v-if="client.additional_info" class="additional-info mt-2 p-2 rounded small text-muted">
                ℹ️ {{ client.additional_info }}
              </div>
            </section>

            <!-- Contracts -->
            <section class="section-block">
              <h6 class="section-title">Договоры ({{ contracts.length }})</h6>
              <div v-if="contracts.length === 0">
                <EmptyState icon="📄" title="Нет договоров" />
              </div>
              <div v-else class="contracts-list">
                <div v-for="c in contracts" :key="c.id" class="contract-card">
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-semibold small">{{ c.contract_number }}</span>
                    <StatusBadge v-if="statusMap[c.status_id]" :name="statusMap[c.status_id].name" :color="statusMap[c.status_id].color" />
                  </div>
                  <div class="text-muted x-small mt-1">
                    {{ buildingMap[c.building_id]?.name }} · {{ formatDate(c.created_at) }}
                  </div>
                  <div class="text-muted x-small">Объекты: {{ c.object_ids.join(', ') }}</div>
                </div>
              </div>
            </section>

            <!-- Objects -->
            <section class="section-block">
              <h6 class="section-title">Объекты ({{ objects.length }})</h6>
              <div v-if="objects.length === 0">
                <EmptyState icon="🏢" title="Нет объектов" />
              </div>
              <div v-else class="objects-list">
                <div v-for="obj in objects" :key="obj.id" class="object-card">
                  <template v-if="editingObjectId === obj.id">
                    <ObjectEditForm :obj="obj" @saved="editingObjectId = null" @cancel="editingObjectId = null" />
                  </template>
                  <template v-else>
                    <div class="d-flex justify-content-between align-items-start">
                      <div>
                        <div class="fw-semibold small">{{ obj.name }}</div>
                        <div class="text-muted x-small">{{ obj.object_type }} · {{ obj.square }} м² · {{ obj.floor }} этаж</div>
                      </div>
                      <div class="d-flex align-items-center gap-2">
                        <StatusBadge v-if="statusMap[obj.status_id]" :name="statusMap[obj.status_id].name" :color="statusMap[obj.status_id].color" />
                        <button class="btn btn-sm btn-outline-secondary py-0 px-2" style="font-size:0.72rem" @click="editingObjectId = obj.id">Изменить</button>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </section>

            <!-- Comments -->
            <section class="section-block">
              <h6 class="section-title">Комментарии ({{ comments.length }})</h6>
              <div v-if="comments.length === 0">
                <EmptyState icon="💬" title="Нет комментариев" />
              </div>
              <div v-else class="comments-list">
                <div v-for="c in comments" :key="c.id" class="comment-card">
                  <div class="small">{{ c.comment_text }}</div>
                  <div class="d-flex justify-content-between align-items-center mt-1">
                    <span class="text-muted x-small">{{ formatDate(c.created_at) }}</span>
                    <span v-if="c.target_date" class="badge bg-warning-subtle text-warning-emphasis x-small">до {{ c.target_date }}</span>
                  </div>
                  <div v-if="c.file_name" class="mt-1">
                    <span class="badge bg-secondary-subtle text-secondary x-small">📎 {{ c.file_name }}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDataStore } from '../../stores/dataStore.js'
import StatusBadge from '../ui/StatusBadge.vue'
import EmptyState from '../ui/EmptyState.vue'
import ObjectEditForm from '../object/ObjectEditForm.vue'

const props = defineProps({
  client: { type: Object, default: null },
})
defineEmits(['close'])

const store = useDataStore()
const editingObjectId = ref(null)

const contracts = computed(() => props.client ? store.getContractsByClient(props.client.id) : [])
const objects = computed(() => props.client ? store.getObjectsByClient(props.client.id) : [])
const comments = computed(() => props.client ? store.getCommentsByClient(props.client.id) : [])
const statusMap = computed(() => store.statusMap)
const buildingMap = computed(() => store.buildingMap)

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<style scoped>
.drawer-overlay {
  position: fixed; inset: 0; z-index: 1050;
  background: rgba(0,0,0,0.35);
  display: flex; justify-content: flex-end;
}
.drawer-panel {
  width: 480px; max-width: 100vw;
  height: 100%; overflow-y: auto;
  background: #fff;
  box-shadow: -4px 0 24px rgba(0,0,0,0.12);
  display: flex; flex-direction: column;
}
.drawer-header {
  padding: 20px 20px 16px;
  border-bottom: 1px solid #e9ecef;
  position: sticky; top: 0; background: #fff; z-index: 2;
}
.drawer-body { padding: 0 20px 24px; flex: 1; }
.section-block { margin-top: 20px; }
.section-title {
  font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em;
  color: #6c757d; font-weight: 700; margin-bottom: 10px;
  padding-bottom: 6px; border-bottom: 1px solid #f0f0f0;
}
.info-grid { display: flex; flex-direction: column; gap: 6px; }
.info-row { display: flex; gap: 8px; font-size: 0.85rem; }
.info-label { color: #6c757d; min-width: 80px; flex-shrink: 0; }
.additional-info { background: #f8f9fa; border-left: 3px solid #dee2e6; }
.contracts-list, .objects-list, .comments-list { display: flex; flex-direction: column; gap: 8px; }
.contract-card, .object-card, .comment-card {
  padding: 10px 12px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #fafafa;
}
.x-small { font-size: 0.75rem; }

/* Drawer transition */
.drawer-enter-active, .drawer-leave-active { transition: opacity 0.2s; }
.drawer-enter-active .drawer-panel, .drawer-leave-active .drawer-panel { transition: transform 0.25s ease; }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-from .drawer-panel, .drawer-leave-to .drawer-panel { transform: translateX(100%); }
</style>
