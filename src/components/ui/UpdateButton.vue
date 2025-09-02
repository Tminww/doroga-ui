<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import { type BaseButtonProps } from './BaseButton.vue'

const props = withDefaults(defineProps<BaseButtonProps>(), {
  leftIcon: 'refresh-cw',
  variant: 'secondary',
  tooltipSide: 'bottom',
  tooltip: 'Обновить данные',
  title: 'Обновить',
  size: 'lg',
})
</script>
<template>
  <BaseButton
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
