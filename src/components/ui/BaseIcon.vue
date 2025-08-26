<template>
  <component
    :is="iconComponent"
    :color="color"
    :size="size"
    :stroke-width="strokeWidth"
    :class="iconClasses"
  />
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import {
  Activity,
  AlertTriangle,
  Beaker,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  FileText,
  Filter,
  LayoutDashboard,
  Menu,
  Plus,
  RefreshCw,
  ScrollText,
  Search,
  Settings,
  Target,
  TestTube,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  X,
  type LucideIcon,
} from 'lucide-vue-next'

// Создаем строго типизированную карту иконок
const ICON_MAP = {
  activity: Activity,
  'alert-triangle': AlertTriangle,
  beaker: Beaker,
  bell: Bell,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  download: Download,
  edit: Edit,
  'file-text': FileText,
  filter: Filter,
  'layout-dashboard': LayoutDashboard,
  menu: Menu,
  plus: Plus,
  'refresh-cw': RefreshCw,
  'scroll-text': ScrollText,
  search: Search,
  settings: Settings,
  target: Target,
  'test-tube': TestTube,
  'trending-down': TrendingDown,
  'trending-up': TrendingUp,
  user: User,
  users: Users,
  x: X,
} as const

// Экспортируем тип для использования в других компонентах
export type IconName = keyof typeof ICON_MAP

export interface BaseIconProps {
  /** Название иконки из доступных */
  icon: IconName
  /** Цвет иконки (CSS значение) */
  color?: string
  /** Размер иконки в пикселях */
  size?: number
  /** Толщина линий иконки */
  strokeWidth?: number
  /** Дополнительные CSS классы */
  class?: string
}

const props = withDefaults(defineProps<BaseIconProps>(), {
  icon: 'x',
  size: 24,
  strokeWidth: 2,
})

// Получаем компонент иконки с проверкой типов
const iconComponent = computed((): Component => {
  const IconComponent = ICON_MAP[props.icon]
  if (!IconComponent) {
    console.warn(`Icon "${props.icon}" not found. Available icons:`, Object.keys(ICON_MAP))
    return ICON_MAP.x // Fallback иконка
  }
  return IconComponent as LucideIcon
})

const iconClasses = computed(() => ['base-icon', props.class])
</script>

<style scoped>
.base-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
