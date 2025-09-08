<template>
  <div :class="tableContainerClasses">
    <!-- Пустое состояние -->
    <div v-if="isEmpty" class="base-table-empty">
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
              <div class="base-table-header-wrapper">
                <div class="base-table-header-title">{{ header.name }}</div>
                <!-- Иконка сортировки -->
                <BaseButton
                  v-if="header.sortable !== false"
                  @click="handleSort(header.accessorKey)"
                  icon-only
                  :icon-size="16"
                  variant="ghost"
                  size="sm"
                  :left-icon="getSortIcon(getCurrentSort(header.accessorKey))"
                  :class="getSortIconClass(getCurrentSort(header.accessorKey))"
                />
              </div>

              <div class="base-table-header-actions">
                <!-- Иконка фильтра -->
                <TableFilter
                  v-if="header.filterable !== false"
                  :type="header.type"
                  :value="filterValues[header.accessorKey]"
                  @update:filter="updateFilter(header.accessorKey, $event)"
                />
              </div>
            </div>
          </th>
        </tr>
      </thead>

      <tbody class="base-table-body">
        <!-- Оверлей загрузки -->
        <div v-if="loading" class="base-table-loading-overlay">
          <div class="base-table-loading">
            <BaseIcon icon="refresh-cw" :size="24" class="base-table-loading-icon" />
            <span class="base-table-loading-text">{{ loadingText }}</span>
          </div>
        </div>
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

    <!-- Оверлей для закрытия фильтра -->
    {{ filterValues }}
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import BaseIcon, { type IconName } from './BaseIcon.vue'
import BasePopover from './BasePopover.vue'
import BaseButton from './BaseButton.vue'
import TableFilter from '../widgets/TableFilter.vue'
import { watchEffect } from 'vue'

export type Sort = 'asc' | 'desc' | false
export type Type = 'text' | 'number' | 'date' | 'boolean'
export interface BaseTableHeader {
  /** Ключ для доступа к данным */
  accessorKey: string
  /** Отображаемое имя колонки */
  name: string
  /** Ширина колонки */
  width?: string
  /** Тип данных в колонке */
  type?: 'text' | 'number' | 'date' | 'boolean'
  /** Состояние сортировки */
  sort?: Sort
  /** Можно ли сортировать колонку */
  sortable?: boolean
  /** Можно ли фильтровать колонку */
  filterable?: boolean
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

export interface BaseTableEmits {
  /** Клик по строке */
  'row-click': [row: TData, rowIndex: number, event: MouseEvent]
  /** Изменение сортировки */
  'sort-change': [accessorKey: string, direction: 'asc' | 'desc' | false]
  /** Изменение фильтра */
  'filter-change': [{ accessorKey: string; value: any }[]]
}

const emit = defineEmits<BaseTableEmits>()

// Реактивные данные
const filterValues = reactive<Record<string, any>>({})
const sortState = reactive<Record<string, 'asc' | 'desc' | false>>({})

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

// Методы сортировки
const getCurrentSort = (accessorKey: string): 'asc' | 'desc' | false => {
  return sortState[accessorKey] || false
}

const getSortIcon = (sort?: 'asc' | 'desc' | false): IconName => {
  if (sort === 'asc') return 'chevron-down'
  if (sort === 'desc') return 'chevron-up'
  return 'chevrons-up-down'
}

const getSortIconClass = (sort?: 'asc' | 'desc' | false): string => {
  return sort ? 'base-table-header-sort-icon--active' : ''
}

const handleSort = (accessorKey: string): void => {
  const currentSort = sortState[accessorKey] || false
  let newSort: 'asc' | 'desc' | false = 'asc'

  if (currentSort === 'asc') {
    newSort = 'desc'
  } else if (currentSort === 'desc') {
    newSort = false
  }

  // Сбрасываем все сортировки
  Object.keys(sortState).forEach((key) => {
    sortState[key] = false
  })

  // Устанавливаем новую сортировку
  if (newSort) {
    sortState[accessorKey] = newSort
  }

  emit('sort-change', accessorKey, newSort)
}

const updateFilter = (accessorKey, value) => {
  filterValues[accessorKey] = value
  emit('filter-change', filterValues)
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

.base-table-header-wrapper {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-xs);
}
/* Заголовок колонки */
.base-table-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ds-spacing-xs);
  cursor: default;
  min-height: 20px;
  width: 100%;
}

.base-table-header-title {
  flex: 1;
  min-width: 0;
}

.base-table-header-actions {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-xs);
  flex-shrink: 0;
}

/* Оверлей загрузки */
.base-table-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Состояния */
.base-table-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--ds-spacing-lg);
  color: var(--ds-text-secondary);
  font-size: var(--ds-font-size-sm);
  gap: var(--ds-spacing-sm);
  background-color: var(--ds-surface);
  border-radius: var(--ds-radius-lg);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--ds-border);
}
.base-table-loading-icon {
  animation: spin 1s linear infinite;
  color: var(--ds-accent-primary);
}
.base-table-loading-text {
  font-weight: 500;
  color: var(--ds-text-primary);
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
