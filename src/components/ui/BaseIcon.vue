<template>
  <component :is="lucideIcon" :color="color" :size="size" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
} from 'lucide-vue-next'

export interface BaseIconProps {
  color?: string
  size?: number
  icon?: string
}

const props = withDefaults(defineProps<BaseIconProps>(), {
  icon: 'x',
})

const mapNameToLucide = {
  filter: Filter,
  plus: Plus,
  download: Download,
  settings: Settings,
  search: Search,
  'trending-up': TrendingUp,
  x: X,
  menu: Menu,
  'layout-dashboard': LayoutDashboard,
  'file-text': FileText,
  'test-tube': TestTube,
  'scroll-text': ScrollText,
  target: Target,
  beaker: Beaker,
  'chevron-down': ChevronDown,
  bell: Bell,
  user: User,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'refresh-cw': RefreshCw,
  'alert-triangle': AlertTriangle,
  'trending-down': TrendingDown,
  activity: Activity,
  users: Users,
  edit: Edit,
}

const lucideIcon = computed(() => mapNameToLucide[props.icon])
</script>

<style>
.ComboboxIcon {
  width: 16px;
  height: 16px;
  color: var(--grass-11);
}
</style>
