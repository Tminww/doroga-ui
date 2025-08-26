<template>
  <div class="design-system-provider">
    <div class="design-system-controls">
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
import { ref, watch } from 'vue'

const isDesignSystemMode = ref(true)
const showTooltipCode = ref(true)

// Сохраняем настройки в localStorage
const STORAGE_KEY = 'doroga-ui-design-system'

const loadSettings = () => {
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

const saveSettings = () => {
  const settings = {
    isDesignSystemMode: isDesignSystemMode.value,
    showTooltipCode: showTooltipCode.value,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

// Загружаем настройки при инициализации
loadSettings()

// Сохраняем настройки при изменении
watch([isDesignSystemMode, showTooltipCode], saveSettings, { deep: true })
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
  gap: var(--ds-spacing-md);
  min-width: 280px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-xs);
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
}

.control-description {
  font-size: var(--ds-font-size-xs);
  color: var(--ds-text-secondary);
  margin-left: 1.25rem;
}

@media (max-width: 768px) {
  .design-system-controls {
    position: static;
    margin-bottom: var(--ds-spacing-lg);
    min-width: auto;
  }
}
</style>
