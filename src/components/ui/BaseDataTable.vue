<template>
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
            :style="getColumnStyle(header)"
          >
            <div
              v-if="!header.isPlaceholder"
              class="base-table-header-content"
              :class="{
                'base-table-header-content--sortable': header.column.getCanSort() && sortable,
                'base-table-header-content--sorting':
                  sortLoading && currentSortColumn === header.column.id,
              }"
              @click="handleSort(header.column)"
            >
              <div>
                <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />

                <!-- Индикатор сортировки -->
                <template v-if="sortable && header.column.getCanSort()">
                  <BaseIcon
                    v-if="sortLoading && currentSortColumn === header.column.id"
                    icon="refresh-cw"
                    :size="14"
                    class="base-table-sort-loading"
                  />
                  <BaseIcon
                    v-else
                    :icon="getSortIcon(header.column.getIsSorted())"
                    :size="14"
                    class="base-table-sort-icon"
                  />
                </template>
                <input type="text" @click.stop />
              </div>
            </div>
          </th>
        </tr>
      </thead>

      <tbody class="base-table-body">
        <template v-if="!loading && table.getRowModel().rows.length">
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="base-table-row base-table-row--body"
            :class="getRowClasses(row)"
            @click="handleRowClick(row)"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="base-table-cell base-table-cell--body"
              :class="getCellClasses(cell.column)"
            >
              <!-- Слот для кастомизации содержимого ячейки -->
              <slot
                :name="`cell-${cell.column.id}`"
                :cell="cell"
                :row="row"
                :value="cell.getValue()"
              >
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <!-- Состояние загрузки -->
    <div v-if="loading" class="base-table-loading">
      <BaseIcon icon="refresh-cw" :size="20" class="base-table-loading-icon" />
      <span>{{ loadingText }}</span>
    </div>

    <!-- Пустое состояние -->
    <div v-else-if="!table.getRowModel().rows.length" class="base-table-empty">
      <slot name="empty" :search-value="searchValue">
        <BaseIcon icon="file-text" :size="24" class="base-table-empty-icon" />
        <div class="base-table-empty-content">
          <span class="base-table-empty-title">
            {{ searchValue ? 'Ничего не найдено' : emptyText }}
          </span>
          <span v-if="searchValue" class="base-table-empty-subtitle">
            Попробуйте изменить поисковый запрос
          </span>
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
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'

export interface BaseTableProps<TData> {
  /** Данные таблицы */
  data: TData[]
  /** Конфигурация колонок */
  columns: ColumnDef<TData, any>[]
  /** Заголовок таблицы */
  title?: string

  // Поиск
  /** Включить поиск */
  searchable?: boolean
  /** Placeholder для поиска */
  searchPlaceholder?: string
  /** Значение поиска (для внешнего управления) */
  searchValue?: string
  /** Задержка поиска в мс */
  searchDebounce?: number

  // Пагинация
  /** Показать пагинацию */
  showPagination?: boolean
  /** Текущая страница */
  currentPage?: number
  /** Размер страницы */
  pageSize?: number
  /** Общее количество элементов */
  totalItems?: number
  /** Количество отфильтрованных элементов */
  filteredItems?: number
  /** Показать селектор размера страницы */
  showPageSizeSelector?: boolean
  /** Опции размера страницы */
  pageSizeOptions?: number[]

  // Сортировка
  /** Включить сортировку */
  sortable?: boolean
  /** Текущая сортировка */
  sortBy?: string
  /** Направление сортировки */
  sortDirection?: SortDirection

  // Состояния загрузки
  /** Общее состояние загрузки */
  loading?: boolean
  /** Загрузка поиска */
  searchLoading?: boolean
  /** Загрузка сортировки */
  sortLoading?: boolean
  /** Загрузка пагинации */
  paginationLoading?: boolean

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
  /** Показать информацию о результатах */
  showResultsInfo?: boolean
  /** Дополнительные классы */
  class?: string

  // Поведение
  /** Включить выбор строк */
  selectable?: boolean
  /** Множественный выбор */
  multiSelect?: boolean
  /** Выбранные строки */
  selectedRows?: TData[]
}

const props = withDefaults(defineProps<BaseTableProps<any>>(), {
  searchPlaceholder: 'Поиск...',
  searchDebounce: 300,
  showPagination: true,
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  showPageSizeSelector: true,
  pageSizeOptions: () => [10, 25, 50, 100],
  sortable: true,
  loading: false,
  searchLoading: false,
  sortLoading: false,
  paginationLoading: false,
  loadingText: 'Загрузка...',
  emptyText: 'Нет данных для отображения',
  size: 'md',
  fullWidth: true,
  hoverable: true,
  showResultsInfo: true,
  selectable: false,
  multiSelect: false,
  selectedRows: () => [],
})

