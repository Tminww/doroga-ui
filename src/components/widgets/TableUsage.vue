<template>
  <div class="table-example">
    <EnhancedBaseTable
      title="Управление пользователями"
      :data="tableData"
      :columns="columns"
      :searchable="true"
      :loading="loading"
      :search-loading="searchLoading"
      :sort-loading="sortLoading"
      :pagination-loading="paginationLoading"
      :current-page="currentPage"
      :page-size="pageSize"
      :total-items="totalItems"
      :filtered-items="filteredItems"
      :sort-by="sortBy"
      :sort-direction="sortDirection"
      @search="handleSearch"
      @search-clear="handleSearchClear"
      @sort-change="handleSortChange"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
      @row-click="handleRowClick"
    >
      <!-- Слот для действий в заголовке -->
      <template #actions>
        <BaseButton variant="primary" left-icon="plus" @click="showCreateDialog = true">
          Добавить пользователя
        </BaseButton>
        <BaseButton variant="ghost" left-icon="download" @click="exportData"> Экспорт </BaseButton>
      </template>

      <!-- Слот для фильтров -->
      <template #filters>
        <select v-model="statusFilter" @change="applyFilters" class="filter-select">
          <option value="">Все статусы</option>
          <option value="active">Активные</option>
          <option value="inactive">Неактивные</option>
          <option value="pending">Ожидают подтверждения</option>
        </select>

        <select v-model="roleFilter" @change="applyFilters" class="filter-select">
          <option value="">Все роли</option>
          <option value="admin">Администратор</option>
          <option value="user">Пользователь</option>
          <option value="moderator">Модератор</option>
        </select>
      </template>

      <!-- Кастомизация ячейки статуса -->
      <template #cell-status="{ value }">
        <span :class="getStatusClass(value)" class="status-badge">
          {{ getStatusText(value) }}
        </span>
      </template>

      <!-- Кастомизация ячейки аватара -->
      <template #cell-avatar="{ value, row }">
        <div class="user-avatar">
          <img v-if="value" :src="value" :alt="row.original.name" class="avatar-image" />
          <div v-else class="avatar-placeholder">
            {{ getInitials(row.original.name) }}
          </div>
        </div>
      </template>

      <!-- Кастомизация ячейки действий -->
      <template #cell-actions="{ row }">
        <div class="table-actions">
          <BaseButton
            variant="ghost"
            size="sm"
            left-icon="eye"
            title="Просмотр"
            @click.stop="viewUser(row.original)"
          />
          <BaseButton
            variant="ghost"
            size="sm"
            left-icon="edit"
            title="Редактировать"
            @click.stop="editUser(row.original)"
          />
          <BaseButton
            variant="ghost"
            size="sm"
            left-icon="trash"
            title="Удалить"
            :class="{ 'text-red-600': true }"
            @click.stop="deleteUser(row.original)"
          />
        </div>
      </template>

      <!-- Кастомное пустое состояние -->
      <template #empty="{ searchValue }">
        <div class="custom-empty-state">
          <BaseIcon :icon="searchValue ? 'search-x' : 'users'" :size="48" class="empty-icon" />
          <h3 class="empty-title">
            {{ searchValue ? 'Пользователи не найдены' : 'Нет пользователей' }}
          </h3>
          <p class="empty-description">
            {{
              searchValue
                ? `Попробуйте изменить поисковый запрос "${searchValue}"`
                : 'Начните с добавления первого пользователя'
            }}
          </p>
          <BaseButton
            v-if="!searchValue"
            variant="primary"
            left-icon="plus"
            @click="showCreateDialog = true"
          >
            Добавить пользователя
          </BaseButton>
        </div>
      </template>
    </EnhancedBaseTable>

    <!-- Диалог создания пользователя -->
    <div v-if="showCreateDialog" class="dialog-overlay" @click="showCreateDialog = false">
      <div class="dialog-content" @click.stop>
        <h2>Добавить нового пользователя</h2>
        <p>Здесь будет форма создания пользователя...</p>
        <div class="dialog-actions">
          <BaseButton variant="ghost" @click="showCreateDialog = false"> Отмена </BaseButton>
          <BaseButton variant="primary" @click="createUser"> Создать </BaseButton>
        </div>
      </div>
    </div>

    <!-- Диалог просмотра пользователя -->
    <div
      v-if="selectedUser && showViewDialog"
      class="dialog-overlay"
      @click="showViewDialog = false"
    >
      <div class="dialog-content" @click.stop>
        <h2>Информация о пользователе</h2>
        <div class="user-details">
          <div class="user-header">
            <div class="user-avatar large">
              <img
                v-if="selectedUser.avatar"
                :src="selectedUser.avatar"
                :alt="selectedUser.name"
                class="avatar-image"
              />
              <div v-else class="avatar-placeholder">
                {{ getInitials(selectedUser.name) }}
              </div>
            </div>
            <div class="user-info">
              <h3>{{ selectedUser.name }}</h3>
              <p>{{ selectedUser.email }}</p>
              <span :class="getStatusClass(selectedUser.status)" class="status-badge">
                {{ getStatusText(selectedUser.status) }}
              </span>
            </div>
          </div>

          <div class="user-details-grid">
            <div class="detail-item">
              <label>Роль:</label>
              <span>{{ getRoleText(selectedUser.role) }}</span>
            </div>
            <div class="detail-item">
              <label>Дата регистрации:</label>
              <span>{{ formatDate(selectedUser.createdAt) }}</span>
            </div>
            <div class="detail-item">
              <label>Последний вход:</label>
              <span>{{
                selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Никогда'
              }}</span>
            </div>
            <div class="detail-item">
              <label>Департамент:</label>
              <span>{{ selectedUser.department || 'Не указан' }}</span>
            </div>
          </div>
        </div>

        <div class="dialog-actions">
          <BaseButton variant="ghost" @click="showViewDialog = false"> Закрыть </BaseButton>
          <BaseButton variant="primary" @click="editUser(selectedUser)"> Редактировать </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import EnhancedBaseTable from '@/components/ui/BaseTable.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'moderator'
  status: 'active' | 'inactive' | 'pending'
  avatar?: string
  createdAt: string
  lastLogin?: string
  department?: string
}

