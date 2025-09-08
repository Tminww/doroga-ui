<script setup lang="ts">
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { ref } from 'vue'
import ExtBaseTable, { type Sort, type BaseTableHeader } from '@/components/ui/ExtBaseTable.vue'
import BasePopover from '@/components/ui/BasePopover.vue'

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
    createdAt: '2024-03-10',
  },
  {
    id: 2,
    name: 'Анна',
    fio: 'Смирнова',
    email: 'anna@example.com',
    role: 'Пользователь',
    createdAt: '2024-04-05',
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
])

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

// Пример использования
const handleFilterChange = async (filters: { accessorKey: string; value: any }[]) => {
  tableData.value = await filterData(tableData.value, filters)
  // Здесь можно использовать отфильтрованные данные
  console.log('Отфильтрованные данные:', filters)
}
</script>

<template>
  <BaseTable :data="tableData" :headers="tableHeaders">
    <template #cell-fio="{ value }">
      <BaseBadge :title="value" variant="danger" />
    </template>
    <template #cell-role="{ value }">
      <BaseBadge :title="value" variant="secondary" />
    </template>
    <template #cell-actions="{ row }">
      <BaseButton
        @click="console.log(row)"
        variant="secondary"
        title="Подробнее"
        size="sm"
      /> </template
  ></BaseTable>
  <ExtBaseTable
    @sort-change="handleSortChange"
    @filter-change="handleFilterChange"
    :loading="loading"
    :data="tableData"
    :headers="tableHeaders"
  >
    <template #cell-fio="{ value }">
      <BaseBadge :title="value" variant="danger" />
    </template>
    <template #cell-role="{ value }">
      <BaseBadge :title="value" variant="secondary" />
    </template>
    <template #cell-actions="{ row }">
      <BaseButton
        @click="console.log(row)"
        variant="secondary"
        title="Подробнее"
        size="sm"
      /> </template
  ></ExtBaseTable>
  <BasePopover>
    <BaseButton icon-only :icon-size="16" variant="ghost" size="sm" left-icon="filter"
  /></BasePopover>
</template>
<style scoped></style>
