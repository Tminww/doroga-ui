<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import { type BaseButtonProps } from './BaseButton.vue'

const props = withDefaults(defineProps<BaseButtonProps>(), {
  variant: 'secondary',
  tooltipSide: 'left',
  title: 'Подробнее',
  size: 'sm',
})
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
