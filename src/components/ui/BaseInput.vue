<template>
  <div class="base-input-wrapper">
    <label v-if="label" :for="inputId" class="base-input-label">
      {{ label }}
      <span v-if="required" class="base-input-required">*</span>
    </label>

    <BaseTooltip
      :content="tooltipContent"
      component-name="BaseInput"
      :component-props="tooltipProps"
      :code="tooltipCode"
      side="right"
    >
      <div class="base-input-container">
        <BaseIcon
          v-if="leftIcon"
          :icon="leftIcon"
          :size="16"
          class="base-input-icon base-input-icon--left"
        />

        <input
          :id="inputId"
          ref="inputRef"
          :class="inputClasses"
          :type="type"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :required="required"
          :value="modelValue"
          :autocomplete="autocomplete"
          @input="handleInput"
          @focus="$emit('focus', $event)"
          @blur="$emit('blur', $event)"
          @keydown="$emit('keydown', $event)"
        />

        <BaseIcon
          v-if="rightIcon"
          :icon="rightIcon"
          :size="16"
          class="base-input-icon base-input-icon--right"
        />

        <button
          v-if="clearable && modelValue"
          type="button"
          class="base-input-clear"
          @click="handleClear"
          tabindex="-1"
        >
          <BaseIcon icon="x" :size="14" />
        </button>
      </div>
    </BaseTooltip>

    <div v-if="error || hint" class="base-input-help">
      <span v-if="error" class="base-input-error">{{ error }}</span>
      <span v-else-if="hint" class="base-input-hint">{{ hint }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import BaseIcon, { type IconName } from './BaseIcon.vue'
import BaseTooltip from './BaseTooltip.vue'

export interface BaseInputProps {
  /** Значение поля */
  modelValue?: string | number
  /** Тип поля */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  /** Метка поля */
  label?: string
  /** Placeholder */
  placeholder?: string
  /** Подсказка */
  hint?: string
  /** Ошибка */
  error?: string
  /** Иконка слева */
  leftIcon?: IconName
  /** Иконка справа */
  rightIcon?: IconName
  /** Размер поля */
  size?: 'sm' | 'md' | 'lg'
  /** Заблокированное состояние */
  disabled?: boolean
  /** Только для чтения */
  readonly?: boolean
  /** Обязательное поле */
  required?: boolean
  /** Кнопка очистки */
  clearable?: boolean
  /** Автокомплит */
  autocomplete?: string
  /** Описание для tooltip в продакшене */
  tooltip?: string
}

const props = withDefaults(defineProps<BaseInputProps>(), {
  type: 'text',
  size: 'md',
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
}>()

const inputRef = ref<HTMLInputElement>()
const inputId = useId()

const inputClasses = computed(() => [
  'base-input',
  `base-input--${props.size}`,
  {
    'base-input--disabled': props.disabled,
    'base-input--readonly': props.readonly,
    'base-input--error': props.error,
    'base-input--with-left-icon': props.leftIcon,
    'base-input--with-right-icon': props.rightIcon || props.clearable,
  },
])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? target.valueAsNumber : target.value
  emit('update:modelValue', value)
}

const handleClear = () => {
  emit('update:modelValue', '')
  inputRef.value?.focus()
}

// Tooltip content для продакшена
const tooltipContent = computed(() => {
  return props.tooltip || `${props.label || 'Поле ввода'} (${props.type})`
})

// Props для отображения в дизайн-системе
const tooltipProps = computed(() => {
  const propsList = []

  if (props.modelValue !== undefined) propsList.push(`v-model="${props.modelValue}"`)
  if (props.type !== 'text') propsList.push(`type="${props.type}"`)
  if (props.label) propsList.push(`label="${props.label}"`)
  if (props.placeholder) propsList.push(`placeholder="${props.placeholder}"`)
  if (props.hint) propsList.push(`hint="${props.hint}"`)
  if (props.error) propsList.push(`error="${props.error}"`)
  if (props.leftIcon) propsList.push(`left-icon="${props.leftIcon}"`)
  if (props.rightIcon) propsList.push(`right-icon="${props.rightIcon}"`)
  if (props.size !== 'md') propsList.push(`size="${props.size}"`)
  if (props.disabled) propsList.push(':disabled="true"')
  if (props.readonly) propsList.push(':readonly="true"')
  if (props.required) propsList.push(':required="true"')
  if (props.clearable) propsList.push(':clearable="true"')
  if (props.autocomplete) propsList.push(`autocomplete="${props.autocomplete}"`)

  return propsList.join('\n  ')
})

// Полный код компонента для tooltip
const tooltipCode = computed(() => {
  const hasProps = tooltipProps.value.length > 0

  if (!hasProps) {
    return `<BaseInput v-model="value" />`
  }

  return `<BaseInput\n  ${tooltipProps.value}\n/>`
})
</script>

<style scoped>
.base-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-xs);
}

