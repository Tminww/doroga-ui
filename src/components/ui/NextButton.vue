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

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
<template>
  <BaseButton
    @click="$emit('click', $event)"
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
