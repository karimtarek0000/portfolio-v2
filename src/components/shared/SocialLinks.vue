<template>
  <div class="flex gap-3">
    <a
      v-for="social in data.info.social"
      :key="social.name"
      :href="social.url"
      :aria-label="social.name"
      target="_blank"
      rel="noopener noreferrer"
      :class="[
        'relative p-3 transition-all duration-300 border group rounded-xl bg-primary-2/10 hover:bg-primary-2/20 hover:scale-110 hover:-translate-y-1 border-primary-2/10 hover:border-primary-2/30 hover:shadow-lg',
        { 'opacity-0': type === 'header' },
      ]"
    >
      <SharedRenderSVG
        :iconName="social.name"
        sizes="w-[2rem] h-[2rem]"
        :fill="isDark ? 'white' : 'black'"
      />

      <!-- Glow effect on hover (only for footer variant) -->
      <div
        class="absolute inset-0 transition-transform duration-300 scale-0 opacity-0 rounded-xl bg-primary-2/20 group-hover:scale-100 group-hover:opacity-100 blur-sm"
      ></div>
    </a>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    type?: 'header' | 'footer'
  }>(),
  {
    type: 'footer',
  },
)

const { isDark } = useToggleTheme()
const data: Ref<Data> = useState('data')
</script>
