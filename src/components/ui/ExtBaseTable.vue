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
              <span class="base-table-header-title">{{ header.name }}</span>

              <div class="base-table-header-actions">
                <!-- Иконка сортировки -->
                <button
                  v-if="header.sortable !== false"
                  type="button"
                  class="base-table-header-sort-btn"
                  @click="handleSort(header.accessorKey)"
                >
                  <BaseIcon
                    :icon="getSortIcon(getCurrentSort(header.accessorKey))"
                    :size="16"
                    class="base-table-header-sort-icon"
                    :class="getSortIconClass(getCurrentSort(header.accessorKey))"
                  />
                </button>

                <!-- Иконка фильтра -->
                <div v-if="header.filterable !== false" class="base-table-header-filter">
                  <button
                    type="button"
                    class="base-table-header-filter-btn"
                    :class="{
                      'base-table-header-filter-btn--active': getFilterValue(header.accessorKey),
                    }"
                    @click="toggleFilter(header.accessorKey, $event)"
                  >
                    <BaseIcon icon="filter" :size="16" class="base-table-header-filter-icon" />
                  </button>

                  <!-- Меню фильтра -->
                  <div
                    v-if="activeFilter === header.accessorKey"
                    class="base-table-filter-menu"
                    @click.stop
                  >
                    <div class="base-table-filter-content">
                      <!-- Фильтр по тексту -->
                      <div
                        v-if="!header.type || header.type === 'text'"
                        class="base-table-filter-group"
                      >
                        <label class="base-table-filter-label">Поиск по тексту:</label>
                        <input
                          v-model="filterValues[header.accessorKey]"
                          type="text"
                          class="base-table-filter-input"
                          placeholder="Введите текст для поиска"
                          @input="handleFilterChange(header.accessorKey, $event)"
                        />
                      </div>

                      <!-- Фильтр по числу -->
                      <div v-else-if="header.type === 'number'" class="base-table-filter-group">
                        <label class="base-table-filter-label">Минимальное значение:</label>
                        <input
                          :value="getNumberFilterValue(header.accessorKey, 'min')"
                          type="number"
                          class="base-table-filter-input"
                          placeholder="Минимум"
                          @input="handleNumberFilterChange(header.accessorKey, 'min', $event)"
                        />
                        <label class="base-table-filter-label">Максимальное значение:</label>
                        <input
                          :value="getNumberFilterValue(header.accessorKey, 'max')"
                          type="number"
                          class="base-table-filter-input"
                          placeholder="Максимум"
                          @input="handleNumberFilterChange(header.accessorKey, 'max', $event)"
                        />
                      </div>

                      <!-- Фильтр по дате -->
                      <div v-else-if="header.type === 'date'" class="base-table-filter-group">
                        <label class="base-table-filter-label">С даты:</label>
                        <input
                          :value="getDateFilterValue(header.accessorKey, 'from')"
                          type="date"
                          class="base-table-filter-input"
                          @change="handleDateFilterChange(header.accessorKey, 'from', $event)"
                        />
                        <label class="base-table-filter-label">По дату:</label>
                        <input
                          :value="getDateFilterValue(header.accessorKey, 'to')"
                          type="date"
                          class="base-table-filter-input"
                          @change="handleDateFilterChange(header.accessorKey, 'to', $event)"
                        />
                      </div>

                      <!-- Фильтр по булеву значению -->
                      <div v-else-if="header.type === 'boolean'" class="base-table-filter-group">
                        <label class="base-table-filter-label base-table-filter-checkbox-label">
                          <input
                            :checked="getBooleanFilterValue(header.accessorKey)"
                            type="checkbox"
                            class="base-table-filter-checkbox"
                            @change="handleBooleanFilterChange(header.accessorKey, $event)"
                          />
                          <span class="base-table-filter-checkbox-text">Только отмеченные</span>
                        </label>
                      </div>

                      <!-- Кнопки управления -->
                      <div class="base-table-filter-actions">
                        <button
                          type="button"
                          class="base-table-filter-clear-btn"
                          @click="clearFilter(header.accessorKey)"
                        >
                          Очистить
                        </button>
                        <button
                          type="button"
                          class="base-table-filter-close-btn"
                          @click="closeFilter"
                        >
                          Закрыть
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
          v-for="(row, rowIndex) in sortedData"
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
    <div v-if="activeFilter" class="base-table-filter-overlay" @click="closeFilter"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import BaseIcon from './BaseIcon.vue'

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
  sort?: 'asc' | 'desc' | null
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

