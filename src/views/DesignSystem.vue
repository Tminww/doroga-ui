<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import { ref } from 'vue'

const nameLucideIcons = [
  'filter',
  'plus',
  'download',
  'settings',
  'search',
  'trending-up',
  'x',
  'menu',
  'layout-dashboard',
  'file-text',
  'test-tube',
  'scroll-text',
  'target',
  'beaker',
  'chevron-down',
  'bell',
  'user',
  'chevron-left',
  'chevron-right',
  'refresh-cw',
  'alert-triangle',
  'trending-down',
  'activity',
  'users',
  'edit',
]

const iconSize = ref(20)
const iconColor = ref("")
</script>
<template>
  <div class="component-demo">
    <h3 class="component-demo-title">Иконки</h3>
    size <input type="number" v-model="iconSize" />
    color <input type="text" v-model="iconColor"></input>
    <div class="icons-grid">
<div class="icon-item" v-for="icon in nameLucideIcons" :key="icon">
      <div class="icon-preview">
<BaseIcon :icon="icon" :size="iconSize" :color="iconColor" />
      </div>
      <div class="icon-info">
        <div class="icon-name">{{ icon }}</div>
        <div class="icon-description"></div>
      </div>
      
    </div>
    </div>
    
  </div>
  <div class="component-demo">
    <h3 class="component-demo-title">Кнопки</h3>
    <p class="component-demo-description">Различные цвета</p>
    <div class="component-demo-content">
      <BaseButton title="primary" variant="primary" />
      <BaseButton title="secondary" variant="secondary" />
      <BaseButton title="success" variant="success" />
      <BaseButton title="warning" variant="warning" />
      <BaseButton title="danger" variant="danger" />
    </div>
  </div>
  <div class="component-demo">
    <h3 class="component-demo-title">Кнопки</h3>
    <p class="component-demo-description">Disabled</p>
    <div class="component-demo-content">
      <BaseButton title="disabled" variant="primary" :disabled="true" />
      <BaseButton title="disabled" variant="secondary" :disabled="true" />
      <BaseButton title="disabled" variant="success" :disabled="true" />
      <BaseButton title="disabled" variant="warning" :disabled="true" />
      <BaseButton title="disabled" variant="danger" :disabled="true" />
    </div>
  </div>
  <div class="component-demo">
    <h3 class="component-demo-title">Кнопки</h3>
    <p class="component-demo-description">Растягиваются по ширине</p>
    <div class="component-demo-content">
      <BaseButton title=":full-width='true'" variant="primary" :full-width="true" />
      <BaseButton
        title=":full-width='true'"
        variant="secondary"
        :disabled="true"
        :full-width="true"
      />
      <BaseButton
        title=":full-width='true'"
        variant="success"
        :disabled="true"
        :full-width="true"
      />
      <BaseButton
        title=":full-width='true'"
        variant="warning"
        :disabled="true"
        :full-width="true"
      />
      <BaseButton title=":full-width='true'" variant="danger" :disabled="true" :full-width="true" />
    </div>
  </div>
  <div class="component-demo">
    <h3 class="component-demo-title">Кнопки</h3>
    <p class="component-demo-description">C SVG иконками</p>
    <div class="component-demo-content">
      <BaseButton title="Поиск" left-icon="search" variant="primary" />
      <BaseButton title="secondary" left-icon="filter" variant="secondary" />
      <BaseButton title="success" right-icon="plus" variant="success" />
      <BaseButton
        title="warning"
        left-icon="alert-triangle"
        right-icon="chevron-right"
        variant="warning"
      />
      <BaseButton title="danger" right-icon="x" variant="danger" />
    </div>
  </div>
  <div class="component-demo">
    <h3 class="component-demo-title">Кнопки</h3>
    <p class="component-demo-description">В виде иконок</p>
    <div class="component-demo-content">
      <BaseButton :icon-only="true" left-icon="settings" variant="primary"/>
      <BaseButton :icon-only="true" left-icon="settings" variant="secondary"/>
      <BaseButton :icon-only="true" left-icon="settings" variant="success"/>
      <BaseButton :icon-only="true" left-icon="settings" variant="warning"/>
      <BaseButton :icon-only="true" left-icon="settings" variant="danger"/>

    </div>
  </div>
  <div class="component-demo">
    <h3 class="component-demo-title">Кнопки для приложения</h3>
    <div class="component-demo-content">
      <BaseButton title="Экспорт" left-icon="download" variant="secondary" size="lg"/>
      <BaseButton title="Добавить" left-icon="plus"  size="lg"/>
      <BaseButton :icon-only="true" left-icon="settings" variant="success"/>
      <BaseButton :icon-only="true" left-icon="settings" variant="warning"/>
      <BaseButton :icon-only="true" left-icon="settings" variant="danger"/>

    </div>
  </div>
</template>
<style scoped>
.component-demo {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
}
.component-demo-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}
.component-demo-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}
.component-demo-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.icons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}

.icon-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    background: white;
    transition: all 0.2s;
}
.icon-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    background-color: #f3f4f6;
    border-radius: 0.5rem;
    color: #374151;
    flex-shrink: 0;
}
.icon-info {
    flex: 1;
}
.icon-name {
    font-family: "Courier New", monospace;
    font-size: 0.875rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
}
.icon-description {
    font-size: 0.75rem;
    color: #6b7280;
    line-height: 1.4;
}
</style>
