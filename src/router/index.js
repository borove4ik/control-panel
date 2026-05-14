import { createRouter, createWebHashHistory } from 'vue-router'
import ClientsView from '../views/ClientsView.vue'

const routes = [
  { path: '/', redirect: '/clients' },
  { path: '/clients', component: ClientsView, name: 'clients' },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
