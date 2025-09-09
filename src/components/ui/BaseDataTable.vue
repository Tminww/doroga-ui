<template>
  <div :class="tableContainerClasses">
    <!-- Таблица -->
    <table :class="tableClasses">
      <thead class="base-table-header-row">
        <!-- Строка заголовков -->
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
            </div>
          </th>
        </tr>

        <!-- Строка фильтров -->
        <tr class="base-table-row base-table-row--filter">
          <th
            v-for="header in headers"
            :key="`filter-${header.accessorKey}`"
            class="base-table-cell base-table-cell--filter"
          >
            <div class="base-table-filter-wrapper">
              <!-- Слот для кастомного фильтра -->
              <slot
                :name="`filter-${header.accessorKey}`"
                :header="header"
                :value="filterValues[header.accessorKey]"
                :update-filter="(value) => updateFilter(header.accessorKey, value)"
              >
                <!-- Дефолтный фильтр (если колонка фильтруемая) -->
                <BaseInput
                  v-if="header.filterable !== false"
                  v-model="filterValues[header.accessorKey]"
                  :type="getFilterInputType(header.type)"
                  :placeholder="`Поиск по ${header.name.toLowerCase()}...`"
                  size="sm"
                  clearable
                  @input="handleFilterInput(header.accessorKey)"
                  @clear="handleFilterClear(header.accessorKey)"
                  class="base-table-filter-input"
                />
              </slot>
            </div>
          </th>
        </tr>
      </thead>

      <tbody class="base-table-body">
        <!-- Пустое состояние -->
        <tr v-if="isEmpty && !loading" class="base-table-empty-row">
          <td :colspan="headers.length" class="base-table-empty">
            <slot name="empty">
              <div class="base-table-empty-content">
                <div class="base-table-empty-icon-container">
                  <BaseIcon icon="file-text" :size="48" class="base-table-empty-icon" />
                  <div class="base-table-empty-icon-bg"></div>
                </div>
                <div class="base-table-empty-text">
                  <h3 class="base-table-empty-title">
                    {{ emptyText }}
                  </h3>
                  <p class="base-table-empty-subtitle">
                    Попробуйте изменить поисковый запрос или очистить фильтры
                  </p>
                </div>
              </div>
            </slot>
          </td>
        </tr>

        <!-- Оверлей загрузки -->
        <tr v-if="loading" class="base-table-loading-row">
          <td :colspan="headers.length" class="base-table-loading-cell">
            <slot name="loading">
              <div class="base-table-loading-overlay">
                <div class="base-table-loading">
                  <div class="base-table-loading-spinner">
                    <div class="base-table-loading-spinner-inner">
                      <BaseIcon icon="refresh-cw" :size="24" class="base-table-loading-icon" />
                    </div>
                  </div>
                  <div class="base-table-loading-content">
                    <h4 class="base-table-loading-title">{{ loadingText }}</h4>
                    <p class="base-table-loading-subtitle">Пожалуйста, подождите...</p>
                  </div>
                </div>
              </div>
            </slot>
          </td>
        </tr>

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
import { computed, ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import BaseIcon, { type IconName } from './BaseIcon.vue'
import BasePopover from './BasePopover.vue'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'

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
  /** Дебаунс для фильтров в мс */
  filterDebounce?: number
}

const props = withDefaults(defineProps<BaseTableProps>(), {
  loading: false,
  loadingText: 'Загрузка данных',
  emptyText: 'Нет данных для отображения',
  size: 'md',
  fullWidth: true,
  hoverable: true,
  rowKey: undefined,
  filterDebounce: 300,
})

export interface BaseTableEmits {
  /** Клик по строке */
  'row-click': [row: TData, rowIndex: number, event: MouseEvent]
  /** Изменение сортировки */
  'sort-change': [accessorKey: string, direction: 'asc' | 'desc' | false]
  /** Изменение фильтра */
  'filter-change': [filters: Record<string, any>]
}

const emit = defineEmits<BaseTableEmits>()

// Реактивные данные
const filterValues = reactive<Record<string, any>>({})
const sortState = reactive<Record<string, 'asc' | 'desc' | false>>({})
const filterTimeouts = reactive<Record<string, NodeJS.Timeout>>({})

// Инициализация значений фильтров
onMounted(() => {
  props.headers.forEach((header) => {
    if (header.filterable !== false && !(header.accessorKey in filterValues)) {
      filterValues[header.accessorKey] = ''
    }
  })
})

// Очистка таймеров при размонтировании
onUnmounted(() => {
  Object.values(filterTimeouts).forEach((timeout) => {
    if (timeout) clearTimeout(timeout)
  })
})

// Вычисляемые свойства
const isEmpty = computed(() => props.data.length === 0)

