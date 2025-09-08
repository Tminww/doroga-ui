<template>
  <div class="icon-container">
    <slot></slot>
    <!-- Здесь размещается иконка -->
    <div v-if="hasNotification" class="notification-badge"></div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

interface NotificationBadgeProps {
  hasNotification: boolean
}
withDefaults(defineProps<NotificationBadgeProps>(), { hasNotification: false })
</script>

<style scoped>
.icon-container {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.notification-badge {
  position: absolute;
  right: 3px;
  top: 3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;

  background-color: red;
}
</style>
