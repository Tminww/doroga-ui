<script setup lang="ts">
import { computed } from 'vue'

interface BadgeProps {
  title?: string
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
  class?: string
  size?: 'sm' | 'md' | 'lg'
}
const props = withDefaults(defineProps<BadgeProps>(), {
  title: 'Статус',
  variant: 'secondary',
})

const badgeClasses = computed(() => [
  'base-badge',
  `base-badge--${props.variant}`,
  `base-badge--${props.size}`,
  props.class,
])
</script>
<template>
  <span :class="badgeClasses">{{ title }}</span>
</template>
<style scoped>
/* Статусы */
.base-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--ds-spacing-xs) var(--ds-spacing-sm);
  /* border: 1px solid transparent; */
  border-radius: var(--ds-radius-full);
  font-size: var(--ds-font-size-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

/* Размеры */
.base-badge--sm {
  padding: var(--ds-spacing-xs) var(--ds-spacing-md);
  font-size: var(--ds-font-size-xs);
  min-height: 1rem;
}

.base-badge--md {
  padding: var(--ds-spacing-sm) var(--ds-spacing-lg);
  font-size: var(--ds-font-size-sm);
  min-height: 1.25rem;
}

.base-badge--lg {
  padding: var(--ds-spacing-md) var(--ds-spacing-xl);
  font-size: var(--ds-font-size-md);
  min-height: 1.5rem;
}

/* Варианты */
.base-badge--primary {
  background-color: var(--ds-badge-primary-bg);
  color: var(--ds-badge-primary-text);
  border-color: var(--ds-badge-primary-bg);
}

.base-badge--secondary {
  background-color: var(--ds-badge-secondary-bg);
  color: var(--ds-badge-secondary-text);
  border-color: var(--ds-badge-secondary-bg);
}

.base-badge--danger {
  background-color: var(--ds-badge-danger-bg);
  color: var(--ds-badge-danger-text);
  border-color: var(--ds-badge-danger-bg);
}

.base-badge--success {
  background-color: var(--ds-badge-success-bg);
  color: var(--ds-badge-success-text);
  border-color: var(--ds-badge-success-bg);
}

.base-badge--warning {
  background-color: var(--ds-badge-warning-bg);
  color: var(--ds-badge-warning-text);
  border-color: var(--ds-badge-warning-bg);
}
</style>
