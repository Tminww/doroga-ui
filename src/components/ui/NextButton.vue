<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import { type BaseButtonProps } from './BaseButton.vue'

const props = withDefaults(defineProps<BaseButtonProps>(), {
  rightIcon: 'chevron-right',
  variant: 'secondary',
  tooltipSide: 'bottom',
  title: 'Следующая',
  size: 'md',
})
</script>
<template>
  <BaseButton
    :icon-only="iconOnly"
    :left-icon="leftIcon"
    :right-icon="rightIcon"
    :variant="variant"
    :tooltip="tooltip"
    :tooltip-side="tooltipSide"
    :size="size"
    :disabled="disabled"
    :title="title"
  />
</template>
