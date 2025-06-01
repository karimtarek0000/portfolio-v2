<template>
  <Component
    :is="as"
    :class="
      mergeClasses(defaultClasses, variantClasses[variant], sizeClasses[size])
    "
    :disabled="disabled"
  >
    <slot />
  </Component>
</template>

<script lang="tsx" setup>
interface Props {
  as?: 'a' | 'button'
  variant?: 'primary' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  as: 'button',
  variant: 'primary',
  size: 'lg',
  disabled: false,
  loading: false,
})

const defaultClasses =
  'relative capitalize inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 ease-out   disabled:opacity-50 focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:pointer-events-none overflow-hidden focus:outline-none group cursor-pointer select-none '

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  primary:
    'text-primary-1 bg-primary-2 hover:bg-opacity-90 hover:shadow-xl hover:shadow-primary-2/25',

  outline:
    'border-2 border-primary-2 dark:border-primary-3 hover:bg-primary-2 hover:text-primary-1 text-primary-2 bg-transparent hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-primary-2/20 backdrop-blur-sm',
}

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm min-h-[32px] text-xs',
  md: 'px-4 py-2 text-sm min-h-[36px]',
  lg: 'px-6 py-3 text-base min-h-[44px]',
  xl: 'px-8 py-4 text-lg min-h-[52px] font-semibold',
}
</script>
