/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                heading: ["Space Grotesk", "Inter", "system-ui", "sans-serif"]
            },
            colors: {
                "hub-surface": "#0f172a",
                "hub-panel": "#111a2e",
                "hub-card": "#152038",
                "theme-surface": "rgb(var(--color-surface) / <alpha-value>)",
                "theme-panel": "rgb(var(--color-panel) / <alpha-value>)",
                "theme-card": "rgb(var(--color-card) / <alpha-value>)",
                "theme-border": "rgb(var(--color-border) / <alpha-value>)",
                "theme-primary": "rgb(var(--color-text-primary) / <alpha-value>)",
                "theme-secondary": "rgb(var(--color-text-secondary) / <alpha-value>)",
                "theme-muted": "rgb(var(--color-text-muted) / <alpha-value>)",
                "theme-accent": "rgb(var(--color-accent) / <alpha-value>)",
                "theme-accent-hover": "rgb(var(--color-accent-hover) / <alpha-value>)",
            },
            boxShadow: { neon: "0 25px 60px -25px rgba(59,130,246,0.35)" },
        },
    },
    plugins: [],
}
