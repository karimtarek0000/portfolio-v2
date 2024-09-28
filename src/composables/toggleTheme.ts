export const useToggleTheme = () => {
  const moveClass = ref("translate-x-0");
  const cookie = useCookie("theme");

  // ------------ Computed ------------ //
  const isDark: ComputedRef<boolean> = computed(() => cookie.value === "dark");

  // ------------ Functions ------------ //
  const setModeHandler = (): void => {
    cookie.value = cookie.value === "dark" ? "light" : "dark";
  };

  const moveHandler = (): void => {
    if (typeof cookie.value === "undefined") cookie.value = "dark";
    moveClass.value = isDark.value ? "translate-x-0" : "translate-x-12";
  };

  const toggleHandler = (): void => {
    setModeHandler();
    moveHandler();
  };

  moveHandler();

  useHead(() => {
    return {
      bodyAttrs: {
        "data-theme": cookie.value || "dark",
      },
    };
  });

  return {
    moveClass,
    isDark,
    toggleHandler,
  };
};
