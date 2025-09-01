<script setup lang="ts">
import BaseIcon from './BaseIcon.vue'
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
import { computed, ref } from 'vue'

interface Item {
  icon?: string
  name: string
  value?: string | number
  selected?: boolean
}

interface BaseSelectProps {
  modelValue?: string

  items?: Item[]
  /** Вариант стиля кнопки */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost'
  /** Размер кнопки */
  size?: 'sm' | 'md' | 'lg'
  iconSize?: number
  /** Текст кнопки */
  placeholder?: string
  /** Заблокированное состояние */
  disabled?: boolean
  /** Растянуть на всю ширину контейнера */
  fullWidth?: boolean

  /** Выравнивание содержимого кнопки */
  alignContent?: 'start' | 'center' | 'end'
  /** Дополнительные CSS классы */
  class?: string

  portalTo?: string
}

const props = withDefaults(defineProps<BaseSelectProps>(), {
  portalTo: 'body',
  alignContent: 'center',
  size: 'md',
  fullWidth: false,
  disabled: false,
  variant: 'ghost',
})
const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:modelValue': [value: AcceptableValue]
  select: [event: ListboxItemSelectEvent<AcceptableValue>]
  closeAutoFocus: [event: Event]
  escapeKeyDown: [event: KeyboardEvent]
  pointerDownOutside: [event: PointerDownOutsideEvent]
}>()

const selectContentClasses = computed(() => ['base-select-content'])

const selectTriggerClasses = computed(() => [
  'base-select-trigger',
  `base-select-trigger--${props.variant}`,
  `base-select-trigger--${props.size}`,
  {
    'base-button--full-width': props.fullWidth,
    'base-button--disabled': props.disabled,
  },
  props.class,
])

const value = ref(props.modelValue)

const updateModelValue = () => {
  emit('update:modelValue', value)
}
const updateOpen = (value: boolean) => {
  console.log('OPEN')
  emit('update:open', value)
}
</script>

<template>
  <SelectRoot
    v-model="value"
    @update:model-value="updateModelValue"
    @update:open="(value) => updateOpen(value)"
  >
    <SelectTrigger :class="selectTriggerClasses" aria-label="Customise options">
      <SelectValue placeholder="Select a fruit..." />
      <BaseIcon icon="chevron-down" class="base-select-icon" :size="16" />
    </SelectTrigger>

    <SelectPortal :to="portalTo">
      <SelectContent
        :class="selectContentClasses"
        :side-offset="5"
        position="popper"
        :align="alignContent"
      >
        <!-- <SelectScrollUpButton class="base-select-scroll-button">
          <BaseIcon icon="chevron-up" :size="16" />
        </SelectScrollUpButton> -->

        <SelectViewport class="base-select-viewport">
          <SelectLabel class="base-select-label"> Fruits </SelectLabel>
          <SelectGroup>
            <SelectItem
              v-for="(option, index) in items"
              :key="index"
              class="base-select-item"
              :value="option"
            >
              <SelectItemIndicator class="base-select-item-indicator">
                <BaseIcon icon="check" :size="16" />
              </SelectItemIndicator>
              <SelectItemText>
                {{ option }}
              </SelectItemText>
            </SelectItem>
          </SelectGroup>
          <SelectSeparator class="base-select-separator" />
          <SelectLabel class="base-select-label"> Vegetables </SelectLabel>
          <SelectGroup>
            <SelectItem
              v-for="(option, index) in vegetables"
              :key="index"
              class="base-select-item"
              :value="option"
              :disabled="option === 'Courgette'"
            >
              <SelectItemIndicator class="base-select-item-indicator">
                <BaseIcon icon="check" :size="16" />
              </SelectItemIndicator>
              <SelectItemText>
                {{ option }}
              </SelectItemText>
            </SelectItem>
          </SelectGroup>
        </SelectViewport>

        <SelectScrollDownButton class="base-select-scroll-button">
          <BaseIcon icon="chevron-down" />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
<style scoped>
.base-select-trigger {
  display: inline-flex;
  width: 10rem;
  height: 35px;
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
.base-select-trigger:hover {
  background-color: var(--ds-warning-600);
}

.base-select-trigger[data-placeholder] {
  color: var(--ds-success-900);
}

.base-select-trigger:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--ds-border-focus);
}

.base-select-trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-select-trigger--full-width {
  width: 100%;
}

.base-select-trigger--sm {
  padding: var(--ds-spacing-xs) var(--ds-spacing-md);
  font-size: var(--ds-font-size-xs);
  min-height: 1rem;
}

.base-select-trigger--md {
  padding: var(--ds-spacing-sm) var(--ds-spacing-lg);
  font-size: var(--ds-font-size-sm);
  min-height: 1.25rem;
}

.base-select-trigger--lg {
  padding: var(--ds-spacing-md) var(--ds-spacing-xl);
  font-size: var(--ds-font-size-md);
  min-height: 1.5rem;
}

.base-select-icon {
  color: Var(--ds-success-500);
}

:deep(.base-select-content) {
  /* overflow: hidden; */
  border-radius: var(--ds-radius-md);
  border: 1px solid var(--ds-border);
  padding: 5px;
  color: var(--ds-button-secondary-text);
  background-color: var(--ds-button-secondary-bg);
  box-shadow: var(--ds-tooltip-shadow);
  user-select: none;
  z-index: var(--ds-z-popover);
}

:deep(.base-select-viewport) {
  padding: 0px;
}

.base-select-item {
  font-size: 13px;
  line-height: 1;
  color: var(--ds-success-500);
  border-radius: 3px;
  display: flex;
  align-items: center;
  height: 25px;
  padding: 0 35px 0 25px;
  position: relative;
  user-select: none;
}
.base-select-item[data-disabled] {
  color: var(--ds-warning-600);
  pointer-events: none;
}
.base-select-item[data-highlighted] {
  outline: none;
  background-color: var(--ds-succes-900);
  color: var(--ds-success-200);
}

.base-select-label {
  padding: 0 25px;
  font-size: 12px;
  line-height: 25px;
  color: var(--ds-warning-500);
}

.base-select-separator {
  height: 1px;
  background-color: var(--ds-success-600);
  margin: 5px;
}

.base-select-item-indicator {
  position: absolute;
  left: 0;
  width: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.base-select-scroll-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  background-color: white;
  color: var(--ds-success-500);
  cursor: default;
}
</style>