.base-input-label {
  font-size: var(--ds-font-size-sm);
  font-weight: 500;
  color: var(--ds-text-tertiary);
  cursor: pointer;
  padding: var(--ds-spacing-xs);
  border-radius: var(--ds-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.base-input-clear:hover {
  color: var(--ds-text-secondary);
  background-color: var(--ds-surface-secondary);
}

.base-input--sm .base-input-clear {
  right: var(--ds-spacing-sm);
}

.base-input--lg .base-input-clear {
  right: var(--ds-spacing-lg);
}

/* Подсказки и ошибки */
.base-input-help {
  font-size: var(--ds-font-size-xs);
  line-height: 1.4;
}

.base-input-error {
  color: var(--ds-danger-500);
}

.base-input-hint {
  color: var(--ds-text-secondary);
}

.base-input-required {
  color: var(--ds-danger-500);
  font-weight: 600;
}

.base-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.base-input {
  width: 100%;
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md);
  background-color: var(--ds-surface);
  color: var(--ds-text-primary);
  font-size: var(--ds-font-size-sm);
  transition: all 0.2s ease;
  font-family: inherit;
}

.base-input:focus {
  outline: none;
  border-color: var(--ds-border-focus);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.base-input:disabled {
  background-color: var(--ds-surface-secondary);
  color: var(--ds-text-tertiary);
  cursor: not-allowed;
  pointer-events: none;
}

.base-input:readonly {
  background-color: var(--ds-surface-secondary);
  cursor: default;
}

.base-input::placeholder {
  color: var(--ds-text-tertiary);
}

/* Размеры */
.base-input--sm {
  padding: var(--ds-spacing-xs) var(--ds-spacing-md);
  font-size: var(--ds-font-size-xs);
  min-height: 1rem;
}

.base-input--md {
  padding: var(--ds-spacing-sm) var(--ds-spacing-lg);
  font-size: var(--ds-font-size-sm);
  min-height: 1.25rem;
}

.base-input--lg {
  padding: var(--ds-spacing-md) var(--ds-spacing-xl);
  font-size: var(--ds-font-size-md);
  min-height: 1.5rem;
}

/* Состояния */
.base-input--error {
  border-color: var(--ds-danger-500);
}

.base-input--error:focus {
  border-color: var(--ds-danger-500);
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
}

/* С иконками */
.base-input--with-left-icon {
  padding-left: 2.5rem;
}

.base-input--with-right-icon {
  padding-right: 2.5rem;
}

.base-input--sm.base-input--with-left-icon {
  padding-left: 2rem;
}

.base-input--sm.base-input--with-right-icon {
  padding-right: 2rem;
}

.base-input--lg.base-input--with-left-icon {
  padding-left: 3rem;
}

.base-input--lg.base-input--with-right-icon {
  padding-right: 3rem;
}

/* Иконки */
.base-input-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: var(--ds-text-tertiary);
  pointer-events: none;
}

.base-input-icon--left {
  left: var(--ds-spacing-md);
}

.base-input-icon--right {
  right: var(--ds-spacing-md);
}

.base-input--sm .base-input-icon--left {
  left: var(--ds-spacing-sm);
}

.base-input--sm .base-input-icon--right {
  right: var(--ds-spacing-sm);
}

.base-input--lg .base-input-icon--left {
  left: var(--ds-spacing-lg);
}

.base-input--lg .base-input-icon--right {
  right: var(--ds-spacing-lg);
}

/* Кнопка очистки */
.base-input-clear {
  position: absolute;
  right: var(--ds-spacing-md);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--ds-text-tertiary);
  cursor: pointer;
  padding: var(--ds-spacing-xs);
  border-radius: var(--ds-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
</style>
