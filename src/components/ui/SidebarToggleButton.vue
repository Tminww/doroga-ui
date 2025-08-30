<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import { type BaseButtonProps } from './BaseButton.vue'

interface SettingsButtonProps extends BaseButtonProps {
  // Add any new props specific to SettingsButton here
  isCollapsed?: boolean
}

const props = withDefaults(defineProps<SettingsButtonProps>(), {
  iconOnly: true,
  leftIcon: 'bell',
  variant: 'ghost',
  isCollapsed: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
<template>
  <BaseButton
    @click="$emit('click', $event)"
    :icon-size="24"
    :icon-only="iconOnly"
    :left-icon="isCollapsed ? 'panel-left-open' : 'panel-left-close'"
    :variant="variant"
    :tooltip="tooltip"
    :tooltip-side="tooltipSide"
    :size="size"
    :disabled="disabled"
  />
</template>
