<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import { type BaseButtonProps } from './BaseButton.vue'

interface SettingsButtonProps extends BaseButtonProps {
  // Add any new props specific to SettingsButton here
  isCollapsed?: boolean
}

const props = withDefaults(defineProps<SettingsButtonProps>(), {
  leftIcon: 'beaker',
  variant: 'secondary',
  tooltipSide: 'right',
  title: 'Направления',
  tooltip: 'Направления',
  size: 'md',
  active: false, // добавить эту строку
  isCollapsed: false, // добавить эту строку
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
<template>
  <BaseButton
    @click="$emit('click', $event)"
    :icon-only="iconOnly"
    :icon-size="18"
    :left-icon="leftIcon"
    :variant="isCollapsed ? 'secondary' : 'ghost'"
    :align="isCollapsed ? 'center' : 'left'"
    :tooltip="isCollapsed ? tooltip : ''"
    :tooltip-side="tooltipSide"
    :size="size"
    :disabled="disabled"
    :title="isCollapsed ? '' : title"
    :active="active"
  />
</template>
