<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header">
      <BaseButton
        variant="secondary"
        icon-only
        :left-icon="isCollapsed ? 'menu' : 'x'"
        @click="toggleSidebar"
        class="sidebar-toggle"
      />
    </div>

    <nav class="sidebar-nav">
      <div v-for="category in categories" :key="category.title" class="sidebar-category">
        <h3 v-if="!isCollapsed" class="sidebar-category-title">
          {{ category.title }}
        </h3>
        <div class="sidebar-items">
          <button
            v-for="item in category.items"
            :key="item.id"
            class="sidebar-item"
            :class="{ active: activeItemId === item.id }"
            @click="selectItem(item)"
          >
            <BaseIcon :icon="item.icon" :size="20" />
            <span v-if="!isCollapsed" class="sidebar-item-text">
              {{ item.text }}
            </span>
          </button>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon, { type IconName } from '@/components/ui/BaseIcon.vue'

export interface SidebarItem {
  id: string
  text: string
  icon: IconName
  route?: string
}

export interface SidebarCategory {
  title: string
  items: SidebarItem[]
}

export interface BaseSidebarProps {
  /** Категории элементов сайдбара */
  categories?: SidebarCategory[]
  /** ID активного элемента */
  activeItemId?: string
  /** Начальное состояние сворачивания */
  initiallyCollapsed?: boolean
}

const props = withDefaults(defineProps<BaseSidebarProps>(), {
  categories: () => [
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
      ],
    },
  ],
  activeItemId: 'dashboard',
  initiallyCollapsed: false,
})

const isCollapsed = ref(props.initiallyCollapsed)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  emit('toggleCollapse', isCollapsed.value)
}

const emit = defineEmits<{
  itemSelect: [item: SidebarItem]
  toggleCollapse: [collapsed: boolean]
}>()

const selectItem = (item: SidebarItem) => {
  emit('itemSelect', item)
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background: var(--ds-surface);
  border-right: 1px solid var(--ds-border);
  transition: all 0.3s ease;
  overflow-x: hidden;
  position: sticky;
  top: 0;
  align-self: start;
}

.sidebar.collapsed {
  width: 4rem;
}

.sidebar-header {
  padding: var(--ds-spacing-lg);
  border-bottom: 1px solid var(--ds-border);
}

.sidebar-toggle {
  width: 100%;
  justify-content: center;
}

.sidebar-nav {
  padding: var(--ds-spacing-sm);
}

.sidebar-category {
  margin-bottom: var(--ds-spacing-xl);
}

.sidebar-category-title {
  font-size: var(--ds-font-size-xs);
  font-weight: 600;
  color: var(--ds-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--ds-spacing-sm);
  padding: 0 var(--ds-spacing-sm);
  margin-top: 0;
}

.sidebar-items {
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-xs);
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-md);
  padding: var(--ds-spacing-sm);
  color: var(--ds-text-primary);
  background: transparent;
  border: none;
  border-radius: var(--ds-radius-md);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
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

/* Демо-контейнер */
.sidebar-demo {
  position: relative;
  height: 400px;
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  overflow: hidden;
  background: var(--ds-surface);
}
</style>