const emit = defineEmits<{
  // События поиска
  search: [query: string]
  'search-clear': []

  // События пагинации
  'page-change': [page: number]
  'page-size-change': [size: number]

  // События сортировки
  'sort-change': [column: string, direction: SortDirection | false]

  // События строк
  'row-click': [row: Row<TData>, event: MouseEvent]
  'row-select': [row: TData, selected: boolean]
  'selection-change': [selectedRows: TData[]]
}>()

// Поиск
const searchValue = ref(props.searchValue || '')
const currentSortColumn = ref<string | null>(null)

// Настройка TanStack Table
const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true,
  manualSorting: true,
  manualFiltering: true,
})

// Классы
const tableContainerClasses = computed(() => [
  'base-table-scroll-container',
  {
    'base-table--loading': props.loading,
    'base-table--full-width': props.fullWidth,
  },
  props.class,
])

const tableClasses = computed(() => [`base-table--${props.size}`])

// Получение стилей колонки
const getColumnStyle = (header: any) => {
  const styles: Record<string, string> = {}

  if (header.getSize() !== 150) {
    styles.width = `${header.getSize()}px`
  }

  if (header.column.columnDef.minWidth) {
    styles.minWidth = `${header.column.columnDef.minWidth}px`
  }

  if (header.column.columnDef.maxWidth) {
    styles.maxWidth = `${header.column.columnDef.maxWidth}px`
  }

  return styles
}

// Получение иконки сортировки
const getSortIcon = (sortDirection: false | SortDirection): IconName => {
  if (sortDirection === 'asc') return 'trending-up'
  if (sortDirection === 'desc') return 'trending-down'
  return 'arrow-up-down'
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

// Получение классов для строки
const getRowClasses = (row: Row<TData>) => {
  const classes = []

  if (row.getIsSelected()) {
    classes.push('base-table-row--selected')
  }

  if (props.hoverable) {
    classes.push('base-table-row--hoverable')
  }

  return classes
}

const handleSort = (column: Column<TData>) => {
  if (!props.sortable || !column.getCanSort()) return

  currentSortColumn.value = column.id
  const currentSort = column.getIsSorted()

  let newDirection: SortDirection | false
  if (currentSort === false) {
    newDirection = 'asc'
  } else if (currentSort === 'asc') {
    newDirection = 'desc'
  } else {
    newDirection = false
  }

  emit('sort-change', column.id, newDirection)
}

const handleRowClick = (row: Row<TData>, event?: MouseEvent) => {
  const mouseEvent = event || new MouseEvent('click')
  emit('row-click', row, mouseEvent)
}

// Следим за внешними изменениями поиска
watch(
  () => props.searchValue,
  (newValue) => {
    if (newValue !== searchValue.value) {
      searchValue.value = newValue || ''
    }
  },
)
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

.base-table-row--body.base-table-row--hoverable:hover {
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
  flex-shrink: 0;
}

.base-table-header-content--sortable:hover .base-table-sort-icon {
  opacity: 1;
}

.base-table-sort-loading {
  animation: spin 1s linear infinite;
  color: var(--ds-text-primary);
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

/* Информация о результатах */
.base-table-results-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--ds-spacing-sm);
}

.base-table-results-text {
  font-size: var(--ds-font-size-xs);
  color: var(--ds-text-secondary);
}

/* Пагинация */
.base-table-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ds-spacing-md);
  flex-wrap: wrap;
  padding: var(--ds-spacing-sm) 0;
}

.base-table-pagination-info {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-lg);
}

.base-table-pagination-text {
  font-size: var(--ds-font-size-xs);
  color: var(--ds-text-secondary);
  white-space: nowrap;
}

.base-table-page-size {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-sm);
}

.base-table-page-size-label {
  font-size: var(--ds-font-size-xs);
  color: var(--ds-text-secondary);
  white-space: nowrap;
}

.base-table-page-size-select {
  padding: var(--ds-spacing-xs) var(--ds-spacing-sm);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-sm);
  background-color: var(--ds-surface);
  color: var(--ds-text-primary);
  font-size: var(--ds-font-size-xs);
  cursor: pointer;
}

.base-table-page-size-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-table-pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-xs);
}

.base-table-pagination-pages {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-xs);
}

.base-table-pagination-ellipsis {
  padding: 0 var(--ds-spacing-xs);
  color: var(--ds-text-secondary);
  font-size: var(--ds-font-size-sm);
}

.base-table-page-active {
  background-color: var(--ds-button-primary-bg) !important;
  color: var(--ds-button-primary-text) !important;
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

  .base-table-pagination-info {
    flex-direction: column;
    align-items: stretch;
    gap: var(--ds-spacing-sm);
  }

  .base-table-pagination-controls {
    justify-content: center;
  }

  .base-table-pagination-pages {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .base-table-pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }

  .base-table-pagination-pages {
    order: -1;
    margin-bottom: var(--ds-spacing-sm);
  }
}
</style>
