<template>
  <BaseTooltip :content="tooltipContent" :side="tooltipSide">
    <SelectRoot
      v-model="internalValue"
      :open="open"
      :disabled="disabled"
      @update:open="handleOpenChange"
    >
      <SelectTrigger :class="triggerClasses" :disabled="disabled" @click="handleTriggerClick">
        <div class="base-select-trigger-content">
          <BaseIcon v-if="selectedItem?.icon" :icon="selectedItem.icon" :size="iconSize" />
          <BaseIcon v-else-if="leftIcon" :icon="leftIcon" :size="iconSize" />

          <span v-if="!iconOnly" class="base-select-trigger-text">
            <SelectValue :placeholder="placeholder">
              {{ selectedItem?.name || placeholder }}
            </SelectValue>
          </span>

          <BaseIcon v-if="!iconOnly" icon="chevron-down" :size="12" class="base-select-chevron" />
        </div>
      </SelectTrigger>

      <SelectPortal :to="portalTo">
        <SelectContent
          :class="contentClasses"
          :side-offset="5"
          position="popper"
          :align="align"
          @escape-key-down="handleClose"
          @pointer-down-outside="handleClose"
        >
          <SelectViewport class="base-select-viewport">
            <SelectGroup v-if="groups.length > 0">
              <template v-for="(group, groupIndex) in groups" :key="groupIndex">
                <SelectLabel v-if="group.label" class="base-select-label">
                  {{ group.label }}
                </SelectLabel>
                <SelectItem
                  v-for="item in group.items"
                  :key="getItemKey(item)"
                  class="base-select-item"
                  :value="item"
                  :disabled="item.disabled"
                  @select="handleSelect"
                >
                  <div class="base-select-item-content">
                    <BaseIcon v-if="item.icon" :icon="item.icon" :size="16" />
                    <SelectItemText>{{ item.name }}</SelectItemText>
                  </div>
                  <SelectItemIndicator class="base-select-item-indicator">
                    <BaseIcon icon="check" :size="14" />
                  </SelectItemIndicator>
                </SelectItem>
                <div v-if="groupIndex < groups.length - 1" class="base-select-separator" />
              </template>
            </SelectGroup>

            <SelectGroup v-else>
              <SelectItem
                v-for="item in items"
                :key="getItemKey(item)"
                class="base-select-item"
                :value="item"
                :disabled="item.disabled"
                @select="handleSelect"
              >
                <div class="base-select-item-content">
                  <BaseIcon v-if="item.icon" :icon="item.icon" :size="16" />
                  <SelectItemText>{{ item.name }}</SelectItemText>
                </div>
                <SelectItemIndicator class="base-select-item-indicator">
                  <BaseIcon icon="check" :size="14" />
                </SelectItemIndicator>
              </SelectItem>
            </SelectGroup>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </BaseTooltip>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseIcon, { type IconName } from './BaseIcon.vue'
import BaseTooltip from './BaseTooltip.vue'
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
  type AcceptableValue,
} from 'reka-ui'

export interface SelectItem {
  /** Уникальный идентификатор */
  id?: string | number
  /** Отображаемое имя */
  name: string
  /** Значение элемента */
  value: string | number | boolean
  /** Иконка элемента */
  icon?: IconName
  /** Заблокированное состояние */
  disabled?: boolean
  /** Дополнительные данные */
  data?: any
}

export interface SelectGroup {
  /** Заголовок группы */
  label?: string
  /** Элементы группы */
  items: SelectItem[]
}

export interface BaseSelectProps {
  /** Текущее значение */
  modelValue?: SelectItem | string | number | null
  /** Элементы для выбора */
  items?: SelectItem[]
  /** Группированные элементы */
  groups?: SelectGroup[]
  /** Placeholder текст */
  placeholder?: string
  /** Вариант стиля */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost'
  /** Размер */
  size?: 'sm' | 'md' | 'lg'
  /** Размер иконки */
  iconSize?: number
  /** Иконка слева */
  leftIcon?: IconName
  /** Отображать только иконку без текста */
  iconOnly?: boolean
  /** Заблокированное состояние */
  disabled?: boolean
  /** Растянуть на всю ширину */
  fullWidth?: boolean
  /** Выравнивание содержимого попапа */
  align?: 'start' | 'center' | 'end'
  /** Куда портировать содержимое */
  portalTo?: string
  /** Дополнительные CSS классы */
  class?: string
  /** Описание для tooltip */
  tooltip?: string
  /** Позиция tooltip */
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left'
}

