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

const defaultClasses = "capitalize box-border rounded-lg ";
const variantClasses: Record<NonNullable<Props["variant"]>, string> = {
  primary: "text-primary-1 bg-primary-2",
  outline:
    "outline outline-1 outline-primary-2 dark:outline-primary-3 text-primary-2 bg-transparent",
};
const sizeClasses: Record<NonNullable<Props["size"]>, string> = {
  md: "px-3 py-1",
  lg: "px-4 py-2",
};
</script>
