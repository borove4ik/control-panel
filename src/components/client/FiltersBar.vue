<template>
  <div class="filters-bar row g-2 align-items-end">
    <div class="col-12 col-md-5 col-lg-4">
      <div class="input-group input-group-sm">
        <span class="input-group-text bg-white"><i class="bi bi-search text-muted"></i></span>
        <input
          class="form-control"
          type="text"
          placeholder="Компания, директор, договор, здание..."
          v-model="search"
          @input="$emit('reset-page')"
        />
        <button v-if="search" class="btn btn-outline-secondary" @click="search = ''; $emit('reset-page')">✕</button>
      </div>
    </div>
    <div class="col-6 col-md-3 col-lg-2">
      <select class="form-select form-select-sm" v-model="statusFilter" @change="$emit('reset-page')">
        <option :value="null">Все статусы</option>
        <option v-for="s in statuses" :key="s.id" :value="s.id">{{ s.name }}</option>
      </select>
    </div>
    <div class="col-6 col-md-3 col-lg-2">
      <select class="form-select form-select-sm" v-model="typeFilter" @change="$emit('reset-page')">
        <option value="">Все типы</option>
        <option v-for="t in objectTypes" :key="t" :value="t">{{ t }}</option>
      </select>
    </div>
    <div class="col-auto">
      <button class="btn btn-sm btn-outline-secondary" @click="$emit('reset-all')" title="Сбросить фильтры">
        <i class="bi bi-x-circle"></i> Сбросить
      </button>
    </div>
    <div class="col-auto ms-auto text-muted small align-self-center">
      Найдено: <strong>{{ count }}</strong>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDataStore } from '../../stores/dataStore.js'

const search = defineModel('search')
const statusFilter = defineModel('statusFilter')
const typeFilter = defineModel('typeFilter')

const props = defineProps({ count: Number })
defineEmits(['reset-page', 'reset-all'])

const store = useDataStore()
const statuses = computed(() => store.statuses)
const objectTypes = ['Офис', 'Бутик', 'Склад']
</script>
