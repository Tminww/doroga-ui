<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button class="theme-switcher-button" aria-label="Переключить тему">
        <component :is="currentThemeIcon" class="theme-icon" />
        <span class="sr-only">Переключить тему</span>
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent class="theme-dropdown-content" :side-offset="5">
      <DropdownMenuItem class="theme-dropdown-item" @click="setTheme('light')">
        <SunIcon class="theme-option-icon" />
        <span>Светлая</span>
        <CheckIcon v-if="theme === 'light'" class="theme-check-icon" />
      </DropdownMenuItem>

      <DropdownMenuItem class="theme-dropdown-item" @click="setTheme('dark')">
        <MoonIcon class="theme-option-icon" />
        <span>Тёмная</span>
        <CheckIcon v-if="theme === 'dark'" class="theme-check-icon" />
      </DropdownMenuItem>

      <DropdownMenuItem class="theme-dropdown-item" @click="setTheme('system')">
        <MonitorIcon class="theme-option-icon" />
        <span>Системная</span>
        <CheckIcon v-if="theme === 'system'" class="theme-check-icon" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'reka-ui'
import {
  Sun as SunIcon,
  Moon as MoonIcon,
  Monitor as MonitorIcon,
  Check as CheckIcon,
} from 'lucide-vue-next'

// Реактивное состояние темы
const theme = ref('system')

// Вычисляемая иконка для текущей темы
const currentThemeIcon = computed(() => {
  if (theme.value === 'light') return SunIcon
  if (theme.value === 'dark') return MoonIcon
  return MonitorIcon
})

// Функция для применения темы к DOM
const applyTheme = (newTheme) => {
  const root = document.documentElement

  if (newTheme === 'system') {
    // Удаляем атрибут, чтобы использовать системные настройки
    root.removeAttribute('data-theme')
    root.style.colorScheme = ''
  } else {
    // Устанавливаем конкретную тему
    root.setAttribute('data-theme', newTheme)
    root.style.colorScheme = newTheme
  }
}

// Функция для установки темы
const setTheme = (newTheme) => {
  theme.value = newTheme
  localStorage.setItem('theme-preference', newTheme)
  applyTheme(newTheme)
}

// Слушатель изменения системной темы
const mediaQuery = ref(null)

const handleSystemThemeChange = (e) => {
  if (theme.value === 'system') {
    applyTheme('system')
  }
}

// Инициализация темы при монтировании
onMounted(() => {
  // Загружаем сохранённые настройки
  const savedTheme = localStorage.getItem('theme-preference') || 'system'
  theme.value = savedTheme

  // Применяем тему
  applyTheme(savedTheme)

  // Настраиваем слушатель системных изменений
  mediaQuery.value = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.value.addEventListener('change', handleSystemThemeChange)
})

// Очистка при размонтировании
onUnmounted(() => {
  if (mediaQuery.value) {
    mediaQuery.value.removeEventListener('change', handleSystemThemeChange)
  }
})
</script>

<style scoped>
.theme-switcher-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--ds-spacing-sm);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md);
  background: var(--ds-surface);
  color: var(--ds-text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 2.5rem;
  min-height: 2.5rem;
}

.theme-switcher-button:hover {
  background: var(--ds-surface-secondary);
  border-color: var(--ds-border-secondary);
}

.theme-switcher-button:focus-visible {
  outline: 2px solid var(--ds-border-focus);
  outline-offset: 2px;
}

.theme-icon {
  width: 1.25rem;
  height: 1.25rem;
  stroke-width: 1.5;
}

.theme-dropdown-content {
  min-width: 8rem;
  padding: var(--ds-spacing-xs);
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ds-shadow-lg);
  z-index: var(--ds-z-dropdown);
}

.theme-dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-sm);
  padding: var(--ds-spacing-sm) var(--ds-spacing-md);
  border-radius: var(--ds-radius-sm);
  cursor: pointer;
  color: var(--ds-text-primary);
  font-size: var(--ds-font-size-sm);
  transition: background-color 0.2s ease;
  position: relative;
}

.theme-dropdown-item:hover {
  background: var(--ds-surface-secondary);
}

.theme-dropdown-item:focus {
  background: var(--ds-surface-secondary);
  outline: none;
}

.theme-option-icon {
  width: 1rem;
  height: 1rem;
  stroke-width: 1.5;
  color: var(--ds-text-secondary);
}

.theme-check-icon {
  width: 1rem;
  height: 1rem;
  stroke-width: 2;
  color: var(--ds-primary-600);
  margin-left: auto;
}

/* Адаптивная настройка для мобильных устройств */
@media (max-width: 768px) {
  .theme-dropdown-content {
    min-width: 10rem;
  }

  .theme-dropdown-item {
    padding: var(--ds-spacing-md);
    font-size: var(--ds-font-size-md);
  }
}
</style>
