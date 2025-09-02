<script setup lang="ts">
import BaseDialog from './BaseDialog.vue'
import { type BaseButtonProps } from './BaseButton.vue'

interface ConfirmDialogProps {
  title?: string
  subTitle?: string
  message?: string
}
const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  title: 'Окно подтверждения',
  subTitle: '',
  message: 'Вы действительно хотите выполнить это действие?',
})

const okButton: BaseButtonProps = {
  title: 'Подтвердить',
  variant: 'danger',
}
</script>

<template>
  <BaseDialog :title :sub-title :ok-button-props="okButton">
    <template #default><slot></slot></template>
    <template #content> {{ message }}</template>
  </BaseDialog>
</template>