// Состояние данных
const tableData = ref<User[]>([])
const loading = ref(false)
const searchLoading = ref(false)
const sortLoading = ref(false)
const paginationLoading = ref(false)

// Параметры пагинации
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const filteredItems = ref(0)

// Параметры сортировки
const sortBy = ref<string>('')
const sortDirection = ref<'asc' | 'desc' | false>(false)

// Параметры поиска и фильтрации
const searchQuery = ref('')
const statusFilter = ref('')
const roleFilter = ref('')

// Диалоги
const showCreateDialog = ref(false)
const showViewDialog = ref(false)
const selectedUser = ref<User | null>(null)

// Конфигурация колонок
const columns: ColumnDef<User>[] = [
  {
    id: 'avatar',
    header: '',
    accessorKey: 'avatar',
    size: 60,
    enableSorting: false,
  },
  {
    id: 'name',
    header: 'Имя',
    accessorKey: 'name',
    size: 200,
  },
  {
    id: 'email',
    header: 'Email',
    accessorKey: 'email',
    size: 250,
  },
  {
    id: 'role',
    header: 'Роль',
    accessorKey: 'role',
    size: 120,
    cell: ({ getValue }) => getRoleText(getValue() as string),
  },
  {
    id: 'status',
    header: 'Статус',
    accessorKey: 'status',
    size: 120,
  },
  {
    id: 'createdAt',
    header: 'Дата регистрации',
    accessorKey: 'createdAt',
    size: 150,
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
  {
    id: 'lastLogin',
    header: 'Последний вход',
    accessorKey: 'lastLogin',
    size: 150,
    cell: ({ getValue }) => {
      const value = getValue() as string | undefined
      return value ? formatDate(value) : 'Никогда'
    },
  },
  {
    id: 'actions',
    header: 'Действия',
    size: 140,
    enableSorting: false,
  },
]

// Методы API
const fetchData = async () => {
  loading.value = true
  try {
    // Имитация API запроса
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Генерируем тестовые данные
    const mockUsers = generateMockUsers()

    // Применяем фильтры и поиск на стороне сервера
    let filteredUsers = mockUsers

    if (searchQuery.value) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.value.toLowerCase()),
      )
    }

    if (statusFilter.value) {
      filteredUsers = filteredUsers.filter((user) => user.status === statusFilter.value)
    }

    if (roleFilter.value) {
      filteredUsers = filteredUsers.filter((user) => user.role === roleFilter.value)
    }

    // Применяем сортировку
    if (sortBy.value && sortDirection.value) {
      filteredUsers.sort((a, b) => {
        const aValue = a[sortBy.value as keyof User] as string
        const bValue = b[sortBy.value as keyof User] as string

        const comparison = aValue.localeCompare(bValue)
        return sortDirection.value === 'asc' ? comparison : -comparison
      })
    }

    // Обновляем счетчики
    totalItems.value = mockUsers.length
    filteredItems.value = filteredUsers.length

    // Применяем пагинацию
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    tableData.value = filteredUsers.slice(start, end)
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  } finally {
    loading.value = false
    searchLoading.value = false
    sortLoading.value = false
    paginationLoading.value = false
  }
}

