<script setup lang="ts">
import BasePopover from '../ui/BasePopover.vue'
import BaseButton from '../ui/BaseButton.vue'
import NotificationBadge from '../ui/NotificationBadge.vue'
import { ref } from 'vue'
import BaseInput from '../ui/BaseInput.vue'

interface TableFilterProps {
  type?: 'text' | 'number' | 'date' | 'boolean'
  value?: string | number | boolean
  name?: string
}

const props = defineProps<TableFilterProps>()
const emit = defineEmits<{
  (e: 'update:filter', value: string | number | boolean): void
}>()
// Обработчик ввода
const inputValue = ref(props.value)

const handleInput = () => {
  emit('update:filter', inputValue.value)
}

const handleClear = () => {
  inputValue.value = null
  emit('update:filter', inputValue.value)
}
</script>

<template>
  <BasePopover>
    <NotificationBadge :has-notification="value ? true : false">
      <BaseButton icon-only :icon-size="16" variant="ghost" size="sm" left-icon="filter" />
    </NotificationBadge>

    <template #content>
      <BaseInput :label="name" :type v-model="inputValue" size="sm" clearable />
    </template>
    <template #close>
      <BaseButton title="Очистить" size="sm" variant="danger" @click="handleClear" />
      <BaseButton title="Применить" size="sm" @click="handleInput"
    /></template>
  </BasePopover>
</template>
