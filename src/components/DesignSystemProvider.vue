<template>
  <div class="design-system-provider">
    <div class="design-system-controls">
      <!-- Переключатель темы -->
      <div class="control-group">
        <span class="control-group-label">Тема интерфейса</span>
        <DropdownMenuRoot>
          <DropdownMenuTrigger as-child>
            <button class="theme-switcher-button" aria-label="Переключить тему">
              <component :is="currentThemeIcon" class="theme-icon" />
              <span class="theme-label">{{ currentThemeLabel }}</span>
              <ChevronDownIcon class="chevron-icon" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent class="theme-dropdown-content" :side-offset="5" align="end">
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
        </DropdownMenuRoot>
      </div>

      <!-- Разделитель -->
      <div class="control-separator"></div>

      <!-- Существующие контролы дизайн-системы -->
      <div class="control-group">
        <label class="control-label">
          <input type="checkbox" v-model="isDesignSystemMode" class="control-checkbox" />
          Режим дизайн-системы
        </label>
        <span class="control-description">
          {{ isDesignSystemMode ? 'Показывать код компонентов' : 'Показывать описания' }}
        </span>
      </div>

      <div class="control-group" v-if="isDesignSystemMode">
        <label class="control-label">
          <input type="checkbox" v-model="showTooltipCode" class="control-checkbox" />
          Показывать код в tooltip
        </label>
      </div>
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import {
  DropdownMenuRoot,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'reka-ui'
import {
  Sun as SunIcon,
  Moon as MoonIcon,
  Monitor as MonitorIcon,
  Check as CheckIcon,
  ChevronDown as ChevronDownIcon,
} from 'lucide-vue-next'

// Существующие настройки дизайн-системы
const isDesignSystemMode = ref(true)
const showTooltipCode = ref(true)

// Настройки темы
const theme = ref<'light' | 'dark' | 'system'>('system')
const mediaQuery = ref<MediaQueryList | null>(null)

// Ключи для localStorage
const STORAGE_KEY = 'doroga-ui-design-system'
const THEME_STORAGE_KEY = 'doroga-ui-theme-preference'

// Вычисляемые значения для темы
const currentThemeIcon = computed(() => {
  if (theme.value === 'light') return SunIcon
  if (theme.value === 'dark') return MoonIcon
  return MonitorIcon
})

const currentThemeLabel = computed(() => {
  if (theme.value === 'light') return 'Светлая'
  if (theme.value === 'dark') return 'Тёмная'
  return 'Системная'
})

const resolvedTheme = computed(() => {
  if (theme.value !== 'system') {
    return theme.value
  }

  if (mediaQuery.value) {
    return mediaQuery.value.matches ? 'dark' : 'light'
  }

  return 'light'
})

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

const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
  theme.value = newTheme

  try {
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  } catch (error) {
    console.warn('Could not save theme preference:', error)
  }

  applyTheme(newTheme)
}

// Обработчик изменения системной темы
const handleSystemThemeChange = () => {
  if (theme.value === 'system') {
    applyTheme('system')
  }
}

// Загрузка и сохранение настроек дизайн-системы
const loadDesignSystemSettings = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const settings = JSON.parse(saved)
      isDesignSystemMode.value = settings.isDesignSystemMode ?? true
      showTooltipCode.value = settings.showTooltipCode ?? true
    } catch (e) {
      console.warn('Failed to load design system settings:', e)
    }
  }
}

const saveDesignSystemSettings = () => {
  const settings = {
    isDesignSystemMode: isDesignSystemMode.value,
    showTooltipCode: showTooltipCode.value,
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.warn('Could not save design system settings:', error)
  }
}

// Загрузка настроек темы
const loadThemeSettings = () => {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'system'
    theme.value = savedTheme as 'light' | 'dark' | 'system'
  } catch (error) {
    console.warn('Could not load theme preference:', error)
    theme.value = 'system'
  }
}

