<script setup lang="ts">
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui'
defineProps<{
  shortName: string // две заглавные буквы имени и фамилии
}>()
</script>

<template>
  <AvatarRoot class="avatar-root">
    <!-- <AvatarImage
      class="avatar-image"
      src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80"
      alt="Pedro Duarte"
    /> -->
    <AvatarFallback class="avatar-fallback">
      {{ shortName }}
    </AvatarFallback>
  </AvatarRoot>
</template>

<style scoped>
.avatar-root {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  overflow: hidden;
  user-select: none;
  width: 35px;
  height: 35px;
  border-radius: 100%;
  background-color: var(--black-a3);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--ds-button-primary-bg);
  color: var(--ds-button-primary-text);
  font-size: var(--ds-font-size-sm);
  line-height: 1;
  font-weight: 600;
}
</style>
