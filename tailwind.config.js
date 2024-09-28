/** @type {import('tailwindcss').Config} */
import multiTheme from "./src/tailwind/mulit-theme";
import themes from "./src/tailwind/themes";

export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    multiTheme({
      colorThemes: themes,
    }),
  ],
};
