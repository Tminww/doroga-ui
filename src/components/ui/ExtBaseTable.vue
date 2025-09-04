<template>
  <div class="base-table-wrapper">
    <!-- Заголовок и действия -->
    <div v-if="title || $slots.actions" class="base-table-header">
      <div v-if="title" class="base-table-title-section">
        <h3 class="base-table-title">{{ title }}</h3>
      </div>
      <div class="base-table-actions">
        <slot name="actions" />
      </div>
    </div>

    <!-- Контролы -->
    <div v-if="searchable || $slots.controls" class="base-table-controls">
      <div v-if="searchable" class="base-table-search">
        <BaseInput
          v-model="searchValue"
          :placeholder="searchPlaceholder"
          :loading="searchLoading"
          clearable
          @input="handleSearch"
          @clear="handleSearchClear"
        >
          <template #prefix>
            <BaseIcon icon="search" :size="16" />
          </template>
        </BaseInput>
      </div>
      <slot name="controls" />
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
              :style="getColumnStyle(header)"
            >
              <div v-if="!header.isPlaceholder" class="base-table-header-wrapper">
                <!-- Основной заголовок с сортировкой -->
                <div
                  class="base-table-header-content"
                  :class="{
                    'base-table-header-content--sortable': header.column.getCanSort() && sortable,
                    'base-table-header-content--sorting':
                      sortLoading && currentSortColumn === header.column.id,
                  }"
                  @click="handleSort(header.column)"
                >
                  <FlexRender
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />

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
                </div>

                <!-- Фильтр колонки -->
                <div
                  v-if="filterable && header.column.columnDef.enableColumnFilter !== false"
                  class="base-table-column-filter"
                >
                  <slot
                    :name="`filter-${header.column.id}`"
                    :column="header.column"
                    :filter-value="getColumnFilterValue(header.column.id)"
                    :on-filter="(value) => handleColumnFilter(header.column.id, value)"
                  >
                    <!-- Дефолтный фильтр -->
                    <component
                      :is="getFilterComponent(header.column)"
                      :model-value="getColumnFilterValue(header.column.id)"
                      :column="header.column"
                      :options="getFilterOptions(header.column)"
                      :loading="filterLoading && currentFilterColumn === header.column.id"
                      @update:model-value="(value) => handleColumnFilter(header.column.id, value)"
                    />
                  </slot>
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

    <!-- Пагинация -->
    <div v-if="showPagination" class="base-table-footer">
      <div class="base-table-results-info">
        <span class="base-table-results-text">
          Показано {{ startItem }}-{{ endItem }} из {{ totalItems }} записей
          <template v-if="filteredItems !== undefined && filteredItems !== totalItems">
            (отфильтровано из {{ filteredItems }})
          </template>
        </span>
      </div>

      <div class="base-table-pagination">
        <div class="base-table-pagination-info">
          <div v-if="showPageSizeSelector" class="base-table-page-size">
            <span class="base-table-page-size-label">Показать:</span>
            <select
              :value="pageSize"
              class="base-table-page-size-select"
              :disabled="paginationLoading"
              @change="handlePageSizeChange"
            >
              <option v-for="size in pageSizeOptions" :key="size" :value="size">
                {{ size }}
              </option>
            </select>
          </div>
        </div>

        <div class="base-table-pagination-controls">
          <BaseButton
            variant="outline"
            size="sm"
            :disabled="currentPage <= 1 || paginationLoading"
            @click="handlePageChange(1)"
          >
            <BaseIcon icon="chevrons-left" :size="14" />
          </BaseButton>

          <BaseButton
            variant="outline"
            size="sm"
            :disabled="currentPage <= 1 || paginationLoading"
            @click="handlePageChange(currentPage - 1)"
          >
            <BaseIcon icon="chevron-left" :size="14" />
          </BaseButton>

          <div class="base-table-pagination-pages">
            <template v-for="page in visiblePages" :key="page">
              <span v-if="page === '...'" class="base-table-pagination-ellipsis">...</span>
              <BaseButton
                v-else
                variant="outline"
                size="sm"
                :class="{ 'base-table-page-active': page === currentPage }"
                :disabled="paginationLoading"
                @click="handlePageChange(page)"
              >
                {{ page }}
              </BaseButton>
            </template>
          </div>

          <BaseButton
            variant="outline"
            size="sm"
            :disabled="currentPage >= totalPages || paginationLoading"
            @click="handlePageChange(currentPage + 1)"
          >
            <BaseIcon icon="chevron-right" :size="14" />
          </BaseButton>

          <BaseButton
            variant="outline"
            size="sm"
            :disabled="currentPage >= totalPages || paginationLoading"
            @click="handlePageChange(totalPages)"
          >
            <BaseIcon icon="chevrons-right" :size="14" />
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
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
import BaseSelect from './BaseSelect.vue'
// import BaseDatePicker from './BaseDatePicker.vue'
// import BaseNumberInput from './BaseNumberInput.vue'

