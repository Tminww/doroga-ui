<template>
  <div class="layout">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <SidebarToggleButton
            variant="ghost"
            icon-only
            :is-collapsed="isCollapsed"
            @click="toggleSidebar"
          />
          <h1 class="header-title">{{ appTitle }}</h1>
        </div>
        <div class="header-right">
          <!-- Здесь можно добавить дополнительные элементы: уведомления, профиль и т.д. -->
          <BaseButton variant="ghost" icon-only left-icon="bell" />
          <BaseButton variant="ghost" icon-only left-icon="user" />
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
      <nav class="sidebar-nav">
        <div v-for="category in sidebarCategories" :key="category.title" class="sidebar-category">
          <h3 v-if="!isCollapsed" class="sidebar-category-title">
            {{ category.title }}
          </h3>

          <div class="sidebar-items">
            <SidebarButton
              v-for="item in category.items"
              :title="item.text"
              :left-icon="item.icon"
              :key="item.id"
              class="sidebar-item"
              :tooltip="item.text"
              :active="activeItem === item.id"
              :is-collapsed="isCollapsed"
              @click="selectItem(item)"
            >
            </SidebarButton>
          </div>
        </div>
      </nav>
    </aside>

    <!-- Main Content с скроллом -->
    <main class="main-content">
      <div class="container">
        <h1>{{ currentPageTitle }}</h1>
        <p>Активная страница: {{ activeItem }}</p>
        <p>Состояние сайдбара: {{ isCollapsed ? 'свернут' : 'развернут' }}</p>

        <!-- Содержимое страниц можно отображать через слот -->
        <slot>
          <div class="default-content">
            <h2>Добро пожаловать</h2>
            <p>Выберите раздел в боковой панели для навигации.</p>
          </div>
          <div class="default-content">
            <h2>Welcome</h2>
            <p>
              The connection() context behaves like the Connection object context: at the end of the
              block, if there is a transaction open, it will be committed if the context is exited
              normally, or rolled back if the context is exited with an exception. See Transaction
              contexts for details. The pool manages a certain amount of connections (between
              min_size and max_size). If the pool has a connection ready in its state, it is served
              immediately to the connection() caller, otherwise the caller is put in a queue and is
              served a connection as soon as it's available. If instead of threads your application
              uses async code you can use the AsyncConnectionPool instead and use the async and
              await keywords with the methods requiring them:
            </p>
          </div>
          <div class="default-content">
            <h2>Welcome</h2>
            <p>
              The connection() context behaves like the Connection object context: at the end of the
              block, if there is a transaction open, it will be committed if the context is exited
              normally, or rolled back if the context is exited with an exception. See Transaction
              contexts for details. The pool manages a certain amount of connections (between
              min_size and max_size). If the pool has a connection ready in its state, it is served
              immediately to the connection() caller, otherwise the caller is put in a queue and is
              served a connection as soon as it's available. If instead of threads your application
              uses async code you can use the AsyncConnectionPool instead and use the async and
              await keywords with the methods requiring them:
            </p>
          </div>
          <div class="default-content">
            <h2>Welcome</h2>
            <p>
              The connection() context behaves like the Connection object context: at the end of the
              block, if there is a transaction open, it will be committed if the context is exited
              normally, or rolled back if the context is exited with an exception. See Transaction
              contexts for details. The pool manages a certain amount of connections (between
              min_size and max_size). If the pool has a connection ready in its state, it is served
              immediately to the connection() caller, otherwise the caller is put in a queue and is
              served a connection as soon as it's available. If instead of threads your application
              uses async code you can use the AsyncConnectionPool instead and use the async and
              await keywords with the methods requiring them:
            </p>
          </div>
          <div class="default-content">
            <h2>Welcome</h2>
            <p>
              The connection() context behaves like the Connection object context: at the end of the
              block, if there is a transaction open, it will be committed if the context is exited
              normally, or rolled back if the context is exited with an exception. See Transaction
              contexts for details. The pool manages a certain amount of connections (between
              min_size and max_size). If the pool has a connection ready in its state, it is served
              immediately to the connection() caller, otherwise the caller is put in a queue and is
              served a connection as soon as it's available. If instead of threads your application
              uses async code you can use the AsyncConnectionPool instead and use the async and
              await keywords with the methods requiring them:
            </p>
          </div>
        </slot>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SidebarButton from '@/components/ui/SidebarButton.vue'