const generateMockUsers = (): User[] => {
  const names = [
    'Алексей Иванов',
    'Мария Петрова',
    'Дмитрий Сидоров',
    'Елена Козлова',
    'Андрей Морозов',
    'Ольга Волкова',
    'Сергей Лебедев',
    'Наталья Соколова',
    'Владимир Попов',
    'Татьяна Новикова',
    'Игорь Федоров',
    'Анна Михайлова',
  ]

  const departments = ['IT', 'HR', 'Финансы', 'Маркетинг', 'Продажи', 'Поддержка']
  const roles = ['admin', 'user', 'moderator'] as const
  const statuses = ['active', 'inactive', 'pending'] as const

  return Array.from({ length: 127 }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length],
    email: `user${i + 1}@company.com`,
    role: roles[Math.floor(Math.random() * roles.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    avatar: Math.random() > 0.7 ? `https://i.pravatar.cc/40?img=${(i % 70) + 1}` : undefined,
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin:
      Math.random() > 0.3
        ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
    department: departments[Math.floor(Math.random() * departments.length)],
  }))
}

// Обработчики событий таблицы
const handleSearch = async (query: string) => {
  searchLoading.value = true
  searchQuery.value = query
  currentPage.value = 1
  await fetchData()
}

const handleSearchClear = async () => {
  searchLoading.value = true
  searchQuery.value = ''
  currentPage.value = 1
  await fetchData()
}

const handleSortChange = async (column: string, direction: 'asc' | 'desc' | false) => {
  sortLoading.value = true
  sortBy.value = column
  sortDirection.value = direction
  await fetchData()
}

const handlePageChange = async (page: number) => {
  paginationLoading.value = true
  currentPage.value = page
  await fetchData()
}

const handlePageSizeChange = async (size: number) => {
  paginationLoading.value = true
  pageSize.value = size
  currentPage.value = 1
  await fetchData()
}

const handleRowClick = (row: any) => {
  selectedUser.value = row.original
  showViewDialog.value = true
}

const applyFilters = async () => {
  loading.value = true
  currentPage.value = 1
  await fetchData()
}

// Действия с пользователями
const viewUser = (user: User) => {
  selectedUser.value = user
  showViewDialog.value = true
}

const editUser = (user: User) => {
  console.log('Редактирование пользователя:', user)
  showViewDialog.value = false
}

