<script setup lang="ts">
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { ref } from 'vue'
import ExtBaseTable from '@/components/ui/ExtBaseTable.vue'

const tableColumns = [
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
    actions: 'hui',
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
    actions: 'hui',
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

// Опционально - можете обрабатывать события сортировки
const handleSortChange = (accessorKey, direction) => {
  console.log(`Сортировка по ${accessorKey}: ${direction}`)
}
</script>

<template>
  <BaseTable :data="tableData" :headers="tableColumns">
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
    :loading="false"
    :data="tableData"
    :headers="tableColumns"
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
</template>
<style scoped></style>
