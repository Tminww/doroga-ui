<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { TooltipProvider, ToastProvider } from 'reka-ui'
import { useRoute, useRouter } from 'vue-router'

import SidebarButton from '@/components/ui/SidebarButton.vue'
import SidebarToggleButton from '@/components/ui/SidebarToggleButton.vue'
import { type IconName } from '@/components/ui/BaseIcon.vue'
import ThemeSwitcher from '@/components/widgets/ThemeSwitcher.vue'
import SettingsButton from '@/components/ui/SettingsButton.vue'
import NotifyButton from '@/components/ui/NotifyButton.vue'
import AboutUser from '@/components/widgets/AboutUser.vue'

interface SidebarItem {
  id: string
  text: string
  description?: string
  icon: IconName
  routeName?: string
}

interface SidebarCategory {
  title: string
  items: SidebarItem[]
}

const router = useRouter()
const route = useRoute()
const activeItem = ref(route.name || 'dashboard')
const isCollapsed = ref(false)
const appTitle = ref('ЛИС Дорога')

const sidebarCategories: SidebarCategory[] = [
  {
    title: 'Основное',
    items: [
      {
        id: 'dashboard',
        text: 'Панель управления',
        description: 'Обзор текущей деятельности ',
        icon: 'layout-dashboard',
        routeName: 'dashboard',
      },
    ],
  },
  {
    title: 'Рабочие процессы',
    items: [
      {
        id: 'directions',
        text: 'Направления',
        description: 'Управление данными направления',
        icon: 'waypoints',
        routeName: 'directions',
      },
      {
        id: 'samples',
        text: 'Образцы',
        description: 'Управление данными образцов',
        icon: 'test-tube-diagonal',
        routeName: 'samples',
      },
      {
        id: 'protocols',
        text: 'Протоколы',
        description: 'Управление данными протоколов',
        icon: 'clipboard-list',
        routeName: 'protocols',
      },
      {
        id: 'results',
        text: 'Результаты',
        description: 'Управление данными результатов',
        icon: 'layout-list',
        routeName: 'results',
      },
      {
        id: 'conclusions',
        text: 'Заключения',
        description: 'Управление данными заключений',
        icon: 'file-check',
        routeName: 'conclusions',
      },
    ],
  },
  {
    title: 'Персонал и структура',
    items: [
      {
        id: 'doctors',
        text: 'Врачи',
        description: 'Управление данными врачей',
        icon: 'user-check',
        routeName: 'doctors',
      },
      {
        id: 'divisions',
        text: 'Подразделения',
        description: 'Управление данными подразделений',
        icon: 'hospital',
        routeName: 'divisions',
      },
      {
        id: 'users',
        text: 'Пользователи',
        description: 'Управление данными пользователей системы',
        icon: 'users',
        routeName: 'users',
      },
    ],
  },
  {
    title: 'Справочники',
    items: [
      {
        id: 'research-goals',
        text: 'Цели исследования',
        description: 'Управление данными целей исследования',
        icon: 'goal',
        routeName: 'research-goals',
      },
      {
        id: 'sample-types',
        text: 'Типы образцов',
        description: 'Управление данными типов образцов',
        icon: 'test-tubes',
        routeName: 'sample-types',
      },
      {
        id: 'indicators',
        text: 'Показатели',
        description: 'Управление данными показателей',
        icon: 'bar-chart',
        routeName: 'indicators',
      },
      {
        id: 'protocol-types',
        text: 'Типы протоколов',
        description: 'Управление данными типов протоколов',
        icon: 'files',
        routeName: 'protocol-types',
      },
      {
        id: 'objects',
        text: 'Объекты',
        description: 'Управление данными объектов',
        icon: 'building',
        routeName: 'objects',
      },
    ],
  },
]

const currentPageInfo = computed(() => {
  for (const category of sidebarCategories) {
    const item = category.items.find((item) => item.id === activeItem.value)
    if (item) {
      return { title: item.text, description: item.description }
    }
  }
  return { title: 'Неизвестная страница', description: '' }
})

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const selectItem = (item: SidebarItem) => {
  activeItem.value = item.id
  console.log('Выбран элемент:', item.text, item.routeName)
  // Здесь можно добавить навигацию:
  if (item.routeName) {
    router.push({ name: item.routeName })
  }
}

watch(
  () => route.name,
  (newName) => {
    console.log('Маршрут сменился:', newName)
    activeItem.value = newName || 'dashboard'
  },
  { immediate: true },
)
</script>
<template>
  <TooltipProvider :delay-duration="400" :skip-delay-duration="0">
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
            <ThemeSwitcher />
            <NotifyButton />
            <SettingsButton />

            <AboutUser />
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
          <h1>{{ currentPageInfo.title }}</h1>
          <p>{{ currentPageInfo.description }}</p>

          <!-- Содержимое страниц можно отображать через слот -->
          <ToastProvider :duration="3000">
            <slot name="main"> </slot>
          </ToastProvider>
        </div>
      </main>
    </div>
  </TooltipProvider>
</template>

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
  /* border: 1px solid var(--ds-border); */
}

/* Header */
.header {
  grid-area: header;
  height: 60px;
  background: var(--ds-surface);
  border-bottom: 1px solid var(--ds-border);
  position: sticky;
  top: 0;
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
  width: 4.5rem;
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
  max-width: 100%;
  padding: var(--ds-spacing-xl);
}

.container > h1 {
  color: var(--ds-text-primary);
  font-size: var(--ds-font-size-2xl);
}

.container > p {
  color: var(--ds-text-secondary);
  font-size: var(--ds-font-size-md);
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