// Инициализация при монтировании
onMounted(() => {
  // Загружаем все настройки
  loadDesignSystemSettings()
  loadThemeSettings()

  // Применяем тему
  applyTheme(theme.value)

  // Настраиваем слушатель системных изменений
  if (window.matchMedia) {
    mediaQuery.value = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.value.addEventListener('change', handleSystemThemeChange)
  }
})

// Очистка при размонтировании
onUnmounted(() => {
  if (mediaQuery.value) {
    mediaQuery.value.removeEventListener('change', handleSystemThemeChange)
  }
})

// Отслеживание изменений настроек дизайн-системы
watch([isDesignSystemMode, showTooltipCode], saveDesignSystemSettings, { deep: true })

// Экспорт для использования в других компонентах
defineExpose({
  theme,
  resolvedTheme,
  setTheme,
  isDesignSystemMode,
  showTooltipCode,
})
</script>

<style scoped>
.design-system-provider {
  min-height: 100vh;
}

.design-system-controls {
  position: fixed;
  top: var(--ds-spacing-lg);
  right: var(--ds-spacing-lg);
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-spacing-lg);
  box-shadow: var(--ds-shadow-lg);
  z-index: var(--ds-z-fixed);
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-lg);
  min-width: 280px;
  max-width: 320px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-xs);
}

.control-group-label {
  font-size: var(--ds-font-size-sm);
  font-weight: 600;
  color: var(--ds-text-primary);
  margin-bottom: var(--ds-spacing-xs);
}

.control-label {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-sm);
  font-size: var(--ds-font-size-sm);
  font-weight: 500;
  color: var(--ds-text-primary);
  cursor: pointer;
}

.control-checkbox {
  width: 1rem;
  height: 1rem;
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-sm);
  cursor: pointer;
  accent-color: var(--ds-primary-600);
}

.control-description {
  font-size: var(--ds-font-size-xs);
  color: var(--ds-text-secondary);
  margin-left: 1.25rem;
}

.control-separator {
  height: 1px;
  background: var(--ds-border);
  margin: var(--ds-spacing-sm) 0;
}

/* Стили для переключателя темы */
.theme-switcher-button {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-sm);
  width: 100%;
  padding: var(--ds-spacing-sm) var(--ds-spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md);
  background: var(--ds-button-secondary-bg);
  color: var(--ds-button-secondary-text);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: var(--ds-font-size-sm);
}

.theme-switcher-button:hover {
  background: var(--ds-button-secondary-bg-hover);
  border-color: var(--ds-border-secondary);
}

.theme-switcher-button:focus-visible {
  outline: 2px solid var(--ds-border-focus);
  outline-offset: 2px;
}

.theme-icon {
  width: 1.125rem;
  height: 1.125rem;
  stroke-width: 1.5;
  flex-shrink: 0;
}

.theme-label {
  flex: 1;
  text-align: left;
}

.chevron-icon {
  width: 1rem;
  height: 1rem;
  stroke-width: 1.5;
  color: var(--ds-text-tertiary);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.theme-switcher-button[data-state='open'] .chevron-icon {
  transform: rotate(180deg);
}

/* Стили для выпадающего меню */
.theme-dropdown-content {
  min-width: var(--radix-dropdown-menu-trigger-width);
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
  outline: none;
}

.theme-dropdown-item:hover,
.theme-dropdown-item:focus {
  background: var(--ds-surface-secondary);
}

.theme-option-icon {
  width: 1rem;
  height: 1rem;
  stroke-width: 1.5;
  color: var(--ds-text-secondary);
  flex-shrink: 0;
}

.theme-check-icon {
  width: 1rem;
  height: 1rem;
  stroke-width: 2;
  color: var(--ds-primary-600);
  margin-left: auto;
  flex-shrink: 0;
}

/* Адаптивная настройка */
@media (max-width: 768px) {
  .design-system-controls {
    position: static;
    margin-bottom: var(--ds-spacing-lg);
    min-width: auto;
    max-width: none;
  }

  .theme-dropdown-content {
    min-width: 12rem;
  }

  .theme-dropdown-item {
    padding: var(--ds-spacing-md);
    font-size: var(--ds-font-size-md);
  }
}

/* Анимация появления dropdown */
.theme-dropdown-content {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
