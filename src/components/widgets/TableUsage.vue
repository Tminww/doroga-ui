<template>
  <div class="table-example">
    <BaseTable
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :search-loading="searchLoading"
      :filter-loading="filterLoading"
      :sort-loading="sortLoading"
      :pagination-loading="paginationLoading"
      :current-page="currentPage"
      :page-size="pageSize"
      :total-items="totalItems"
      :filtered-items="filteredItems"
      :column-filters="columnFilters"
      :sort-by="sortBy"
      :sort-direction="sortDirection"
      :searchable="true"
      :filterable="true"
      :sortable="true"
      :show-pagination="true"
      title="Список сотрудников"
      @search="handleSearch"
      @search-clear="handleSearchClear"
      @column-filter="handleColumnFilter"
      @sort-change="handleSortChange"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
      @row-click="handleRowClick"
    >
      <!-- Кастомный фильтр для статуса -->
      <template #filter-status="{ onFilter, filterValue }">
        <BaseSelect
          :items="status"
          :model-value="filterValue"
          :options="statusOptions"
          placeholder="Все статусы"
          clearable
          size="sm"
          @update:model-value="onFilter"
        />
      </template>

      <!-- Кастомный фильтр для зарплаты (диапазон) -->
      <template #filter-salary="{ onFilter, filterValue }">
        <div class="salary-filter">
          <input
            type="number"
            :model-value="filterValue?.min"
            placeholder="От"
            size="sm"
            @update:model-value="(value) => onFilter({ ...filterValue, min: value })"
          />
          <input
            type="number"
            :model-value="filterValue?.max"
            placeholder="До"
            size="sm"
            @update:model-value="(value) => onFilter({ ...filterValue, max: value })"
          />
        </div>
      </template>

      <!-- Кастомный рендер для статуса -->
      <template #cell-status="{ value }">
        <span class="status-badge" :class="`status-badge--${value.toLowerCase()}`">
          {{ getStatusLabel(value) }}
        </span>
      </template>

      <!-- Кастомный рендер для зарплаты -->
      <template #cell-salary="{ value }">
        <span class="salary-amount">
          {{ formatCurrency(value) }}
        </span>
      </template>

      <!-- Кастомные действия -->
      <template #actions>
        <BaseButton variant="primary" size="sm" @click="addEmployee">
          <BaseIcon icon="plus" :size="14" />
          Добавить
        </BaseButton>
        <BaseButton variant="outline" size="sm" @click="exportData">
          <BaseIcon icon="download" :size="14" />
          Экспорт
        </BaseButton>
      </template>
    </BaseTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { type ColumnDef } from '@tanstack/vue-table'
import BaseTable from '@/components/ui/ExtBaseTable.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
// import BaseNumberInput from '@/components/ui/BaseNumberInput.vue'

// Интерфейс данных
interface Employee {
  id: number
  name: string
  email: string
  position: string
  department: string
  salary: number
  status: 'active' | 'inactive' | 'pending'
  startDate: string
  isRemote: boolean
}

// Реактивные данные
const loading = ref(false)
const searchLoading = ref(false)
const filterLoading = ref(false)
const sortLoading = ref(false)
const paginationLoading = ref(false)

// Параметры таблицы
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const filteredItems = ref(0)
const sortBy = ref<string | undefined>()
const sortDirection = ref<'asc' | 'desc' | undefined>()

// Фильтры
const searchQuery = ref('')
const columnFilters = reactive<Record<string, any>>({})

// Данные
const allEmployees = ref<Employee[]>([])
const tableData = ref<Employee[]>([])

// Опции для фильтров
const statusOptions = [
  { label: 'Все', value: null },
  { label: 'Активный', value: 'active' },
  { label: 'Неактивный', value: 'inactive' },
  { label: 'Ожидает', value: 'pending' },
]

const departmentOptions = [
  { label: 'Все отделы', value: null },
  { label: 'Разработка', value: 'development' },
  { label: 'Дизайн', value: 'design' },
  { label: 'Маркетинг', value: 'marketing' },
  { label: 'HR', value: 'hr' },
  { label: 'Продажи', value: 'sales' },
]