import SidebarToggleButton from '@/components/ui/SidebarToggleButton.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon, { type IconName } from '@/components/ui/BaseIcon.vue'

interface SidebarItem {
  id: string
  text: string
  icon: IconName
  route?: string
}

interface SidebarCategory {
  title: string
  items: SidebarItem[]
}

const activeItem = ref('dashboard')
const isCollapsed = ref(false)
const appTitle = ref('ЛИС Дорога')

const sidebarCategories: SidebarCategory[] = [
  {
    title: 'Основное',
    items: [
      {
        id: 'dashboard',
        text: 'Панель управления',
        icon: 'layout-dashboard',
        route: '/dashboard',
      },
    ],
  },
  {
    title: 'Рабочие процессы',
    items: [
      {
        id: 'directions',
        text: 'Направления',
        icon: 'file-text',
        route: '/directions',
      },
      {
        id: 'samples',
        text: 'Образцы',
        icon: 'test-tube',
        route: '/samples',
      },
      {
        id: 'protocols',
        text: 'Протоколы',
        icon: 'scroll-text',
        route: '/protocols',
      },
      {
        id: 'results',
        text: 'Результаты',
        icon: 'activity',
        route: '/results',
      },
      {
        id: 'conclusions',
        text: 'Заключения',
        icon: 'file-check',
        route: '/conclusions',
      },
    ],
  },
  {
    title: 'Персонал и структура',
    items: [
      {
        id: 'doctors',
        text: 'Врачи',
        icon: 'user-check',
        route: '/doctors',
      },
      {
        id: 'divisions',
        text: 'Подразделения',
        icon: 'building',
        route: '/divisions',
      },
      {
        id: 'users',
        text: 'Пользователи',
        icon: 'users',
        route: '/users',
      },
    ],
  },
  {
    title: 'Справочники',
    items: [
      {
        id: 'research-goals',
        text: 'Цели исследования',
        icon: 'target',
        route: '/research-goals',
      },
      {
        id: 'sample-types',
        text: 'Типы образцов',
        icon: 'beaker',
        route: '/sample-types',
      },
      {
        id: 'indicators',
        text: 'Показатели',
        icon: 'bar-chart',
        route: '/indicators',
      },
      {
        id: 'protocol-types',
        text: 'Типы протоколов',
        icon: 'clipboard-list',
        route: '/protocol-types',
      },
      {
        id: 'objects',
        text: 'Объекты',
        icon: 'settings',
        route: '/objects',
      },
    ],
  },
]

const currentPageTitle = computed(() => {
  for (const category of sidebarCategories) {
    const item = category.items.find((item) => item.id === activeItem.value)
    if (item) {
      return item.text
    }
  }
  return 'Неизвестная страница'
})

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const selectItem = (item: SidebarItem) => {
  activeItem.value = item.id
  console.log('Выбран элемент:', item.text)
  // Здесь можно добавить навигацию:
  // if (item.route) router.push(item.route)
}

// Экспортируем для использования в других компонентах
defineExpose({
  activeItem,
  isCollapsed,
  selectItem,
  toggleSidebar,
})
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-areas:
    'sidebar header'
    'sidebar main';
  grid-template-rows: auto 1fr;
  grid-template-columns: auto 1fr;
  height: 100vh;
  overflow: hidden;
  border: 1px solid var(--ds-border);
}