export interface BaseTableEmits<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Клик по строке */
  'row-click': [row: TData, rowIndex: number, event: MouseEvent]
  /** Изменение сортировки */
  'sort-change': [accessorKey: string, direction: 'asc' | 'desc' | null]
  /** Изменение фильтра */
  'filter-change': [accessorKey: string, value: any]
}

const emit = defineEmits<BaseTableEmits>()

// Реактивные данные
const activeFilter = ref<string | null>(null)
const filterValues = reactive<Record<string, any>>({})
const sortState = reactive<Record<string, 'asc' | 'desc' | null>>({})

// Вычисляемые свойства
const isEmpty = computed(() => !props.loading && props.data.length === 0)

// Отсортированные данные
const sortedData = computed(() => {
  let result = [...props.data]

  // Применяем сортировку
  const activeSortKey = Object.keys(sortState).find((key) => sortState[key])
  if (activeSortKey && sortState[activeSortKey]) {
    const direction = sortState[activeSortKey]
    result.sort((a, b) => {
      const aValue = a[activeSortKey]
      const bValue = b[activeSortKey]

      // Обработка null/undefined значений
      if (aValue == null && bValue == null) return 0
      if (aValue == null) return direction === 'asc' ? -1 : 1
      if (bValue == null) return direction === 'asc' ? 1 : -1

      // Определяем тип данных для правильной сортировки
      const header = props.headers.find((h) => h.accessorKey === activeSortKey)

      if (header?.type === 'number') {
        const numA = Number(aValue)
        const numB = Number(bValue)
        return direction === 'asc' ? numA - numB : numB - numA
      }

      if (header?.type === 'date') {
        const dateA = new Date(aValue as string)
        const dateB = new Date(bValue as string)
        return direction === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime()
      }

      // Строковая сортировка
      const strA = String(aValue).toLowerCase()
      const strB = String(bValue).toLowerCase()

      if (direction === 'asc') {
        return strA < strB ? -1 : strA > strB ? 1 : 0
      } else {
        return strA > strB ? -1 : strA < strB ? 1 : 0
      }
    })
  }

  return result
})

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

// Методы сортировки
const getCurrentSort = (accessorKey: string): 'asc' | 'desc' | null => {
  return sortState[accessorKey] || null
}

const getSortIcon = (sort?: 'asc' | 'desc' | null): string => {
  if (sort === 'asc') return 'chevron-up'
  if (sort === 'desc') return 'chevron-down'
  return 'chevrons-up-down'
}

const getSortIconClass = (sort?: 'asc' | 'desc' | null): string => {
  return sort ? 'base-table-header-sort-icon--active' : ''
}

const handleSort = (accessorKey: string): void => {
  const currentSort = sortState[accessorKey] || null
  let newSort: 'asc' | 'desc' | null = 'asc'

  if (currentSort === 'asc') {
    newSort = 'desc'
  } else if (currentSort === 'desc') {
    newSort = null
  }

  // Сбрасываем все сортировки
  Object.keys(sortState).forEach((key) => {
    sortState[key] = null
  })

  // Устанавливаем новую сортировку
  if (newSort) {
    sortState[accessorKey] = newSort
  }

  emit('sort-change', accessorKey, newSort)
}

