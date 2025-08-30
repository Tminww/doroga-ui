<template>
  <DesignSystemProvider>
    <div class="design-system">
      <!-- Поля ввода -->
      <section class="component-demo">
        <h3 class="component-demo-title">Поля ввода - Варианты</h3>
        <div class="inputs-grid">
          <BaseInput
            label="Поиск"
            placeholder="Введите запрос..."
            left-icon="search"
            clearable
            tooltip="Поиск по базе данных"
          />

          <BaseInput
            type="email"
            label="Email"
            placeholder="example@domain.com"
            left-icon="user"
            required
            tooltip="Введите ваш email адрес"
          />

          <BaseInput
            type="password"
            label="Пароль"
            placeholder="••••••••"
            required
            tooltip="Минимум 8 символов"
          />

          <BaseInput
            type="number"
            label="Количество"
            placeholder="0"
            right-icon="target"
            tooltip="Укажите количество товара"
          />
        </div>
      </section>

      <!-- Поля ввода - Размеры -->
      <section class="component-demo">
        <h3 class="component-demo-title">Поля ввода - Размеры</h3>
        <div class="inputs-grid">
          <BaseInput label="Small" placeholder="Small input" size="sm" left-icon="search" />

          <BaseInput label="Medium" placeholder="Medium input" size="md" left-icon="search" />

          <BaseInput label="Large" placeholder="Large input" size="lg" left-icon="search" />
        </div>
      </section>

      <!-- Поля ввода - Состояния -->
      <section class="component-demo">
        <h3 class="component-demo-title">Поля ввода - Состояния</h3>
        <div class="inputs-grid">
          <BaseInput
            label="Обычное поле"
            placeholder="Введите текст..."
            tooltip="Обычное состояние поля"
          />

          <BaseInput
            label="Заблокированное поле"
            placeholder="Заблокировано"
            disabled
            tooltip="Поле недоступно для редактирования"
          />

          <BaseInput
            label="Только чтение"
            model-value="Только для чтения"
            readonly
            tooltip="Поле только для чтения"
          />

          <BaseInput
            label="С ошибкой"
            placeholder="Введите корректное значение"
            error="Это поле обязательно для заполнения"
            tooltip="Поле с ошибкой валидации"
          />

          <BaseInput
            label="С подсказкой"
            placeholder="username"
            hint="Используйте только латинские буквы и цифры"
            tooltip="Поле с полезной подсказкой"
          />
        </div>
      </section>

      <!-- Практические примеры с полями -->
      <section class="component-demo">
        <h3 class="component-demo-title">Практические примеры с полями</h3>
        <div class="practical-examples">
          <div class="example">
            <h4>Форма входа</h4>
            <div class="example-content login-form">
              <BaseInput
                type="email"
                label="Email"
                placeholder="your@email.com"
                left-icon="user"
                required
                tooltip="Ваш email для входа в систему"
              />

              <BaseInput
                type="password"
                label="Пароль"
                placeholder="••••••••"
                required
                tooltip="Пароль должен содержать минимум 8 символов"
              />

              <div class="form-actions">
                <BaseButton
                  title="Войти"
                  variant="primary"
                  type="submit"
                  :full-width="true"
                  tooltip="Войти в систему"
                />
              </div>
            </div>
          </div>

          <div class="example">
            <h4>Панель поиска</h4>
            <div class="example-content search-panel">
              <BaseInput
                placeholder="Поиск товаров..."
                left-icon="search"
                clearable
                size="lg"
                tooltip="Поиск по названию, артикулу или описанию"
              />

              <BaseButton
                title="Фильтр"
                left-icon="filter"
                variant="secondary"
                size="lg"
                tooltip="Открыть дополнительные фильтры"
              />

              <BaseButton
                :icon-only="true"
                left-icon="settings"
                variant="secondary"
                size="lg"
                tooltip="Настройки поиска"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Цветовая палитра -->
      <section class="component-demo">
        <h3 class="component-demo-title">Цветовая палитра</h3>
        <div class="colors-grid">
          <div v-for="colorGroup in colorGroups" :key="colorGroup.name" class="color-group">
            <h4 class="color-group-title">{{ colorGroup.label }}</h4>
            <div class="color-swatches">
              <div
                v-for="shade in colorShades"
                :key="shade"
                class="color-swatch"
                :style="{ backgroundColor: `var(--ds-${colorGroup.name}-${shade})` }"
              >
                <div class="color-info">
                  <span class="color-shade">{{ shade }}</span>
                  <span class="color-var">--ds-{{ colorGroup.name }}-{{ shade }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Иконки -->
      <section class="component-demo">
        <h3 class="component-demo-title">Иконки</h3>
        <div class="controls">
          <label>
            Размер: <input type="number" v-model.number="iconSize" min="12" max="48" />
          </label>
          <label> Цвет: <input type="color" v-model="iconColor" /> </label>
          <label>
            Толщина линий:
            <input type="number" v-model.number="strokeWidth" min="1" max="4" step="0.5" />
          </label>
        </div>
        <div class="icons-grid">
          <div class="icon-item" v-for="iconName in availableIcons" :key="iconName">
            <div class="icon-preview">
              <BaseIcon
                :icon="iconName"
                :size="iconSize"
                :color="iconColor"
                :stroke-width="strokeWidth"
              />
            </div>
            <div class="icon-info">
              <div class="icon-name">{{ iconName }}</div>
              <code class="icon-usage">&lt;BaseIcon icon="{{ iconName }}" /&gt;</code>
            </div>
          </div>
        </div>
      </section>

      <!-- Кнопки - Варианты -->
      <section class="component-demo">
        <h3 class="component-demo-title">Кнопки - Варианты</h3>
        <div class="component-demo-content">
          <BaseButton title="Primary" variant="primary" />
          <BaseButton title="Secondary" variant="secondary" />
          <BaseButton title="Success" variant="success" />
          <BaseButton title="Warning" variant="warning" />
          <BaseButton title="Danger" variant="danger" />
          <BaseButton variant="ghost" title="Ghost Button" />
          <BaseButton variant="ghost" left-icon="settings" title="Settings" />
          <BaseButton variant="ghost" left-icon="menu" icon-only />
        </div>
      </section>

      <!-- Кнопки - Размеры -->
      <section class="component-demo">
        <h3 class="component-demo-title">Кнопки - Размеры</h3>
        <div class="component-demo-content">
          <BaseButton title="Small" size="sm" />
          <BaseButton title="Medium" size="md" />
          <BaseButton title="Large" size="lg" />
        </div>
      </section>

      <!-- Кнопки - Состояния -->
      <section class="component-demo">
        <h3 class="component-demo-title">Кнопки - Состояния</h3>
        <div class="component-demo-content">
          <BaseButton title="Normal" variant="primary" />
          <BaseButton title="Disabled" variant="primary" :disabled="true" />
          <BaseButton title="Full Width" variant="primary" :full-width="true" />
        </div>
      </section>

      <!-- Кнопки - С иконками -->
      <section class="component-demo">
        <h3 class="component-demo-title">Кнопки - С иконками</h3>
        <div class="component-demo-content">
          <BaseButton title="Поиск" left-icon="search" variant="primary" />
          <BaseButton title="Фильтр" left-icon="filter" variant="secondary" />
          <BaseButton title="Добавить" right-icon="plus" variant="success" />
          <BaseButton
            title="Экспорт"
            left-icon="download"
            right-icon="chevron-right"
            variant="secondary"
          />
        </div>
      </section>

      <!-- Иконочные кнопки -->
      <section class="component-demo">
        <h3 class="component-demo-title">Иконочные кнопки</h3>
        <div class="component-demo-content">
          <BaseButton :icon-only="true" left-icon="settings" variant="primary" size="sm" />
          <BaseButton :icon-only="true" left-icon="settings" variant="secondary" size="md" />
          <BaseButton :icon-only="true" left-icon="settings" variant="success" size="lg" />
          <BaseButton :icon-only="true" left-icon="edit" variant="warning" />
          <BaseButton :icon-only="true" left-icon="x" variant="danger" />
        </div>
      </section>

      <!-- Практические примеры -->
      <section class="component-demo">
        <h3 class="component-demo-title">Практические примеры</h3>
        <div class="practical-examples">
          <div class="example">
            <h4>Панель действий</h4>
            <div class="example-content">
              <SettingsButton @click="console.log('SETTINGS CLICK')" />
              <NotifyButton @click="console.log('Notify CLICK')" />
              <AddButton @click="console.log('ADD CLICK')" />
              <ExportButton @click="console.log('EXPORT CLICK')" />
              <FilterButton @click="console.log('FILTER CLICK')" />
              <UpdateButton @click="console.log('Update CLICK')" />
              <ActionButton @click="console.log('ACTION CLICK')" />
              <PrevButton @click="console.log('PREV CLICK')" />
              <NextButton @click="console.log('NEXT CLICK')" />
            </div>
            <div class="example-content">
              <SidebarButton />
            </div>
          </div>

          <div class="example">
            <h4>Форма с кнопками</h4>
            <div class="example-content form-actions">
              <BaseButton title="Отмена" variant="secondary" />
              <BaseButton title="Сохранить" variant="primary" type="submit" />
            </div>
          </div>

          <div class="example">
            <h4>Карточка товара</h4>
            <div class="example-content card-actions">
              <BaseButton title="В корзину" left-icon="plus" variant="success" :full-width="true" />
              <div class="card-secondary-actions">
                <BaseButton :icon-only="true" left-icon="user" variant="secondary" />
                <BaseButton :icon-only="true" left-icon="settings" variant="secondary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Типографика -->
      <section class="component-demo">
        <h3 class="component-demo-title">Типографика</h3>
        <div class="typography-demo">
          <div class="typography-item" v-for="fontSize in fontSizes" :key="fontSize">
            <span class="typography-label">{{ fontSize }}</span>
            <span
              class="typography-example"
              :style="{ fontSize: `var(--ds-font-size-${fontSize})` }"
            >
              The quick brown fox jumps over the lazy dog
            </span>
          </div>
        </div>
      </section>

      <!-- Спейсинг -->
      <section class="component-demo">
        <h3 class="component-demo-title">Спейсинг</h3>
        <div class="spacing-demo">
          <div class="spacing-item" v-for="spacing in spacingSizes" :key="spacing">
            <span class="spacing-label">{{ spacing }}</span>
            <div
              class="spacing-example"
              :style="{
                width: `var(--ds-spacing-${spacing})`,
                height: `var(--ds-spacing-${spacing})`,
              }"
            ></div>
            <code class="spacing-var">--ds-spacing-{{ spacing }}</code>
          </div>
        </div>
      </section>

      <!-- Границы и тени -->
      <section class="component-demo">
        <h3 class="component-demo-title">Границы и тени</h3>
        <div class="effects-demo">
          <div class="effects-group">
            <h4>Border Radius</h4>
            <div class="radius-examples">
              <div v-for="radius in borderRadii" :key="radius" class="radius-item">
                <div
                  class="radius-example"
                  :style="{ borderRadius: `var(--ds-radius-${radius})` }"
                ></div>
                <span class="radius-label"> {{ `--ds-radius-${radius}` }} </span>
              </div>
            </div>
          </div>

          <div class="effects-group">
            <h4>Shadows</h4>
            <div class="shadow-examples">
              <div v-for="shadow in shadows" :key="shadow" class="shadow-item">
                <div
                  class="shadow-example"
                  :style="{
                    boxShadow: `var(--ds-shadow-${shadow})`,
                    borderRadius: 'var(--ds-radius-lg)',
                  }"
                ></div>
                <span class="shadow-label">{{ `--ds-shadow-${shadow}` }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="component-demo">
        <h3 class="component-demo-title">Layouts</h3>
        <div class="layout-demo">
          <BaseLayout />
        </div>
      </section>
      <section class="component-demo">
        <h3 class="component-demo-title">Таблицы</h3>
        <div class="component-demo-content">
          <BaseTable
            :data="tableData"
            :columns="tableColumns"
            title="Пользователи"
            searchable
            :page-size="20"
            @row-click="handleRowClick"
          >
            <template #actions>
              <BaseButton variant="primary">Добавить</BaseButton>
            </template>
          </BaseTable>
        </div>
      </section>
    </div>
  </DesignSystemProvider>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import DesignSystemProvider from '@/components/DesignSystemProvider.vue'
import { type IconName } from '@/components/ui/BaseIcon.vue'
import SettingsButton from '@/components/ui/SettingsButton.vue'
import NotifyButton from '@/components/ui/NotifyButton.vue'
import AddButton from '@/components/ui/AddButton.vue'
import ExportButton from '@/components/ui/ExportButton.vue'
import FilterButton from '@/components/ui/FilterButton.vue'
import UpdateButton from '@/components/ui/UpdateButton.vue'
import ActionButton from '@/components/ui/ActionButton.vue'
import PrevButton from '@/components/ui/PrevButton.vue'
import NextButton from '@/components/ui/NextButton.vue'
import SidebarButton from '@/components/ui/SidebarButton.vue'
import BaseLayout from '@/layouts/BaseLayout.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
// Данные для демонстрации

import { h } from 'vue'

const tableColumns = [
  {
    accessorKey: 'id',
    id: 'id',
    header: 'ID',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'name',
    id: 'name',
    header: 'Имя',
    cell: (info) => h('span', info.getValue()),
  },
  {
    accessorKey: 'email',
    id: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    id: 'role',
    header: 'Роль',
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: 'Дата регистрации',
  },
]

const tableData = ref([
  { id: 1, name: 'Иван Петров', email: 'ivan@example.com', role: 'Админ', createdAt: '2024-03-10' },
  {
    id: 2,
    name: 'Анна Смирнова',
    email: 'anna@example.com',
    role: 'Пользователь',
    createdAt: '2024-04-05',
  },
  {
    id: 3,
    name: 'Сергей Иванов',
    email: 'sergey@example.com',
    role: 'Модератор',
    createdAt: '2024-06-22',
  },
  {
    id: 4,
    name: 'Ольга Кузнецова',
    email: 'olga@example.com',
    role: 'Пользователь',
    createdAt: '2024-07-01',
  },
  {
    id: 5,
    name: 'Дмитрий Сидоров',
    email: 'dmitry@example.com',
    role: 'Пользователь',
    createdAt: '2024-08-15',
  },
])

const handleRowClick = (row: any) => {
  console.log('Клик по строке:', row)
}

const colorGroups = [
  { name: 'primary', label: 'Primary' },
  { name: 'gray', label: 'Gray' },
  { name: 'success', label: 'Success' },
  { name: 'warning', label: 'Warning' },
  { name: 'danger', label: 'Danger' },
]

const colorShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

const availableIcons: IconName[] = [
  'activity',
  'alert-triangle',
  'beaker',
  'bell',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'download',
  'edit',
  'file-text',
  'filter',
  'layout-dashboard',
  'menu',
  'plus',
  'refresh-cw',
  'scroll-text',
  'search',
  'settings',
  'target',
  'test-tube',
  'trending-down',
  'trending-up',
  'user',
  'users',
  'x',
]

const fontSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']
const spacingSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl']
const borderRadii = ['sm', 'md', 'lg', 'xl', 'full']
const shadows = ['sm', 'md', 'lg', 'xl']

// Интерактивные контролы для иконок
const iconSize = ref(24)
const iconColor = ref('#374151')
const strokeWidth = ref(2)
</script>

<style scoped>
.layout-demo {
  height: 100vh;
  overflow: hidden;
}
.design-system {
  margin: 0 auto;
  padding: var(--ds-spacing-2xl);
  background: var(--ds-background);
  color: var(--ds-text-primary);
  font-family: ui-sans-serif, system-ui, sans-serif;
}

.component-demo {
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-spacing-2xl);
  box-shadow: var(--ds-shadow-sm);
  margin-bottom: var(--ds-spacing-2xl);
}

