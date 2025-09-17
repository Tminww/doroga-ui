<template>
  <div :class="tableContainerClasses">
    <!-- Состояние загрузки -->
    <div v-if="loading" class="base-table-loading">
      <BaseIcon icon="refresh-cw" :size="20" class="base-table-loading-icon" />
      <span>{{ loadingText }}</span>
    </div>

    <!-- Пустое состояние -->
    <div v-else-if="isEmpty" class="base-table-empty">
      <slot name="empty">
        <BaseIcon icon="file-text" :size="60" class="base-table-empty-icon" />
        <div class="base-table-empty-content">
          <span class="base-table-empty-title">
            {{ emptyText }}
          </span>
          <span class="base-table-empty-subtitle"> Попробуйте изменить поисковый запрос </span>
        </div>
      </slot>
    </div>

    <!-- Таблица -->
    <table v-else :class="tableClasses">
      <thead class="base-table-header-row">
        <tr class="base-table-row base-table-row--header">
          <th
            v-for="header in headers"
            :key="header.accessorKey"
            class="base-table-cell base-table-cell--header"
            :style="{ width: header.width }"
          >
            <div class="base-table-header-content">
              {{ header.name }}
            </div>
          </th>
        </tr>
      </thead>

      <tbody class="base-table-body">
        <tr
          v-for="(row, rowIndex) in data"
          :key="`row-${rowIndex}`"
          class="base-table-row base-table-row--body"
          :class="getRowClasses(row, rowIndex)"
          @click="handleRowClick(row, rowIndex, $event)"
        >
          <td
            v-for="header in headers"
            :key="`cell-${rowIndex}-${header.accessorKey}`"
            class="base-table-cell base-table-cell--body"
          >
            <!-- Слот для кастомизации содержимого ячейки -->
            <slot
              :name="`cell-${header.accessorKey}`"
              :row="row"
              :value="getCellValue(row, header.accessorKey)"
              :row-index="rowIndex"
            >
              {{ getCellValue(row, header.accessorKey) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

export interface BaseTableHeader {
  /** Ключ для доступа к данным */
  accessorKey: string
  /** Отображаемое имя колонки */
  name: string
  /** Ширина колонки */
  width?: string
}

export interface BaseTableProps<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Данные таблицы */
  data: TData[]
  /** Конфигурация заголовков */
  headers: BaseTableHeader[]
  /** Состояние загрузки */
  loading?: boolean
  /** Текст при загрузке */
  loadingText?: string
  /** Текст для пустого состояния */
  emptyText?: string
  /** Размер таблицы */
  size?: 'sm' | 'md' | 'lg'
  /** Растянуть на всю ширину */
  fullWidth?: boolean
  /** Выделяемые строки при наведении */
  hoverable?: boolean
  /** Дополнительные классы */
  class?: string
  /** Функция для получения уникального ключа строки */
  rowKey?: string | ((row: TData, index: number) => string | number)
}

const props = withDefaults(defineProps<BaseTableProps>(), {
  loading: false,
  loadingText: 'Загрузка...',
  emptyText: 'Нет данных для отображения',
  size: 'md',
  fullWidth: true,
  hoverable: true,
  rowKey: undefined,
})

export interface BaseTableEmits<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Клик по строке */
  'row-click': [row: TData, rowIndex: number, event: MouseEvent]
}

const emit = defineEmits<BaseTableEmits>()

// Вычисляемые свойства
const isEmpty = computed(() => !props.loading && props.data.length === 0)

const tableContainerClasses = computed(() => [
  'base-table-scroll-container',
  'base-table-container',
  {
    'base-table--loading': props.loading,
    'base-table--full-width': props.fullWidth,
  },
  props.class,
])

const tableClasses = computed(() => ['base-table', `base-table--${props.size}`])

// Методы
const getRowKey = (row: Record<string, unknown>, index: number): string | number => {
  if (props.rowKey === undefined) {
    return index
  }

  if (typeof props.rowKey === 'string') {
    const value = row[props.rowKey]
    return value != null ? String(value) : index
  }

  return props.rowKey(row, index)
}

const getCellValue = (row: Record<string, unknown>, accessorKey: string): unknown => {
  return row[accessorKey] ?? ''
}

const getRowClasses = (row: Record<string, unknown>, rowIndex: number) => {
  const classes: string[] = []

  if (props.hoverable) {
    classes.push('base-table-row--hoverable')
  }

  return classes
}

const handleRowClick = (
  row: Record<string, unknown>,
  rowIndex: number,
  event: MouseEvent,
): void => {
  emit('row-click', row, rowIndex, event)
}
</script>

<style scoped>
.base-table-container {
  position: relative;
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md);
  overflow: hidden;
  background-color: var(--ds-surface);
}

.base-table-scroll-container {
  overflow-x: auto;
}

.base-table--full-width {
  width: 100%;
}

.base-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}

.base-table-row {
  border-bottom: 1px solid var(--ds-border);
}

.base-table-row:last-child {
  border-bottom: none;
}

.base-table-row--header {
  background-color: var(--ds-surface-secondary);
}

.base-table-row--body.base-table-row--hoverable:hover {
  background-color: var(--ds-button-ghost-bg-hover);
}

.base-table-cell {
  text-align: left;
  vertical-align: middle;
  border-right: 1px solid var(--ds-border);
}

.base-table-cell:last-child {
  border-right: none;
}

.base-table-cell--header {
  font-weight: 600;
  color: var(--ds-text-secondary);
  background-color: var(--ds-surface-secondary);
  position: sticky;
  top: 0;
}

.base-table-cell--body {
  color: var(--ds-text-primary);
}

/* Размеры */
.base-table--sm .base-table-cell {
  padding: var(--ds-spacing-xs) var(--ds-spacing-sm);
  font-size: var(--ds-font-size-xs);
}

.base-table--md .base-table-cell {
  padding: var(--ds-spacing-sm) var(--ds-spacing-md);
  font-size: var(--ds-font-size-sm);
}

.base-table--lg .base-table-cell {
  padding: var(--ds-spacing-md) var(--ds-spacing-lg);
  font-size: var(--ds-font-size-md);
}

/* Выравнивание */
.base-table-cell--align-left {
  text-align: left;
}

.base-table-cell--align-center {
  text-align: center;
}

.base-table-cell--align-right {
  text-align: right;
}

/* Заголовок колонки */
.base-table-header-content {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-xs);
  cursor: default;
  min-height: 20px;
}

/* Состояния */
.base-table-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--ds-spacing-xl);
  color: var(--ds-text-secondary);
  font-size: var(--ds-font-size-sm);
  gap: var(--ds-spacing-md);
}

.base-table-loading-icon {
  animation: spin 1s linear infinite;
}

.base-table-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--ds-spacing-xl);
  color: var(--ds-text-secondary);
  font-size: var(--ds-font-size-sm);
  gap: var(--ds-spacing-md);
}

.base-table-empty-icon {
  opacity: 0.5;
}

.base-table-empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ds-spacing-xs);
  text-align: center;
}

.base-table-empty-title {
  font-weight: 500;
  color: var(--ds-text-primary);
}

.base-table-empty-subtitle {
  font-size: var(--ds-font-size-xs);
}

/* Анимации */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
