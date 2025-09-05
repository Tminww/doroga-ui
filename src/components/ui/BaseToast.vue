<script setup lang="ts">
import {
  ToastAction,
  ToastPortal,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from 'reka-ui'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseIcon, { type IconName } from './BaseIcon.vue'
import BaseProgress from './BaseProgress.vue'

interface BaseToastProps {
  title?: string
  message?: string
  showIcon?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
  duration?: number
}

const props = withDefaults(defineProps<BaseToastProps>(), {
  title: 'Заголовок',
  message: 'Что-то произошло!',
  variant: 'warning',
  showIcon: true,
  duration: 3000,
})

const open = ref(false)
const timerRef = ref(0)
const progressValue = ref(100)
const isPaused = ref(false)
const progressIntervalRef = ref(0)

function startProgressAnimation() {
  progressValue.value = 100
  isPaused.value = false

  const updateInterval = 50 // обновляем каждые 50мс
  const step = 100 / (props.duration / updateInterval) // сколько процентов убавлять за каждый шаг

  progressIntervalRef.value = window.setInterval(() => {
    if (!isPaused.value) {
      progressValue.value = Math.max(0, progressValue.value - step)
    }

    if (progressValue.value <= 0) {
      window.clearInterval(progressIntervalRef.value)
    }
  }, updateInterval)
}

function stopProgressAnimation() {
  if (progressIntervalRef.value) {
    window.clearInterval(progressIntervalRef.value)
    progressIntervalRef.value = 0
  }
}

function pauseProgress() {
  isPaused.value = true
}

function resumeProgress() {
  isPaused.value = false
}

function clearProgressAnimation() {
  stopProgressAnimation()
  isPaused.value = false
}

function handleClick() {
  open.value = false
  clearProgressAnimation()
  window.clearTimeout(timerRef.value)

  timerRef.value = window.setTimeout(() => {
    open.value = true
  }, 100)
}

// Запускаем анимацию прогресса когда тост открывается
watch(open, (newValue) => {
  if (newValue) {
    startProgressAnimation()
  } else {
    clearProgressAnimation()
  }
})

// Очищаем таймеры при размонтировании компонента
onUnmounted(() => {
  stopProgressAnimation()
  if (timerRef.value) {
    window.clearTimeout(timerRef.value)
  }
})

const icon = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'info' // или 'bell' для уведомлений
    case 'secondary':
      return 'message-circle' // или 'info'
    case 'danger':
      return 'alert-circle' // или 'x-circle', 'alert-triangle'
    case 'success':
      return 'check-circle' // или 'check', 'check-circle-2'
    case 'warning':
      return 'alert-triangle' // или 'alert-circle'
    default:
      return 'info'
  }
})

const iconClasses = computed(() => ['toast-icon', `${props.variant}`])
const toastClasses = computed(() => ['toast-root', `${props.variant}`])
</script>

<template>
  <div @click="handleClick">
    <slot>
      <BaseButton variant="secondary" right-icon="chevrons-right">
        Отобразить сообщение
      </BaseButton>
    </slot>
  </div>

  <ToastRoot
    v-model:open="open"
    :class="toastClasses"
    @pause="pauseProgress"
    @resume="resumeProgress"
  >
    <!-- <ToastPortal to="body"> -->
    <BaseIcon v-if="showIcon" :class="iconClasses" :icon="icon" :size="25"></BaseIcon>
    <ToastTitle class="toast-title"> {{ title }} </ToastTitle>
    <ToastDescription as-child>
      <div class="toast-description">
        {{ message }}
      </div>
    </ToastDescription>
    <ToastAction class="toast-action" alt-text="Goto schedule to undo">
      <BaseButton size="sm" :variant="variant">Закрыть</BaseButton>
    </ToastAction>
    <BaseProgress class="toast-progress" :variant="variant" :progress-value="progressValue" />
    <!-- </ToastPortal> -->
  </ToastRoot>
  <ToastViewport class="toast-viewport" />
</template>

<style scoped>
/* reset */
button {
  all: unset;
}

:deep(.toast-viewport) {
  --viewport-padding: 25px;
  position: fixed;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: var(--viewport-padding);
  gap: 10px;
  width: 400px;
  max-width: 100vw;
  margin: 0;
  list-style: none;
  z-index: 2147483647;
  outline: none;
}

:deep(.toast-root) {
  background-color: var(--ds-background);
  border-radius: var(--ds-radius-md);
  box-shadow: var(--ds-toast-shadow);
  padding: 15px 15px 10px 15px;
  display: grid;
  grid-template-areas:
    'icon title action'
    'icon description action'
    'progress progress progress';
  grid-template-columns: max-content auto max-content;
  column-gap: 15px;
  align-items: center;
}

:deep(.toast-root).primary {
  background-color: var(--ds-toast-primary-bg);
}

:deep(.toast-root).warning {
  background-color: var(--ds-toast-warning-bg);
}

:deep(.toast-root).success {
  background-color: var(--ds-toast-success-bg);
}
:deep(.toast-root).danger {
  background-color: var(--ds-toast-danger-bg);
}
:deep(.toast-root).secondary {
  background-color: var(--ds-toast-secondary-bg);
}

:deep(.toast-root)[data-state='open'] {
  animation: slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1);
}
:deep(.toast-root)[data-state='closed'] {
  animation: hide 100ms ease-in;
}
:deep(.toast-root)[data-swipe='move'] {
  transform: translateX(var(--reka-toast-swipe-move-x));
}
:deep(.toast-root)[data-swipe='cancel'] {
  transform: translateX(0);
  transition: transform 200ms ease-out;
}
:deep(.toast-root)[data-swipe='end'] {
  animation: swipeOut 100ms ease-out;
}

@keyframes hide {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(calc(100% + var(--viewport-padding)));
  }
  to {
    transform: translateX(0);
  }
}

@keyframes swipeOut {
  from {
    transform: translateX(var(--reka-toast-swipe-end-x));
  }
  to {
    transform: translateX(calc(100% + var(--viewport-padding)));
  }
}

.toast-icon {
  grid-area: icon;
  width: 25px;
}

.toast-icon.primary {
  color: var(--ds-primary-500);
}

.toast-icon.warning {
  color: var(--ds-warning-500);
}

.toast-icon.success {
  color: var(--ds-success-500);
}

.toast-icon.danger {
  color: var(--ds-danger-500);
}

.toast-icon.secondary {
  color: var(--ds-gray-500);
}

.toast-title {
  grid-area: title;
  margin-bottom: 5px;
  font-weight: 500;
  color: var(--slate-12);
  font-size: 15px;
}

.toast-description {
  grid-area: description;
  color: var(--slate-11);
  font-size: 13px;
  line-height: 1.3;
}

.toast-action {
  grid-area: action;
}

.toast-progress {
  grid-area: progress;
  margin-top: 10px;
}
</style>
