<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import { type BaseButtonProps } from './BaseButton.vue'

const props = withDefaults(defineProps<BaseButtonProps>(), {
  leftIcon: 'chevron-left',
  variant: 'secondary',
  tooltipSide: 'bottom',
  title: 'Предыдущая',
  size: 'md',
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