// Конфигурация колонок
const columns: ColumnDef<Employee>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Имя',
    size: 200,
    meta: {
      filter: {
        type: 'text',
        placeholder: 'Поиск по имени',
      },
    },
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    size: 250,
    meta: {
      filter: {
        type: 'text',
        placeholder: 'Поиск по email',
      },
    },
  },
  {
    id: 'position',
    accessorKey: 'position',
    header: 'Должность',
    size: 180,
    meta: {
      filter: {
        type: 'text',
        placeholder: 'Должность',
      },
    },
  },
  {
    id: 'department',
    accessorKey: 'department',
    header: 'Отдел',
    size: 150,
    meta: {
      filter: {
        type: 'select',
        options: departmentOptions,
      },
    },
  },
  {
    id: 'salary',
    accessorKey: 'salary',
    header: 'Зарплата',
    size: 130,
    align: 'right',
    meta: {
      filter: {
        type: 'numberRange',
      },
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Статус',
    size: 120,
    align: 'center',
    // Фильтр будет кастомный через слот
    enableColumnFilter: true,
  },
  {
    id: 'startDate',
    accessorKey: 'startDate',
    header: 'Дата найма',
    size: 130,
    cell: ({ getValue }) => {
      return new Date(getValue() as string).toLocaleDateString('ru-RU')
    },
    meta: {
      filter: {
        type: 'dateRange',
      },
    },
  },
  {
    id: 'isRemote',
    accessorKey: 'isRemote',
    header: 'Удаленно',
    size: 100,
    align: 'center',
    cell: ({ getValue }) => (getValue() ? 'Да' : 'Нет'),
    meta: {
      filter: {
        type: 'boolean',
      },
    },
  },
  {
    id: 'actions',
    header: 'Действия',
    size: 120,
    enableSorting: false,
    enableColumnFilter: false,
  },
]

// Методы
const loadData = async () => {
  loading.value = true

  try {
    // Симуляция API запроса
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Моковые данные
    allEmployees.value = generateMockEmployees(100)

    // Применяем фильтры и сортировку
    applyFiltersAndSort()
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  } finally {
    loading.value = false
  }
}

const applyFiltersAndSort = () => {
  let filtered = [...allEmployees.value]

  // Применяем поиск
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (employee) =>
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.position.toLowerCase().includes(query),
    )
  }

  // Применяем фильтры колонок
  Object.entries(columnFilters).forEach(([column, value]) => {
    if (!value) return

    switch (column) {
      case 'name':
      case 'email':
      case 'position':
        if (typeof value === 'string') {
          filtered = filtered.filter((employee) =>
            (employee[column as keyof Employee] as string)
              .toLowerCase()
              .includes(value.toLowerCase()),
          )
        }
        break

      case 'department':
        filtered = filtered.filter((employee) => employee.department === value)
        break

      case 'status':
        filtered = filtered.filter((employee) => employee.status === value)
        break

      case 'salary':
        if (value.min !== undefined) {
          filtered = filtered.filter((employee) => employee.salary >= value.min)
        }
        if (value.max !== undefined) {
          filtered = filtered.filter((employee) => employee.salary <= value.max)
        }
        break

      case 'isRemote':
        filtered = filtered.filter((employee) => employee.isRemote === value)
        break

      case 'startDate':
        if (value.from) {
          filtered = filtered.filter(
            (employee) => new Date(employee.startDate) >= new Date(value.from),
          )
        }
        if (value.to) {
          filtered = filtered.filter(
            (employee) => new Date(employee.startDate) <= new Date(value.to),
          )
        }
        break
    }
  })

  filteredItems.value = filtered.length

  // Применяем сортировку
  if (sortBy.value && sortDirection.value) {
    filtered.sort((a, b) => {
      const aValue = a[sortBy.value as keyof Employee]
      const bValue = b[sortBy.value as keyof Employee]

      let comparison = 0
      if (aValue < bValue) comparison = -1
      if (aValue > bValue) comparison = 1

      return sortDirection.value === 'desc' ? -comparison : comparison
    })
  }

  totalItems.value = filtered.length

  // Применяем пагинацию
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  tableData.value = filtered.slice(startIndex, endIndex)
}

// Обработчики событий
const handleSearch = async (query: string) => {
  searchLoading.value = true
  searchQuery.value = query
  currentPage.value = 1

  // Симуляция задержки запроса
  await new Promise((resolve) => setTimeout(resolve, 300))

  applyFiltersAndSort()
  searchLoading.value = false
}

const handleSearchClear = () => {
  searchQuery.value = ''
  currentPage.value = 1
  applyFiltersAndSort()
}

