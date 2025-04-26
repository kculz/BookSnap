/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: "#3B82F6",      // Vibrant blue (Buttons, CTAs)
        secondary: "#8B5CF6",    // Purple (Accents, highlights)
        
        // Neutrals
        dark: "#1F2937",         // Dark gray (Headers, text)
        light: "#F9FAFB",        // Off-white (Backgrounds)
        gray: "#6B7280",         // Medium gray (Subtle text/icons)
        
        // Accents
        accent1: "#EF4444",      // Red (Errors, warnings)
        accent2: "#10B981",      // Emerald green (Success, confirmations)
        accent3: "#F59E0B",      // Amber (Alerts, discounts)
      },
      fontFamily: {
        sans: ["'Inter'", "sans-serif"],  // Main font
        heading: ["'Playfair Display'", "serif"], // Elegant titles
        mono: ["'Fira Code'", "monospace"] // Code/technical text
      },
    },
  },
  plugins: [],
}