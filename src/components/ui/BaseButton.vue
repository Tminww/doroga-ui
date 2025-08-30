<template>
  <BaseTooltip :content="tooltip" :side="tooltipSide">
    <button
      :class="buttonClasses"
      :disabled="disabled"
      :type="type"
      @click="$emit('click', $event)"
    >
      <BaseIcon v-if="leftIcon" :icon="leftIcon" :size="iconSize" />
      <span v-if="!iconOnly && (title || $slots.default)" class="button-text">
        <slot>{{ title }}</slot>
      </span>
      <BaseIcon v-if="rightIcon" :icon="rightIcon" :size="iconSize" />
    </button>
  </BaseTooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon, { type IconName } from './BaseIcon.vue'
import BaseTooltip from './BaseTooltip.vue'

export interface BaseButtonProps {
  /** Вариант стиля кнопки */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost'
  /** Размер кнопки */
  size?: 'sm' | 'md' | 'lg'

  iconSize?: number
  /** Текст кнопки */
  title?: string
  /** Иконка слева */
  leftIcon?: IconName
  /** Иконка справа */
  rightIcon?: IconName
  /** Отображать только иконку без текста */
  iconOnly?: boolean
  /** Заблокированное состояние */
  disabled?: boolean
  /** Растянуть на всю ширину контейнера */
  fullWidth?: boolean
  /** Тип кнопки для формы */
  type?: 'button' | 'submit' | 'reset'
  /** Выравнивание содержимого кнопки */
  align?: 'left' | 'center' | 'right'
  /** Программное управление активным состоянием */
  active?: boolean
  /** Дополнительные CSS классы */
  class?: string
  /** Описание для tooltip в продакшене */
  tooltip?: string
  /** Позиция tooltip относительно элемента */
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left'
}

const props = withDefaults(defineProps<BaseButtonProps>(), {
  variant: 'primary',
  size: 'md',
  iconOnly: false,
  disabled: false,
  fullWidth: false,
  type: 'button',
  align: 'center',
  active: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  `base-button--align-${props.align}`,
  {
    'base-button--icon-only': props.iconOnly,
    'base-button--full-width': props.fullWidth,
    'base-button--disabled': props.disabled,
    'base-button--active': props.active,
  },
  props.class,
])

const iconSize = computed(() => {
  if (props.iconSize) {
    return props.iconSize
  }
  switch (props.size) {
    case 'sm':
      return 14
    case 'lg':
      return 20
    default:
      return 16
  }
})
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

.base-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--ds-border-focus);
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
  padding: var(--ds-spacing-xs) var(--ds-spacing-md);
  font-size: var(--ds-font-size-xs);
  min-height: 1rem;
}

.base-button--md {
  padding: var(--ds-spacing-sm) var(--ds-spacing-lg);
  font-size: var(--ds-font-size-sm);
  min-height: 1.25rem;
}

.base-button--lg {
  padding: var(--ds-spacing-md) var(--ds-spacing-xl);
  font-size: var(--ds-font-size-md);
  min-height: 1.5rem;
}

/* Варианты */
.base-button--primary {
  background-color: var(--ds-button-primary-bg);
  color: var(--ds-button-primary-text);
  border-color: var(--ds-button-primary-bg);
}

.base-button--primary:hover:not(:disabled) {
  background-color: var(--ds-button-primary-bg-hover);
  border-color: var(--ds-button-primary-bg-hover);
}

.base-button--primary.base-button--active {
  background-color: var(--ds-button-primary-bg-hover);
  border-color: var(--ds-button-primary-bg-hover);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.base-button--secondary {
  background-color: var(--ds-button-hover-bg);
  color: var(--ds-button-secondary-text);
  border-color: var(--ds-button-secondary-border);
}

.base-button--secondary:hover:not(:disabled) {
  background-color: var(--ds-button-secondary-bg-hover);
  border-color: var(--ds-border-secondary);
}

.base-button--secondary.base-button--active {
  background-color: var(--ds-button-ghost-bg-active);
  color: var(--ds-button-ghost-text-active);
  border-color: var(--ds-button-ghost-border-active);
}

.base-button--danger {
  background-color: var(--ds-button-danger-bg);
  color: var(--ds-button-danger-text);
  border-color: var(--ds-button-danger-bg);
}

.base-button--danger:hover:not(:disabled) {
  background-color: var(--ds-button-danger-bg-hover);
  border-color: var(--ds-button-danger-bg-hover);
}

.base-button--danger.base-button--active {
  background-color: var(--ds-button-danger-bg-hover);
  border-color: var(--ds-button-danger-bg-hover);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.base-button--success {
  background-color: var(--ds-button-success-bg);
  color: var(--ds-button-success-text);
  border-color: var(--ds-button-success-bg);
}

.base-button--success:hover:not(:disabled) {
  background-color: var(--ds-button-success-bg-hover);
  border-color: var(--ds-button-success-bg-hover);
}

.base-button--success.base-button--active {
  background-color: var(--ds-button-success-bg-hover);
  border-color: var(--ds-button-success-bg-hover);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.base-button--warning {
  background-color: var(--ds-button-warning-bg);
  color: var(--ds-button-warning-text);
  border-color: var(--ds-button-warning-bg);
}

.base-button--warning:hover:not(:disabled) {
  background-color: var(--ds-button-warning-bg-hover);
  border-color: var(--ds-button-warning-bg-hover);
}

.base-button--warning.base-button--active {
  background-color: var(--ds-button-warning-bg-hover);
  border-color: var(--ds-button-warning-bg-hover);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Ghost вариант */
.base-button--ghost {
  background-color: transparent;
  color: var(--ds-text-primary);
  border-color: transparent;
}

.base-button--ghost:hover:not(:disabled) {
  background-color: var(--ds-button-ghost-bg-hover);
  border-color: var(--ds-button-ghost-border-hover);
}

.base-button--ghost:active:not(:disabled),
.base-button--ghost:focus:not(:disabled),
.base-button--ghost.base-button--active {
  background-color: var(--ds-button-ghost-bg-active);
  color: var(--ds-button-ghost-text-active);
  border-color: var(--ds-button-ghost-border-active);
}

/* Выравнивание содержимого */
.base-button--align-left {
  justify-content: flex-start;
}

.base-button--align-center {
  justify-content: center;
}

.base-button--align-right {
  justify-content: flex-end;
}

/* Иконочная кнопка */
.base-button--icon-only {
  aspect-ratio: 1;
  padding: var(--ds-spacing-sm);
}

.base-button--icon-only.base-button--sm {
  padding: var(--ds-spacing-xs);
}

.base-button--icon-only.base-button--lg {
  padding: var(--ds-spacing-md);
}

/* Иконки */
.button-icon {
  flex-shrink: 0;
}

.button-text {
  font-weight: 500;
}
</style>