// Типы фильтров
export type FilterType =
  | 'text'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'dateRange'
  | 'number'
  | 'numberRange'
  | 'boolean'

export interface ColumnFilterConfig {
  type?: FilterType
  options?: Array<{ label: string; value: any }>
  placeholder?: string
  multiple?: boolean
}

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

  // Фильтрация
  /** Включить фильтрацию колонок */
  filterable?: boolean
  /** Значения фильтров колонок */
  columnFilters?: Record<string, any>

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
  /** Загрузка фильтрации */
  filterLoading?: boolean
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
  filterable: true,
  columnFilters: () => ({}),
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
  filterLoading: false,
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

  // События фильтрации
  'column-filter': [column: string, value: any]
  'filter-clear': [column: string]
  'filters-clear': []

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

// Реактивные переменные
const searchValue = ref(props.searchValue || '')
const currentSortColumn = ref<string | null>(null)
const currentFilterColumn = ref<string | null>(null)
const searchDebounceTimer = ref<NodeJS.Timeout | null>(null)
const filterDebounceTimers = ref<Record<string, NodeJS.Timeout>>({})

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

// Вычисляемые свойства
const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize))

const startItem = computed(() => (props.currentPage - 1) * props.pageSize + 1)

const endItem = computed(() => Math.min(props.currentPage * props.pageSize, props.totalItems))

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = props.currentPage

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (current <= 4) {
      for (let i = 2; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

const tableContainerClasses = computed(() => [
  'base-table-scroll-container',
  {
    'base-table--loading': props.loading,
    'base-table--full-width': props.fullWidth,
  },
  props.class,
])

const tableClasses = computed(() => [`base-table--${props.size}`])

// Методы для работы с фильтрами
const getColumnFilterValue = (columnId: string) => {
  return props.columnFilters[columnId] || null
}

const getFilterComponent = (column: Column<any>) => {
  const filterConfig = column.columnDef.meta?.filter as ColumnFilterConfig
  const filterType = filterConfig?.type || 'text'

  switch (filterType) {
    case 'select':
    case 'multiselect':
      return BaseSelect
    case 'date':
    case 'dateRange':
      return BaseSelect
    case 'number':
    case 'numberRange':
      return BaseSelect
    case 'boolean':
      return BaseSelect
    default:
      return BaseInput
  }
}

const getFilterOptions = (column: Column<any>) => {
  const filterConfig = column.columnDef.meta?.filter as ColumnFilterConfig

  if (filterConfig?.type === 'boolean') {
    return [
      { label: 'Все', value: null },
      { label: 'Да', value: true },
      { label: 'Нет', value: false },
    ]
  }

  return filterConfig?.options || []
}

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

// Обработчики событий
const handleSearch = (query: string) => {
  if (searchDebounceTimer.value) {
    clearTimeout(searchDebounceTimer.value)
  }

  searchDebounceTimer.value = setTimeout(() => {
    emit('search', query)
  }, props.searchDebounce)
}

const handleSearchClear = () => {
  searchValue.value = ''
  if (searchDebounceTimer.value) {
    clearTimeout(searchDebounceTimer.value)
  }
  emit('search-clear')
}

const handleColumnFilter = (columnId: string, value: any) => {
  currentFilterColumn.value = columnId

  // Очищаем предыдущий таймер для этой колонки
  if (filterDebounceTimers.value[columnId]) {
    clearTimeout(filterDebounceTimers.value[columnId])
  }

  // Устанавливаем новый таймер
  filterDebounceTimers.value[columnId] = setTimeout(() => {
    emit('column-filter', columnId, value)
    currentFilterColumn.value = null
  }, props.searchDebounce)
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

const handlePageChange = (page: number) => {
  if (page !== props.currentPage) {
    emit('page-change', page)
  }
}

const handlePageSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newSize = parseInt(target.value)
  emit('page-size-change', newSize)
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

// Очистка таймеров при размонтировании
onMounted(() => {
  return () => {
    if (searchDebounceTimer.value) {
      clearTimeout(searchDebounceTimer.value)
    }
    Object.values(filterDebounceTimers.value).forEach((timer) => {
      if (timer) clearTimeout(timer)
    })
  }
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
.base-table-header-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-xs);
}

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

/* Фильтры колонок */
.base-table-column-filter {
  min-width: 120px;
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

/* Информация о результатах и пагинация */
.base-table-footer {
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-md);
}

.base-table-results-info {
  display: flex;
  align-items: center;
  justify-content: center;
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

  .base-table-column-filter {
    min-width: 100px;
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

  .base-table-column-filter {
    min-width: 80px;
  }
}
</style>
