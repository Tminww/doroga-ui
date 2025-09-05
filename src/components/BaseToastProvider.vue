<script setup lang="ts">
import { ToastProvider } from 'reka-ui'

interface BaseToastProviderProps {
  duration?: number
}

const props = withDefaults(defineProps<BaseToastProviderProps>(), {
  duration: 3000,
})
</script>

<template>
  <ToastProvider :duration="duration">
    <slot> </slot>
  </ToastProvider>
</template>
