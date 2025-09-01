<script setup lang="ts">
import BaseIcon from '@/components/ui/BaseIcon.vue'
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
  type AcceptableValue,
  type ListboxItemSelectEvent,
  type PointerDownOutsideEvent,
} from 'reka-ui'
import { type IconName } from '@/components/ui/BaseIcon.vue'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import BaseButton from '../ui/BaseButton.vue'

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

const open = ref(false)
const toggleOpen = () => {
  open.value = !open.value
}

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
  console.log('CLICK', newTheme.value)

  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newTheme))
  } catch (error) {
    console.warn('Could not save theme preference:', error)
  }

  applyTheme(newTheme.value)
}

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

// Инициализация при монтировании
onMounted(() => {
  // Загружаем все настройки
  loadThemeSettings()
  console.log(selected.value)

  // Применяем тему
  applyTheme(selected.value.value)
})
</script>

<template>
  <SelectRoot
    v-model="selected"
    :open="open"
    :default-value="selected.value"
    @update:model-value="setTheme"
  >
    <SelectTrigger
      :as="BaseButton"
      :icon-only="true"
      variant="secondary"
      :left-icon="selected.icon"
      tooltip="Цветовая тема"
      tooltip-side="bottom"
      @click="toggleOpen"
    >
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="theme-switcher-content"
        :side-offset="5"
        position="popper"
        align="center"
        @escape-key-down="toggleOpen"
        @pointer-down-outside="toggleOpen"
      >
        <!-- <SelectScrollUpButton class="theme-switcher-scroll-button">
          <BaseIcon icon="chevron-up" :size="16" />
        </SelectScrollUpButton> -->

        <SelectViewport class="theme-switcher-viewport">
          <SelectGroup>
            <SelectItem
              v-for="item in items"
              :key="item.value"
              class="theme-switcher-item"
              :value="item"
              @select="toggleOpen"
              @keyup.enter="toggleOpen"
            >
              <BaseIcon :icon="item.icon" />

              <SelectItemText> {{ item.name }} </SelectItemText>
              <SelectItemIndicator class="theme-switcher-item-indicator">
                <BaseIcon icon="check" :size="16" />
              </SelectItemIndicator>
            </SelectItem>
          </SelectGroup>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
<style scoped>
.theme-switcher-trigger {
  display: inline-flex;
  width: 2.5rem;
  height: 30px;
  align-items: center;
  justify-content: space-around;
  gap: var(--ds-spacing-sm);
  border: 1px solid transparent;
  border-radius: var(--ds-radius-md);
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  line-height: 1;
  white-space: nowrap;
}
.theme-switcher-trigger:hover {
  background-color: var(--ds-warning-600);
}

.theme-switcher-trigger[data-placeholder] {
  color: var(--ds-success-900);
}

.theme-switcher-trigger:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--ds-border-focus);
}

:deep(.theme-switcher-content) {
  /* overflow: hidden; */
  border-radius: var(--ds-radius-md);
  border: 1px solid var(--ds-border);
  padding: 10px;
  color: var(--ds-button-secondary-text);
  background-color: var(--ds-button-secondary-bg);
  box-shadow: var(--ds-select-shadow);
  user-select: none;
  z-index: var(--ds-z-popover);
}

:deep(.theme-switcher-viewport) {
  padding: 0px;
}

/* Ghost вариант */

.theme-switcher-item {
  display: flex;
  border: 1px solid transparent;
  justify-content: flex-start;
  gap: var(--ds-spacing-md);
  font-size: var(--ds-font-size-md);
  line-height: 1;
  background-color: transparent;
  color: var(--ds-text-primary);
  border-color: transparent;
  border-radius: var(--ds-radius-md);
  display: flex;
  align-items: center;
  height: 25px;
  padding: 0 30px 0 10px;
  margin-bottom: 5px;
  position: relative;
  user-select: none;
  cursor: pointer;
}
.theme-switcher-item:hover:not(.disabled) {
  background-color: var(--ds-button-ghost-bg-hover);
  border-color: var(--ds-button-ghost-border-hover);
}
.theme-switcher-item[data-disabled] {
  color: var(--ds-warning-600);
  pointer-events: none;
}

.theme-switcher-item[data-highlighted] {
  outline: none;
  background-color: var(--ds-button-ghost-bg-hover);
  border-color: var(--ds-button-ghost-border-hover);
}

.theme-switcher-item[data-state='checked'] {
  background-color: var(--ds-button-ghost-bg-active);
  color: var(--ds-button-ghost-text-active);
  border-color: var(--ds-button-ghost-border-active);
}

.theme-switcher-label {
  padding: 0 25px;
  font-size: 12px;
  line-height: 25px;
  color: var(--ds-warning-500);
}

.theme-switcher-separator {
  height: 1px;
  background-color: var(--ds-success-600);
  margin: 5px;
}

.theme-switcher-item-indicator {
  position: absolute;
  right: 0;
  width: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.theme-switcher-scroll-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  background-color: white;
  color: var(--ds-success-500);
  cursor: default;
}
</style>
