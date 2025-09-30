/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Slate & Sky Theme - Softer on eyes
        'app-bg': '#f1f5f9',
        'primary': '#0ea5e9',
        'primary-hover': '#0284c7',
        'secondary': '#64748b',
        'secondary-hover': '#475569',
        'surface': '#f8fafc',        // Softer off-white instead of pure white
        'surface-alt': '#f1f5f9',    // Light slate
        'border': '#e2e8f0',
        'text-primary': '#0f172a',
        'text-secondary': '#64748b',
      },
    },
  },
  plugins: [],
}

