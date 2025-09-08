<script setup lang="ts">
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { ref } from 'vue'
import BaseDataTable, { type Sort, type BaseTableHeader } from '@/components/ui/BaseDataTable.vue'
import BasePopover from '@/components/ui/BasePopover.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import BaseDialog from '@/components/ui/BaseDialog.vue'

const tableHeaders: BaseTableHeader = [
  {
    accessorKey: 'id',
    name: 'ID',
    type: 'number',
    width: '50px',
    sortable: true,
    filterable: false,
    sort: 'asc',
  },
  {
    accessorKey: 'name',
    name: 'Имя',
    type: 'text',
    sortable: true,
    filterable: true,
    sort: null,
  },
  {
    accessorKey: 'fio',
    name: 'Фамилия',
    type: 'text',
    sortable: true,
    filterable: true,
    sort: null,
  },
  {
    accessorKey: 'email',
    name: 'Email',
    type: 'text',
    sortable: true,
    filterable: true,
    sort: null,
  },
  {
    accessorKey: 'role',
    name: 'Роль',
    type: 'text',
    sortable: true,
    filterable: true,
    sort: null,
  },
  {
    accessorKey: 'createdAt',
    name: 'Дата регистрации',
    type: 'date',
    sortable: true,
    filterable: true,
    sort: null,
  },
  {
    accessorKey: 'actions',
    name: 'Действия',
    width: '10px',
    sortable: false,
    filterable: false,
  },
]

const tableData = ref([
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
    name: 'Ольга',
    fio: 'Олейник',
    email: 'olga@example.com',
    role: 'Пользователь',
    createdAt: '2024-07-01',
  },
  {
    id: 7,
    name: 'Дмитрий',
    fio: 'Сидоров',
    email: 'dmitry@example.com',
    role: 'Пользователь',
    createdAt: '2024-08-15',
  },
  {
    id: 8,
    name: 'Ольга',
    fio: 'Олейник',
    email: 'olga@example.com',
    role: 'Пользователь',
    createdAt: '2024-07-01',
  },
  {
    id: 9,
    name: 'Дмитрий',
    fio: 'Сидоров',
    email: 'dmitry@example.com',
    role: 'Пользователь',
    createdAt: '2024-08-15',
  },
  {
    id: 10,
    name: 'Ольга',
    fio: 'Олейник',
    email: 'olga@example.com',
    role: 'Пользователь',
    createdAt: '2024-07-01',
  },
  {
    id: 11,
    name: 'Дмитрий',
    fio: 'Сидоров',
    email: 'dmitry@example.com',
    role: 'Пользователь',
    createdAt: '2024-08-15',
  },
  {
    id: 12,
    name: 'Анна',
    fio: 'Смирнова',
    email: 'anna@example.com',
    role: 'Пользователь',
    createdAt: '2024-04-05',
  },
  {
    id: 13,
    name: 'Сергей',
    fio: 'Иванов',
    email: 'sergey@example.com',
    role: 'Модератор',
    createdAt: '2024-06-22',
  },
  {
    id: 14,
    name: 'Ольга',
    fio: 'Олейник',
    email: 'olga@example.com',
    role: 'Пользователь',
    createdAt: '2024-07-01',
  },
  {
    id: 15,
    name: 'Дмитрий',
    fio: 'Сидоров',
    email: 'dmitry@example.com',
    role: 'Пользователь',
    createdAt: '2024-08-15',
  },
  {
    id: 16,
    name: 'Ольга',
    fio: 'Олейник',
    email: 'olga@example.com',
    role: 'Пользователь',
    createdAt: '2024-07-01',
  },
  {
    id: 17,
    name: 'Дмитрий',
    fio: 'Сидоров',
    email: 'dmitry@example.com',
    role: 'Пользователь',
    createdAt: '2024-08-15',
  },
  {
    id: 18,
    name: 'Ольга',
    fio: 'Олейник',
    email: 'olga@example.com',
    role: 'Пользователь',
    createdAt: '2024-07-01',
  },
  {
    id: 19,
    name: 'Дмитрий',
    fio: 'Сидоров',
    email: 'dmitry@example.com',
    role: 'Пользователь',
    createdAt: '2024-08-15',
  },
  {
    id: 20,
    name: 'Ольга',
    fio: 'Олейник',
    email: 'olga@example.com',
    role: 'Пользователь',
    createdAt: '2024-07-01',
  },
  {
    id: 21,
    name: 'Дмитрий',
    fio: 'Сидоров',
    email: 'dmitry@example.com',
    role: 'Пользователь',
    createdAt: '2024-08-15',
  },
])

const ITEM_PER_PAGE = 5
const loading = ref(false)
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

// Опционально - можете обрабатывать события сортировки
const handleSortChange = (accessorKey: string, direction: Sort) => {
  console.log(`Сортировка по ${accessorKey}: ${direction}`)
  tableData.value = sortData(tableData.value, accessorKey, direction)
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const filterData = async (data: DataItem[], filters: Filter) => {
  // Если нет фильтров, возвращаем все данные
  if (!filters || Object.keys(filters).length === 0) return data
  loading.value = true
  await delay(5000)
  loading.value = false
  // Фильтруем данные
  return data.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      // Проверяем существование ключа
      if (!item.hasOwnProperty(key)) return true

      // Получаем значение из объекта
      const itemValue = item[key]

      // Обработка null и undefined
      if (value === undefined || value === null) return true

      // Обработка строковых значений
      if (typeof value === 'string') {
        // Для дат используем специальный формат
        if (key === 'createdAt') {
          const dateValue = new Date(value)
          const itemDate = new Date(itemValue)
          return itemDate.toISOString() === dateValue.toISOString()
        }
        return String(itemValue).toLowerCase().includes(value.toLowerCase())
      }

      // Обработка числовых значений
      if (typeof value === 'number') {
        return itemValue === value
      }

      // Обработка булевых значений
      if (typeof value === 'boolean') {
        return itemValue === value
      }

      // Обработка массивов (для множественного выбора)
      if (Array.isArray(value)) {
        return value.includes(itemValue)
      }

      return itemValue === value
    })
  })
}

const currentPage = ref(1)
const handlePage = (value: number) => {
  currentPage.value = value
  console.log(currentPage.value)
}
// Пример использования
const handleFilterChange = async (filters: { accessorKey: string; value: any }[]) => {
  tableData.value = await filterData(tableData.value, filters)
  // Здесь можно использовать отфильтрованные данные
  console.log('Отфильтрованные данные:', filters)
}
</script>

<template>
  <BaseDataTable
    @sort-change="handleSortChange"
    @filter-change="handleFilterChange"
    :loading="loading"
    :data="
      tableData.slice(
        ITEM_PER_PAGE * (currentPage - 1),
        ITEM_PER_PAGE * (currentPage - 1) + ITEM_PER_PAGE,
      )
    "
    :headers="tableHeaders"
  >
    <template #cell-fio="{ value }">
      <BaseBadge :title="value" variant="danger" />
    </template>
    <template #cell-role="{ value }">
      <BaseBadge :title="value" variant="secondary" />
    </template>
    <template #cell-actions="{ row }">
      <BaseDialog
        close-only-button
        use-close-button
        :use-cancel-button="false"
        :use-ok-button="false"
      >
        <BaseButton @click="console.log(row)" variant="secondary" title="Подробнее" size="sm" />
        <template #content>
          {{ row }}
        </template>
      </BaseDialog>
    </template>
  </BaseDataTable>
  <BasePagination
    @update:page="handlePage"
    :total="tableData.length"
    :items-per-page="ITEM_PER_PAGE"
  />
</template>
<style scoped></style>
