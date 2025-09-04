<script setup lang="ts">
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { computed, onMounted, ref } from 'vue'

interface BaseProgressProps {
  progressValue: number
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
  max?: number
  rounded?: 'buttom' | 'top' | 'full'
  animated?: boolean // добавляем prop для контроля анимации
}

const props = withDefaults(defineProps<BaseProgressProps>(), {
  progressValue: 0,
  variant: 'primary',
  max: 100,
  rounded: 'full',
  animated: false, // по умолчанию отключаем CSS анимацию
})

const progressRootClasses = computed(() => [
  'progress-root rounded',
  props.rounded === 'full' ? 'rounded' : '',
])

const progressIndicatorClasses = computed(() => [
  'progress-indicator',
  `${props.variant}`,
  props.animated ? 'animated' : '', // добавляем класс только если нужна анимация
])
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
  transition: transform 100ms ease-out; /* плавный переход для JS анимации */
  transform-origin: left center;
}

/* CSS анимация применяется только когда есть класс animated */
.progress-indicator.animated {
  animation: progress-animation 3s linear forwards;
  transition: none; /* отключаем transition для CSS анимации */
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
