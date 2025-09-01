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
        :loading="searchLoading"
        @input="handleSearchInput"
        @clear="handleSearchClear"
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

    <!-- Информация о результатах -->
    <div v-if="showResultsInfo && !loading" class="base-table-results-info">
      <slot
        name="results-info"
        :total="totalItems"
        :filtered="filteredItems"
        :visible="table.getRowModel().rows.length"
      >
        <span class="base-table-results-text">
          <template v-if="searchValue">
            Найдено {{ filteredItems }} из {{ totalItems }} записей
          </template>
          <template v-else>
            Показано {{ table.getRowModel().rows.length }} из {{ totalItems }} записей
          </template>
        </span>
      </slot>
    </div>

    <!-- Пагинация -->
    <div v-if="showPagination && totalPages > 1 && !loading" class="base-table-pagination">
      <div class="base-table-pagination-info">
        <span class="base-table-pagination-text">
          Страница {{ currentPage }} из {{ totalPages }}
        </span>

        <!-- Выбор размера страницы -->
        <div v-if="showPageSizeSelector" class="base-table-page-size">
          <span class="base-table-page-size-label">Показать:</span>
          <select
            :value="pageSize"
            @change="handlePageSizeChange"
            class="base-table-page-size-select"
            :disabled="loading"
          >
            <option v-for="size in pageSizeOptions" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
        </div>
      </div>

      <div class="base-table-pagination-controls">
        <BaseButton
          variant="ghost"
          size="sm"
          left-icon="chevrons-left"
          :disabled="currentPage === 1 || paginationLoading"
          @click="goToPage(1)"
          title="Первая страница"
        />

        <BaseButton
          variant="ghost"
          size="sm"
          left-icon="chevron-left"
          :disabled="currentPage === 1 || paginationLoading"
          @click="goToPage(currentPage - 1)"
          title="Предыдущая страница"
        />

        <!-- Номера страниц -->
        <div class="base-table-pagination-pages">
          <template v-for="page in visiblePages" :key="page">
            <BaseButton
              v-if="page !== '...'"
              variant="ghost"
              size="sm"
              :class="{ 'base-table-page-active': page === currentPage }"
              :disabled="paginationLoading"
              @click="goToPage(page)"
            >
              {{ page }}
            </BaseButton>
            <span v-else class="base-table-pagination-ellipsis">...</span>
          </template>
        </div>

        <BaseButton
          variant="ghost"
          size="sm"
          right-icon="chevron-right"
          :disabled="currentPage === totalPages || paginationLoading"
          @click="goToPage(currentPage + 1)"
          title="Следующая страница"
        />

        <BaseButton
          variant="ghost"
          size="sm"
          right-icon="chevrons-right"
          :disabled="currentPage === totalPages || paginationLoading"
          @click="goToPage(totalPages)"
          title="Последняя страница"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
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

export interface BaseTableProps<TData = any> {
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

const props = withDefaults(defineProps<BaseTableProps<TData>>(), {
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
const searchTimeoutId = ref<NodeJS.Timeout | null>(null)
const currentSortColumn = ref<string | null>(null)

// Вычисляемые свойства
const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize))
const actualFilteredItems = computed(() => props.filteredItems ?? props.totalItems)

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

// Получение видимых страниц для пагинации
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const current = props.currentPage
  const total = totalPages.value

  if (total <= 7) {
    // Показываем все страницы
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Сложная логика для большого количества страниц
    pages.push(1)

    if (current > 4) {
      pages.push('...')
    }

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < total - 3) {
      pages.push('...')
    }

    if (total > 1) {
      pages.push(total)
    }
  }

  return pages
})

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
const handleSearchInput = () => {
  if (searchTimeoutId.value) {
    clearTimeout(searchTimeoutId.value)
  }

  searchTimeoutId.value = setTimeout(() => {
    emit('search', searchValue.value)
  }, props.searchDebounce)
}

const handleSearchClear = () => {
  searchValue.value = ''
  if (searchTimeoutId.value) {
    clearTimeout(searchTimeoutId.value)
  }
  emit('search-clear')
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

const goToPage = (page: number) => {
  if (page !== props.currentPage && page >= 1 && page <= totalPages.value) {
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