const deleteUser = async (user: User) => {
  if (confirm(`Вы уверены, что хотите удалить пользователя ${user.name}?`)) {
    console.log('Удаление пользователя:', user)
    await fetchData()
  }
}

const createUser = () => {
  console.log('Создание пользователя')
  showCreateDialog.value = false
}

const exportData = () => {
  console.log('Экспорт данных')
}

// Вспомогательные функции
const getStatusClass = (status: string) => {
  const classes = {
    active: 'status-active',
    inactive: 'status-inactive',
    pending: 'status-pending',
  }
  return classes[status as keyof typeof classes] || ''
}

const getStatusText = (status: string) => {
  const texts = {
    active: 'Активен',
    inactive: 'Неактивен',
    pending: 'Ожидает',
  }
  return texts[status as keyof typeof texts] || status
}

const getRoleText = (role: string) => {
  const texts = {
    admin: 'Администратор',
    user: 'Пользователь',
    moderator: 'Модератор',
  }
  return texts[role as keyof typeof texts] || role
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Инициализация
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.table-example {
  padding: var(--ds-spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
}

/* Фильтры */
.filter-select {
  padding: var(--ds-spacing-sm) var(--ds-spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md);
  background-color: var(--ds-surface);
  color: var(--ds-text-primary);
  font-size: var(--ds-font-size-sm);
  min-width: 150px;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: var(--ds-border-focus);
}

/* Статусы */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--ds-spacing-xs) var(--ds-spacing-sm);
  border-radius: var(--ds-radius-full);
  font-size: var(--ds-font-size-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-active {
  background-color: #dcfce7;
  color: #166534;
}

.status-inactive {
  background-color: #f3f4f6;
  color: #374151;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

/* Аватары */
.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--ds-radius-full);
  overflow: hidden;
}

.user-avatar.large {
  width: 64px;
  height: 64px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--ds-button-primary-bg);
  color: var(--ds-button-primary-text);
  font-size: var(--ds-font-size-xs);
  font-weight: 600;
}

.user-avatar.large .avatar-placeholder {
  font-size: var(--ds-font-size-lg);
}

/* Действия в таблице */
.table-actions {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-xs);
}

.text-red-600 {
  color: #dc2626 !important;
}

/* Диалоги */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--ds-spacing-lg);
}

.dialog-content {
  background-color: var(--ds-surface);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-spacing-xl);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.dialog-content h2 {
  margin: 0 0 var(--ds-spacing-lg) 0;
  color: var(--ds-text-primary);
  font-size: var(--ds-font-size-xl);
  font-weight: 600;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--ds-spacing-md);
  margin-top: var(--ds-spacing-xl);
}

/* Детали пользователя */
.user-details {
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-lg);
}

.user-header {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-lg);
}

.user-info h3 {
  margin: 0 0 var(--ds-spacing-xs) 0;
  font-size: var(--ds-font-size-lg);
  font-weight: 600;
  color: var(--ds-text-primary);
}

.user-info p {
  margin: 0 0 var(--ds-spacing-sm) 0;
  color: var(--ds-text-secondary);
}

.user-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--ds-spacing-md);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-xs);
}

.detail-item label {
  font-size: var(--ds-font-size-xs);
  font-weight: 600;
  color: var(--ds-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.detail-item span {
  color: var(--ds-text-primary);
}

/* Кастомное пустое состояние */
.custom-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--ds-spacing-xl);
  text-align: center;
  gap: var(--ds-spacing-md);
}

.empty-icon {
  opacity: 0.3;
}

.empty-title {
  font-size: var(--ds-font-size-lg);
  font-weight: 600;
  color: var(--ds-text-primary);
  margin: 0;
}

.empty-description {
  color: var(--ds-text-secondary);
  margin: 0;
  max-width: 400px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .user-header {
    flex-direction: column;
    text-align: center;
  }

  .user-details-grid {
    grid-template-columns: 1fr;
  }

  .dialog-content {
    margin: var(--ds-spacing-md);
    max-width: none;
  }
}
</style>
