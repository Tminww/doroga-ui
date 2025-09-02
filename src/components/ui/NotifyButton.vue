<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import { type BaseButtonProps } from './BaseButton.vue'

const props = withDefaults(defineProps<BaseButtonProps>(), {
  iconOnly: true,
  leftIcon: 'bell',
  variant: 'secondary',
  tooltipSide: 'bottom',
  tooltip: 'Уведомления',
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
  />
</template>
