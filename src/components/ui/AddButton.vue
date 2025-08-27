<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import { type BaseButtonProps } from './BaseButton.vue'

const props = withDefaults(defineProps<BaseButtonProps>(), {
  leftIcon: 'plus',
  variant: 'primary',
  tooltipSide: 'bottom',
  tooltip: 'Добавить',
  title: 'Добавить',
  size: 'lg',
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
<template>
  <BaseButton
    @click="$emit('click', $event)"
    :icon-only="iconOnly"
    :left-icon="leftIcon"
    :variant="variant"
    :tooltip="tooltip"
    :tooltip-side="tooltipSide"
    :size="size"
    :disabled="disabled"
    :title="title"
  />
</template>
