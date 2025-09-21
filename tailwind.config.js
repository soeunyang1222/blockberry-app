/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Colors (메인 그린)
        primary: {
          DEFAULT: '#4CAF50',
          hover: '#45a049',
          light: '#81C784',
          dark: '#388E3C',
        },

        // Secondary Colors (네이비)
        secondary: {
          DEFAULT: '#2C3E50',
          light: '#34495E',
          dark: '#1A252F',
        },

        // Background Colors
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8F9FA',
          muted: '#E8F5E8',
        },

        // Text Colors
        foreground: {
          DEFAULT: '#2E3440',
          secondary: '#5E6B73',
          muted: '#8B9196',
        },

        // Border Colors
        border: {
          DEFAULT: '#E1E8ED',
          light: '#F1F3F4',
          dark: '#D1D9E0',
        },
      }
    },
  },
  plugins: [],
}
