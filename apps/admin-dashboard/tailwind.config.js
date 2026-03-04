/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#1b2a4b",
                "primary-light": "#2C3E6B",
                "secondary": "#2c3e6b",
                "accent": "#d4af37",
                "background-light": "#f6f7f8",
                "background-dark": "#14171e",
                "neutral-soft": "#eaecf1",
                "text-main": "#111318",
                "text-muted": "#5d6b89",
            },
            fontFamily: {
                "display": ["Plus Jakarta Sans", "sans-serif"],
                "sans": ["Inter", "sans-serif"],
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "2xl": "12px",
                "full": "9999px"
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries')
    ],
}