.component-demo-title {
  font-size: var(--ds-font-size-xl);
  font-weight: 600;
  color: var(--ds-text-primary);
  margin-bottom: var(--ds-spacing-lg);
  border-bottom: 2px solid var(--ds-border);
  padding-bottom: var(--ds-spacing-sm);
}

.component-demo-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--ds-spacing-md);
}

/* Поля ввода */
.inputs-grid {
  display: grid;
  gap: var(--ds-spacing-lg);
  max-width: 400px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-lg);
  max-width: 300px;
  padding: var(--ds-spacing-2xl);
  background: var(--ds-surface-secondary);
  border-radius: var(--ds-radius-lg);
  border: 1px solid var(--ds-border);
}

.search-panel {
  display: flex;
  gap: var(--ds-spacing-md);
  align-items: flex-end;
  padding: var(--ds-spacing-lg);
  background: var(--ds-surface-secondary);
  border-radius: var(--ds-radius-md);
}

.search-panel .inputs-grid {
  flex: 1;
  max-width: none;
}

/* Цветовая палитра */
.colors-grid {
  display: grid;
  gap: var(--ds-spacing-2xl);
}

.color-group-title {
  font-size: var(--ds-font-size-lg);
  font-weight: 600;
  margin-bottom: var(--ds-spacing-md);
  color: var(--ds-text-primary);
}

