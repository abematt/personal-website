/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      // Values live in app/globals.css so they can switch with the theme.
      colors: {
        page: "var(--page)",
        ink: {
          DEFAULT: "var(--ink)",
          strong: "var(--ink-strong)",
          muted: "var(--ink-muted)",
          subtle: "var(--ink-subtle)",
        },
        line: {
          DEFAULT: "var(--line)",
          strong: "var(--line-strong)",
        },
        panel: "var(--panel)",
        hover: "var(--hover)",
        tile: {
          DEFAULT: "var(--tile)",
          line: "var(--tile-line)",
        },
      },
      boxShadow: {
        panel: "var(--panel-shadow)",
      },
    },
  },
  plugins: [],
}
