// Экспорт типов иконок
export type { IconName } from '@/components/ui/BaseIcon.vue'

// Экспорт типов кнопок
export type { BaseButtonProps } from '@/components/ui/BaseButton.vue'

// Общие типы для дизайн-системы
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
export type ComponentSize = 'sm' | 'md' | 'lg'
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'gray'

// Типы для цветовой палитры
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950

// Утилитарный тип для получения CSS переменной цвета
export type ColorVariable =
  | `--ds-${ColorVariant}-${ColorShade}`
  | `--ds-text-${string}`
  | `--ds-background${string}`
  | `--ds-border${string}`
  | `--ds-surface${string}`

// Типы для спейсинга
export type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'

// Типы для радиуса границ
export type BorderRadius = 'sm' | 'md' | 'lg' | 'xl' | 'full'

// Типы для теней
export type Shadow = 'sm' | 'md' | 'lg' | 'xl'

// Типы для типографики
export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