.color-swatches {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--ds-spacing-sm);
}

.color-swatch {
  aspect-ratio: 1;
  border-radius: var(--ds-radius-md);
  border: 1px solid var(--ds-border);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: var(--ds-spacing-sm);
  position: relative;
  overflow: hidden;
}

.color-info {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border-radius: var(--ds-radius-sm);
  padding: var(--ds-spacing-xs);
  font-size: var(--ds-font-size-xs);
  text-align: center;
}

.color-shade {
  font-weight: 600;
  display: block;
}

.color-var {
  color: var(--ds-text-secondary);
  font-family: monospace;
  font-size: 10px;
}

/* Иконки */
.controls {
  display: flex;
  gap: var(--ds-spacing-lg);
  margin-bottom: var(--ds-spacing-lg);
  padding: var(--ds-spacing-lg);
  background: var(--ds-surface-secondary);
  border-radius: var(--ds-radius-md);
}

.controls label {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-sm);
  font-size: var(--ds-font-size-sm);
}

.controls input {
  padding: var(--ds-spacing-xs) var(--ds-spacing-sm);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-sm);
  font-size: var(--ds-font-size-sm);
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--ds-spacing-lg);
}

.icon-item {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-lg);
  padding: var(--ds-spacing-lg);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md);
  background: var(--ds-surface);
  transition: all 0.2s;
}