const handleColumnFilter = async (column: string, value: any) => {
  filterLoading.value = true

  if (value === null || value === undefined || value === '') {
    delete columnFilters[column]
  } else {
    columnFilters[column] = value
  }

  currentPage.value = 1

  // Симуляция задержки запроса
  await new Promise((resolve) => setTimeout(resolve, 300))

  applyFiltersAndSort()
  filterLoading.value = false
}

const handleSortChange = async (column: string, direction: 'asc' | 'desc' | false) => {
  sortLoading.value = true

  sortBy.value = direction ? column : undefined
  sortDirection.value = direction || undefined

  // Симуляция задержки запроса
  await new Promise((resolve) => setTimeout(resolve, 300))

  applyFiltersAndSort()
  sortLoading.value = false
}

const handlePageChange = async (page: number) => {
  paginationLoading.value = true
  currentPage.value = page

  // Симуляция задержки запроса
  await new Promise((resolve) => setTimeout(resolve, 200))

  applyFiltersAndSort()
  paginationLoading.value = false
}

const handlePageSizeChange = async (size: number) => {
  paginationLoading.value = true
  pageSize.value = size
  currentPage.value = 1

  // Симуляция задержки запроса
  await new Promise((resolve) => setTimeout(resolve, 200))

  applyFiltersAndSort()
  paginationLoading.value = false
}

const handleRowClick = (row: any) => {
  console.log('Клик по строке:', row.original)
}

// Утилиты
const getStatusLabel = (status: string) => {
  const labels = {
    active: 'Активный',
    inactive: 'Неактивный',
    pending: 'Ожидает',
  }
  return labels[status as keyof typeof labels] || status
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(amount)
}

const generateMockEmployees = (count: number): Employee[] => {
  const names = [
    'Иван Петров',
    'Мария Иванова',
    'Алексей Сидоров',
    'Елена Козлова',
    'Дмитрий Федоров',
  ]
  const positions = [
    'Frontend Developer',
    'Backend Developer',
    'UI/UX Designer',
    'Product Manager',
    'QA Engineer',
  ]
  const departments = ['development', 'design', 'marketing', 'hr', 'sales']
  const statuses = ['active', 'inactive', 'pending']

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names[Math.floor(Math.random() * names.length)],
    email: `user${i + 1}@example.com`,
    position: positions[Math.floor(Math.random() * positions.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    salary: Math.floor(Math.random() * 200000) + 50000,
    status: statuses[Math.floor(Math.random() * statuses.length)] as Employee['status'],
    startDate: new Date(
      2020 + Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28),
    ).toISOString(),
    isRemote: Math.random() > 0.5,
  }))
}

// Действия
const addEmployee = () => {
  console.log('Добавить сотрудника')
}

const exportData = () => {
  console.log('Экспорт данных')
}

// Глобальные функции для действий в ячейках
declare global {
  interface Window {
    editEmployee: (id: number) => void
    deleteEmployee: (id: number) => void
  }
}

window.editEmployee = (id: number) => {
  console.log('Редактировать сотрудника:', id)
}

window.deleteEmployee = (id: number) => {
  console.log('Удалить сотрудника:', id)
}

// Загружаем данные при монтировании
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.table-example {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--ds-spacing-lg);
}

.salary-filter {
  display: flex;
  gap: var(--ds-spacing-xs);
  min-width: 160px;
}

.status-badge {
  display: inline-block;
  padding: var(--ds-spacing-xs) var(--ds-spacing-sm);
  border-radius: var(--ds-radius-sm);
  font-size: var(--ds-font-size-xs);
  font-weight: 500;
  text-align: center;
}

.status-badge--active {
  background-color: var(--ds-success-bg);
  color: var(--ds-success-text);
}

.status-badge--inactive {
  background-color: var(--ds-error-bg);
  color: var(--ds-error-text);
}

.status-badge--pending {
  background-color: var(--ds-warning-bg);
  color: var(--ds-warning-text);
}

.salary-amount {
  font-weight: 600;
  color: var(--ds-text-primary);
}

:deep(.table-actions) {
  display: flex;
  gap: var(--ds-spacing-xs);
  justify-content: center;
}

:deep(.action-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-sm);
  background-color: var(--ds-surface);
  color: var(--ds-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.action-btn:hover) {
  background-color: var(--ds-button-ghost-bg-hover);
  color: var(--ds-text-primary);
}

:deep(.action-btn--danger:hover) {
  background-color: var(--ds-error-bg);
  color: var(--ds-error-text);
  border-color: var(--ds-error);
}
</style>
