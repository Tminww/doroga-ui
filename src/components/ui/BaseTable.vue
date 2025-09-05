<template>
  <!-- Таблица -->
  <div :class="tableContainerClasses">
    <table :class="tableClasses">
      <thead class="base-table-header-row">
        <tr class="base-table-row base-table-row--header">
          <th
            v-for="header in table.headers"
            :key="header.accessorKey"
            class="base-table-cell base-table-cell--header"
          >
            <div class="base-table-header-content">
              {{ header.name }}
            </div>
          </th>
        </tr>
      </thead>

      <tbody class="base-table-body">
        <tr
          v-for="(row, index) in table.rows"
          :key="`row-${index}`"
          class="base-table-row base-table-row--body"
          :class="getRowClasses(row)"
          @click="handleRowClick(row)"
        >
          <td
            v-for="[cellKey, cellValue] in Object.entries(row)"
            :key="`cell-${index}-${cellKey}`"
            class="base-table-cell base-table-cell--body"
          >
            <!-- Слот для кастомизации содержимого ячейки -->
            <slot :name="`cell-${cellKey}`" :row="row" :value="cellValue"> {{ cellValue }} </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Состояние загрузки -->
    <div v-if="loading" class="base-table-loading">
      <BaseIcon icon="refresh-cw" :size="20" class="base-table-loading-icon" />
      <span>{{ loadingText }}</span>
    </div>

    <!-- Пустое состояние -->
    <div v-else-if="table.rows.length === 0" class="base-table-empty">
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  type ColumnDef,
  type SortDirection,
  type Row,
  type Column,
  FlexRender,
  getCoreRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import BaseIcon, { type IconName } from './BaseIcon.vue'

export interface BaseTableProps<Data> {
  /** Данные таблицы */
  data: Data[]
  /** Конфигурация колонок */
  headers: Header[]
  enableActions: boolean
  /** Общее состояние загрузки */
  loading?: boolean

  // Тексты
  /** Текст при загрузке */
  loadingText?: string
  /** Текст для пустого состояния */
  emptyText?: string

  // Внешний вид
  /** Размер таблицы */
  size?: 'sm' | 'md' | 'lg'
  /** Растянуть на всю ширину */
  fullWidth?: boolean
  /** Выделяемые строки */
  hoverable?: boolean
  /** Дополнительные классы */
  class?: string
}
interface Header {
  accessorKey: string
  name: string
}

const props = withDefaults(defineProps<BaseTableProps<any>>(), {
  loading: false,
  enableActions: true,
  loadingText: 'Загрузка...',
  emptyText: 'Нет данных для отображения',
  size: 'md',
  fullWidth: true,
  hoverable: true,
})

const emit = defineEmits<{
  // События строк
  'row-click': [row: Row<Data>, event: MouseEvent]
}>()

const prepareRows = (data) => {
  return data
}

// Настройка  Table
const table = {
  rows: prepareRows(props.data),
  headers: props.headers,
}

// Классы
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

// Получение классов для строки
const getRowClasses = (row: Row<TData>) => {
  const classes = []

  if (props.hoverable) {
    classes.push('base-table-row--hoverable')
  }

  return classes
}

const handleRowClick = (row: Row<TData>, event?: MouseEvent) => {
  const mouseEvent = event || new MouseEvent('click')
  emit('row-click', row, mouseEvent)
}
</script>

<style scoped>
.base-table-container {
  position: relative;
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
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
