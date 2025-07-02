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
  'relative capitalize inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 ease-out disabled:opacity-50 focus:ring-2 rounded-full focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:pointer-events-none focus:outline-none group cursor-pointer select-none'

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  primary:
    'text-primary-1 bg-primary-2 hover:bg-opacity-90 hover:shadow-xl hover:shadow-primary-2/25 overflow-hidden',

  outline: [
    'px-6 py-2 sm:px-8 font-bold text-sm',
    'border-[1.5px] border-gray-500 text-gray-300',
    'bg-transparent backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.1)]',
    'tracking-[0.09em] overflow-hidden relative z-[1]',
    'hover:border-gray-400 hover:text-white hover:scale-[1.065] hover:shadow-[0_4px_16px_rgba(0,0,0,0.2)]',
    'dark:text-white dark:border-primary-2/50',
    'before:absolute before:inset-0 before:opacity-50 before:pointer-events-none',
    'before:transition-all before:duration-300 before:z-[2]',
    'before:bg-gradient-to-r before:from-white/25 before:to-white/10',
    'before:bg-[length:200%_200%] before:bg-[position:0%_50%]',
    'hover:before:opacity-70 hover:before:bg-[position:100%_50%]',
    'after:absolute after:top-0 after:w-[60%] after:h-full after:opacity-0',
    'after:transition-all after:duration-300 after:z-[3] after:-left-[60%]',
    'after:bg-gradient-to-r after:from-white/18 after:to-white/1 after:blur-[2px]',
    'hover:after:opacity-100 hover:after:left-[110%]',
  ].join(' '),
}

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm min-h-[32px] text-xs',
  md: 'px-4 py-2 text-sm min-h-[36px]',
  lg: 'px-6 py-3',
  xl: 'px-8 py-4 text-lg min-h-[52px] font-semibold',
}
</script>
