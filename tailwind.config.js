/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern:
        /^(bg|text|border|ring|fill|stroke|decoration|from|via|to)-status-(queued|processing|succeeded|failed|dead_letter|cancelled)$/,
      variants: ["dark"],
    },
    {
      pattern:
        /^(bg|text|border|ring)-status-(queued|processing|succeeded|failed|dead_letter|cancelled)\/(5|10|15|20|25|30|40|50)$/,
      variants: ["dark"],
    },
  ],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-raised": "rgb(var(--color-surface-raised) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        "border-subtle": "rgb(var(--color-border-subtle) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        "ink-muted": "rgb(var(--color-ink-muted) / <alpha-value>)",
        "ink-faint": "rgb(var(--color-ink-faint) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-hover": "rgb(var(--color-accent-hover) / <alpha-value>)",
        "accent-ink": "rgb(var(--color-accent-ink) / <alpha-value>)",
        "accent-soft": "rgb(var(--color-accent-soft) / <alpha-value>)",

        status: {
          queued: "rgb(var(--status-queued) / <alpha-value>)",
          processing: "rgb(var(--status-processing) / <alpha-value>)",
          succeeded: "rgb(var(--status-succeeded) / <alpha-value>)",
          failed: "rgb(var(--status-failed) / <alpha-value>)",
          dead_letter: "rgb(var(--status-dead_letter) / <alpha-value>)",
          cancelled: "rgb(var(--status-cancelled) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: [
          "Inter var",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        md: "10px",
        lg: "14px",
        xl: "18px",
        "2xl": "24px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        card: "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        raised: "0 4px 16px -4px rgb(0 0 0 / 0.16), 0 2px 6px -2px rgb(0 0 0 / 0.08)",
        popover: "0 8px 30px -6px rgb(0 0 0 / 0.25)",
        glow: "0 0 0 1px rgb(var(--color-accent) / 0.4), 0 0 24px -4px rgb(var(--color-accent) / 0.5)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "slide-up": {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: 0, transform: "translateX(16px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: 0, transform: "translateX(-16px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: 0, transform: "scale(0.97)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.85)", opacity: 0.7 },
          "70%": { transform: "scale(1.8)", opacity: 0 },
          "100%": { transform: "scale(1.8)", opacity: 0 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "slide-up": "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-right": "slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-left": "slide-in-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scale-in 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 1.8s linear infinite",
      },
    },
  },
  plugins: [],
};