// Методы фильтрации
const toggleFilter = (accessorKey: string, event: Event): void => {
  event.stopPropagation()

  if (activeFilter.value === accessorKey) {
    closeFilter()
  } else {
    activeFilter.value = accessorKey

    // Инициализируем значение фильтра если его нет
    if (!(accessorKey in filterValues)) {
      const header = props.headers.find((h) => h.accessorKey === accessorKey)
      if (header?.type === 'number') {
        filterValues[accessorKey] = { min: '', max: '' }
      } else if (header?.type === 'date') {
        filterValues[accessorKey] = { from: '', to: '' }
      } else if (header?.type === 'boolean') {
        filterValues[accessorKey] = false
      } else {
        filterValues[accessorKey] = ''
      }
    }
  }
}

const closeFilter = (): void => {
  activeFilter.value = null
}

const getFilterValue = (accessorKey: string): any => {
  const value = filterValues[accessorKey]
  if (typeof value === 'object' && value !== null) {
    return Object.values(value).some((v) => v !== '' && v !== null && v !== undefined)
  }
  return value
}

const getNumberFilterValue = (accessorKey: string, type: 'min' | 'max'): string => {
  return filterValues[accessorKey]?.[type] || ''
}

const getDateFilterValue = (accessorKey: string, type: 'from' | 'to'): string => {
  return filterValues[accessorKey]?.[type] || ''
}

const getBooleanFilterValue = (accessorKey: string): boolean => {
  return filterValues[accessorKey] || false
}

const clearFilter = (accessorKey: string): void => {
  const header = props.headers.find((h) => h.accessorKey === accessorKey)

  if (header?.type === 'number') {
    filterValues[accessorKey] = { min: '', max: '' }
  } else if (header?.type === 'date') {
    filterValues[accessorKey] = { from: '', to: '' }
  } else if (header?.type === 'boolean') {
    filterValues[accessorKey] = false
  } else {
    filterValues[accessorKey] = ''
  }

  emit('filter-change', accessorKey, filterValues[accessorKey])
}

const handleFilterChange = (accessorKey: string, event: Event): void => {
  const target = event.target as HTMLInputElement
  filterValues[accessorKey] = target.value
  emit('filter-change', accessorKey, target.value)
}

const handleNumberFilterChange = (accessorKey: string, type: 'min' | 'max', event: Event): void => {
  const target = event.target as HTMLInputElement
  const value = target.value

  if (!filterValues[accessorKey]) {
    filterValues[accessorKey] = { min: '', max: '' }
  }

  filterValues[accessorKey][type] = value
  emit('filter-change', accessorKey, filterValues[accessorKey])
}

const handleDateFilterChange = (accessorKey: string, type: 'from' | 'to', event: Event): void => {
  const target = event.target as HTMLInputElement

  if (!filterValues[accessorKey]) {
    filterValues[accessorKey] = { from: '', to: '' }
  }

  filterValues[accessorKey][type] = target.value
  emit('filter-change', accessorKey, filterValues[accessorKey])
}

const handleBooleanFilterChange = (accessorKey: string, event: Event): void => {
  const target = event.target as HTMLInputElement
  filterValues[accessorKey] = target.checked
  emit('filter-change', accessorKey, target.checked)
}

// Обработка клика вне фильтра
const handleClickOutside = (event: Event): void => {
  const target = event.target as Element
  if (
    !target.closest('.base-table-filter-menu') &&
    !target.closest('.base-table-header-filter-btn')
  ) {
    closeFilter()
  }
}

// Синхронизация с внешним состоянием сортировки
watch(
  () => props.headers,
  (newHeaders) => {
    // Очищаем старое состояние
    Object.keys(sortState).forEach((key) => {
      delete sortState[key]
    })

    // Инициализируем новое состояние
    newHeaders.forEach((header) => {
      sortState[header.accessorKey] = header.sort || null
    })
  },
  { immediate: true, deep: true },
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
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

/* Кнопка сортировки */
.base-table-header-sort-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: var(--ds-radius-sm);
  color: var(--ds-text-tertiary);
  transition: all 0.2s ease;
}

