<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import { type BaseButtonProps } from './BaseButton.vue'
import BaseButton from './BaseButton.vue'
import { ref, watch } from 'vue'

interface BaseDialogProps {
  title?: string
  subTitle?: string
  open?: boolean
  closeOnlyButton?: boolean
  useCloseButton?: boolean
  useCancelButton?: boolean
  useOkButton?: boolean
  closeButtonProps?: BaseButtonProps
  cancelButtonProps?: BaseButtonProps
  okButtonProps?: BaseButtonProps
}

const props = withDefaults(defineProps<BaseDialogProps>(), {
  title: 'Диалоговое окно',
  subTitle: 'Описание',
  open: false,
  closeOnlyButton: false,
  useCloseButton: false,
  useCancelButton: true,
  useOkButton: true,
  closeButtonProps: {
    variant: 'ghost',
    size: 'md',
    iconOnly: true,
    leftIcon: 'x',
    iconSize: 20,
    disabled: false,
    fullWidth: false,
    type: 'button',
    align: 'center',
    active: false,
  },
  cancelButtonProps: {
    title: 'Отмена',
    variant: 'ghost',
    size: 'md',
    iconOnly: false,
    disabled: false,
    fullWidth: false,
    type: 'button',
    align: 'center',
    active: false,
  },
  okButtonProps: {
    title: 'Применить',
    variant: 'primary',
    size: 'md',
    iconOnly: false,
    disabled: false,
    fullWidth: false,
    type: 'button',
    align: 'center',
    active: false,
  },
})

const emit = defineEmits<{
  'click:ok': [event: MouseEvent]
  'click:close': [event: MouseEvent]
  'update:modelValue': [open: boolean]
}>()

const open = ref(props.open)
</script>
<template>
  <div>
    <DialogRoot :open="open" @update:open="(value) => (open = value)">
      <DialogTrigger as-child> <slot name="default"> </slot></DialogTrigger>
      <DialogPortal to="body">
        <DialogOverlay class="dialog-overlay" />
        <DialogContent
          class="dialog-content"
          @pointer-down-outside="closeOnlyButton ? $event.preventDefault() : null"
        >
          <div class="dialog-content-header">
            <div>
              <DialogTitle class="dialog-title"> {{ title }} </DialogTitle>
              <DialogDescription class="dialog-description"> {{ subTitle }} </DialogDescription>
            </div>
            <div class="dialog-header-actions">
              <slot name="headerActions"> </slot>
              <DialogClose as-child>
                <BaseButton
                  v-if="useCloseButton"
                  v-bind="closeButtonProps"
                  @click="emit('click:close', $event)"
                />
              </DialogClose>
            </div>
          </div>
          <slot name="content"> Здесь будет ваш контент...</slot>

          <div class="dialog-actions">
            <slot name="footerActions"> </slot>
            <DialogClose as-child>
              <BaseButton
                ref="close-button"
                v-if="useCancelButton"
                v-bind="cancelButtonProps"
                @click="emit('click:close', $event)"
              />
            </DialogClose>
            <DialogClose as-child>
              <BaseButton
                v-if="useOkButton"
                v-bind="okButtonProps"
                @click="emit('click:ok', $event)"
            /></DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </div>
</template>

<style scoped>
/* Диалоги */
button,
fieldset,
input {
  all: unset;
}

.dialog-overlay {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  inset: 0;
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);

  /* position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--ds-spacing-lg); */
}

.dialog-content {
  background-color: var(--ds-button-secondary-bg);
  box-shadow: var(--ds-tooltip-shadow);
  border-radius: var(--ds-radius-lg);

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 450px;
  max-height: 85vh;
  padding: 25px;
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);

  /* background-color: var(--ds-surface);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-spacing-xl);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); */
}

.dialog-content:focus {
  outline: none;
}

.dialog-title {
  margin-bottom: var(--ds-spacing-sm);
  color: var(--ds-text-primary);
  font-size: var(--ds-font-size-xl);
  font-weight: 600;
}

.dialog-description {
  margin: 0 0 var(--ds-spacing-lg) 0;
  color: var(--ds-text-secondary);
  font-size: var(--ds-font-size-sm);
  font-weight: 500;
}
.dialog-content-header {
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
}
.dialog-header-actions {
  display: flex;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--ds-spacing-md);
  margin-top: var(--ds-spacing-xl);
}
/* @keyframes overlayShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes contentShow {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
} */
</style>
