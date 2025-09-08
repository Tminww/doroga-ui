<script setup lang="ts">
import BasePopover from '../ui/BasePopover.vue'
import BaseButton from '../ui/BaseButton.vue'
import NotificationBadge from '../ui/NotificationBadge.vue'
import { ref } from 'vue'

interface TableFilterProps {
  type?: 'text' | 'number' | 'date' | 'boolean'
  value?: string | number | boolean
}

const props = defineProps<TableFilterProps>()
const emit = defineEmits<{
  (e: 'update:filter', value: string | number | boolean): void
}>()
// Обработчик ввода
const inputValue = ref(props.value)

const handleInput = (event: Event) => {
  emit('update:filter', inputValue.value)
}
</script>

<template>
  <BasePopover title="Фильтр">
    <NotificationBadge :has-notification="value ? true : false">
      <BaseButton icon-only :icon-size="16" variant="ghost" size="sm" left-icon="filter" />
    </NotificationBadge>

    <template #content>
      <input :type v-model="inputValue" /> <input type="submit" @click.prevent="handleInput"
    /></template>
  </BasePopover>
</template>
