<template>
  <Component
    :is="as"
    :class="
      mergeClasses(defaultClasses, variantClasses[variant], sizeClasses[size])
    "
  >
    <slot />
  </Component>
</template>

<script lang="tsx" setup>
interface Props {
  as?: "a" | "button";
  variant?: "primary" | "outline";
  size?: "md" | "lg";
}

withDefaults(defineProps<Props>(), {
  as: "button",
  variant: "primary",
  size: "lg",
});

const defaultClasses =
  "capitalize inline-block box-border rounded-lg focus-visible:ring-1 focus-visible:ring-yellow-100 transition-all focus-visible:ring-offset-1 focus-visible:ring-offset-black focus-visible:outline-none";
const variantClasses: Record<NonNullable<Props["variant"]>, string> = {
  primary: "text-primary-1 hover:bg-opacity-90 bg-primary-2",
  outline:
    "border border-1 border-primary-2 dark:border-primary-3 hover:bg-primary-2 hover:text-primary-1 text-primary-2 bg-transparent",
};
const sizeClasses: Record<NonNullable<Props["size"]>, string> = {
  md: "px-3 py-1",
  lg: "px-4 py-2",
};
</script>
