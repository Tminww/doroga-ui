<script setup lang="ts">
import { type IconName } from '@/components/ui/BaseIcon.vue'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import BaseSelect from '../ui/BaseSelect.vue'

interface Item {
  icon: IconName
  name: string
  value: 'system' | 'light' | 'dark'
}

const items: Item[] = [
  {
    icon: 'monitor',
    name: 'Системная',
    value: 'system',
  },
  {
    icon: 'sun',
    name: 'Светлая',
    value: 'light',
  },
  {
    icon: 'moon',
    name: 'Темная',
    value: 'dark',
  },
]

const selected = ref<Item>({
  icon: 'monitor',
  name: 'Системная',
  value: 'system',
})

// Ключи для localStorage
const THEME_STORAGE_KEY = 'doroga-ui-theme-preference'

// Функции для управления темой
const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
  const root = document.documentElement

  if (newTheme === 'system') {
    root.removeAttribute('data-theme')
    root.style.colorScheme = ''
  } else {
    root.setAttribute('data-theme', newTheme)
    root.style.colorScheme = newTheme
  }
}

const setTheme = (newTheme: Item) => {
  console.log('THEME CHANGE', newTheme.value)
  selected.value = newTheme

  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newTheme))
  } catch (error) {
    console.warn('Could not save theme preference:', error)
  }

  applyTheme(newTheme.value)
}

// Слушатель изменений BaseSelect
watch(
  selected,
  (newTheme) => {
    if (newTheme && newTheme.value) {
      setTheme(newTheme)
    }
  },
  { immediate: false },
)

// Загрузка настроек темы
const loadThemeSettings = () => {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme) {
      selected.value = JSON.parse(savedTheme) || {
        icon: 'monitor',
        name: 'Системная',
        value: 'system',
      }
    }
  } catch (error) {
    console.warn('Could not load theme preference:', error)
    selected.value = {
      icon: 'monitor',
      name: 'Системная',
      value: 'system',
    }
  }
}

// Слушатель изменений системной темы
let mediaQuery: MediaQueryList | null = null

const handleSystemThemeChange = (e: MediaQueryListEvent) => {
  if (selected.value.value === 'system') {
    applyTheme('system')
  }
}

// Инициализация при монтировании
onMounted(() => {
  // Загружаем все настройки
  loadThemeSettings()
  console.log(selected.value)

  // Применяем тему
  applyTheme(selected.value.value)

  // Добавляем слушатель системной темы
  if (typeof window !== 'undefined' && window.matchMedia) {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', handleSystemThemeChange)
  }
})

onUnmounted(() => {
  // Убираем слушатель при размонтировании
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }
})
</script>

<template>
  <BaseSelect
    :items="items"
    v-model="selected"
    :icon-only="true"
    variant="secondary"
    tooltip="Цветовая тема"
    tooltip-side="bottom"
  />
</template>

<style scoped>
/* Стили перенесены в BaseSelect */
</style>
