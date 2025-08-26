<template>
  <TooltipRoot :delay-duration="delayDuration" :disable-closing-trigger="true">
    <TooltipTrigger as-child>
      <slot />
    </TooltipTrigger>

    <TooltipPortal>
      <TooltipContent
        class="tooltip-content"
        :side="side"
        :side-offset="sideOffset"
        :align="align"
        :avoid-collisions="true"
        :collision-padding="8"
      >
        <div v-if="isDesignSystem" class="tooltip-design-system">
          <div class="tooltip-code" v-if="showCode">
            <pre><code>{{ formattedCode }}</code></pre>
          </div>
        </div>

        <div v-else class="tooltip-production">
          {{ content }}
        </div>

        <TooltipArrow class="tooltip-arrow" />
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>

<script setup lang="ts">
import { computed, inject, ref, type InjectionKey } from 'vue'
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger } from 'reka-ui'

export interface BaseTooltipProps {
  /** Содержимое tooltip для продакшена */
  content?: string
  /** Название компонента для дизайн-системы */
  componentName?: string
  /** Пропсы компонента в виде строки */
  componentProps?: string
  /** Показывать код компонента */
  showCode?: boolean
  /** Код компонента (автогенерируется если не передан) */
  code?: string
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
  showCode: true,
})

// Проверяем, находимся ли мы в режиме дизайн-системы
const isDesignSystem = ref(true)

// Форматирование кода
const formattedCode = computed(() => {
  if (props.code) {
    return props.code
  }

  if (!props.componentName) {
    return ''
  }

  // Автогенерация кода на основе названия компонента и пропсов
  const componentTag = `<${props.componentName}`
  const propsString = props.componentProps ? ` ${props.componentProps}` : ''
  const closingTag = ` />`

  return `${componentTag}${propsString}${closingTag}`
})
</script>

<style scoped>
:deep(.tooltip-content) {
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 15px;
  line-height: 1;
  color: var(--ds-button-secondary-text);
  background-color: var(--ds-button-secondary-bg);
  box-shadow:
    hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  user-select: none;
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
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
