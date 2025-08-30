<template>
  <div class="base-table-wrapper">
    <!-- Заголовок и действия -->
    <div v-if="title || $slots.header || $slots.actions" class="base-table-header">
      <div class="base-table-title-section">
        <h3 v-if="title" class="base-table-title">{{ title }}</h3>
        <slot name="header" />
      </div>
      <div v-if="$slots.actions" class="base-table-actions">
        <slot name="actions" />
      </div>
    </div>

    <!-- Фильтры и поиск -->
    <div v-if="searchable || $slots.filters" class="base-table-controls">
      <BaseInput
        v-if="searchable"
        v-model="searchValue"
        :placeholder="searchPlaceholder"
        left-icon="search"
        clearable
        class="base-table-search"
      />
      <slot name="filters" />
    </div>

    <!-- Таблица -->
    <div class="base-table-container" :class="tableContainerClasses">
      <table class="base-table" :class="tableClasses">
        <thead class="base-table-header-row">
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            class="base-table-row base-table-row--header"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="base-table-cell base-table-cell--header"
              :class="getCellClasses(header.column)"
              :style="{ width: header.getSize() !== 150 ? `${header.getSize()}px` : undefined }"
            >
              <div
                v-if="!header.isPlaceholder"
                class="base-table-header-content"
                :class="{ 'base-table-header-content--sortable': header.column.getCanSort() }"
                @click="header.column.getToggleSortingHandler()?.($event)"
              >
                <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                <BaseIcon
                  v-if="header.column.getCanSort()"
                  :icon="getSortIcon(header.column.getIsSorted())"
                  :size="16"
                  class="base-table-sort-icon"
                />
              </div>
            </th>
          </tr>
        </thead>

        <tbody class="base-table-body">
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="base-table-row base-table-row--body"
            :class="{ 'base-table-row--selected': row.getIsSelected() }"
            @click="handleRowClick(row)"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="base-table-cell base-table-cell--body"
              :class="getCellClasses(cell.column)"
            >
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
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
      <div v-else-if="!table.getRowModel().rows.length" class="base-table-empty">
        <BaseIcon icon="file-text" :size="24" class="base-table-empty-icon" />
        <span>{{ emptyText }}</span>
      </div>
    </div>

    <!-- Пагинация -->
    <div v-if="showPagination && table.getPageCount() > 1" class="base-table-pagination">
      <div class="base-table-pagination-info">
        Показано {{ table.getRowModel().rows.length }} из
        {{ table.getFilteredRowModel().rows.length }} записей
      </div>

      <div class="base-table-pagination-controls">
        <BaseButton
          variant="ghost"
          size="sm"
          left-icon="chevron-left"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        />

        <span class="base-table-pagination-pages">
          Страница {{ table.getState().pagination.pageIndex + 1 }} из {{ table.getPageCount() }}
        </span>

        <BaseButton
          variant="ghost"
          size="sm"
          right-icon="chevron-right"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  type ColumnDef,
  type SortDirection,
  type Row,
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import BaseIcon, { type IconName } from './BaseIcon.vue'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'

export interface BaseTableProps<TData = any> {
  /** Данные таблицы */
  data: TData[]
  /** Конфигурация колонок */
  columns: ColumnDef<TData, any>[]
  /** Заголовок таблицы */
  title?: string
  /** Включить поиск */
  searchable?: boolean
  /** Placeholder для поиска */
  searchPlaceholder?: string
  /** Показать пагинацию */
  showPagination?: boolean
  /** Размер страницы */
  pageSize?: number
  /** Состояние загрузки */
  loading?: boolean
  /** Текст при загрузке */
  loadingText?: string
  /** Текст для пустого состояния */
  emptyText?: string
  /** Включить выбор строк */
  selectable?: boolean
  /** Включить сортировку */
  sortable?: boolean
  /** Размер таблицы */
  size?: 'sm' | 'md' | 'lg'
  /** Растянуть на всю ширину */
  fullWidth?: boolean
  /** Дополнительные классы */
  class?: string
  /** Обработчик клика по строке */
  onRowClick?: (row: Row<TData>) => void
}

