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
    width: '80px',
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
    width: '150px',
    sortable: false,
    filterable: false,
  },
]

// Исходные данные (не изменяются при фильтрации)
const originalData = [
  {
    id: 1,
    name: 'Иван',
    fio: 'Петров',
    email: 'ivan@example.com',
    role: 'Админ',
    createdAt: '2024-03-20',
  },
  {
    id: 2,
    name: 'Анна',
    fio: 'Смирнова',
    email: 'anna@example.com',
    role: 'Пользователь',
    createdAt: '2024-04-25',
  },
  {
    id: 3,
    name: 'Сергей',
    fio: 'Иванов',
    email: 'sergey@example.com',
    role: 'Модератор',
    createdAt: '2024-06-22',
  },
  {
    id: 4,
    name: 'Ольга',
    fio: 'Олейник',
    email: 'olga@example.com',
    role: 'Пользователь',
    createdAt: '2024-07-01',
  },
  {
    id: 5,
    name: 'Дмитрий',
    fio: 'Сидоров',
    email: 'dmitry@example.com',
    role: 'Пользователь',
    createdAt: '2024-08-15',
  },
  {
    id: 6,
    name: 'Мария',
    fio: 'Козлова',
    email: 'maria@example.com',
    role: 'Модератор',
    createdAt: '2024-07-10',
  },
  {
    id: 7,
    name: 'Александр',
    fio: 'Волков',
    email: 'alex@example.com',
    role: 'Пользователь',
    createdAt: '2024-08-20',
  },
  {
    id: 8,
    name: 'Екатерина',
    fio: 'Белова',
    email: 'kate@example.com',
    role: 'Админ',
    createdAt: '2024-05-15',
  },
  {
    id: 9,
    name: 'Максим',
    fio: 'Орлов',
    email: 'max@example.com',
    role: 'Пользователь',
    createdAt: '2024-06-30',
  },
  {
    id: 10,
    name: 'Татьяна',
    fio: 'Жукова',
    email: 'tanya@example.com',
    role: 'Модератор',
    createdAt: '2024-07-25',
  },
  {
    id: 11,
    name: 'Владимир',
    fio: 'Морозов',
    email: 'vladimir@example.com',
    role: 'Пользователь',
    createdAt: '2024-08-05',
  },
  {
    id: 12,
    name: 'Людмила',
    fio: 'Соколова',
    email: 'lyuda@example.com',
    role: 'Пользователь',
    createdAt: '2024-04-10',
  },
  {
    id: 13,
    name: 'Андрей',
    fio: 'Лебедев',
    email: 'andrey@example.com',
    role: 'Модератор',
    createdAt: '2024-06-18',
  },
  {
    id: 14,
    name: 'Светлана',
    fio: 'Попова',
    email: 'svetlana@example.com',
    role: 'Пользователь',
    createdAt: '2024-07-03',
  },
  {
    id: 15,
    name: 'Юрий',
    fio: 'Захаров',
    email: 'yury@example.com',
    role: 'Пользователь',
    createdAt: '2024-08-12',
  },
  {
    id: 16,
    name: 'Наталья',
    fio: 'Медведева',
    email: 'natasha@example.com',
    role: 'Админ',
    createdAt: '2024-05-28',
  },
  {
    id: 17,
    name: 'Олег',
    fio: 'Борисов',
    email: 'oleg@example.com',
    role: 'Пользователь',
    createdAt: '2024-08-08',
  },
  {
    id: 18,
    name: 'Ирина',
    fio: 'Романова',
    email: 'irina@example.com',
    role: 'Модератор',
    createdAt: '2024-06-14',
  },
  {
    id: 19,
    name: 'Павел',
    fio: 'Васильев',
    email: 'pavel@example.com',
    role: 'Пользователь',
    createdAt: '2024-08-18',
  },
  {
    id: 20,
    name: 'Елена',
    fio: 'Тихонова',
    email: 'elena@example.com',
    role: 'Пользователь',
    createdAt: '2024-07-12',
  },
  {
    id: 21,
    name: 'Михаил',
    fio: 'Крылов',
    email: 'mikhail@example.com',
    role: 'Модератор',
    createdAt: '2024-08-22',
  },
]

const ITEMS_PER_PAGE = 5
const loading = ref(true)
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
  let data = [...originalData]

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
          :items="roleOptions"
          :model-value="value"
          @update:model-value="updateFilter"
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
  gap: 1rem;
  padding: 1rem;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
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
