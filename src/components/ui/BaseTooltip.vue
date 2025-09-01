<template>
  <TooltipRoot :delay-duration="delayDuration" :disable-closing-trigger="true">
    <TooltipTrigger as-child>
      <slot />
    </TooltipTrigger>

    <TooltipPortal>
      <TooltipContent
        v-if="content"
        class="tooltip-content"
        :side="side"
        :side-offset="sideOffset"
        :align="align"
        :avoid-collisions="true"
        :collision-padding="8"
      >
        {{ content }}

        <TooltipArrow class="tooltip-arrow" />
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger } from 'reka-ui'

export interface BaseTooltipProps {
  /** Содержимое tooltip для продакшена */
  content?: string
  /** Позиция tooltip относительно элемента */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Выравнивание tooltip */
  align?: 'start' | 'center' | 'end'
  /** Отступ от элемента */
  sideOffset?: number
  /** Задержка перед показом */
  delayDuration?: number
}

const props = withDefaults(defineProps<BaseTooltipProps>(), {
  side: 'top',
  align: 'center',
  sideOffset: 4,
  delayDuration: 1000,
})
</script>

<style scoped>
:deep(.tooltip-content) {
  border-radius: var(--ds-radius-lg);
  border: 1px solid var(--ds-border);
  padding: 10px 15px;
  font-size: 15px;
  line-height: 1;
  color: var(--ds-button-secondary-text);
  background-color: var(--ds-button-secondary-bg);
  box-shadow: var(--ds-tooltip-shadow);
  user-select: none;
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
  z-index: var(--ds-z-tooltip);
}
:deep(.tooltip-content)[data-state='delayed-open'][data-side='top'] {
  animation-name: slideDownAndFade;
}
:deep(.tooltip-content)[data-state='delayed-open'][data-side='right'] {
  animation-name: slideLeftAndFade;
}
:deep(.tooltip-content)[data-state='delayed-open'][data-side='bottom'] {
  animation-name: slideUpAndFade;
}
:deep(.tooltip-content)[data-state='delayed-open'][data-side='left'] {
  animation-name: slideRightAndFade;
}

:deep(.tooltip-arrow) {
  fill: var(--ds-button-secondary-bg);
}

@keyframes slideUpAndFade {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideRightAndFade {
  from {
    opacity: 0;
    transform: translateX(-2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideDownAndFade {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideLeftAndFade {
  from {
    opacity: 0;
    transform: translateX(2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