const props = withDefaults(defineProps<BaseTableProps<TData>>(), {
  searchPlaceholder: 'Поиск...',
  showPagination: true,
  pageSize: 10,
  loadingText: 'Загрузка...',
  emptyText: 'Нет данных для отображения',
  selectable: false,
  sortable: true,
  size: 'md',
  fullWidth: true,
})

const emit = defineEmits<{
  'row-click': [row: Row<TData>]
  'selection-change': [selectedRows: TData[]]
}>()

const searchValue = ref('')

// Настройка TanStack Table
const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  globalFilterFn: 'includesString',
  state: {
    get globalFilter() {
      return searchValue.value
    },
    get pagination() {
      return {
        pageIndex: 0,
        pageSize: props.pageSize,
      }
    },
  },
  onGlobalFilterChange: (value) => {
    searchValue.value = value
  },
})

// Классы для контейнера таблицы
const tableContainerClasses = computed(() => [
  'base-table-scroll-container',
  {
    'base-table--loading': props.loading,
    'base-table--full-width': props.fullWidth,
  },
  props.class,
])

// Классы для таблицы
const tableClasses = computed(() => [`base-table--${props.size}`])

// Получение иконки сортировки
const getSortIcon = (sortDirection: false | SortDirection): IconName => {
  if (sortDirection === 'asc') return 'trending-up'
  if (sortDirection === 'desc') return 'trending-down'
  return 'minus'
}

// Получение классов для ячейки
const getCellClasses = (column: any) => {
  const classes = []

  if (column.columnDef.align) {
    classes.push(`base-table-cell--align-${column.columnDef.align}`)
  }

  if (column.columnDef.className) {
    classes.push(column.columnDef.className)
  }

  return classes
}

// Обработчик клика по строке
const handleRowClick = (row: Row<TData>) => {
  emit('row-click', row)
  props.onRowClick?.(row)
}

// Сброс пагинации при изменении поиска
watch(searchValue, () => {
  table.setPageIndex(0)
})
</script>

<style scoped>
.base-table-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-lg);
  width: 100%;
}

.base-table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ds-spacing-lg);
  flex-wrap: wrap;
}

.base-table-title-section {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-md);
}

.base-table-title {
  font-size: var(--ds-font-size-lg);
  font-weight: 600;
  color: var(--ds-text-primary);
  margin: 0;
}

.base-table-actions {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-sm);
}

.base-table-controls {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-md);
  flex-wrap: wrap;
}

.base-table-search {
  max-width: 320px;
}

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

.base-table-row--body:hover {
  background-color: var(--ds-button-ghost-bg-hover);
}

.base-table-row--selected {
  background-color: var(--ds-button-ghost-bg-active);
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
  z-index: 10;
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
}

.base-table-header-content--sortable {
  cursor: pointer;
  user-select: none;
}

.base-table-header-content--sortable:hover {
  color: var(--ds-text-primary);
}

.base-table-sort-icon {
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.base-table-header-content--sortable:hover .base-table-sort-icon {
  opacity: 1;
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

/* Пагинация */
.base-table-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ds-spacing-md);
  flex-wrap: wrap;
}

.base-table-pagination-info {
  font-size: var(--ds-font-size-xs);
  color: var(--ds-text-secondary);
}

.base-table-pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-sm);
}

.base-table-pagination-pages {
  font-size: var(--ds-font-size-sm);
  color: var(--ds-text-primary);
  padding: 0 var(--ds-spacing-sm);
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

/* Адаптивность */
@media (max-width: 768px) {
  .base-table-header {
    flex-direction: column;
    align-items: stretch;
  }

  .base-table-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .base-table-search {
    max-width: none;
  }

  .base-table-pagination {
    flex-direction: column;
    gap: var(--ds-spacing-sm);
  }
}
</style>
