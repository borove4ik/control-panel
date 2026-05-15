<template>
  <div class="app-shell">
    <nav class="app-sidebar d-flex flex-column">
      <div class="sidebar-brand">
        <span class="brand-icon">🏢</span>
        <span class="brand-name">Rent System</span>
      </div>
      <ul class="nav-list">
        <li>
          <RouterLink to="/clients" class="nav-item" active-class="active">
            <i class="bi bi-people-fill nav-icon"></i>
            <span class="nav-label">Клиенты</span>
          </RouterLink>
        </li>
      </ul>
      <div class="sidebar-footer">
        <span class="text-muted x-small">Управляющая компания</span>
      </div>
    </nav>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
</script>

<style>
*, *::before, *::after { box-sizing: border-box; }
html, body, #app { height: 100%; margin: 0; }
body { background: #f6f8fb; }
</style>

<style scoped>
.app-shell { display: flex; height: 100vh; overflow: hidden; font-family: 'Segoe UI', system-ui, sans-serif; }
.app-sidebar { width: 220px; flex-shrink: 0; background: #fff; border-right: 1px solid #e9ecef; }
.sidebar-brand { display: flex; align-items: center; gap: 10px; padding: 18px 20px; border-bottom: 1px solid #f0f0f0; }
.brand-icon { font-size: 1.4rem; }
.brand-name { font-weight: 700; font-size: 1rem; color: #212529; }
.nav-list { list-style: none; padding: 10px 0; margin: 0; flex: 1; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 20px; color: #6c757d; text-decoration: none; font-size: 0.875rem; font-weight: 500; transition: all 0.15s; }
.nav-item:hover { background: #f6f8fb; color: #212529; }
.nav-item.active { color: #0d6efd; background: #eef3ff; border-right: 2px solid #0d6efd; }
.nav-icon { font-size: 1rem; }
.sidebar-footer { padding: 16px 20px; border-top: 1px solid #f0f0f0; }
.app-main { flex: 1; overflow-y: auto; min-width: 0; }
.x-small { font-size: 0.72rem; }
@media (max-width: 640px) {
  .app-sidebar { width: 52px; }
  .brand-name, .nav-label, .sidebar-footer { display: none; }
  .sidebar-brand { justify-content: center; padding: 14px 0; }
  .nav-item { justify-content: center; padding: 12px 0; }
}
</style>
