<template>
  <div class="object-edit-form card card-body mb-2 border-0 bg-light-subtle">
    <div class="row g-2 align-items-end">
      <div class="col-12">
        <div class="fw-semibold small mb-1">{{ obj.name }}</div>
        <div class="text-muted x-small">{{ obj.object_type }} · {{ obj.square }} м²</div>
      </div>
      <div class="col-sm-6">
        <label class="form-label small mb-1">Этаж</label>
        <select class="form-select form-select-sm" v-model.number="localFloor">
          <option v-for="f in availableFloors" :key="f" :value="f">{{ f }} этаж</option>
        </select>
      </div>
      <div class="col-sm-6">
        <label class="form-label small mb-1">Статус</label>
        <select class="form-select form-select-sm" v-model.number="localStatusId">
          <option v-for="s in statuses" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
      <div class="col-12 d-flex gap-2 justify-content-end">
        <button class="btn btn-sm btn-outline-secondary" @click="$emit('cancel')">Отмена</button>
        <button class="btn btn-sm btn-primary" @click="save" :disabled="!changed">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDataStore } from '../../stores/dataStore.js'

const props = defineProps({
  obj: { type: Object, required: true },
})
const emit = defineEmits(['saved', 'cancel'])
const store = useDataStore()

const localFloor = ref(props.obj.floor)
const localStatusId = ref(props.obj.status_id)

const statuses = computed(() => store.statuses)

// All floors from the building, plus any new value
const availableFloors = computed(() => {
  const existing = store.getBuildingFloors(props.obj.building_id)
  const set = new Set(existing)
  set.add(localFloor.value)
  return [...set].sort((a, b) => a - b)
})

const changed = computed(() =>
  localFloor.value !== props.obj.floor || localStatusId.value !== props.obj.status_id
)

function save() {
  store.updateObject(props.obj.id, {
    floor: localFloor.value,
    status_id: localStatusId.value,
  })
  emit('saved')
}
</script>

<style scoped>
.x-small { font-size: 0.75rem; }
</style>
