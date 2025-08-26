import { ref, computed, watch, onMounted } from 'vue'
import type { ColorVariant, ComponentSize } from '@/types'

export type ThemeMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'doroga-ui-theme'

// Глобальное состояние темы
const themeMode = ref<ThemeMode>('system')
const isDark = ref(false)

/**
 * Композабл для работы с темой приложения
 */
export function useTheme() {
  // Инициализация темы
  const initTheme = () => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      themeMode.value = stored
    }

    updateTheme()
  }

  // Обновление темы в DOM
  const updateTheme = () => {
    const root = document.documentElement

    if (themeMode.value === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      isDark.value = mediaQuery.matches

      // Удаляем принудительные классы темы
      root.classList.remove('light-theme', 'dark-theme')
    } else {
      isDark.value = themeMode.value === 'dark'

      // Добавляем класс для принудительной темы
      root.classList.remove('light-theme', 'dark-theme')
      root.classList.add(`${themeMode.value}-theme`)
    }
  }

  // Установка темы
  const setTheme = (mode: ThemeMode) => {
    themeMode.value = mode
    localStorage.setItem(STORAGE_KEY, mode)
    updateTheme()
  }

  // Переключение темы
  const toggleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system']
    const currentIndex = modes.indexOf(themeMode.value)
    const nextIndex = (currentIndex + 1) % modes.length
    setTheme(modes[nextIndex])
  }

  // Получение CSS переменной цвета
  const getCSSVariable = (variable: string): string => {
    return getComputedStyle(document.documentElement).getPropertyValue(variable)
  }

  // Получение цвета по имени и оттенку
  const getColor = (color: ColorVariant, shade: number = 500): string => {
    return getCSSVariable(`--ds-${color}-${shade}`)
  }

  // Вычисляемые свойства
  const currentTheme = computed(() => themeMode.value)
  const isSystemTheme = computed(() => themeMode.value === 'system')
  const themeIcon = computed(() => {
    if (themeMode.value === 'light') return 'sun'
    if (themeMode.value === 'dark') return 'moon'
    return 'monitor'
  })

  // Отслеживание изменений системной темы
  const watchSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      if (themeMode.value === 'system') {
        isDark.value = e.matches
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    // Возвращаем функцию для отписки
    return () => mediaQuery.removeEventListener('change', handleChange)
  }

  // Инициализация при монтировании
  onMounted(() => {
    initTheme()
    watchSystemTheme()
  })

  // Отслеживание изменений темы
  watch(themeMode, updateTheme)

  return {
    // Состояние
    currentTheme,
    isDark: computed(() => isDark.value),
    isSystemTheme,
    themeIcon,

    // Методы
    setTheme,
    toggleTheme,
    getCSSVariable,
    getColor,

    // Утилиты
    initTheme,
  }
}

/**
 * Композабл для получения стилей компонента с учетом темы
 */
export function useComponentStyles() {
  const { isDark, getColor } = useTheme()

  // Получение стилей для различных состояний компонента
  const getVariantStyles = (variant: ColorVariant) => {
    return {
      background: getColor(variant, 600),
      backgroundHover: getColor(variant, 700),
      backgroundActive: getColor(variant, 800),
      color: '#ffffff',
      border: getColor(variant, 600),
    }
  }

  // Получение размеров для компонента
  const getSizeStyles = (size: ComponentSize) => {
    const sizeMap = {
      sm: {
        padding: 'var(--ds-spacing-xs) var(--ds-spacing-md)',
        fontSize: 'var(--ds-font-size-xs)',
        minHeight: '2rem',
      },
      md: {
        padding: 'var(--ds-spacing-sm) var(--ds-spacing-lg)',
        fontSize: 'var(--ds-font-size-sm)',
        minHeight: '2.5rem',
      },
      lg: {
        padding: 'var(--ds-spacing-md) var(--ds-spacing-xl)',
        fontSize: 'var(--ds-font-size-md)',
        minHeight: '3rem',
      },
    }

    return sizeMap[size]
  }

  return {
    isDark,
    getVariantStyles,
    getSizeStyles,
    getColor,
  }
}