const tableContainerClasses = computed(() => [
  'base-table-scroll-container',
  'base-table-container',
  {
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

// Методы фильтрации
const getFilterInputType = (type?: Type): string => {
  switch (type) {
    case 'number':
      return 'number'
    case 'date':
      return 'date'
    default:
      return 'text'
  }
}

const updateFilter = (accessorKey: string, value: any): void => {
  filterValues[accessorKey] = value

  // Очищаем предыдущий таймер для этого фильтра
  if (filterTimeouts[accessorKey]) {
    clearTimeout(filterTimeouts[accessorKey])
  }

  // Устанавливаем новый таймер с дебаунсом
  filterTimeouts[accessorKey] = setTimeout(() => {
    emit('filter-change', { ...filterValues })
  }, props.filterDebounce)
}

const handleFilterInput = (accessorKey: string): void => {
  updateFilter(accessorKey, filterValues[accessorKey])
}

const handleFilterClear = (accessorKey: string): void => {
  updateFilter(accessorKey, '')
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

.base-table-body {
  position: relative;
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

.base-table-row--filter {
  background-color: var(--ds-surface);
  border-bottom: 2px solid var(--ds-border);
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
  z-index: 10;
}

.base-table-cell--filter {
  background-color: var(--ds-surface);
  position: sticky;
  top: var(--base-table-header-height, 48px);
  z-index: 9;
}

.base-table-cell--body {
  color: var(--ds-text-primary);
}

/* Размеры */
.base-table--sm .base-table-cell {
  padding: var(--ds-spacing-xs) var(--ds-spacing-sm);
  font-size: var(--ds-font-size-xs);
}

.base-table--sm .base-table-cell--filter {
  padding: var(--ds-spacing-xs);
}

.base-table--md .base-table-cell {
  padding: var(--ds-spacing-sm) var(--ds-spacing-md);
  font-size: var(--ds-font-size-sm);
}

.base-table--md .base-table-cell--filter {
  padding: var(--ds-spacing-xs) var(--ds-spacing-sm);
}

.base-table--lg .base-table-cell {
  padding: var(--ds-spacing-md) var(--ds-spacing-lg);
  font-size: var(--ds-font-size-md);
}

.base-table--lg .base-table-cell--filter {
  padding: var(--ds-spacing-sm) var(--ds-spacing-md);
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

/* Обертка для фильтров */
.base-table-filter-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
}

.base-table-filter-input {
  width: 100%;
}

/* === НОВЫЕ СТИЛИ ДЛЯ ПУСТОГО СОСТОЯНИЯ === */
.base-table-empty-row {
  border-bottom: none !important;
}

.base-table-empty {
  padding: var(--ds-spacing-3xl) var(--ds-spacing-xl);
  text-align: center;
  background: linear-gradient(135deg, var(--ds-surface) 0%, var(--ds-surface-secondary) 100%);
  position: relative;
  overflow: hidden;
}

.base-table-empty::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.base-table-empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ds-spacing-lg);
  position: relative;
  z-index: 1;
  max-width: 400px;
  margin: 0 auto;
}

.base-table-empty-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.base-table-empty-icon-bg {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  animation: pulse-bg 3s ease-in-out infinite;
}

.base-table-empty-icon {
  color: var(--ds-text-tertiary);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  z-index: 1;
  position: relative;
  opacity: 0.7;
}

.base-table-empty-text {
  text-align: center;
}

.base-table-empty-title {
  font-weight: 600;
  font-size: var(--ds-font-size-lg);
  color: var(--ds-text-primary);
  margin: 0 0 var(--ds-spacing-xs) 0;
  line-height: 1.4;
}

.base-table-empty-subtitle {
  font-size: var(--ds-font-size-sm);
  color: var(--ds-text-secondary);
  margin: 0;
  line-height: 1.5;
  opacity: 0.8;
}

/* === НОВЫЕ СТИЛИ ДЛЯ ЗАГРУЗКИ === */
.base-table-loading-row {
  border-bottom: none !important;
}

.base-table-loading-cell {
  padding: 0;
  position: relative;
}

.base-table-loading-overlay {
  min-height: 200px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.base-table-loading-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(59, 130, 246, 0.03) 50%,
    transparent 70%
  );
  animation: shimmer 2s linear infinite;
}

.base-table-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ds-spacing-md);
  position: relative;
  z-index: 2;
  padding: var(--ds-spacing-xl);
  background: rgba(255, 255, 255, 0.8);
  border-radius: var(--ds-radius-xl);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.base-table-loading-spinner {
  position: relative;
  width: 56px;
  height: 56px;
}

.base-table-loading-spinner-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: spin-bg 3s linear infinite;
}

.base-table-loading-spinner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top: 2px solid var(--ds-accent-primary);
  border-right: 2px solid rgba(59, 130, 246, 0.3);
  animation: spin-border 1s linear infinite;
}

.base-table-loading-icon {
  color: var(--ds-accent-primary);
  animation: spin 2s linear infinite;
  filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3));
}

.base-table-loading-content {
  text-align: center;
}

.base-table-loading-title {
  font-weight: 600;
  font-size: var(--ds-font-size-md);
  color: var(--ds-text-primary);
  margin: 0 0 var(--ds-spacing-xs) 0;
}

.base-table-loading-subtitle {
  font-size: var(--ds-font-size-sm);
  color: var(--ds-text-secondary);
  margin: 0;
  opacity: 0.8;
}

/* === АНИМАЦИИ === */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-border {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-bg {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
}

@keyframes pulse-bg {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .base-table-empty {
    padding: var(--ds-spacing-xl) var(--ds-spacing-md);
  }

  .base-table-empty-title {
    font-size: var(--ds-font-size-md);
  }

  .base-table-empty-subtitle {
    font-size: var(--ds-font-size-xs);
  }

  .base-table-loading {
    padding: var(--ds-spacing-lg);
    margin: var(--ds-spacing-md);
  }

  .base-table-loading-spinner {
    width: 48px;
    height: 48px;
  }

  .base-table-loading-spinner-inner {
    width: 40px;
    height: 40px;
  }
}
</style>
