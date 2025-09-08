<script setup lang="ts">
import {
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot,
} from 'reka-ui'
import BaseButton from './BaseButton.vue'

interface BasePaginationProps {
  total: number
  defaultPage?: number
  disabled?: boolean
  itemsPerPage: number
}

const props = withDefaults(defineProps<BasePaginationProps>(), {
  defaultPage: 1,
})

const emit = defineEmits<{
  'update:page': [value: number]
}>()
</script>

<template>
  <PaginationRoot
    :total
    :sibling-count="1"
    show-edges
    :default-page
    :items-per-page
    :disabled
    @update:page="emit('update:page', $event)"
  >
    <PaginationList v-slot="{ items }" class="pagination-list">
      <PaginationFirst as-child>
        <BaseButton variant="secondary" icon-only size="md" left-icon="chevrons-left" />
      </PaginationFirst>
      <PaginationPrev :style="{ marginRight: 16 }" as-child>
        <BaseButton variant="secondary" icon-only size="md" left-icon="chevron-left" />
      </PaginationPrev>
      <template v-for="(page, index) in items">
        <PaginationListItem
          v-if="page.type === 'page'"
          :key="index"
          class="pagination-button pagination-button--md"
          :value="page.value"
        >
          {{ page.value }}
        </PaginationListItem>
        <PaginationEllipsis v-else :key="page.type" :index="index" class="pagination-ellipsis">
          &#8230;
        </PaginationEllipsis>
      </template>
      <PaginationNext :style="{ marginLeft: 16 }" as-child>
        <BaseButton variant="secondary" icon-only size="md" left-icon="chevron-right" />
      </PaginationNext>
      <PaginationLast as-child>
        <BaseButton variant="secondary" icon-only size="md" left-icon="chevrons-right" />
      </PaginationLast>
    </PaginationList>
  </PaginationRoot>
</template>

<style scoped>
/* reset */
button {
  all: unset;
}

.pagination-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ds-spacing-sm);
  border: 1px solid transparent;
  border-radius: var(--ds-radius-md);
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  line-height: 1;
  white-space: nowrap;

  background-color: var(--ds-button-hover-bg);
  color: var(--ds-button-secondary-text);
  border-color: var(--ds-button-secondary-border);

  aspect-ratio: 1;
  padding: 6px;
}

.pagination-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--ds-border-focus);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.pagination-button--md {
  /* padding: var(--ds-spacing-sm) var(--ds-spacing-lg); */
  font-size: var(--ds-font-size-xs);
  min-height: 1.25rem;
}
.pagination-button:hover {
  background-color: var(--ds-button-secondary-bg-hover);
  border-color: var(--ds-border-secondary);
}

.pagination-button[data-selected] {
  background-color: var(--ds-button-ghost-bg-active);
  color: var(--ds-button-ghost-text-active);
  border-color: var(--ds-button-ghost-border-active);
}

.pagination-ellipsis {
  display: flex;
  height: 2.25rem;
  width: 2.25rem;
  color: var(--ds-button-secondary-text);

  align-items: center;
  justify-content: center;
}

.pagination-list {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: rgb(255 255 255);
}
</style>
