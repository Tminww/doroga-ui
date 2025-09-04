<script setup lang="ts">
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { computed, onMounted, ref } from 'vue'

interface BaseProgressProps {
  progressValue: number
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
  max?: number
  rounded?: 'buttom' | 'top' | 'full'
}

const props = withDefaults(defineProps<BaseProgressProps>(), {
  progressValue: 0,
  variant: 'primary',
  max: 100,

  rounded: 'full',
})

const progressRootClasses = computed(() => [
  'progress-root rounded',
  props.rounded === 'full' ? 'rounded' : '',
])

const progressIndicatorClasses = computed(() => ['progress-indicator', `${props.variant}`])
</script>

<template>
  <ProgressRoot
    :max
    :model-value="progressValue"
    :class="progressRootClasses"
    style="transform: translateZ(0)"
  >
    <ProgressIndicator
      :class="progressIndicatorClasses"
      :style="`transform: translateX(-${max - progressValue}%)`"
    />
  </ProgressRoot>
</template>

<style scoped>
.progress-root {
  position: relative;
  overflow: hidden;
  background: transparent;
  width: 100%;
  height: 2px;
  border-radius: var(--ds-radius-md);

  /* Fix overflow clipping in Safari */
  /* https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0 */
  transform: translateZ(0);
}

.progress-indicator {
  background-color: transparent;
  width: 100%;
  height: 100%;
  transition: transform 660ms cubic-bezier(0.65, 0, 0.35, 1);
  transform-origin: left center;

  animation: progress-animation 3 linear forwards;
}

.progress-indicator.primary {
  background-color: var(--ds-primary-500);
}

.progress-indicator.warning {
  background-color: var(--ds-warning-500);
}

.progress-indicator.success {
  background-color: var(--ds-success-500);
}
.progress-indicator.danger {
  background-color: var(--ds-danger-500);
}

.progress-indicator.secondary {
  background-color: var(--ds-gray-500);
}

@keyframes progress-animation {
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
}
</style>