.icon-item:hover {
  border-color: var(--ds-border-secondary);
  box-shadow: var(--ds-shadow-sm);
}

.icon-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: var(--ds-surface-secondary);
  border-radius: var(--ds-radius-md);
  flex-shrink: 0;
}

.icon-info {
  flex: 1;
}

.icon-name {
  font-family: monospace;
  font-size: var(--ds-font-size-sm);
  font-weight: 600;
  color: var(--ds-text-primary);
  margin-bottom: var(--ds-spacing-xs);
}

.icon-usage {
  font-size: var(--ds-font-size-xs);
  color: var(--ds-text-secondary);
  background: var(--ds-surface-secondary);
  padding: var(--ds-spacing-xs) var(--ds-spacing-sm);
  border-radius: var(--ds-radius-sm);
  font-family: monospace;
}

/* Практические примеры */
.practical-examples {
  display: grid;
  gap: var(--ds-spacing-2xl);
}

.example h4 {
  font-size: var(--ds-font-size-lg);
  font-weight: 600;
  margin-bottom: var(--ds-spacing-md);
  color: var(--ds-text-primary);
}

.example-content {
  display: flex;
  gap: var(--ds-spacing-md);
  align-items: center;
}

.form-actions {
  justify-content: flex-end;
  padding: var(--ds-spacing-lg);
  background: var(--ds-surface-secondary);
  border-radius: var(--ds-radius-md);
}

