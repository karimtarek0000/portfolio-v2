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
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },
    fontSize: {
      lg: "4rem",
      md: "2.7rem",
      sm: "1.25rem",
    },
    extend: {},
  },
  plugins: [
    multiTheme({
      colorThemes: themes,
    }),
  ],
};
