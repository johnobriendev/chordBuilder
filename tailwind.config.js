/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Blue Gradient Palette
        'app-bg': '#f8f9fb',         // Lightest background
        'primary': '#71a5de',        // Vibrant blue
        'primary-hover': '#5a8fd1',  // Darker blue on hover
        'secondary': '#83b0e1',      // Medium light blue
        'secondary-hover': '#71a5de', // Primary blue on hover
        'surface': '#ffffff',        // Pure white for cards
        'surface-alt': '#e1ecf7',    // Very light blue
        'border': '#aecbeb',         // Light blue border
        'text-primary': '#1e293b',   // Dark slate for primary text
        'text-secondary': '#475569', // Medium slate for secondary text
      },
    },
  },
  plugins: [],
}