.base-table-header-sort-btn:hover {
  background-color: var(--ds-button-ghost-bg-hover);
  color: var(--ds-text-secondary);
}

.base-table-header-sort-icon--active {
  color: var(--ds-text-primary);
}

/* Фильтр */
.base-table-header-filter {
  position: relative;
}

.base-table-header-filter-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: var(--ds-radius-sm);
  color: var(--ds-text-tertiary);
  transition: all 0.2s ease;
}

.base-table-header-filter-btn:hover {
  background-color: var(--ds-button-ghost-bg-hover);
  color: var(--ds-text-secondary);
}

.base-table-header-filter-btn--active {
  color: var(--ds-accent-primary);
  background-color: var(--ds-accent-bg);
}

/* Меню фильтра */
.base-table-filter-menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  min-width: 280px;
  margin-top: 4px;
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.base-table-filter-content {
  padding: var(--ds-spacing-md);
}

.base-table-filter-group {
  margin-bottom: var(--ds-spacing-md);
}

.base-table-filter-group:last-of-type {
  margin-bottom: var(--ds-spacing-sm);
}

.base-table-filter-label {
  display: block;
  margin-bottom: var(--ds-spacing-xs);
  font-size: var(--ds-font-size-xs);
  font-weight: 500;
  color: var(--ds-text-secondary);
}

.base-table-filter-checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-xs);
  cursor: pointer;
  padding: var(--ds-spacing-xs) 0;
  margin-bottom: 0;
}

.base-table-filter-input {
  width: 100%;
  padding: var(--ds-spacing-xs) var(--ds-spacing-sm);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md);
  font-size: var(--ds-font-size-sm);
  background-color: var(--ds-surface);
  color: var(--ds-text-primary);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  margin-bottom: var(--ds-spacing-xs);
}

.base-table-filter-input:focus {
  outline: none;
  border-color: var(--ds-accent-primary);
  box-shadow: 0 0 0 2px var(--ds-accent-bg);
}

.base-table-filter-input:last-child {
  margin-bottom: 0;
}

.base-table-filter-checkbox {
  width: 16px;
  height: 16px;
  accent-color: var(--ds-accent-primary);
  cursor: pointer;
}

.base-table-filter-checkbox-text {
  font-size: var(--ds-font-size-sm);
  color: var(--ds-text-primary);
  user-select: none;
}

/* Действия фильтра */
.base-table-filter-actions {
  display: flex;
  gap: var(--ds-spacing-xs);
  justify-content: flex-end;
  margin-top: var(--ds-spacing-md);
  padding-top: var(--ds-spacing-sm);
  border-top: 1px solid var(--ds-border);
}

.base-table-filter-clear-btn,
.base-table-filter-close-btn {
  padding: var(--ds-spacing-xs) var(--ds-spacing-sm);
  border: none;
  border-radius: var(--ds-radius-md);
  font-size: var(--ds-font-size-xs);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.base-table-filter-clear-btn {
  background-color: transparent;
  color: var(--ds-text-secondary);
  border: 1px solid var(--ds-border);
}

.base-table-filter-clear-btn:hover {
  background-color: var(--ds-button-ghost-bg-hover);
  color: var(--ds-text-primary);
}

.base-table-filter-close-btn {
  background-color: var(--ds-accent-primary);
  color: var(--ds-accent-contrast);
}

.base-table-filter-close-btn:hover {
  background-color: var(--ds-accent-hover);
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

@media (prefers-color-scheme: dark) {
  .base-table-loading-overlay {
    background-color: rgba(0, 0, 0, 0.75);
  }
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
/* Оверлей для закрытия фильтра */
.base-table-filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: transparent;
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
