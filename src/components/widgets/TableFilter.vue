<script setup lang="ts">
import BasePopover from '../ui/BasePopover.vue'
import BaseButton from '../ui/BaseButton.vue'
import NotificationBadge from '../ui/NotificationBadge.vue'
import { ref } from 'vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseSelect from '../ui/BaseSelect.vue'

interface TableFilterProps {
  type?: 'text' | 'number' | 'date' | 'boolean'
  value?: string | number | boolean
  name?: string
}

interface Item {
  icon: IconName
  name: string
  value: 'system' | 'light' | 'dark'
}

const items: Item[] = [
  {
    icon: 'monitor',
    name: 'В начале',
    value: 'system',
  },
  {
    icon: 'sun',
    name: 'В конце',
    value: 'light',
  },
  {
    icon: 'moon',
    name: 'Содержит',
    value: 'dark',
  },
]

const selected = ref<Item>({
  icon: 'menu',
  name: 'Системная',
  value: 'system',
})

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
  <BaseSelect
    :items="items"
    v-model="selected"
    :icon-only="true"
    variant="secondary"
    tooltip="Цветовая тема"
    tooltip-side="bottom"
    :icon-size="14"
  />
</template>