const props = withDefaults(defineProps<BaseSelectProps>(), {
  variant: 'secondary',
  size: 'md',
  iconOnly: false,
  disabled: false,
  fullWidth: false,
  align: 'center',
  portalTo: 'body',
  placeholder: 'Выберите значение...',
  items: () => [],
  groups: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: SelectItem | null]
  'update:open': [value: boolean]
  select: [item: SelectItem]
  open: []
  close: []
}>()

const open = ref(false)
const internalValue = ref<SelectItem | null>(null)

// Вычисляемые свойства
const selectedItem = computed(() => {
  if (internalValue.value) {
    return internalValue.value
  }

  if (typeof props.modelValue === 'object' && props.modelValue !== null) {
    return props.modelValue as SelectItem
  }

  // Поиск элемента по значению
  const allItems = getAllItems()
  return allItems.find((item) => item.value === props.modelValue) || null
})

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

const triggerClasses = computed(() => [
  'base-select-trigger',
  `base-select-trigger--${props.variant}`,
  `base-select-trigger--${props.size}`,
  {
    'base-select-trigger--icon-only': props.iconOnly,
    'base-select-trigger--full-width': props.fullWidth,
    'base-select-trigger--disabled': props.disabled,
    'base-select-trigger--open': open.value,
  },
  props.class,
])

const contentClasses = computed(() => ['base-select-content', `base-select-content--${props.size}`])

const tooltipContent = computed(() => {
  return props.tooltip || `Выбор значения`
})

// Методы
const getAllItems = (): SelectItem[] => {
  if (props.groups.length > 0) {
    return props.groups.flatMap((group) => group.items)
  }
  return props.items
}

const getItemKey = (item: SelectItem): string => {
  return item.id?.toString() || `${item.value}-${item.name}`
}

const handleOpenChange = (newOpen: boolean) => {
  open.value = newOpen
  emit('update:open', newOpen)

  if (newOpen) {
    emit('open')
  } else {
    emit('close')
  }
}

const handleTriggerClick = () => {
  if (!props.disabled) {
    open.value = !open.value
  }
}

const handleSelect = () => {
  open.value = false
}

const handleClose = () => {
  open.value = false
}

// Синхронизация с внешним значением
watch(
  () => props.modelValue,
  (newValue) => {
    if (typeof newValue === 'object' && newValue !== null) {
      internalValue.value = newValue as SelectItem
    } else {
      const allItems = getAllItems()
      internalValue.value = allItems.find((item) => item.value === newValue) || null
    }
  },
  { immediate: true },
)

// Синхронизация внутреннего значения с внешним
watch(internalValue, (newValue) => {
  if (newValue !== props.modelValue) {
    emit('update:modelValue', newValue)
    if (newValue) {
      emit('select', newValue)
    }
  }
})
</script>

<style scoped>
/* Триггер */
.base-select-trigger {
  display: inline-flex;
  align-items: center;
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
  background-color: transparent;
  color: var(--ds-text-primary);
  min-width: 0;
}

.base-select-trigger:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--ds-border-focus);
}

.base-select-trigger:disabled,
.base-select-trigger--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.base-select-trigger--full-width {
  width: 100%;
}

.base-select-trigger-content {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-sm);
  width: 100%;
  min-width: 0;
}

.base-select-trigger-text {
  flex: 1;
  min-width: 0;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
}

