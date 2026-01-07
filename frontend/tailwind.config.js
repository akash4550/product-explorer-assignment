/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // 1. Scan the "app" folder (where pages and layout live)
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    
    // 2. Scan the "components" folder (where ProductGrid lives)
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // You can extend colors or fonts here if needed
      colors: {
        // Example: extending the default blue if you wanted a custom brand color
        // 'able-blue': '#2563EB',
      }
    },
  },
  plugins: [
    // Optional: useful for rendering the "About this Item" text cleanly
    require('@tailwindcss/typography'), 
  ],
};