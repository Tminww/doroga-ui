<template>
  <button :class="buttonClasses" :disabled="disabled" @click="$emit('click', $event)">
    <BaseIcon v-if="leftIcon" :icon="leftIcon" :class="iconClasses" />
    <span v-if="$slots.default || title" class="button-text">
      <slot>{{ title }}</slot>
    </span>
    <BaseIcon v-if="rightIcon" :icon="rightIcon" :class="iconClasses" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

export interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  title: string
  leftIcon?: string
  rightIcon?: string
  iconOnly?: boolean
  disabled?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<BaseButtonProps>(), {
  variant: 'primary',
  size: 'md',
  iconOnly: false,
  disabled: false,
  fullWidth: false,
})

const buttonClasses = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  {
    'base-button--icon-only': props.iconOnly,
    'base-button--full-width': props.fullWidth,
    'base-button--disabled': props.disabled,
  },
])

const iconClasses = computed(() => ['button-icon', `button-icon--${props.size}`])
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  line-height: 1;
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-button--full-width {
  width: 100%;
}

/* Размеры */
.base-button--sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

.base-button--md {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.base-button--lg {
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
}

/* Варианты */
.base-button--primary {
  background-color: #2563eb;
  color: white;
  border-color: #2563eb;
}

.base-button--primary:hover:not(:disabled) {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}

.base-button--secondary {
  background-color: white;
  color: #374151;
  border-color: #d1d5db;
}

.base-button--secondary:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.base-button--danger {
  background-color: #dc2626;
  color: white;
  border-color: #dc2626;
}

.base-button--danger:hover:not(:disabled) {
  background-color: #b91c1c;
  border-color: #b91c1c;
}

.base-button--success {
  background-color: #059669;
  color: white;
  border-color: #059669;
}

.base-button--success:hover:not(:disabled) {
  background-color: #047857;
  border-color: #047857;
}

.base-button--warning {
  background-color: #d97706;
  color: white;
  border-color: #d97706;
}

.base-button--warning:hover:not(:disabled) {
  background-color: #b45309;
  border-color: #b45309;
}

/* Иконочная кнопка */
.base-button--icon-only {
  padding: 0.5rem;
  min-width: 2.5rem;
}

.base-button--icon-only .button-text {
  display: none;
}

/* Иконки */
.button-icon {
  flex-shrink: 0;
}

.button-icon--sm {
  width: 0.875rem;
  height: 0.875rem;
}

.button-icon--md {
  width: 1rem;
  height: 1rem;
}

.button-icon--lg {
  width: 1.25rem;
  height: 1.25rem;
}

.button-text {
  white-space: nowrap;
  font-weight: 500;
}
</style>