.base-select-chevron {
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.base-select-trigger--open .base-select-chevron {
  transform: rotate(180deg);
}

/* Размеры триггера */
.base-select-trigger--sm {
  padding: var(--ds-spacing-xs) var(--ds-spacing-sm);
  font-size: var(--ds-font-size-xs);
  min-height: 1rem;
}

.base-select-trigger--md {
  padding: var(--ds-spacing-sm);
  font-size: var(--ds-font-size-sm);
  min-height: 1.5rem;
}

.base-select-trigger--lg {
  padding: var(--ds-spacing-xs) var(--ds-spacing-md);
  font-size: var(--ds-font-size-md);
  min-height: 2rem;
}

/* Иконочный режим */
.base-select-trigger--icon-only {
  aspect-ratio: 1;
}

.base-select-trigger--icon-only .base-select-trigger-text {
  display: none;
}

.base-select-trigger--icon-only .base-select-chevron {
  display: none;
}

/* Варианты стилей */
.base-select-trigger--primary {
  background-color: var(--ds-button-primary-bg);
  color: var(--ds-button-primary-text);
  border-color: var(--ds-button-primary-bg);
}

.base-select-trigger--primary:hover:not(:disabled) {
  background-color: var(--ds-button-primary-bg-hover);
  border-color: var(--ds-button-primary-bg-hover);
}

.base-select-trigger--secondary {
  background-color: var(--ds-button-secondary-bg);
  color: var(--ds-button-secondary-text);
  border-color: var(--ds-button-secondary-border);
}

.base-select-trigger--secondary:hover:not(:disabled) {
  background-color: var(--ds-button-secondary-bg-hover);
  border-color: var(--ds-border-secondary);
}

.base-select-trigger--ghost {
  background-color: transparent;
  color: var(--ds-text-primary);
  border-color: transparent;
}

.base-select-trigger--ghost:hover:not(:disabled) {
  background-color: var(--ds-button-ghost-bg-hover);
  border-color: var(--ds-button-ghost-border-hover);
}

.base-select-trigger--danger {
  background-color: var(--ds-button-danger-bg);
  color: var(--ds-button-danger-text);
  border-color: var(--ds-button-danger-bg);
}

.base-select-trigger--danger:hover:not(:disabled) {
  background-color: var(--ds-button-danger-bg-hover);
  border-color: var(--ds-button-danger-bg-hover);
}

.base-select-trigger--success {
  background-color: var(--ds-button-success-bg);
  color: var(--ds-button-success-text);
  border-color: var(--ds-button-success-bg);
}

.base-select-trigger--success:hover:not(:disabled) {
  background-color: var(--ds-button-success-bg-hover);
  border-color: var(--ds-button-success-bg-hover);
}

.base-select-trigger--warning {
  background-color: var(--ds-button-warning-bg);
  color: var(--ds-button-warning-text);
  border-color: var(--ds-button-warning-bg);
}

.base-select-trigger--warning:hover:not(:disabled) {
  background-color: var(--ds-button-warning-bg-hover);
  border-color: var(--ds-button-warning-bg-hover);
}

/* Содержимое выпадающего списка */
:deep(.base-select-content) {
  width: 100%;
  border-radius: var(--ds-radius-md);
  border: 1px solid var(--ds-border);
  padding: 5px 5px 5px 5px;
  background-color: var(--ds-surface);
  color: var(--ds-text-primary);
  box-shadow: var(--ds-shadow-lg);
  user-select: none;
  z-index: var(--ds-z-popover);
  max-height: 300px;
  overflow: hidden;
}

:deep(.base-select-viewport) {
  padding: 0;
}

.base-select-item {
  font-size: var(--ds-font-size-sm);
  line-height: 1;
  color: var(--ds-text-primary);
  border-radius: var(--ds-radius-sm);
  display: flex;
  align-items: center;
  height: 30px;
  padding: 0 35px 0 5px;
  position: relative;
  user-select: none;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 5px;
}

.base-select-item-content {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-sm);
  flex: 1;
  min-width: 0;
}

.base-select-item[data-disabled] {
  color: var(--ds-text-tertiary);
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.base-select-item[data-highlighted] {
  outline: none;
  background-color: var(--ds-button-ghost-bg-hover);
  color: var(--ds-text-primary);
}

.base-select-item[data-state='checked'] {
  background-color: var(--ds-button-ghost-bg-active);
  color: var(--ds-button-ghost-text-active);
}

.base-select-item-indicator {
  position: absolute;
  right: 0;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--ds-text-success);
}

.base-select-label {
  padding: var(--ds-spacing-xs) var(--ds-spacing-sm);
  font-size: var(--ds-font-size-xs);
  font-weight: 600;
  color: var(--ds-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.5;
}

.base-select-separator {
  height: 1px;
  background-color: var(--ds-border);
  margin: var(--ds-spacing-xs) 0;
}

/* Размеры содержимого */
.base-select-content--sm .base-select-item {
  min-height: 1rem;
  font-size: var(--ds-font-size-xs);
}
.base-select-content--md .base-select-item {
  min-height: 1rem;
  font-size: var(--ds-font-size-sm);
}

.base-select-content--lg .base-select-item {
  min-height: 1.5rem;
  font-size: var(--ds-font-size-md);
}
</style>