.card-actions {
  flex-direction: column;
  gap: var(--ds-spacing-md);
  padding: var(--ds-spacing-lg);
  background: var(--ds-surface-secondary);
  border-radius: var(--ds-radius-md);
  max-width: 300px;
}

.card-secondary-actions {
  display: flex;
  gap: var(--ds-spacing-sm);
  justify-content: center;
}

/* Типографика */
.typography-demo {
  display: grid;
  gap: var(--ds-spacing-lg);
}

.typography-item {
  display: flex;
  align-items: baseline;
  gap: var(--ds-spacing-lg);
  padding: var(--ds-spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md);
}

.typography-label {
  font-family: monospace;
  font-size: var(--ds-font-size-sm);
  color: var(--ds-text-secondary);
  width: 3rem;
  flex-shrink: 0;
}

.typography-example {
  color: var(--ds-text-primary);
}

/* Спейсинг */
.spacing-demo {
  display: grid;
  gap: var(--ds-spacing-md);
}

.spacing-item {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-lg);
  padding: var(--ds-spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md);
}

.spacing-label {
  font-family: monospace;
  font-size: var(--ds-font-size-sm);
  width: 2rem;
  flex-shrink: 0;
}

.spacing-example {
  background: var(--ds-primary-500);
  border-radius: var(--ds-radius-sm);
}

.spacing-var {
  font-family: monospace;
  font-size: var(--ds-font-size-sm);
  color: var(--ds-text-secondary);
}

/* Эффекты */
.effects-demo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--ds-spacing-2xl);
}

.effects-group h4 {
  font-size: var(--ds-font-size-lg);
  font-weight: 600;
  margin-bottom: var(--ds-spacing-lg);
}

.radius-examples,
.shadow-examples {
  display: grid;
  gap: var(--ds-spacing-lg);
}

.radius-item,
.shadow-item {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-lg);
}

.radius-example,
.shadow-example {
  width: 3rem;
  height: 3rem;
  background: var(--ds-primary-500);
  flex-shrink: 0;
}

.radius-label,
.shadow-label {
  font-family: monospace;
  font-size: var(--ds-font-size-sm);
  color: var(--ds-text-secondary);
}

@media (max-width: 768px) {
  .design-system {
    padding: var(--ds-spacing-lg);
  }

  .component-demo {
    padding: var(--ds-spacing-lg);
  }

  .controls {
    flex-direction: column;
  }

  .effects-demo {
    grid-template-columns: 1fr;
  }

  .color-swatches {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }
}
</style>
