/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "background": "var(--color-bg)",
        "surface-dim": "var(--color-surface-dim)",
        "on-background": "var(--color-on-bg)",
        "on-surface": "var(--color-on-surface)",
        "primary": "var(--color-primary)",
        "on-primary": "var(--color-on-primary)",
        "primary-fixed": "var(--color-primary-fixed)",
        "outline": "var(--color-outline)",
        "outline-variant": "var(--color-outline-variant)",
        "on-surface-variant": "var(--color-on-surface-variant)",
        "surface": "var(--color-surface)",
        "surface-container": "var(--color-surface-container)",
        "surface-container-high": "var(--color-surface-container-high)",
        "surface-container-low": "var(--color-surface-container-low)",
        "surface-container-lowest": "var(--color-surface-container-lowest)",
        "surface-container-highest": "var(--color-surface-container-highest)",
        "error": "#ef4444",
        "secondary": "#94a3b8"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "margin-desktop": "64px",
        "margin-mobile": "20px",
        "base": "8px",
        "container-max": "1440px",
        "gutter": "24px"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        headline: ["Montserrat", "sans-serif"],
        "headline-md": ["Montserrat", "sans-serif"],
        "headline-lg": ["Montserrat", "sans-serif"],
        "display-lg": ["Montserrat", "sans-serif"],
        "label-bold": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}