/* Header */
.header {
  grid-area: header;
  height: 60px;
  background: var(--ds-surface);
  border-bottom: 1px solid var(--ds-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  height: 100%;
  padding: 0 var(--ds-spacing-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-title {
  margin-left: var(--ds-spacing-sm);
  font-size: var(--ds-font-size-lg);
  font-weight: 600;
  color: var(--ds-text-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-sm);
}

/* Sidebar */
.sidebar {
  grid-area: sidebar;
  width: 250px;
  background: var(--ds-surface);
  border-right: 1px solid var(--ds-border);
  transition: all 0.3s ease;
  overflow-x: hidden;
  overflow-y: auto;
  height: calc(100vh);
}

.sidebar.collapsed {
  width: 4rem;
}

.sidebar-header {
  padding: var(--ds-spacing-md);
  border-bottom: 1px solid var(--ds-border);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.sidebar-nav {
  padding: var(--ds-spacing-lg);
}

.sidebar-category:not(:last-child) {
  padding-bottom: var(--ds-spacing-md);
  border-bottom: 1px solid var(--ds-border);
  margin-bottom: var(--ds-spacing-md);
}

.sidebar-category-title {
  font-size: var(--ds-font-size-xs);
  font-weight: 600;
  color: var(--ds-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--ds-spacing-sm);
  padding: 0 var(--ds-spacing-sm);
  white-space: nowrap;
}

.sidebar-category-collapsed {
  display: flex;
  justify-content: center;
  margin-bottom: var(--ds-spacing-sm);
  height: 1rem;
}

.category-indicator {
  width: 2px;
  height: 100%;
  background: var(--ds-border-secondary);
  border-radius: var(--ds-radius-full);
  position: relative;
}

.sidebar-items {
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-xs);
}

.sidebar-item {
  display: inline-flex;
  align-items: flex-start;
  gap: var(--ds-spacing-md);
  padding: var(--ds-spacing-sm);
  color: var(--ds-text-primary);
  background: transparent;
  border: none;
  border-radius: var(--ds-radius-md);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  white-space: nowrap;
  width: 100%;
  font-family: inherit;
}

.sidebar-item:hover {
  background-color: var(--ds-surface-secondary);
  color: var(--ds-text-primary);
}

.sidebar-item.active {
  background-color: var(--ds-primary-50);
  color: var(--ds-primary-600);
  border: 1px solid var(--ds-primary-200);
  font-weight: 600;
}

.sidebar-item-text {
  opacity: 1;
  transition: opacity 150ms ease-in-out;
  transition-delay: 150ms;
  white-space: nowrap;
}

.sidebar.collapsed .sidebar-item {
  justify-content: center;
  padding: var(--ds-spacing-sm);
}

.sidebar.collapsed .sidebar-item-text {
  opacity: 0;
  transition-delay: 0ms;
}

/* Main Content */
.main-content {
  grid-area: main;
  background: var(--ds-surface-secondary);
  overflow-y: auto;
  height: calc(100vh - 60px);
}

.container {
  max-width: 1200px;
  padding: min(30px, 7%);
}

.container h1 {
  margin-bottom: var(--ds-spacing-lg);
  color: var(--ds-text-primary);
  font-size: var(--ds-font-size-xl);
}

.container p {
  margin-bottom: var(--ds-spacing-md);
  color: var(--ds-text-secondary);
  line-height: 1.6;
}

.default-content {
  padding: var(--ds-spacing-xl);
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  text-align: center;
  margin-bottom: var(--ds-spacing-lg);
}

.default-content h2 {
  margin-bottom: var(--ds-spacing-md);
  color: var(--ds-text-primary);
  font-size: var(--ds-font-size-lg);
}

/* Скрытие скроллбара для более чистого вида (опционально) */
.main-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-track {
  background: var(--ds-surface-secondary);
}

.main-content::-webkit-scrollbar-thumb {
  background: var(--ds-border);
  border-radius: var(--ds-radius-full);
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: var(--ds-border-secondary);
}
</style>
