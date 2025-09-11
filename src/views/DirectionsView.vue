<script setup lang="ts">
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { ref, computed } from 'vue'
import BaseDataTable, { type Sort, type BaseTableHeader } from '@/components/ui/BaseDataTable.vue'
import BasePopover from '@/components/ui/BasePopover.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import BaseDialog from '@/components/ui/BaseDialog.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

// Исправленный тип для заголовков - должен быть массив
const tableHeaders: BaseTableHeader[] = [
  {
    accessorKey: 'id',
    name: 'ID',
    type: 'number',
    width: '70px',
    sortable: true,
    filterable: false,
  },
  {
    accessorKey: 'name',
    name: 'Имя',
    type: 'text',
    sortable: true,
    filterable: true,
  },
  {
    accessorKey: 'fio',
    name: 'Фамилия',
    type: 'text',
    sortable: true,
    filterable: true,
  },
  {
    accessorKey: 'email',
    name: 'Email',
    type: 'text',
    sortable: true,
    filterable: true,
  },
  {
    accessorKey: 'role',
    name: 'Роль',
    type: 'text',
    sortable: true,
    filterable: true,
  },
  {
    accessorKey: 'createdAt',
    name: 'Дата регистрации',
    type: 'date',
    sortable: true,
    filterable: true,
  },
  {
    accessorKey: 'actions',
    name: 'Действия',
    width: '110px',
    sortable: false,
    filterable: false,
  },
]

// Исходные данные (не изменяются при фильтрации)
// Массивы для генерации случайных значений
const names = [
  'Иван',
  'Анна',
  'Сергей',
  'Ольга',
  'Дмитрий',
  'Мария',
  'Александр',
  'Екатерина',
  'Максим',
  'Татьяна',
  'Владимир',
  'Людмила',
  'Андрей',
  'Светлана',
  'Юрий',
  'Наталья',
  'Олег',
  'Ирина',
  'Павел',
  'Елена',
  'Михаил',
]

const lastNames = [
  'Петров',
  'Смирнова',
  'Иванов',
  'Олейник',
  'Сидоров',
  'Козлова',
  'Волков',
  'Белова',
  'Орлов',
  'Жукова',
  'Морозов',
  'Соколова',
  'Лебедев',
  'Попова',
  'Захаров',
  'Медведева',
  'Борисов',
  'Романова',
  'Васильев',
  'Тихонова',
  'Крылов',
]

const roles = ['Админ', 'Пользователь', 'Модератор']

// Функция для генерации случайной даты
function getRandomDate(start = new Date(2024, 2), end = new Date()) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString()
    .split('T')[0]
}

// Основная функция генератора
function generateData(count) {
  const data = []

  for (let i = 1; i <= count; i++) {
    data.push({
      id: i,
      name: names[Math.floor(Math.random() * names.length)],
      fio: lastNames[Math.floor(Math.random() * lastNames.length)],
      email: `${names[Math.floor(Math.random() * names.length)].toLowerCase()}@example.com`,
      role: roles[Math.floor(Math.random() * roles.length)],
      createdAt: getRandomDate(),
    })
  }

  return data
}

// Пример использования:
// Генерируем 10 случайных объектов
const generatedData = generateData(100)

const ITEMS_PER_PAGE = 15
const loading = ref(false)
const currentPage = ref(1)
const currentFilters = ref<Record<string, any>>({})
const currentSort = ref<{ key: string; direction: Sort }>({ key: '', direction: false })

// Опции для фильтра ролей
const roleOptions = [
  { name: 'Админ', value: 'Админ' },
  { name: 'Модератор', value: 'Модератор' },
  { name: 'Пользователь', value: 'Пользователь' },
]

// Функция сортировки данных
const sortData = <T,>(data: T[], accessorKey: string, direction: Sort): T[] => {
  if (!direction) {
    return data // Если сортировка отключена, возвращаем исходный массив
  }

  return [...data].sort((a, b) => {
    const valA = a[accessorKey]
    const valB = b[accessorKey]

    // Обработка разных типов данных
    if (typeof valA === 'number' && typeof valB === 'number') {
      return direction === 'asc' ? valA - valB : valB - valA
    }

    if (typeof valA === 'string' && typeof valB === 'string') {
      return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
    }

    if (valA instanceof Date && valB instanceof Date) {
      return direction === 'asc' ? valA.getTime() - valB.getTime() : valB.getTime() - valA.getTime()
    }

    // Для булевых значений
    return direction === 'asc'
      ? (valA ? 1 : -1) - (valB ? 1 : -1)
      : (valB ? 1 : -1) - (valA ? 1 : -1)
  })
}

