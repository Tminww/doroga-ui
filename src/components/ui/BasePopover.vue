<script setup lang="ts">
import {
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'

import BaseIcon from './BaseIcon.vue'
import BaseButton, { type BaseButtonProps } from './BaseButton.vue'

interface BasePopoverProps {
  title?: string
  subTitle?: string

  closeButtonProps?: BaseButtonProps
}

const props = withDefaults(defineProps<BasePopoverProps>(), {
  subTitle: 'Описание',

  closeButtonProps: {
    variant: 'ghost',
    size: 'sm',
    iconOnly: true,
    leftIcon: 'x',
    iconSize: 16,
    disabled: false,
    fullWidth: false,
    type: 'button',
    align: 'center',
    active: false,
  },
})
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger aria-label="Update dimensions" as-child>
      <slot name="default"> <BaseButton icon-only left-icon="check" /></slot>
    </PopoverTrigger>
    <PopoverPortal to="body">
      <PopoverContent
        avoidCollisions
        positionStrategy="fixed"
        side="bottom"
        :side-offset="5"
        class="popover-content"
      >
        <div class="popover-header">
          <h1 class="popover-header-title">{{ title }}</h1>
        </div>

        <slot name="content"> Контент</slot>
        <div class="popover-close">
          <PopoverClose aria-label="Close" as-child>
            <slot name="close">
              <BaseButton v-bind="closeButtonProps" />
            </slot>
          </PopoverClose>
        </div>

        <PopoverArrow class="popover-arrow" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<style scoped>
button,
fieldset,
input {
  all: unset;
}

:deep(.popover-content) {
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  box-shadow: var(--ds-popover-shadow);
  border-radius: var(--ds-radius-lg);
  padding: 10px 10px;
  /* width: 260px; */

  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}

:deep(.popover-content)[data-state='open'][data-side='top'] {
  animation-name: slide-down-and-fade;
}

:deep(.popover-content)[data-state='open'][data-side='right'] {
  animation-name: slide-left-and-fade;
}

:deep(.popover-content)[data-state='open'][data-side='bottom'] {
  animation-name: slide-up-and-fade;
}

:deep(.popover-content)[data-state='open'][data-side='left'] {
  animation-name: slide-right-and-fade;
}

:deep(.popover-arrow) {
  fill: var(--ds-button-secondary-bg);
}

.popover-header {
  /* margin-bottom: var(--ds-spacing-sm); */
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}
.popover-header-title {
  color: var(--ds-text-primary);
  font-size: var(--ds-font-size-sm);
  font-weight: 600;
}

.popover-close {
  display: flex;
  justify-content: flex-end;
  gap: var(--ds-spacing-xs);
  margin-top: var(--ds-spacing-sm);
}
@keyframes slide-up-and-fade {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-right-and-fade {
  from {
    opacity: 0;
    transform: translateX(-2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-down-and-fade {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-left-and-fade {
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
