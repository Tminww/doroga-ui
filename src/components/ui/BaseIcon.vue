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
import { computed, defineComponent, h, type Component } from 'vue'
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowUpDown,
  BarChart2,
  BarChart3,
  BarChart4,
  BarChartBig,
  Beaker,
  Bell,
  Building,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  ChevronUp,
  ClipboardList,
  Download,
  Edit,
  Eye,
  FileCheck,
  Files,
  FileText,
  Filter,
  Goal,
  Hospital,
  Info,
  LayoutDashboard,
  LayoutList,
  Menu,
  MessageCircle,
  MessageCircleWarning,
  Minus,
  Monitor,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCw,
  ScrollText,
  Search,
  SearchX,
  Settings,
  SortAsc,
  SortDesc,
  Sun,
  Target,
  TestTube,
  TestTube2,
  TestTubeDiagonal,
  TestTubes,
  Trash,
  Trash2,
  TrendingDown,
  TrendingUp,
  User,
  UserCheck,
  Users,
  Waypoints,
  X,
  type LucideIcon,
} from 'lucide-vue-next'
import SvgIcon from '@jamescoyle/vue-icon'

import { mdiDoctor } from '@mdi/js'
// Создаем строго типизированную карту иконок
const ICON_MAP = {
  activity: Activity,
  'alert-triangle': AlertTriangle,
  beaker: Beaker,
  bell: Bell,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  download: Download,
  edit: Edit,
  'file-text': FileText,
  filter: Filter,
  'layout-dashboard': LayoutDashboard,
  menu: Menu,
  plus: Plus,
  'refresh-cw': RefreshCw,
  files: Files,
  'layout-list': LayoutList,
  hospital: Hospital,
  goal: Goal,
  'test-tube-diagonal': TestTubeDiagonal,
  'scroll-text': ScrollText,
  search: Search,
  settings: Settings,
  target: Target,
  'test-tube': TestTube,
  'test-tubes': TestTubes,

  'trending-down': TrendingDown,
  'trending-up': TrendingUp,
  user: User,
  users: Users,
  x: X,
  'panel-left-close': PanelLeftClose,
  'panel-left-open': PanelLeftOpen,
  minus: Minus,
  'file-check': FileCheck,
  'user-check': UserCheck,
  building: Building,
  'bar-chart': BarChart2,
  'clipboard-list': ClipboardList,
  waypoints: Waypoints,
  check: Check,
  sun: Sun,
  moon: Moon,
  monitor: Monitor,
  eye: Eye,
  trash: Trash,
  'trash-2': Trash2,
  'search-x': SearchX,
  'sort-asc': SortAsc,
  'sort-desc': SortDesc,
  'chevrons-left': ChevronsLeft,
  'chevrons-right': ChevronsRight,
  'arrow-up-down': ArrowUpDown,
  info: Info,
  warning: MessageCircleWarning,
  'message-circle': MessageCircle,
  'alert-circle': AlertCircle,
  'check-circle': CheckCircle,
  'chevrons-up-down': ChevronsUpDown,

  // Пример использования иконки из Material Design Icons
  doctor: mdiDoctor,
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
}

const props = withDefaults(defineProps<BaseIconProps>(), {
  icon: 'x',
  size: 16,
  strokeWidth: 2,
})

// Получаем компонент иконки с проверкой типов
const iconComponent = computed((): Component => {
  const IconComponent = ICON_MAP[props.icon]

  if (typeof IconComponent === 'string') {
    return defineComponent({
      components: { SvgIcon },
      setup() {
        return () => h(SvgIcon, { type: 'mdi', path: IconComponent })
      },
    })
  }
  if (!IconComponent) {
    console.warn(`Icon "${props.icon}" not found. Available icons:`, Object.keys(ICON_MAP))
    return ICON_MAP.x // Fallback иконка
  }
  return IconComponent as LucideIcon
})

const iconClasses = computed(() => ['base-icon'])
</script>

<style scoped>
.base-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