// Функция фильтрации данных
const filterData = (data: any[], filters: Record<string, any>) => {
  if (!filters || Object.keys(filters).length === 0) return data

  return data.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value || value === '') return true

      const itemValue = item[key]

      if (typeof value === 'string') {
        if (key === 'createdAt') {
          return itemValue.includes(value)
        }
        return String(itemValue).toLowerCase().includes(value.toLowerCase())
      }

      if (typeof value === 'number') {
        return itemValue === value
      }

      if (Array.isArray(value)) {
        return value.includes(itemValue)
      }

      return itemValue === value
    })
  })
}

// Функция задержки для имитации загрузки
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Вычисляемые свойства для обработанных данных
const processedData = computed(() => {
  let data = [...generatedData]

  // Применяем фильтры
  data = filterData(data, currentFilters.value)

  // Применяем сортировку
  if (currentSort.value.direction) {
    data = sortData(data, currentSort.value.key, currentSort.value.direction)
  }

  return data
})

// Пагинированные данные
const paginatedData = computed(() => {
  const start = ITEMS_PER_PAGE * (currentPage.value - 1)
  const end = start + ITEMS_PER_PAGE
  return processedData.value.slice(start, end)
})

// Обработчик изменения сортировки
const handleSortChange = (accessorKey: string, direction: Sort) => {
  console.log(`Сортировка по ${accessorKey}: ${direction}`)
  currentSort.value = { key: accessorKey, direction }
  currentPage.value = 1 // Сбрасываем на первую страницу
}

// Обработчик изменения фильтров
const handleFilterChange = async (filters: Record<string, any>) => {
  loading.value = true

  // Имитация задержки загрузки
  await delay(500)

  currentFilters.value = { ...filters }
  currentPage.value = 1 // Сбрасываем на первую страницу
  loading.value = false

  console.log('Отфильтрованные данные:', filters)
}

// Обработчик изменения страницы
const handlePageChange = (page: number) => {
  currentPage.value = page
  console.log('Текущая страница:', currentPage.value)
}

// Функция получения варианта бейджа для роли
const getRoleVariant = (role: string) => {
  switch (role) {
    case 'Админ':
      return 'danger'
    case 'Модератор':
      return 'warning'
    case 'Пользователь':
      return 'secondary'
    default:
      return 'primary'
  }
}
</script>

<template>
  <div class="directions-view">
    <BaseDataTable
      :data="paginatedData"
      :headers="tableHeaders"
      :loading="loading"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
    >
      <!-- Кастомный фильтр для роли -->
      <template #filter-role="{ value, updateFilter }">
        <BaseSelect
          full-width
          left-icon="search"
          :items="roleOptions"
          :model-value="value"
          @update:model-value="(value) => updateFilter(value.value)"
          placeholder="Все роли"
          size="sm"
          clearable
          class="w-full"
        />
      </template>

      <!-- Кастомные ячейки -->
      <template #cell-fio="{ value }">
        <BaseBadge :title="value" variant="primary" />
      </template>

      <template #cell-role="{ value }">
        <BaseBadge :title="value" :variant="getRoleVariant(value)" />
      </template>

      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <BaseDialog
            close-only-button
            use-close-button
            :use-cancel-button="false"
            :use-ok-button="false"
          >
            <BaseButton variant="secondary" title="Подробнее" size="sm" />
            <template #content>
              <div class="user-details">
                <h3>Информация о пользователе</h3>
                <div class="details-grid">
                  <div><strong>ID:</strong> {{ row.id }}</div>
                  <div><strong>Имя:</strong> {{ row.name }}</div>
                  <div><strong>Фамилия:</strong> {{ row.fio }}</div>
                  <div><strong>Email:</strong> {{ row.email }}</div>
                  <div><strong>Роль:</strong> {{ row.role }}</div>
                  <div><strong>Дата регистрации:</strong> {{ row.createdAt }}</div>
                </div>
              </div>
            </template>
          </BaseDialog>
        </div>
      </template>
    </BaseDataTable>

    <!-- Пагинация -->
    <div class="pagination-wrapper">
      <BasePagination
        :current-page="currentPage"
        :total="processedData.length"
        :items-per-page="ITEMS_PER_PAGE"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.directions-view {
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-sm);
  padding: 1rem 0 0 0;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
}

.user-details h3 {
  margin-bottom: 1rem;
  color: var(--ds-text-primary);
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.details-grid div {
  padding: 0.5rem;
  background-color: var(--ds-surface-secondary);
  border-radius: var(--ds-radius-sm);
}

.flex {
  display: flex;
}

.gap-2 {
  gap: 0.5rem;
}

.w-full {
  width: 100%;
}
</style>
