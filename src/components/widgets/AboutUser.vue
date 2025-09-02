<script setup lang="ts">
import { computed } from 'vue'
import BaseAvatar from '../ui/BaseAvatar.vue'

const props = withDefaults(
  defineProps<{
    name?: string // Имя
    lastName?: string // Фамилия
    middleName?: string // Отчество
    role?: string // Роль
  }>(),
  {
    name: 'Серафим',
    lastName: 'Олейник',
    middleName: 'Сергеевич',
    role: 'Администратор',
  },
)

const shortName = computed(() => {
  return `${props.name[0].toUpperCase()}${props.lastName[0].toUpperCase()}`
})
</script>

<template>
  <div class="about-user">
    <div class="container">
      <div class="name">{{ name }} {{ lastName }}</div>
      <div class="role">{{ role }}</div>
    </div>
    <BaseAvatar class="avatar" :shortName="shortName" />
  </div>
</template>

<style scoped>
.about-user {
  display: flex;
  align-items: center;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: end;
  border-left: 1px solid var(--ds-border);
  padding-left: 10px;
}

.name {
  font-size: var(--ds-font-size-sm);
  font-weight: 600;
}

.role {
  font-size: var(--ds-font-size-xs);
  color: var(--ds-text-secondary);
}

.avatar {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
